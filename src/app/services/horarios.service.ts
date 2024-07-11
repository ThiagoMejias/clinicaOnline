import { Injectable } from '@angular/core';
import { Firestore, QuerySnapshot, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Horarios } from '../interfaces/horarios';
import { FranjaHoraria } from '../interfaces/franja-horaria';
import { UsuarioGenerico } from '../interfaces/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {


  private _horariosEspecialistasColecction = collection(this.fs, 'horariosEspecialistas');
  constructor(private fs: Firestore) { 
   this._horariosEspecialistasColecction = collection(this.fs, 'horariosEspecialistas');

  }

  addEspecialidadHorarios(NuevosHoariosPorEspecialidad: Horarios) {
    const docs = doc(this._horariosEspecialistasColecction);
    setDoc(docs, NuevosHoariosPorEspecialidad);
  }

  updateHorarios(usuario: UsuarioGenerico, especialidad: string, nuevaFranjaHorarios: FranjaHoraria[]) {

    try {
      const q = query(
        this._horariosEspecialistasColecction,
        where('Especialista.id', '==', usuario.id),
        where('Especialidad', '==', especialidad)
      );

      getDocs(q).then(
        (querySnapshot) => {
          if (!querySnapshot.empty) {

            const docSnapshot = querySnapshot.docs[0];
            const horario = docSnapshot.data() as Horarios;
            horario.franjaHoraria = nuevaFranjaHorarios;
            const turnoDoc = doc(this._horariosEspecialistasColecction, docSnapshot.id);
            updateDoc(turnoDoc, { franjaHoraria: nuevaFranjaHorarios });
          }else{
            let Horario : Horarios = {
              Especialidad : especialidad ,
              franjaHoraria : nuevaFranjaHorarios,
              Especialista : usuario
            }
            console.log(Horario);
            
            this.addEspecialidadHorarios(Horario);
          }

        });
        console.log("actualizo");
        
      return true;

    }
    catch {
      console.log("Error al actualizar los horarios");
      return false;
    }

  }

 getData(): Observable<Horarios[]> {
    return new Observable<Horarios[]>((observer) => {
      onSnapshot(this._horariosEspecialistasColecction, (snap) => {
        const Listas: Horarios[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Horarios;
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
  }
  getHorariosByEspecialista(especialistaId: string): Observable<Horarios[]> {
    return new Observable<Horarios[]>((observer) => {
      const q = query(
        this._horariosEspecialistasColecction,
        where('Especialista.id', '==', especialistaId)
      );

      onSnapshot(q, (snap: QuerySnapshot) => {
        const Listas: Horarios[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Horarios;
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
  }


  getHorariosByEspecialistaAndEspecialidad(especialistaId: string, especialidad : string): Observable<Horarios[]> {
    return new Observable<Horarios[]>((observer) => {
      const q = query(
        this._horariosEspecialistasColecction,
        where('Especialista.id', '==', especialistaId),
        where('Especialidad', '==', especialidad)
      );

      onSnapshot(q, (snap: QuerySnapshot) => {
        const Listas: Horarios[] = [];
        snap.docChanges().forEach(x => {
          const one = x.doc.data() as Horarios;
          Listas.push(one);
        });
        observer.next(Listas);
      });
    });
  }


  // modificar(dato: Especialidad) {
  //   const docs = doc(this._horariosEspecialistasColecction, dato.id);
  //   updateDoc(docs, {
  //     Nombre: dato.nombre,
  //   });
  // }


}
