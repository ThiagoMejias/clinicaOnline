import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';


@NgModule({
  declarations: [
    SolicitarTurnoComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule
  ]
})
export class TurnosModule { }
