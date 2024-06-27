import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);

  if(authService.esAdmin()){
    return true;
  }else{
    if(authService.obtenerUsuario()){
      window.location.href = '/noAutorizado'
    }else{
      window.location.href = '/welcome';
    }
    return false
  }
};
