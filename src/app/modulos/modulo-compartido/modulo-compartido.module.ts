import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloCompartidoRoutingModule } from './modulo-compartido-routing.module';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';

@NgModule({
  declarations: [ DynamicTableComponent],
  imports: [
    CommonModule,
    ModuloCompartidoRoutingModule
  ], 
  exports: [ DynamicTableComponent]
})
export class ModuloCompartidoModule { }
