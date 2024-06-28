import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoggedIn: boolean = true;
  public loading: boolean = false;
  //#region variables de formulario 
  email: string = '';
  emailError: string = '';
  password: string = '';
  passwordError: string = '';
  username: string = '';
  usernameError: string = '';
  confirmPassword: string = '';
  confirmPasswordError: string = '';
  // #endregion


  constructor(private authService: AuthService, private router: Router, private _userService: UserService) {

  }

  cargarUsuarioAdmin() {
    this.email = 'mejiasthiago1@gmail.com';
    this.password = '12345T';
  }

  cargarUsuarioEspecialista() {
    this.email = 'comahueindioo@gmail.com';
    this.password = '12345T';
  }

  setLogin() {

    this.isLoggedIn = false;
  }

  async login() {
    if (this.verifyFields()) {
      this.loading = true;
      let user = await this.authService.loginUser(this.email, this.password);
      if(user.emailVerified){

        this._userService.getUsernameByEmail(user.email).subscribe(
          (user: UsuarioGenerico) => {
            if (user.Autorizado) {
              this.router.navigate(['/miPerfil']);
              this._userService.guardarUsuario(user);
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Debe ser autorizado por el administrador',
                background: 'white',
                icon: 'error'
              });
            }
            this.loading = false;
          },
          error => {
            console.error('Error obteniendo datos de usuario:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al obtener los datos del usuario',
              background: 'white',
              icon: 'error'
            });
          }
        );
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Debe verificar el correo electronico, con el mail que le llego a su correo.',
          background: 'white',
          icon: 'error'
        });
      }


  }
}



  verifyFields() {
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    this.confirmPasswordError = '';
    if (!this.isValidEmail(this.email)) {
      this.emailError = 'El formato del correo electrónico no es válido.';
      return false;
    }
    if (!this.email || !this.password) {
      this.emailError = !this.email ? 'El correo electrónico es obligatorio.' : '';
      this.passwordError = !this.password ? 'La contraseña es obligatoria.' : '';
      return false;
    }
    if (!this.isLoggedIn) {
      if (!this.username || !this.password || !this.confirmPassword) {
        this.usernameError = !this.username ? 'El nombre de usuario es obligatorio.' : '';
        this.passwordError = !this.password ? 'La contraseña es obligatoria.' : '';
        this.confirmPasswordError = !this.confirmPassword ? 'La confirmación de la contraseña es obligatoria.' : '';
        return false;
      }
      if (this.password.length < 6) {
        this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
        this.confirmPasswordError = 'La contraseña debe tener al menos 6 caracteres';
        return false;
      }
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Las contraseñas no coinciden.';
        return false;
      }
    }

    return true;
  }

  isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
