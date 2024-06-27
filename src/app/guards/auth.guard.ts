import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);

  if(authService.obtenerUsuario()){
    return true;
  }else{
    window.location.href = '/welcome'
    return false
  }
};