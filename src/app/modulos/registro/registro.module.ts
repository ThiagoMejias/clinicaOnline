import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro/registro.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    UsuarioModule,
    FormsModule ]
})
export class RegistroModule { }
