import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Turno } from '../interfaces/Turno';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private dataRef = collection(this.fs, 'turnos');

  constructor(private fs: Firestore) { }

  addTurno(newTurno: Turno) {
    const turnoDoc = doc(this.dataRef);
    newTurno.id = turnoDoc.id;
    setDoc(turnoDoc, newTurno);
  }

  getTurnos(): Observable<Turno[]> {
    return new Observable<Turno[]>((observer) => {
      onSnapshot(this.dataRef, (snap) => {
        const turnos: Turno[] = [];
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const turno = change.doc.data() as Turno;
            turnos.push(turno);
          }
        });
        observer.next(turnos);
      });
    });
  }

  updateTurno(turno: Turno) {
    const turnoDoc = doc(this.dataRef, turno.id);
    updateDoc(turnoDoc, {
      especialidad: turno.especialidad,
      especialista: turno.especialista,
      fecha: turno.fecha,
      horario: turno.horario,
      paciente: turno.paciente
    });
  }

  deleteTurno(turno: Turno) {
    const turnoDoc = doc(this.dataRef, turno.id);
    deleteDoc(turnoDoc);
  }

}

