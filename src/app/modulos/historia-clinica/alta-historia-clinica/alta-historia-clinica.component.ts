import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { HistoriaClinica } from '../../../interfaces/HistoriaClinica';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { Turno } from '../../../interfaces/Turno';
import { TurnosService } from '../../../services/turnos.service';
@Component({
  selector: 'app-alta-historia-clinica',
  templateUrl: './alta-historia-clinica.component.html',
  styleUrl: './alta-historia-clinica.component.css'
})
export class AltaHistoriaClinicaComponent implements OnInit {
  @Input() turno! : Turno;

  @Output() close = new EventEmitter<void>();
  historiaClinicaForm: FormGroup;

  ngOnInit(): void {
   
  }
  constructor(private fb: FormBuilder, private _turnosService : TurnosService) {
    this.historiaClinicaForm = this.fb.group({
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      temperatura: ['', Validators.required],
      presion: ['', Validators.required],
      dato1Clave: [''],
      dato1Valor: [''],
      dato2Clave: [''],
      dato2Valor: [''],
      dato3Clave: [''],
      dato3Valor: ['']
    });
  }
  

  guardarHistoriaClinica() {
    if (this.historiaClinicaForm.valid) {
      const historiaClinica: HistoriaClinica = {
        altura: this.historiaClinicaForm.value.altura,
        peso: this.historiaClinicaForm.value.peso,
        temperatura: this.historiaClinicaForm.value.temperatura,
        presion: this.historiaClinicaForm.value.presion,
        datos: [
          { [this.historiaClinicaForm.value.dato1Clave]: this.historiaClinicaForm.value.dato1Valor },
          { [this.historiaClinicaForm.value.dato2Clave]: this.historiaClinicaForm.value.dato2Valor },
          { [this.historiaClinicaForm.value.dato3Clave]: this.historiaClinicaForm.value.dato3Valor }
        ]
      };
      this._turnosService.addHistoriaClinica(historiaClinica,this.turno);
      Swal.fire({
        title: 'Éxito',
        text: `Los datos del turno fueron cargados con exito!`,
        icon: 'success'
        
      }).then(()=> {this.close.emit();})
      
  
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Debe ser autorizado por el administrador',
        background: 'white',
        icon: 'error'
      });
    }
  }
}
