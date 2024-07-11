import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authAdminGuard } from './guards/auth-admin.guard';
import { NoAutorizadoComponent } from './components/no-autorizado/no-autorizado.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home',
    loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule),
    canActivate: [authGuard] 
  },
  { 
    path: 'login',
    loadChildren: () => import('./modulos/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'welcome',
    loadChildren: () => import('./modulos/welcome/welcome.module').then(m => m.WelcomeModule) 
  },
  {
    path: 'registro',
    loadChildren : () => import('./modulos/registro/registro.module').then(m => m.RegistroModule)
  },
  {
    path: 'gestionUsuarios',
    loadChildren : () => import('./modulos/gestion-usuarios/gestion-usuarios.module').then(m => m.GestionUsuariosModule),
    canActivate: [authAdminGuard]
  },
  {
    path: 'misTurnos',
    loadChildren : () => import('./modulos/turnos/turnos.module').then(m => m.TurnosModule),
    canActivate: [authGuard] ,
    
  },
  {
    path: 'misTurnos/solicitarTurno',
    loadChildren : () => import('./modulos/turnos/turnos.module').then(m => m.TurnosModule),
    canActivate: [authGuard] 
  },
  {
    path: 'miPerfil',
    loadChildren : () => import('./modulos/perfil/perfil.module').then(m => m.PerfilModule),
    canActivate: [authGuard] 
  },
  {
    path: 'pacientes',
    loadChildren : () => import('./modulos/pacientes/pacientes.module').then(m => m.PacientesModule),
    canActivate: [authGuard] 
  },
  { path: 'noAutorizado', component: NoAutorizadoComponent },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
