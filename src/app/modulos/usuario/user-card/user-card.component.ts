import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() usuario!: UsuarioGenerico;
  @Input() vistaAdmin : boolean = false;
  @Output() accionRealizada = new EventEmitter<string>();
 
  constructor(private _usuarioService: UserService) { }
  accion(accion : string){
    console.log(accion);
    this.accionRealizada.emit(accion);
  }
  toggleAccess() {
    
    this._usuarioService.toggleAccess(this.usuario.id,this.usuario.Autorizado).subscribe(
      () => {
        this.usuario.Autorizado = !this.usuario.Autorizado;
        const status = this.usuario.Autorizado ? 'Habilitado' : 'Inhabilitado';
        Swal.fire({
          title: 'Éxito',
          text: `Acceso ${status} para ${this.usuario.Nombre} ${this.usuario.Apellido}`,
          icon: 'success'
        });
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al actualizar el estado de acceso',
          icon: 'error'
        });
        console.error('Error al actualizar estado de acceso:', error);
  
        this.usuario.Autorizado = !this.usuario.Autorizado;
      }
    );
  }
}
