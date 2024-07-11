import { AbstractType, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentDate'
})
export class CurrentDatePipe implements PipeTransform {
  transform(fecha: any): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }
}
