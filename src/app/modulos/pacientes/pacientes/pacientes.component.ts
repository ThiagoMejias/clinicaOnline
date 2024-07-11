import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';  
import { UserService } from '../../../services/user.service';
import { PacienteConTurnos, UsuarioGenerico } from '../../../interfaces/Usuarios';
import { TurnosService } from '../../../services/turnos.service';
import { Turno } from '../../../interfaces/Turno';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {

  loading : boolean = false;
  pacientes : UsuarioGenerico[] = [];
  usuario : UsuarioGenerico|null = null;
  pacientesConTurnos! : PacienteConTurnos[];
  historiaClinica : boolean = false;
  pacienteSeleccionado! : UsuarioGenerico;
  altaHistoriaClinica : boolean = false;
  turnoSeleccionado! :Turno;
  constructor(private _usuarioService: UserService, private _turnosService: TurnosService) {
    
  }

  ngOnInit(): void {
    this.loading = true;
    this._usuarioService.obtenerUsuarioObs().subscribe(data => {
      this.usuario = data;
      if(this.usuario!=null){
        this.cargarDatos(this.usuario);
      }
      });

    
  } 

  cargarDatos(usuario: UsuarioGenerico) {
    const pacientesConTurnos: PacienteConTurnos[] = [];
    const pacientesMap = new Map<string, { paciente: UsuarioGenerico, turnos: Turno[] }>();
  
    this._turnosService.getTurnosPorUsuario(usuario).subscribe(
      turnos => {
        const turnosFinalizados = turnos.filter(t => t.estado === 'finalizado');
  
        turnosFinalizados.forEach(turno => {
          const pacienteId = turno.paciente!.id;
          
          if (!pacientesMap.has(pacienteId)) {
            pacientesMap.set(pacienteId, { paciente: turno.paciente!, turnos: [] });
          }
          
          pacientesMap.get(pacienteId)!.turnos.push(turno);
        });
  
        pacientesMap.forEach((value, key) => {
          var turnosOrdenados = value.turnos.sort((a : any, b : any) => {
            const dateA = this.convertTimestampToDate(a.fecha as { seconds: number, nanoseconds: number });
            const dateB = this.convertTimestampToDate(b.fecha as { seconds: number, nanoseconds: number });
            console.log(dateA.getTime());
            
            return dateB.getTime() - dateA.getTime();
          });
          
          // Quedarse con los tres turnos más recientes
          value.turnos = turnosOrdenados.slice(0, 3);
          pacientesConTurnos.push(value);
        });
        this.pacientesConTurnos = pacientesConTurnos;
      },
      error => {
        console.error('Error al obtener los turnos:', error);
      }
    );
  }
  verHistoriaClinica(paciente : UsuarioGenerico){
    this.historiaClinica = !this.historiaClinica;
    this.pacienteSeleccionado = paciente;
  }
  agregarHistoriaClinica(turno : Turno) {
    this.turnoSeleccionado = turno;
    this.altaHistoriaClinica = !this.altaHistoriaClinica;
  }
  mostrarListado() {
    this.altaHistoriaClinica = false;
    this.historiaClinica = false; 
    this.cargarDatos(this.usuario!);
  }
  convertTimestampToDate(timestamp: { seconds: number, nanoseconds: number }): Date {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
}
