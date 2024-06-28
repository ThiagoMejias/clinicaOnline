import { Component } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  users : UsuarioGenerico[] = [
  ]
  searchQuery: string = '';
  userSelected! : UsuarioGenerico;
  openViewUser : boolean = false;
  usersLimpios : any[] = [];
  usersParaTabla : any[] =[];
  openUserForm : boolean = false;
  loading : boolean = false;
  constructor(private _usuariosService: UserService) {
    
  }

  ngOnInit(): void {
      this._usuariosService.getAll().subscribe(usuarios => {

        this.users = usuarios;
        console.log(usuarios);
        
        this.usersLimpios = this.limpiarArrayParaTabla(this.users);
        this.usersParaTabla = this.usersLimpios;
      });
    } 


  filtrarUsuarios() {
      if (!this.searchQuery.trim()) {
        this.usersParaTabla = this.usersLimpios.slice();
        return;
      }
  
      const query = this.searchQuery.toLowerCase().trim();

      this.usersParaTabla = this.usersLimpios.filter(user =>
        user.nombre.toLowerCase().includes(query) ||
        user.apellido.toLowerCase().includes(query) ||
        user.dni.includes(query)
      );
    }


  

  onSearchQueryChange() {
    this.filtrarUsuarios();
  }
  
  limpiarArrayParaTabla(usuarios: UsuarioGenerico[]): any[] {

    
    return usuarios.map(usuario => ({
      id: usuario.id,
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      rol: usuario.Rol,
      dni: usuario.Dni
    }));
  }

  mostrarAltaForm(){
    this.openUserForm = true;
    this.openViewUser = false;
  }
  
  mostrarUsuarioEdit(selectedObject: any) {
    this.openViewUser = true;
    this.openUserForm = false;

    let user = this.users.find(u => u.id == selectedObject.id);
    if(user){
      this.userSelected = user;
    }
  
  }
}
