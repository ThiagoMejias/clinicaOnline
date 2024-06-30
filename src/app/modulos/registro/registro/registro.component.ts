import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { UsuarioGenericoService } from '../../../services/usuarioGenerico.service';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
 
})
export class RegistroComponent implements OnInit {

  public rol: string = '';
  public usuario!: UsuarioGenerico;
  public ocultar: boolean = false;
  loading : boolean = false;
  public selectedRole = '';
  roles = {
    especialista: false,
    paciente: false
  };
  

  constructor(private auth: AuthService, private _userService: UsuarioGenericoService,
    private router: Router) { }

  ngOnInit(): void {
    
    if (this.rol == '') {
      this.rol = '';
    }
  

  }

  getSelectedRole(): string {
    if (this.roles.especialista) {
      return 'especialista';
    } else if (this.roles.paciente) {
      return 'paciente';
    } else {
      return '';
    }
  }

  onCheckboxChange(event: any) {
    this.selectedRole = event.target.name; 
    const isChecked = event.target.checked;

    if (!isChecked) {
  
      this.ocultar = false;
      this.roles.especialista = false;
      this.roles.paciente = false;  
   
    } else {

      this.ocultar = true;
      if (this.selectedRole === 'especialista') {
        this.roles.paciente = false;
      } else if (this.selectedRole === 'paciente') {
        this.roles.especialista = false;
      }
    }

  }


  async getUsuario(event: UsuarioGenerico) {
    this.usuario = event;
    console.log(this.usuario);
    this.loading = true;
    let usuario = await this.auth.registerUser(this.usuario.Email, this.usuario.Password);
    if(usuario){
      this._userService.addData(this.usuario);
      Swal.fire({
        title: 'Creacion exitosa!',
        text: 'Datos cargados correctamente',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ok'
      })
      this.loading = false;
      this.router.navigate(['/welcome']);
    } 
    
  }

}