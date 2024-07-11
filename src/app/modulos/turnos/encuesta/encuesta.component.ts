import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Turno } from '../../../interfaces/Turno';
import { TurnosService } from '../../../services/turnos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  @Input() turno!: Turno|null;
  @Output() close = new EventEmitter<void>();
  formularioEncuesta: FormGroup;
  constructor(private _turnosService : TurnosService,private fb: FormBuilder) {
    
    this.formularioEncuesta = this.fb.group({
      experienciaGeneral: ['', Validators.required],
      tiemposEspera: ['', Validators.required],
      sugerencias: ['', Validators.required]
    });
  }
  cerrar() {
    this.close.emit();
  }



  enviarEncuesta() {

    if(this.turno){
      
      if(this.formularioEncuesta.valid) {
        this.turno.encuesta = {
          experienciaGeneral: this.formularioEncuesta.get('experienciaGeneral')?.value,
          tiempoDeEspera: this.formularioEncuesta.get('tiemposEspera')?.value,
          sugerencias: this.formularioEncuesta.get('sugerencias')?.value,
        }
        this._turnosService.updateTurno(this.turno);
        Swal.fire({
          title: 'Éxito',
          text: `Gracias por tu encuesta!`,
          icon: 'success' 
        });
        this.close.emit();
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Valide los datos',
          showConfirmButton: false,
          timer: 1500
        })
      }    
    }
}


}
