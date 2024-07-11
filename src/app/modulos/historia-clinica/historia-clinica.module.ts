import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { AltaHistoriaClinicaComponent } from './alta-historia-clinica/alta-historia-clinica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HistoriaClinicaComponent,
    AltaHistoriaClinicaComponent
  ],
  imports: [
    CommonModule,
    HistoriaClinicaRoutingModule,
    ReactiveFormsModule
  ],
  exports: [HistoriaClinicaComponent, AltaHistoriaClinicaComponent]
})
export class HistoriaClinicaModule { }
