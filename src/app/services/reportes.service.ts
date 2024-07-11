import { Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, query, where } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { Turno } from '../interfaces/Turno';
import { UsuarioGenerico } from '../interfaces/Usuarios';
import * as jspdf from 'jspdf';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private turnosRef = collection(this.firestore, 'turnos');
  private logRef = collection(this.firestore, 'ingresos');

  constructor(private firestore: Firestore) { }


  // Log de ingresos al sistema
  getLogIngresos(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      onSnapshot(this.logRef, (snapshot) => {
        const logs: any[] = [];
        snapshot.forEach(doc => logs.push(doc.data()));
        observer.next(logs);
      });
    });
  }
  async guardarLogsEnPdf() {
    const logs = await this.getLogIngresos().toPromise();
    const pdf =  new jspdf.jsPDF();
    const logoPath = '../../assets/logo.jpg';
    const logoDataUrl = await this.getBase64Image(logoPath);
    const lineHeight = 10;
    let yPosition = 20;
 
    
    pdf.addImage(logoDataUrl, 'JPEG', 5, 5, 30, 30);
    pdf.text('Log de Ingresos al Sistema', pdf.internal.pageSize.width / 2, 10, { align: 'center' });

    logs!.forEach(log => {
      pdf.text(`Usuario: ${log.nombre} - Fecha: ${log.fecha}`, 10, yPosition);
      yPosition += lineHeight;
      if (yPosition > pdf.internal.pageSize.height - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    pdf.save('log_ingresos.pdf');
  }
  private async getBase64Image(imagePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    });
  }
  
  // Cantidad de turnos por especialidad
  getTurnosPorEspecialidad(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      onSnapshot(this.turnosRef, (snapshot) => {
        const turnosPorEspecialidad: any = {};
        snapshot.forEach(doc => {
          const turno = doc.data() as Turno;
          if (!turnosPorEspecialidad[turno.especialidad]) {
            turnosPorEspecialidad[turno.especialidad] = 0;
          }
          turnosPorEspecialidad[turno.especialidad]++;
        });
        observer.next(turnosPorEspecialidad);
      });
    });
  }

  // Cantidad de turnos por día
  getTurnosPorDia(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      onSnapshot(this.turnosRef, (snapshot) => {
        const turnosPorDia: any = {};
        snapshot.forEach(doc => {
          const turno = doc.data() as Turno;
            const fecha = new Date(turno.fecha.getSeconds() * 1000).toISOString().split('T')[0];
          if (!turnosPorDia[fecha]) {
            turnosPorDia[fecha] = 0;
          }
          turnosPorDia[fecha]++;
        });
        observer.next(turnosPorDia);
      });
    });
  }






}
