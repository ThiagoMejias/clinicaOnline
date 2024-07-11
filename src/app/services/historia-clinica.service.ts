import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { HistoriaClinica } from '../interfaces/HistoriaClinica';
import { UsuarioGenerico } from '../interfaces/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  _historiaClinica = collection(this.fs, 'horariosEspecialistas'); 
  _turnosService = collection(this.fs, 'turnos'); 

  constructor(private fs: Firestore) { }

  addHistoriaClinica(nuevaHistoriaClinica: HistoriaClinica) {
    try{
      const historiaDoc = doc(this._historiaClinica);
      nuevaHistoriaClinica.id = historiaDoc.id;
      setDoc(historiaDoc, nuevaHistoriaClinica);
      return true;
    }catch(e){
      return false;
    }
  }

  getDatoPorId(paciente: UsuarioGenerico): Promise<HistoriaClinica[] | null> {
    const docs = doc(this._historiaClinica, paciente.id);
    return getDoc(docs)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const dato = docSnap.data()['historias'] as HistoriaClinica[];
          return dato;
        } else {
          return null;
        }
      })
  }

  updateHistoriaClinica(historiaClinica: HistoriaClinica) {
    const historiaClinicaAModificar = doc(this._historiaClinica, historiaClinica.id);
    updateDoc(historiaClinicaAModificar, {
      altura: historiaClinica.altura,
      peso: historiaClinica.peso,
      temperatura: historiaClinica.temperatura,
      presion: historiaClinica.presion,
      datos: historiaClinica.datos
    });
  }

}
