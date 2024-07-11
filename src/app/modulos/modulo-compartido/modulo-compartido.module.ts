import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloCompartidoRoutingModule } from './modulo-compartido-routing.module';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { OrdenarUsuariosPipe } from '../../pipes/ordernar-usuarios';
import { ImagenRedondeada } from '../../Directivas/imagen-redondeada';
import { MostrarErrorDirective } from '../../Directivas/mostrar-error.directive';
@NgModule({
  declarations: [ DynamicTableComponent,SpinnerComponent,OrdenarUsuariosPipe,ImagenRedondeada,MostrarErrorDirective],
  imports: [
    CommonModule,
    ModuloCompartidoRoutingModule,

  ], 
  exports: [ DynamicTableComponent,SpinnerComponent,ImagenRedondeada,MostrarErrorDirective]
})
export class ModuloCompartidoModule { }
