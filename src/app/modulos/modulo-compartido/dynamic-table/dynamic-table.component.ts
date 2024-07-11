import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent {

  @Input() objects: any[] = [];
  @Output() objectSelected = new EventEmitter<any>();

  columns: string[] = [];
  selectedObject: any;

  
  ngOnInit(): void {
    console.log(this.objects);
    if (this.objects.length > 0) {
      this.columns = Object.keys(this.objects[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.objects);
    if (changes['objects'] && this.objects.length > 0) {
      this.columns = Object.keys(this.objects[0]);
    }
  }

  selectObject(object: any) {
    this.selectedObject = object;
    this.objectSelected.emit(object);
  }

  esImagen(column: string): boolean {
    return column.toLowerCase() =='imagen'; // O cualquier otra lógica para identificar columnas de imágenes
  }

  isColumnVisible(column: string): boolean {
    return column.toLocaleLowerCase() != 'id';
  }
}
