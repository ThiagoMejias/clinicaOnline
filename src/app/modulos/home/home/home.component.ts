import { Component } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { UserService } from '../../../services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('slideInOutAlt', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('2000ms cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('2000ms cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent {
  
  public usuario: UsuarioGenerico | null = null;
  public loading: boolean = false;
  date!: Date;
  constructor(private _userService : UserService) { 
    this.date = new Date();
  }
  tituloBienvenida = 'Bienvenido a Clínica Médica';
  descripcionBienvenida = 'Somos una clínica médica comprometida con brindar atención de calidad a nuestros pacientes. Ofrecemos una amplia gama de servicios médicos, desde consultas de rutina hasta procedimientos especializados, todo en un ambiente cálido y acogedor.';

  ngOnInit(): void {
    this._userService.obtenerUsuarioObs().subscribe(
      (user: UsuarioGenerico | null) => {
        console.log(user);
        this.usuario = user;
        this.loading = true;
      }
    );
  }
}
