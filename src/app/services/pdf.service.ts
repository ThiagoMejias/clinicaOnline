import { Injectable } from '@angular/core';
import { UsuarioGenerico } from '../interfaces/Usuarios';
import { Turno } from '../interfaces/Turno';
import * as jspdf from 'jspdf';
import { Ingresos } from '../interfaces/Ingresos';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(){
     Chart.register(...registerables);
  }

  async generarInformeTurnosPdf(turnosPorEspecialidad: any[], turnosPorDia: any[]): Promise<void> {
    try {
      const pdf = new jspdf.jsPDF();

      // Crear gráfico de turnos por especialidad en un canvas temporal
      const canvasEspecialidad = document.createElement('canvas');
      document.body.appendChild(canvasEspecialidad);
      const chartEspecialidad = new Chart(canvasEspecialidad, {
        type: 'bar',
        data: {
          labels: turnosPorEspecialidad.map(turno => turno.especialidad),
          datasets: [{
            label: 'Cantidad de Turnos por Especialidad',
            data: turnosPorEspecialidad.map(turno => turno.cantidad),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Turnos'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Especialidad'
              }
            }
          }
        }
      });

      // Esperar a que el gráfico se renderice
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capturar el gráfico de turnos por especialidad como una imagen con html2canvas
      const imgDataEspecialidad = (await html2canvas(canvasEspecialidad)).toDataURL('image/png');
      document.body.removeChild(canvasEspecialidad);

      // Crear gráfico de turnos por día en un canvas temporal
      const canvasDia = document.createElement('canvas');
      document.body.appendChild(canvasDia);
      const chartDia = new Chart(canvasDia, {
        type: 'line',
        data: {
          labels: turnosPorDia.map(turno => turno.dia),
          datasets: [{
            label: 'Cantidad de Turnos por Día',
            data: turnosPorDia.map(turno => turno.cantidad),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Turnos'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Día'
              }
            }
          }
        }
      });

      // Esperar a que el gráfico se renderice
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capturar el gráfico de turnos por día como una imagen con html2canvas
      const imgDataDia = (await html2canvas(canvasDia)).toDataURL('image/png');
      document.body.removeChild(canvasDia);

      // Agregar título y gráfico de turnos por especialidad al PDF
      pdf.text('Cantidad de Turnos por Especialidad', pdf.internal.pageSize.width / 2, 10, { align: 'center' });
      pdf.addImage(imgDataEspecialidad, 'PNG', 10, 20, 180, 100);

      // Agregar título y gráfico de turnos por día al PDF
      pdf.text('Cantidad de Turnos por Día', pdf.internal.pageSize.width / 2, 130, { align: 'center' });
      pdf.addImage(imgDataDia, 'PNG', 10, 140, 180, 100);

      // Guardar PDF
      pdf.save('informe_turnos.pdf');
    } catch (error) {
      console.error('Error al generar el informe de turnos:', error);
    }
  }

  async descargarAtencionesPdf(usuario: UsuarioGenerico, turnos: Turno[]): Promise<void> {
    const pdf = new jspdf.jsPDF();
    const logoPath = '../../assets/logoHospital.png';
    const logoDataUrl = await this.getBase64Image(logoPath);
    const lineHeight = 10;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
  
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    const bulletRadius = 0.8;
    // Add the logo and title to the first page
    pdf.addImage(logoDataUrl, 'PNG', logoX, 10, logoWidth, logoHeight);
    pdf.setFontSize(16);
    pdf.text(`Atenciones de: ${this.getNombreCompleto(usuario)}`, pageWidth / 2, 50, { align: 'center' });
    const fecha = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    const fechaWidth = pdf.getStringUnitWidth(fecha) * 10 / pdf.internal.scaleFactor;
    pdf.text(`${fecha}`, pageWidth - fechaWidth - margin, 20);
  
    let yPosition = margin + logoHeight + 30;
  
    turnos.forEach((turno, index) => {
      if (yPosition + 5 * lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;

        pdf.addImage(logoDataUrl, 'PNG', logoX, 10, logoWidth, logoHeight, '', 'FAST');
        pdf.setFontSize(16);
        pdf.text(`Atenciones de: ${this.getNombreCompleto(usuario)}`, pageWidth / 2, 50, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text(`${fecha}`, pageWidth - fechaWidth - margin, 20);
  
        yPosition += 60;
      }
  
      pdf.setFontSize(12);
    
      pdf.text(`Fecha y Hora: ${this.obtenerDia(this.convertirTimestamp(turno.fecha))} ${turno.fechaFormateada}`, margin + 3, yPosition);
      yPosition += lineHeight;
      pdf.setFontSize(10);
      pdf.circle(margin, yPosition - 1, bulletRadius, 'F');
      pdf.text(`Paciente: ${this.getNombreCompleto(usuario)}`, margin + 3, yPosition);
      yPosition += lineHeight;
      pdf.circle(margin , yPosition - 1, bulletRadius, 'F');
      pdf.text(`Estado: ${turno.estado}`, margin + 3, yPosition);
      yPosition += lineHeight;
      pdf.circle(margin , yPosition - 1, bulletRadius, 'F');
      pdf.text(`Reseña: ${turno.resenia}`, margin + 3, yPosition);
      yPosition += lineHeight;

      if (turno.historiaClinica?.datos) {
        turno.historiaClinica.datos.forEach(dato => {
          const key = this.getKey(dato);
          pdf.text(`${key}: ${dato[key]}`, margin + 10, yPosition);
          yPosition += lineHeight;
        });
      }
 
  
 
      yPosition += lineHeight * 2;
    });
  
    pdf.save('lista_turnos.pdf');
  }



  async descargarTurnosSolicitados(turnos: Turno[], turnosFinalizados : Turno[] , especialista: UsuarioGenerico, fechaInicio: Date, fechaFinal: Date): Promise<void> {
    const pdf = new jspdf.jsPDF();
    const logoPath = '../../assets/logoHospital.png';
    const logoDataUrl = await this.getBase64Image(logoPath);
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;

   
    pdf.addImage(logoDataUrl, 'PNG', logoX, margin, logoWidth, logoHeight);

    console.log(fechaInicio);
    
    const texto = `Turnos solicitados de ${especialista.Nombre}, ${especialista.Apellido} desde ${fechaInicio} hasta ${fechaFinal}`;
    pdf.setFontSize(12);
    const textoWidth = pdf.getStringUnitWidth(texto) * 12 / pdf.internal.scaleFactor;
    let yPosition = margin + logoHeight + 30;
    pdf.text(texto, (pageWidth - textoWidth) / 2, yPosition);

    yPosition += 20;
 
   const bulletRadius = 0.8;

   turnos.forEach((turno, index) => {
 
     pdf.setFontSize(10);

     
    const spaceLeft = pageHeight - yPosition - margin;
    const requiredSpace = 4 * margin; 


    if (requiredSpace > spaceLeft) {
      pdf.addPage();
      yPosition = margin;
    }

     pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
     const fecha = `Fecha: ${turno.fechaFormateada}`;
     pdf.text(fecha, margin + 10, yPosition);
     yPosition += 10;
     pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
     const pacienteText = `Paciente: ${this.getNombreCompleto(turno.paciente!)}`;
     pdf.text(pacienteText, margin + 10, yPosition);
 
     yPosition += 10;
 
     const especialidadText = `Especialidad: ${turno.especialidad}`;
     pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
     pdf.text(especialidadText, margin + 10, yPosition);
     yPosition += 8;
 
     yPosition += 20;
   });

    const textoFinalizados = `Turnos finalizados de ${especialista.Nombre}, ${especialista.Apellido} desde ${fechaInicio} hasta ${fechaFinal}`;
    pdf.setFontSize(12);
    const textoFinalizadoWidth = pdf.getStringUnitWidth(texto) * 12 / pdf.internal.scaleFactor;
    pdf.text(textoFinalizados, (pageWidth - textoFinalizadoWidth) / 2, yPosition);
    turnosFinalizados.forEach((turno, index) => {
 
      pdf.setFontSize(10);
 
      
     const spaceLeft = pageHeight - yPosition - margin;
     const requiredSpace = 4 * margin; 
 
     if (requiredSpace > spaceLeft) {
       pdf.addPage();
       yPosition = margin;
     }
 
      pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
      const fecha = `Fecha: ${turno.fechaFormateada}`;
      pdf.text(fecha, margin + 10, yPosition);
      yPosition += 10;
      pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
      const pacienteText = `Paciente: ${this.getNombreCompleto(turno.paciente!)}`;
      pdf.text(pacienteText, margin + 10, yPosition);
  
      yPosition += 10;
  
      const especialidadText = `Especialidad: ${turno.especialidad}`;
      pdf.circle(margin + 8, yPosition - 1, bulletRadius, 'F');
      pdf.text(especialidadText, margin + 10, yPosition);
      yPosition += 8;
  
      yPosition += 20;
    });
    
    pdf.save('turnos_solicitados.pdf');
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

  private getNombreCompleto(persona: UsuarioGenerico): string {
    return `${persona.Apellido} ${persona.Nombre}`;
  }

  convertirTimestamp(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
  }


    // Log de ingresos al sistema

    async guardarIngresosEnPdf(ingresos: Ingresos[]) {
      const pdf = new jspdf.jsPDF();
      const logoPath = '../../assets/logoHospital.png';
      const lineHeight = 25;
      const logoDataUrl = await this.getBase64Image(logoPath);
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = (pdf.internal.pageSize.width - logoWidth) / 2;
      pdf.addImage(logoDataUrl, 'PNG', logoX, 10, logoWidth, logoHeight);
      let yPosition = 20 + logoHeight + 30;
      pdf.setFontSize(16);
      pdf.text('Registros de ingresos', pdf.internal.pageSize.width / 2, yPosition, { align: 'center' });
    
      yPosition += 20;
      pdf.setFontSize(12);
      const bulletRadius = 0.8;
    
      ingresos.forEach(log => {

        pdf.circle(20 + 8, yPosition - 1, bulletRadius, 'F');
        pdf.setFontSize(10);
        pdf.text(`Usuario: ${log.nombre}`, 30, yPosition);
        pdf.setFontSize(8);
        pdf.circle(20 + 8, yPosition - 1, bulletRadius, 'F');
        pdf.text(`Fecha: ${this.convertirTimestampAFechaLegible(log.fecha)}`, 30, yPosition + 5);
        
        yPosition += lineHeight;

        if (yPosition > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      });
    
      pdf.save('log_ingresos.pdf');
    }



  convertirTimestampAFechaLegible(timestamp: any  ): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  obtenerDia(date :Date){
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const numeroDia = date.getDay();
    return dias[numeroDia];
  }
  getKey(dato: any): string {
    return Object.keys(dato)[0];
  }
}
