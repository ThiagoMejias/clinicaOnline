import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../interfaces/Turno';
import { EspecialidadService } from '../../../services/especialidad.service';
import { UserService } from '../../../services/user.service';
import { Especialista, UsuarioGenerico } from '../../../interfaces/Usuarios';
import { TurnosService } from '../../../services/turnos.service';
import Swal from 'sweetalert2';
import { PdfService } from '../../../services/pdf.service';
import { firstValueFrom, forkJoin } from 'rxjs';


@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit {
    loading = false;
    pacientesDropdownOpen = false;
    pacienteSeleccionado: any = null;
    pacientesFiltrados: any[] = [];
    pacientes : UsuarioGenerico[] = [];
    especialidadesDropdownOpen = false;
    especialistasDropdownOpen = false;
    mostrarCalificacion = false;
    especialidadSeleccionada: string | null = '';
    especialistaSeleccionado: Especialista | null = null;
    turnos: Turno[] = [];
    turnoSeleccionado! : Turno|null;
    turnosFiltrados : Turno[] = [];
    especialidades : string [] =[];
    especialidadesFiltradas : string [] =[];
    especialistas : Especialista [] = [];
    especialistasFiltrados : Especialista [] = [];
    mostrarComentario = false;
    historicoCliente = false;
    comentarioCancelacion = '';
    estadoModificacion = '';
    encuesta = false;
  usuario! : UsuarioGenerico|null;
searchQuery: any;
  constructor(private _pdfService: PdfService, 
    private _usuarioService : UserService, private _turnoService : TurnosService) {
    
  }
  ngOnInit(): void {   
    this._usuarioService.obtenerUsuarioObs().subscribe(data => {
      this.usuario = data;
      if(this.usuario!=null){
          this.loading = true;
          this.cargarDatos(this.usuario);
      }

    });
  }

  cargarDatos(user : UsuarioGenerico){
    this._turnoService.getTurnosPorUsuario(user).subscribe(turnosResponse => {
      this.turnos = turnosResponse;
      this.turnosFiltrados = turnosResponse;
      
      const especialidadesSet = new Set(this.turnos.map(turno => turno.especialidad));
      const especialistasMap = new Map();
      const pacientesMap = new Map();

      this.turnos.forEach(turno => {
        especialistasMap.set(turno.especialista.id, turno.especialista);
      });

      this.turnos.forEach(turno => {
        pacientesMap.set(turno.paciente?.id, turno.paciente);
      });
      
      this.pacientes = Array.from(pacientesMap.values());
      this.pacientesFiltrados = this.pacientes;
      this.especialidades = Array.from(especialidadesSet);
      this.especialistas = Array.from(especialistasMap.values());

      this.especialidadesFiltradas = this.especialidades;
      this.especialistasFiltrados = this.especialistas;
      this.loading = false;
    });
  }

  toggleEspecialidadesDropdown() {
    this.especialidadesDropdownOpen = !this.especialidadesDropdownOpen;
  }

  toggleEspecialistasDropdown() {
    this.especialistasDropdownOpen = !this.especialistasDropdownOpen;
  }

  seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.especialidadesDropdownOpen = false; // Cerrar el dropdown después de seleccionar
    this.turnosFiltrados = this.filtrarTurnos(this.turnos);
    if(especialidad != ''){
      this.especialistasFiltrados = this.especialistas.filter(especialista => especialista.Especialidades.some(especialidad =>especialidad == especialidad));
    }
  }

  seleccionarEspecialista(especialista: any) {
    this.especialistaSeleccionado = especialista;
    this.especialistasDropdownOpen = false; // Cerrar el dropdown después de seleccionar
    this.turnosFiltrados = this.filtrarTurnos(this.turnos);
    if(especialista){
      this.especialidadesFiltradas = especialista.Especialidades;
    }else{
      this.especialidadesFiltradas = this.especialidades;
    }
  }


  calificar(numEstrella: number) {
      this.turnoSeleccionado!.calificacion = numEstrella;
      this._turnoService.updateTurno(this.turnoSeleccionado!);
      this.cargarDatos(this.usuario!);
   }


   async descargaTurnosPdf() {
    try {
      const obsTurnosPorEspecialidad = this._turnoService.getCantidadTurnosPorEspecialidad();
      const obsTurnosPorDia = this._turnoService.getCantidadTurnosPorDia();
  
      const turnosPorEspecialidad = await firstValueFrom(obsTurnosPorEspecialidad);
      const turnosPorDia = await firstValueFrom(obsTurnosPorDia);
      
      console.log("Datos recibidos:", { turnosPorEspecialidad, turnosPorDia });
  
      this._pdfService.generarInformeTurnosPdf(turnosPorEspecialidad, turnosPorDia);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  }

  

  buscarEnObjeto(objeto: any, valor: string): boolean {
    for (const key in objeto) {
      if (
        Object.prototype.hasOwnProperty.call(objeto, key) &&
        key !== 'Imagen' &&
        key !== 'Imagen2'
      ) {
        const field = objeto[key];
        if (typeof field === 'object') {
          if (this.buscarEnObjeto(field, valor)) {
            return true;
          }
        } else if (field.toString().toLowerCase().includes(valor.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }


  filtrarTurnosGeneral() {
        this.turnosFiltrados = this.turnos.filter(turno =>
          Object.values(turno).some(field =>
            typeof field === 'object'
              ? this.buscarEnObjeto(field, this.searchQuery)
              : field.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          ));
  }



  filtrarTurnos(turnos : Turno[]) {
    if(this.usuario?.Rol == "paciente"){
      return turnos.filter(turno => {
        const especialidadMatch = this.especialidadSeleccionada != '' ? turno.especialidad === this.especialidadSeleccionada : true;
        const especialistaMatch = this.especialistaSeleccionado ? turno.especialista.id === this.especialistaSeleccionado.id : true;
        return especialidadMatch && especialistaMatch;
      });
    }else{
      console.log(this.pacienteSeleccionado);
      
      return turnos.filter(turno => {
        const especialidadMatch = this.especialidadSeleccionada != '' ? turno.especialidad === this.especialidadSeleccionada : true;
        const especialistaMatch = this.pacienteSeleccionado ? turno.paciente?.id === this.pacienteSeleccionado.id : true;
        return especialidadMatch && especialistaMatch;
      });
    }
    
  }
  
  encuestaCerrada(){
    this.encuesta = false;
  }
  altaHistoriaCerrada(){
    this.historicoCliente = false;
  }
 
  cancelarTurno(turno: any) {
    this.mostrarComentario = true;
    this.turnoSeleccionado = turno; 
    this.estadoModificacion = 'cancelado';
  }
  rechazarTurno(turno: any){
    this.mostrarComentario = true;
    this.turnoSeleccionado = turno; 
    this.estadoModificacion = 'rechazado';
  }

  finalizarTurno(turno : any)
  {
    this.mostrarComentario = true;
    this.turnoSeleccionado = turno; 
    this.estadoModificacion = 'finalizado';
  }
  aceptarTurno(turno : any){
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres aceptar el turno?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, seleccionar'
    }).then((result) => {
      if (result.isConfirmed) {
        turno.estado = 'aceptado';
        this._turnoService.updateTurno(turno); 
        this.especialidadSeleccionada = ''; 
        this.turnoSeleccionado = null; 
        if(this.usuario != null )
           this.cargarDatos(this.usuario);
      }
    });
  }
  
  guardarComentario(comentario : string) {
      if(this.turnoSeleccionado){
        
        this.turnoSeleccionado.estado = this.estadoModificacion;
        if(this.estadoModificacion != 'finalizado'){
          this.turnoSeleccionado.comentario = comentario;  
        }else{
          this.turnoSeleccionado.resenia = comentario;
        }
        
        this._turnoService.updateTurno(this.turnoSeleccionado);
        this.mostrarComentario = false;
        Swal.fire({
          title: 'Éxito',
          text: `El turno fue ${this.estadoModificacion} correctamente!`,
          icon: 'success'
          
        }).then(()=> {
          this.especialidadSeleccionada = ''; 
          this.turnoSeleccionado = null; 
          if(this.usuario != null )
            this.cargarDatos(this.usuario);
        })
      }
    }

  
  revisarDetalle(turno: Turno): void {
    let estado = turno.resenia != '' ? 'Reseña' : 'Comentario';
    let texto = estado == 'Reseña' ? turno.resenia : turno.comentario; 
    Swal.fire({
      title: `Turno ${turno.estado}`,
      text: `${estado}: ${texto}`,
      icon: 'info'
      
    })
  }

  encuestaTurno(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.encuesta = true;
  }

  agregarHistorico(turno : Turno): void {
    this.turnoSeleccionado = turno;
    this.historicoCliente = true;
  }
  calificarTurno(turno: Turno): void {
    console.log(`Calificando atención del turno con ID ${turno.id}`);
  }


  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.pacientesDropdownOpen = false;
    this.turnosFiltrados = this.filtrarTurnos(this.turnos);
    if(this.pacienteSeleccionado){
      this.especialidadesFiltradas = Array.from(new Set(this.turnosFiltrados.map(turno => turno.especialidad)));
    }else{
      this.especialidadesFiltradas = this.especialidades;
    }
  }


  toggleAtencion(turno : Turno){
    this.turnoSeleccionado = turno;
    this.mostrarCalificacion = !this.mostrarCalificacion;
  }
  togglePacientesDropdown() {
      this.pacientesDropdownOpen = !this.pacientesDropdownOpen;
      this.especialistasDropdownOpen = false; // Cerrar el dropdown de especialistas si está abierto
  }
  cerrarEncuesta() {
    this.mostrarCalificacion = false;
    this.cargarDatos(this.usuario!);
  }

  convertirTimestamp(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
  }
    obtenerDia(date :Date){
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const numeroDia = date.getDay();
    return dias[numeroDia];
  }
}
