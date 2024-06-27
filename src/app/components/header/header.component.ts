import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioGenerico } from '../../interfaces/Usuarios';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userLogin: boolean = false;
  user!: UsuarioGenerico | null;
  constructor(private authService: AuthService, private _userService: UserService) {

  };


  ngOnInit(): void {
    this._userService.obtenerUsuarioObs().subscribe(
      (user: UsuarioGenerico | null) => {
        console.log(user);
        
          this.user = user;
          this.userLogin = !!user;
       
      }
    );
  }

  logout() {
    this._userService.desloguearUsuario();
    this.authService.signOut();
    window.location.href = "/welcome";
  }
}
