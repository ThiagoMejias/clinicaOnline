import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Turno } from '../interfaces/Turno';
import { Observable, of } from 'rxjs';
import { UsuarioGenerico } from '../interfaces/Usuarios';
import { HistoriaClinica } from '../interfaces/HistoriaClinica';

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
   limpiarObjetosVacios(arr: any[]): any[] {
    return arr.filter(obj => {
      return Object.keys(obj).some(key => obj[key] !== "");
  });
  }


  addHistoriaClinica(historiaClinica: HistoriaClinica, turno: Turno) {
    try {
      const turnoDocRef =  doc(this.dataRef, turno.id); 
      console.log('ID del turno:', turnoDocRef.id);
      console.log('Turno:', turno);
      if (historiaClinica.datos) {
        historiaClinica.datos = this.limpiarObjetosVacios(historiaClinica.datos);
      } 
      console.log('Historia clínica:', historiaClinica);

      if (!turno.historiaClinica) {
        
         setDoc(turnoDocRef, { historiaClinica }, { merge: true });
      } else {
        
         updateDoc(turnoDocRef, { historiaClinica });
      }
  
      return true;
    } catch (error) {
      console.error('Error al agregar historia clínica:', error);
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


   getCantidadTurnosPorEspecialidad(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const q = query(this.dataRef);
      onSnapshot(q, (snapshot) => {
        const turnos: any[] = [];
        snapshot.forEach(doc => turnos.push(doc.data()));
        const resultado = this.procesarTurnosPorEspecialidad(turnos);
        observer.next(resultado);
      });
    });
  }

  procesarTurnosPorEspecialidad(turnos: any[]): any[] {
    const especialidades = turnos.reduce((acc: any, turno: any) => {
      acc[turno.especialidad] = (acc[turno.especialidad] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(especialidades).map(([especialidad, cantidad]) => ({ especialidad, cantidad }));
  }

  getCantidadTurnosPorDia(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const q = query(this.dataRef);
      onSnapshot(q, (snapshot) => {
        const turnos: any[] = [];
        snapshot.forEach(doc => turnos.push(doc.data()));
        const resultado = this.procesarTurnosPorDia(turnos);
        observer.next(resultado);
      });
    });
  }

  procesarTurnosPorDia(turnos: any[]): any[] {
    const dias = turnos.reduce((acc: any, turno: any) => {
      console.log(turno.fecha);
      const fecha = this.obtenerDia(this.convertirTimestamp(turno.fecha));;
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(dias).map(([dia, cantidad]) => ({ dia, cantidad }));
  }

  getTurnosPorUsuario(usuarioGenerico : UsuarioGenerico): Observable<Turno[]> {
      return new Observable<Turno[]>((observer) => {
        const q =  usuarioGenerico.Rol == 'paciente' ? query(this.dataRef, where('paciente.id', '==', usuarioGenerico.id)) 
                :  usuarioGenerico.Rol == 'especialista' ? query(this.dataRef, where('especialista.id', '==', usuarioGenerico.id))  : query(this.dataRef);
        
        onSnapshot(q, (snap) => {
          const Listas: Turno[] = [];
          snap.docChanges().forEach(x => {
            const one = x.doc.data() as Turno;
            Listas.push(one);
          });
          observer.next(Listas);
        });
      });

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


    getTurnosSolicitadosPorMedico(medico: UsuarioGenerico, startDate: Date, endDate: Date): Observable<Turno[]> {
      return new Observable<Turno[]>((observer) => {
        const q = query(
          this.dataRef,
          where('especialista.id', '==', medico.id),
          where('fecha', '>=', startDate),
          where('fecha', '<=', endDate)
        );
  
        onSnapshot(q, (snapshot) => {
          const turnos: Turno[] = [];
          snapshot.forEach(doc => turnos.push(doc.data() as Turno));
          observer.next(turnos);
        });
      });
    }
  
   



    getTurnosCompletadosPorMedico(usuarioGenerico: UsuarioGenerico, startDate: Date, endDate: Date): Observable<Turno[]> {
      return new Observable<Turno[]>((observer) => {
        const q = query(
          this.dataRef,
          where('especialista.id', '==', usuarioGenerico.id),
          where('fecha', '>=', startDate),
          where('fecha', '<=', endDate),
          where('estado', '==', 'finalizado')
        );
  
        onSnapshot(q, (snapshot) => {
          const turnos: Turno[] = [];
          snapshot.forEach(doc => turnos.push(doc.data() as Turno));
          observer.next(turnos);
        });
      });
    }



  updateTurno(turno: Turno) {
    const turnoDoc = doc(this.dataRef, turno.id);
    console.log(turnoDoc);
    
    updateDoc(turnoDoc, {
      especialidad: turno.especialidad,
      especialista: turno.especialista,
      fecha: turno.fecha,
      hora: turno.hora,
      paciente: turno.paciente,
      estado: turno.estado,
      resenia : turno.resenia,
      comentario : turno.comentario,
      calificacion : turno.calificacion || 0,
      encuesta : turno.encuesta || ''
    });
  }

  deleteTurno(turno: Turno) {
    const turnoDoc = doc(this.dataRef, turno.id);
    deleteDoc(turnoDoc);
  }

  convertirTimestamp(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
  }
    obtenerDia(date :Date){
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const numeroDia = date.getDay();
    return dias[numeroDia];
  }

}

