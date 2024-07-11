import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { ModuloCompartidoModule } from '../modulo-compartido/modulo-compartido.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CurrentDatePipe } from '../../pipes/current-date'; // Importa el pipe aquí

@NgModule({
  declarations: [
    HomeComponent,
    CurrentDatePipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ModuloCompartidoModule,
  ]
})
export class HomeModule { }
