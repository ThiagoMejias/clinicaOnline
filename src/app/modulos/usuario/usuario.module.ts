import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserCardComponent } from './user-card/user-card.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        FormUsuarioComponent,
        UserModalComponent,
        UserCardComponent
    ],
    exports: [
        FormUsuarioComponent,
        UserCardComponent
    ],
    imports: [
        CommonModule,
        UsuarioRoutingModule,
        ReactiveFormsModule,
        FormsModule ,
        MatIconModule
    ]
})
export class UsuarioModule { }
