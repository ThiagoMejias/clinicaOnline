import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloCompartidoRoutingModule } from './modulo-compartido-routing.module';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { SpinnerComponent } from './spinner/spinner.component';
@NgModule({
  declarations: [ DynamicTableComponent,SpinnerComponent],
  imports: [
    CommonModule,
    ModuloCompartidoRoutingModule,

  ], 
  exports: [ DynamicTableComponent,SpinnerComponent]
})
export class ModuloCompartidoModule { }
