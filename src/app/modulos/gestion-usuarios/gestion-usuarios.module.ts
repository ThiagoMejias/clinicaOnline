import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionUsuariosRoutingModule } from './gestion-usuarios-routing.module';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { ModuloCompartidoModule } from '../modulo-compartido/modulo-compartido.module';
import { MatIcon, MatIconModule, } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';





@NgModule({
    declarations: [
        GestionUsuariosComponent
    ],
    imports: [
        CommonModule,
        UsuarioModule,
        GestionUsuariosRoutingModule,
        ModuloCompartidoModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        FormsModule
    ]
})
export class GestionUsuariosModule { }
