import { Component,  OnInit, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  private _userService : UserService =  inject(UserService);
  user! : UsuarioGenerico;
  misHorarios : Boolean = false;
  miPerfil : Boolean = true;

  ngOnInit(): void {
      let userResponse = this._userService.obtenerUsuario();
      if(userResponse){
        this.user = userResponse;
      }
  }

  toggleVerHorarios(){
    this.misHorarios = !this.misHorarios;
    this.miPerfil = false;
  }
  toggleVerPerfil(){
    this.miPerfil = !this.miPerfil;
    this.misHorarios = false;
  }

}
