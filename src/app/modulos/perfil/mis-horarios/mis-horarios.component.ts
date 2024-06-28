import { Component, Input, OnInit, inject } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { FranjaHoraria } from '../../../interfaces/franja-horaria';
import { Horarios } from '../../../interfaces/horarios';
import { horas,dias,diasCompletos } from '../../../interfaces/Dias';
import { HorariosService } from '../../../services/horarios.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent implements OnInit {
  
  ngOnInit(): void {
    this.loading = true;
    this._horariosService.getHorariosByEspecialista(this.usuario.id).subscribe((horarios : any)=>{
        console.log(horarios);
        this.Horarios = horarios;
        this.loading = false;
      }
    )
  }

  @Input() usuario!: UsuarioGenerico;
  private  Horarios!: Horarios[];
  private _horariosService = inject(HorariosService);
  public loading : boolean = false;
  selectedCells: Set<string> = new Set();
  isSelecting = false;
  selectedEspecialidad: string = '';
  horas = horas;
  dias = dias;
  selectedFranjas: FranjaHoraria[] = [];

  handleMouseDown(day: string, hour: string) {
    this.isSelecting = true;
    this.toggleCellSelection(day, hour);
    console.log(this.usuario.Especialidades.forEach((e: any) => console.log(e)));
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
    if(!this.horarioOcupado(day, hour)) {
      const cell = `${day}-${hour}`;
      if (this.selectedCells.has(cell)) {
        this.selectedCells.delete(cell);
        this.removeFranja(day, hour);
      } else {
        this.selectedCells.add(cell);
        this.addFranja(day, hour);
      }
    }
  }

  isSelected(day: string, hour: string): boolean {
    return this.selectedCells.has(`${day}-${hour}`);
  }

  especialidadChange() {
      this.selectedCells.clear();
      this.selectedFranjas = [];

      this.Horarios.forEach((horario : Horarios) => {
      
        if(horario.Especialidad == this.selectedEspecialidad){
          horario.franjaHoaria.forEach(franja => {
            const dayAbbr = Object.keys(diasCompletos).find(key => diasCompletos[key] === franja.Dia);
            if (dayAbbr) {
              const cell = `${dayAbbr}-${franja.Hora}`;
              this.selectedCells.add(cell);
              this.selectedFranjas.push(franja);
            }
          });
        } else {
          horario.franjaHoaria.forEach(franja => {
            const dayAbbr = Object.keys(diasCompletos).find(key => diasCompletos[key] === franja.Dia);
            if (dayAbbr) {
              const cell = `${dayAbbr}-${franja.Hora}`;
              this.selectedCells.delete(cell); // Si estaba seleccionada, la deseleccionamos
            }
          });
        }
      });

  }

  addFranja(day: string, hour: string) {
    const franja: FranjaHoraria = {
      Dia: diasCompletos[day],
      Hora: hour,
      Disponible: true
    };
    this.selectedFranjas.push(franja);
  }

  removeFranja(day: string, hour: string) {
    this.selectedFranjas = this.selectedFranjas.filter(f => f.Dia !== diasCompletos[day] || f.Hora !== hour);
  }

  guardarHorarios() {
    const horarios: Horarios = {
      Especialista: this.usuario,
      Especialidad: this.selectedEspecialidad,
      franjaHoaria: this.selectedFranjas
    };
    this._horariosService.addEspecialidadHorarios(horarios);
    Swal.fire({
      title: 'Éxito',
      text: `Sus horarios fueron cambiados correctamente!`,
      icon: 'success'
    })
  }

  horarioOcupado(day: string, hour: string): boolean {
    return this.Horarios.some(horario =>
      horario.Especialidad !== this.selectedEspecialidad &&
      horario.franjaHoaria.some(franja =>
        franja.Dia === diasCompletos[day] && franja.Hora === hour
      )
    );
  }
  

  isSelectable(day: string, hour: string): boolean {
    const horario = this.Horarios.find(h => h.Especialidad === this.selectedEspecialidad);
    if (!horario) return false;
    console.log(horario.franjaHoaria.some(f => f.Dia === diasCompletos[day] && f.Hora === hour));
    
    return horario.franjaHoaria.some(f => f.Dia === diasCompletos[day] && f.Hora === hour);
  }
  getDateFromDay(day: string): Date {
    const today = new Date();
    const dayIndex = this.dias.indexOf(day);
    const targetDate = new Date(today.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7)));
    return targetDate;
  }
}

