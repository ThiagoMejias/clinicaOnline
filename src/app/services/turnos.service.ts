import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Turno } from '../interfaces/Turno';
import { Observable, of } from 'rxjs';
import { UsuarioGenerico } from '../interfaces/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private dataRef = collection(this.fs, 'turnos');

  constructor(private fs: Firestore) { }

  addTurno(newTurno: Turno) {
    try{
      const turnoDoc = doc(this.dataRef);
      newTurno.id = turnoDoc.id;
      setDoc(turnoDoc, newTurno);
      return true;
    }catch(e){
      return false;
    }
  }


  getTurnosPorEspecialistaEspecialidad(Especialista : UsuarioGenerico|null, especialidad : string|null): Observable<Turno[]> {
    if(Especialista && especialidad) {
      return new Observable<Turno[]>((observer) => {
        const q = query(
          this.dataRef, 
          where('especialista.id', '==', Especialista.id),
          where('especialidad', '==', especialidad)
        );
      onSnapshot(q, (snap) => {
        const Listas: Turno[] = [];
        snap.docChanges().forEach(x => {
          
          const one = x.doc.data() as Turno;
          console.log(one);
          
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
    }else {
      return of([]);
    }
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
      hora: turno.hora,
      paciente: turno.paciente
    });
  }

  deleteTurno(turno: Turno) {
    const turnoDoc = doc(this.dataRef, turno.id);
    deleteDoc(turnoDoc);
  }

}

