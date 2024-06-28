import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { MisHorariosComponent } from './mis-horarios/mis-horarios.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { ModuloCompartidoModule } from '../modulo-compartido/modulo-compartido.module';



@NgModule({
  declarations: [
    MiPerfilComponent,
    MisHorariosComponent
  ],
  imports: [
    UsuarioModule,
    CommonModule,
    PerfilRoutingModule,
    MatToolbarModule,
    FormsModule,
    ModuloCompartidoModule
    
  ]
})
export class PerfilModule { }
