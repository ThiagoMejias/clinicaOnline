import { Component,  OnInit, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { PdfService } from '../../../services/pdf.service';
import { TurnosService } from '../../../services/turnos.service';
import { Turno } from '../../../interfaces/Turno';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  private _userService : UserService =  inject(UserService);
  private _pdfService : PdfService =  inject(PdfService);
  private _turnosService : TurnosService =  inject(TurnosService);
  private especialidadSeleccionada : string ='';
  especialidades : string[] = [];
  user! : UsuarioGenerico;
  misHorarios : Boolean = false;
  miPerfil : Boolean = true;
  historialClinico : Boolean = false;
  turnos! : Turno[];
  ngOnInit(): void {
      let userResponse = this._userService.obtenerUsuario();
      if(userResponse){
        this.user = userResponse;
        if(this.user.Rol == 'paciente'){
          this.cargarDatos(this.user);
        }
      }
  }

  cargarDatos(user : UsuarioGenerico){
    this._turnosService.getTurnosPorUsuario(user).subscribe(turnosResponse => {
      this.turnos = turnosResponse;
      const especialidadesSet = new Set(this.turnos.map(turno => turno.especialidad));
      this.especialidades = Array.from(especialidadesSet);
      if(this.especialidadSeleccionada.length > 0){ 
        this.especialidadSeleccionada = this.especialidades[0];
      }
    });
  }

  toggleVerHorarios(){
    this.misHorarios = !this.misHorarios;
    this.miPerfil = false;
  }
  toggleVerPerfil(){
    this.miPerfil = !this.miPerfil;
    this.historialClinico = false;
    this.misHorarios = false;
  }
  toggleHistorialClinico(){
    this.historialClinico = true;
    this.misHorarios = false;
    this.miPerfil = false;
  }
  descargarHistoriaClinica(){
    this._turnosService.getTurnosPorUsuario(this.user).subscribe(turnos =>{
      const turnosFiltrados = turnos.filter(turno => turno.estado == "finalizado");
      this._pdfService.descargarAtencionesPdf(this.user,turnosFiltrados);
    });
  }

  descargarTurnosPorEspecialidad(){
    if(this.especialidadSeleccionada != ''){
      this._turnosService.getTurnosPorUsuario(this.user).subscribe(turnos => {
        const turnosFiltrados = turnos.filter(turno => turno.especialidad == this.especialidadSeleccionada);
        this._pdfService.descargarAtencionesPdf(this.user,turnosFiltrados);
      });
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Es necesario seleccionar una especialidad para descargar el archivo',
        background: 'white',
        icon: 'error'
      });
    }
  
  }

  seleccionarEspecialidad(especialidad: any) {
    this.especialidadSeleccionada = especialidad.value;
  }

}
