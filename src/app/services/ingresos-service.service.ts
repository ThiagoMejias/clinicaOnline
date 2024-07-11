import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from 'firebase/firestore';
import { UsuarioGenerico } from '../interfaces/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class IngresosServiceService {

  private ingresosColecction = collection(this.fs, 'ingresos');

  constructor(private fs: Firestore) { }

  addIngreso(usuarioGenerico: UsuarioGenerico) {
    const docs = doc(this.ingresosColecction);
    const ingresos = {
      nombre : `${usuarioGenerico.Nombre} ${usuarioGenerico.Apellido}` ,
      fecha: Date.now() 
    }
    setDoc(docs, ingresos);
  }

}
