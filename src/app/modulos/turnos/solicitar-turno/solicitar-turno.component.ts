import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from '../../../services/turnos.service';
import { Turno } from '../../../interfaces/Turno';
import { UsuarioGenericoService } from '../../../services/usuarioGenerico.service';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { format } from 'date-fns';
import { HorariosService } from '../../../services/horarios.service';
import { Horarios } from '../../../interfaces/horarios';
import { FranjaHoraria } from '../../../interfaces/franja-horaria';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
  animations: [
    trigger('flyInFromSides', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', 
          stagger('100ms', [
            animate('800ms ease-out', keyframes([
              style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
              style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
            ]))
          ]), { optional: true })
      ])
    ])
  ]
})
export class SolicitarTurnoComponent implements OnInit {
  isAdmin: boolean = false;
  loading : boolean = false;
  puedeSeleccionar : boolean = true;
  especialistas : UsuarioGenerico [] = [];
  especialistaSeleccionado: UsuarioGenerico | null = null;
  especialidadSeleccionada: string | null = null;
  turnosDisponibles: Turno[] = [];
  pacientes : UsuarioGenerico[] = [];
  usuarioActual! : UsuarioGenerico;
  pacienteTurno! : UsuarioGenerico|null;
  constructor(private fb: FormBuilder, private turnoService: TurnosService, private _userService : UserService,
     private _usuariosService : UsuarioGenericoService, private _horariosService :HorariosService) {
   
  }

  ngOnInit(): void {
    this.loading = true;
    let user = this._userService.obtenerUsuario(); 
    if(user){
      this.cargaDeDatos(user);
    }

  }


  cargaDeDatos(user : UsuarioGenerico): void {
    this.usuarioActual = user; 
    this._usuariosService.getEpecialistas().subscribe(data =>{
      this.especialistas = data;
    }); 

    if(this.usuarioActual.Rol == 'administrador'){

      this.isAdmin = true;
      this._usuariosService.getPacientes().subscribe(data =>{
        this.pacientes = data;
        this.loading = false;
      }); 

    }else{
      this.pacienteTurno = this.usuarioActual;
      console.log(this.pacienteTurno);
      this.loading = false;
    }
  }

  seleccionoPaciente() {
    const pacienteId = (<HTMLSelectElement>document.getElementById('pacientes')).value;
    
    let pacienteTurno = this.pacientes.find(paciente => paciente.id == pacienteId);
    
    if(pacienteTurno)
      this.pacienteTurno = pacienteTurno;
    else
      this.pacienteTurno = null;
  }

  seleccionEspecialista(especialista: UsuarioGenerico) {
    
    this.especialistaSeleccionado = especialista;
    this.especialidadSeleccionada = null;
    this.turnosDisponibles = [];
  }

  seleccionEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.turnosDisponibles = [
    ];
    this.getTurnosDisponibles();
  }

  turnoSeleccionado(turno: Turno) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres seleccionar este turno para el día ${turno.fechaFormateada}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, seleccionar'
    }).then((result) => {
      if (result.isConfirmed) {
        turno.paciente = this.pacienteTurno ? this.pacienteTurno : this.usuarioActual; 
     
        if(this.turnoService.addTurno(turno)){
          Swal.fire({
            title: 'Éxito',
            text: `Turno reservado`,
            icon: 'success'
            
          }).then(()=> {
            this.especialidadSeleccionada = '';
            this.especialistaSeleccionado = null;
          })
          
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ocurrio un error reservando el turno',
            showConfirmButton: false,
            timer: 1500
          })
        }


      }
    });
  }
  getTurnosDisponibles(){
    if(this.especialistaSeleccionado && this.especialidadSeleccionada){
      this._horariosService.getHorariosByEspecialistaAndEspecialidad(this.especialistaSeleccionado?.id, this.especialidadSeleccionada)
      .subscribe((horarios : Horarios [])=>{
       
        
        const proximosTurnos = this.obtenerTurnosProximos(horarios[0].franjaHoraria, this.especialistaSeleccionado, this.especialidadSeleccionada);
        this.turnoService.getTurnosPorEspecialistaEspecialidad(this.especialistaSeleccionado,this.especialidadSeleccionada)
        .subscribe( (turnos : Turno []) => {
    
          const turnosFiltrados = proximosTurnos.filter(turnoProximo =>
            !turnos.some(turno => turno.fechaFormateada == turnoProximo.fechaFormateada)
          );
          this.turnosDisponibles = turnosFiltrados.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
        })
        
      });
   
    }
  }

  
  obtenerTurnosProximos(franjasHorarias: FranjaHoraria[], especialista: UsuarioGenerico| null, especialidad: string|null): Turno[] {
    const diasPorSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diasHasta = 15;
    const turnosProximos: Turno[] = [];

    // Obtener la fecha y hora actual
    const ahora = new Date();

    franjasHorarias.forEach(franja => {
      // día pero en número
      const diaFranja = diasPorSemana.indexOf(franja.Dia);

      for (let i = 0; i <= diasHasta; i++) {
        const fechaFranja = new Date(ahora);
        // voy sumando los días
        fechaFranja.setDate(ahora.getDate() + i);

        // establezco hora
        fechaFranja.setHours(parseInt(franja.Hora.split(':')[0], 10), parseInt(franja.Hora.split(':')[1], 10), 0, 0);

        if (fechaFranja.getDay() === diaFranja && franja.Disponible && fechaFranja > ahora && especialista != null && especialidad != null) {
          turnosProximos.push({
            especialidad: especialidad,
            especialista: especialista,
            fecha: fechaFranja,
            fechaFormateada: format(fechaFranja, 'yyyy-MM-dd h:mm a'),
            hora: franja.Hora,
            estado : 'en espera',
            resenia: '',
            comentario: ''
          });
        }
      }
    });

    return turnosProximos;
  }

 
}
