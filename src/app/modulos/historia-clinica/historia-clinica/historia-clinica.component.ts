import { Component, inject, Input, OnInit } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { TurnosService } from '../../../services/turnos.service';
import { Turno } from '../../../interfaces/Turno';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('800ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('800ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HistoriaClinicaComponent implements OnInit{
  @Input() paciente!: UsuarioGenerico;
  turnosService = inject(TurnosService);
  turnos! : Turno[];
  ngOnInit(): void {
    this.cargarDatos();
  }
  cargarDatos(){
    this.turnosService.getTurnosPorUsuario(this.paciente).subscribe(turnos =>{
      this.turnos = turnos.filter(turno => turno.estado == "finalizado");
      console.log(turnos);
      
    });
  }
  getKey(obj: any): string {
    return Object.keys(obj)[0];
  }
}
