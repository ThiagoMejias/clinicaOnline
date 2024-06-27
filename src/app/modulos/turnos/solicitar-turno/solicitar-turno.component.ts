import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from '../../../services/turnos.service';
import { Turno } from '../../../interfaces/Turno';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {
  @Input() isAdmin: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private turnoService: TurnosService) {
    this.form = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fecha: ['', Validators.required],
      horario: ['', Validators.required],
      paciente: ['', this.isAdmin ? Validators.required : Validators.nullValidator]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      const turno: Turno = this.form.value;
      this.turnoService.addTurno(turno);
      console.log('Turno solicitado:', turno);
      // Aquí se puede agregar la lógica para notificar al usuario o realizar otras acciones
    }
  }
}
