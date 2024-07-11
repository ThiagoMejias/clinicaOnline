import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuloCompartidoModule } from '../modulo-compartido/modulo-compartido.module';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { MatIconModule } from '@angular/material/icon';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';
import { EstilosEstadosDirective } from '../../Directivas/estilos-estalos.directive';


@NgModule({
  declarations: [
    SolicitarTurnoComponent,
    MisTurnosComponent,
    EncuestaComponent,
    EstilosEstadosDirective
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,
    ModuloCompartidoModule, 
    ReactiveFormsModule,
    MatIconModule,
    HistoriaClinicaModule
  ]
})
export class TurnosModule { }
