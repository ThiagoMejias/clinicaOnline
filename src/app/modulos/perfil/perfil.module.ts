import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { UserCardComponent } from '../usuario/user-card/user-card.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { MisHorariosComponent } from './mis-horarios/mis-horarios.component';
import { MatToolbarModule } from '@angular/material/toolbar';


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
  ]
})
export class PerfilModule { }
