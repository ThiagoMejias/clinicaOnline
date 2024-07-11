import { Component } from '@angular/core';
import { Especialista, UsuarioGenerico } from '../../../interfaces/Usuarios';
import { UserService } from '../../../services/user.service';
import { ExcelService } from '../../../services/excel.service';
import Swal from 'sweetalert2';
import { TurnosService } from '../../../services/turnos.service';
import { ReportesService } from '../../../services/reportes.service';
import { PdfService } from '../../../services/pdf.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { UsuarioGenericoService } from '../../../services/usuarioGenerico.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  users : UsuarioGenerico[] = [
  ]
  especialistaSeleccionado: any;
  fechaInicio!: Date;
  fechaFin!: Date;
  searchQuery: string = '';
  userSelected! : UsuarioGenerico;
  openViewUser : boolean = false;
  openListUser : boolean = false;
  usersLimpios : any[] = [];
  usersParaTabla : any[] =[];
  openUserForm : boolean = false;
  openFiles : boolean = false;
  loading : boolean = false;
  especialistasFiltrados : Especialista [] = [];;
  historialClinico : boolean = false;
  especialistas : Especialista[] = [];
  constructor(private _usuariosService: UserService, private _usuariosGenericosService : UsuarioGenericoService, private _excelService : ExcelService,
     private _turnosService : TurnosService, private _pdfService : PdfService) {
    
  }

  ngOnInit(): void {
    this.loading = true;
      this._usuariosService.getAll().subscribe(usuarios => {
        this.users = usuarios.filter(u => u.Rol != 'administrador');
        this.usersLimpios = this.limpiarArrayParaTabla(this.users);
        this.usersParaTabla = this.usersLimpios;
        this.loading = false;
      });
      this._usuariosGenericosService.getEpecialistas().subscribe(usuarios => {
        this.especialistas = usuarios;
      });
    } 


  filtrarUsuarios() {
      if (!this.searchQuery.trim()) {
        this.usersParaTabla = this.usersLimpios.slice();
        return;
      }
  
      const query = this.searchQuery.toLowerCase().trim();

      this.usersParaTabla = this.usersLimpios.filter(user =>
        user.nombre.toLowerCase().includes(query) ||
        user.apellido.toLowerCase().includes(query) ||
        user.dni.includes(query)
      );
    }


  

  onSearchQueryChange() {
    this.filtrarUsuarios();
  }
  
  limpiarArrayParaTabla(usuarios: UsuarioGenerico[]): any[] {

    return usuarios.map(usuario => ({
      id: usuario.id,
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      rol: usuario.Rol,
      dni: usuario.Dni,
      email : usuario.Email,
      imagen : usuario.Imagen
    }));
  }

  mostrarAltaForm(){
    this.openUserForm = true;
    this.openViewUser = false;
    this.openListUser = false;
    this.historialClinico = false;
    this.openFiles = false;
  }
  mostraDescargaInforme(){
    this.openFiles = true;
    this.openListUser = false;
    this.openUserForm = false;
    this.openViewUser = false;
    this.historialClinico = false;
  }
  

  mostrarListado(){
    this.openListUser = true;
    this.openUserForm = false;
    this.openViewUser = false;
    this.historialClinico = false;
    this.openFiles = false;
  }
  descargaExcel(){
    this._excelService.guardarTodos(this.users);  
  }
  descargarLogs(){
    this._usuariosService.getIngresos().subscribe(ingresos => {
      this._pdfService.guardarIngresosEnPdf(ingresos);
    });
  }
  
  async generarInformeEspecialista() {
    if (this.especialistaSeleccionado && this.fechaInicio && this.fechaFin) {
      if(this.fechaInicio > this.fechaFin){
        Swal.fire({
          title: 'Error',
          text: 'La fecha de inicio debe ser mayor a la fecha final',
          background: 'white',
          icon: 'error'
        });
        return ;
      }

      const fechaInicioDate = new Date(this.fechaInicio);
      const fechaFinalDate = new Date(this.fechaFin);

      this._turnosService.getTurnosPorUsuario(this.especialistaSeleccionado).subscribe((turnos) =>{
        let turnosSolicitados = turnos.filter((turno) => this.convertirTimestamp(turno.fecha) >= fechaInicioDate && this.convertirTimestamp(turno.fecha) <= fechaFinalDate && turno.estado != 'finalizado');
        let turnosFinalizados = turnos.filter((turno) => this.convertirTimestamp(turno.fecha) >= fechaInicioDate && this.convertirTimestamp(turno.fecha) <= fechaFinalDate && turno.estado == 'finalizado');
      
        this._pdfService.descargarTurnosSolicitados(turnosSolicitados,turnosFinalizados,this.especialistaSeleccionado,this.fechaInicio,this.fechaFin);
      })

    } else {
        Swal.fire({
          title: 'Error',
          text: 'Debe seleccionar fechas y usuario',
          background: 'white',
          icon: 'error'
        });
    }
  }

  mostrarUsuarioEdit(selectedObject: any) {
    this.openViewUser = true;
    this.openUserForm = false;
    this.openListUser = false;
    this.historialClinico = false;
    this.openFiles = false;
    let user = this.users.find(u => u.id == selectedObject.id);
    if(user){
      this.userSelected = user;
    }
  }
  accionRealizada(accion :string){
    this.openViewUser = false;
    this.openUserForm = false;
    this.openListUser = false;
    this.historialClinico = accion == "historial";
    if( accion == "descargaExcel"){
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres descargasr el excel?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, seleccionar'
      }).then((result) => {
        if (result.isConfirmed) {
            this._turnosService.getTurnosPorUsuario(this.userSelected).subscribe((turnos) => {
              this._excelService.guardarTurnosExcel(this.userSelected,turnos);
            });
        }
      });
    }
  }

  convertirTimestamp(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000); 
  }
}
