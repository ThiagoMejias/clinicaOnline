import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioGenerico } from '../interfaces/Usuarios';

@Pipe({
  name: 'ordernarUsuarios'
})
export class OrdenarUsuariosPipe implements PipeTransform {

  transform(cronogramas: any[]): any[] {
    return cronogramas.sort((a, b) => {
      const A = (a && a.apellido) ? a.apellido.toLowerCase() : '';
      const B = (b && b.apellido) ? b.apellido.toLowerCase() : '';

      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });
  }

}