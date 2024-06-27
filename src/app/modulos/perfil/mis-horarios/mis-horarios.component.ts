import { Component, Input } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css'
})
export class MisHorariosComponent {
  @Input() usuario!: UsuarioGenerico;
  selectedCells: Set<string> = new Set();
  isSelecting = false;
  horas = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];
  dias = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  handleMouseDown(day: string, hour: string) {
    this.isSelecting = true;
    this.toggleCellSelection(day, hour);
    console.log(this.usuario.Especialidades.forEach((e : any)=> console.log(e)));
    
  }

  handleMouseEnter(day: string, hour: string) {
    if (this.isSelecting) {
      this.toggleCellSelection(day, hour);
    }
  }

  handleMouseUp() {
    this.isSelecting = false;
  }

  toggleCellSelection(day: string, hour: string) {
    const cell = `${day}-${hour}`;
    if (this.selectedCells.has(cell)) {
      this.selectedCells.delete(cell);
    } else {
      this.selectedCells.add(cell);
    }
  }

  isSelected(day: string, hour: string): boolean {
    return this.selectedCells.has(`${day}-${hour}`);
  }
}
