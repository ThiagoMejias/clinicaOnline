import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
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
    this.cargarHorarios();
  }

  @Input() usuario!: UsuarioGenerico;
  private  Horarios!: Horarios[];
  controllerRefresh : boolean = true;
  private _horariosService = inject(HorariosService);
  public loading : boolean = false;
  selectedCells: Set<string> = new Set();
  isSelecting = false;
  selectedEspecialidad: string = '';
  horas = horas;
  dias = dias;
  selectedFranjas: FranjaHoraria[] = [];
  constructor(private cdr: ChangeDetectorRef) {
    
  }

  cargarHorarios(): void {
    console.log("cargar horarios");
    
    this.loading = true;
    this._horariosService.getHorariosByEspecialista(this.usuario.id).subscribe({
      next: (horarios: Horarios[]) => {
        console.log(horarios);
        
        this.Horarios = horarios;
        this.loading = false;
        this.controllerRefresh = !this.controllerRefresh;
        this.controllerRefresh = !this.controllerRefresh;

      },
      error: (error: any) => {
        console.error('Error al cargar los horarios:', error);
        this.loading = false;
      }
    });
  }

  handleMouseDown(day: string, hour: string) {
    this.isSelecting = true;
    this.toggleCellSelection(day, hour);
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
    if(!this.horarioOcupado(day, hour) && this.selectedEspecialidad != '') {
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
          horario.franjaHoraria.forEach(franja => {
            const dayAbbr = Object.keys(diasCompletos).find(key => diasCompletos[key] === franja.Dia);
            if (dayAbbr) {
              const cell = `${dayAbbr}-${franja.Hora}`;
              this.selectedCells.add(cell);
              this.selectedFranjas.push(franja);
            }
          });
        } else {
          horario.franjaHoraria.forEach(franja => {
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

  async guardarHorarios() {
    if(this.selectedEspecialidad!= '')
    {
        this.loading = true;

        if(await this._horariosService.updateHorarios(this.usuario,this.selectedEspecialidad,this.selectedFranjas)){
          Swal.fire({
            title: 'Éxito',
            text: `Sus horarios fueron cambiados correctamente!`,
            icon: 'success'
            
          }).then(()=> {this.cargarHorarios(); this.selectedEspecialidad = ''})
          
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Valide los datos',
            showConfirmButton: false,
            timer: 1500
          })
        }
        this.especialidadChange();
        this.loading = false;
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar una especialidad',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  horarioOcupado(day: string, hour: string): boolean {
    if(this.Horarios){
      return this.Horarios.some(horario =>
        horario.Especialidad !== this.selectedEspecialidad &&
        horario.franjaHoraria.some(franja =>
          franja.Dia === diasCompletos[day] && franja.Hora === hour
        )
      );
    }
    return false;
   
  }
  

  isSelectable(day: string, hour: string): boolean {
    if(this.Horarios){
      const horario = this.Horarios.find(h => h.Especialidad === this.selectedEspecialidad);
      if (!horario) return false;
      
      return horario.franjaHoraria.some(f => f.Dia === diasCompletos[day] && f.Hora === hour);
    }
    return false;
   
  }
  getDateFromDay(day: string): Date {
    const today = new Date();
    const dayIndex = this.dias.indexOf(day);
    const targetDate = new Date(today.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7)));
    return targetDate;
  }
  seleccionarCeldas() {
    this.selectedCells.clear();
  
    this.Horarios.forEach((horario: Horarios) => {
      if (horario.Especialidad === this.selectedEspecialidad) {
        horario.franjaHoraria.forEach(franja => {
          const dayAbbr = Object.keys(diasCompletos).find(key => diasCompletos[key] === franja.Dia);
          if (dayAbbr) {
            const cell = `${dayAbbr}-${franja.Hora}`;
            this.selectedCells.add(cell); // Agregar la celda seleccionada
          }
        });
      }
    });
  }
}


