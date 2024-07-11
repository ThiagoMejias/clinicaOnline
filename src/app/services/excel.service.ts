import { Injectable } from '@angular/core';
import { UsuarioGenerico } from '../interfaces/Usuarios';
import * as ExcelJS from 'exceljs';
import { Turno } from '../interfaces/Turno';
import { TurnosService } from './turnos.service';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  async guardarComoExcel(usuario: UsuarioGenerico): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuario');

    const columns = [
      { header: 'Nombre', key: 'nombre', width: 15 },
      { header: 'Apellido', key: 'apellido', width: 15 },
      { header: 'Dni', key: 'dni', width: 15 },
      { header: 'Edad', key: 'edad', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Rol', key: 'rol', width: 15 },
    ];

    if (usuario.Rol === 'especialista') {
      columns.push({ header: 'Especialidades', key: 'especialidades', width: 30 });
    } else if (usuario.Rol === 'paciente') {
      columns.push({ header: 'Obra Social', key: 'obraSocial', width: 30 });
    }

    worksheet.columns = columns;

    const rowData: any = {
      nombre: this.capitalizeWords(usuario.Nombre),
      apellido: this.capitalizeWords(usuario.Apellido),
      dni: usuario.Dni,
      edad: usuario.Edad,
      email: usuario.Email,
      rol: usuario.Rol
    };

    if (usuario.Rol === 'especialista') {
      rowData.especialidades = this.capitalizeWords(usuario.Especialidades.join(', '));
    } else if (usuario.Rol === 'paciente') {
      rowData.obraSocial = usuario.ObraSocial;
    }

    worksheet.addRow(rowData);

    if (usuario.Rol === 'especialista') {
      worksheet.getColumn('especialidades').alignment = { wrapText: true };
    }

    worksheet.eachRow((row : any, rowNumber : any) => {
      row.eachCell({ includeEmpty: true }, (cell : any, colNumber : any) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.getRow(1).eachCell((cell : any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
    });
    // --primary-color: #3F51B5;
    // --secondary-color: #FFFFFF;
    // --background-color: #d3d3d3;
    // --text-primary-color: #212121;
    // --text-secondary-color: #757575;
    // --highlight-color: #7FACF0;
    // --danger-color: #E53935;
   
    worksheet.getRow(2).eachCell((cell : any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '#7FACF0' }
      };
      cell.font = {
        color: { argb: '000000' },
        bold: true,
      };
    });

    const blob = await workbook.xlsx.writeBuffer();
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = `${usuario.Apellido}_${usuario.Nombre}_${usuario.id}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  async guardarTodos(usuarios: UsuarioGenerico[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    const columns = [
      { header: 'Nombre', key: 'Nombre', width: 20 },
      { header: 'Apellido', key: 'Apellido', width: 20 },
      { header: 'Edad', key: 'Edad', width: 15 },
      { header: 'Dni', key: 'Dni', width: 15 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Rol', key: 'Rol', width: 15 },
      { header: 'Especialidades', key: 'Especialidades', width: 60 },
      { header: 'ObraSocial', key: 'ObraSocial', width: 30 },
    ];

    worksheet.columns = columns;

    usuarios.forEach((usuario) => {
      const rowData: any = {};
      rowData['Nombre'] = this.capitalizeWords(usuario.Nombre);
      rowData['Apellido'] = this.capitalizeWords(usuario.Apellido);
      rowData['Edad'] = usuario.Edad;
      rowData['Dni'] = usuario.Dni;
      rowData['Email'] = usuario.Email;
      rowData['Rol'] = usuario.Rol;
      rowData['Especialidades'] = usuario.Especialidades ? this.capitalizeWords(usuario.Especialidades.join(', ')) : '';
      rowData['Autorizado'] = usuario.Autorizado ? 'si' : 'no';
      rowData['ObraSocial'] = usuario.ObraSocial ? usuario.ObraSocial : '';
      worksheet.addRow(rowData);
    });

    worksheet.getRow(1).eachCell((cell : any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3F51B5' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
    });

    worksheet.eachRow((row : any, rowNumber : any) => {
      row.eachCell((cell : any, colNumber : any) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber != 1) {
          cell.font = {
            color: { argb: '000000' },
            bold: true,
          };
          if (rowNumber % 2 == 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '7FACF0' },
            };
          }
          else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF' },
            };
          }
        }
        if (cell.value && typeof cell.value === 'string') {
          cell.alignment = { wrapText: true };
        }
      });
    });

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: worksheet.rowCount,
        column: worksheet.columnCount,
      },
    };

    const blob = await workbook.xlsx.writeBuffer();
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = 'usuarios.xlsx';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  async guardarTurnosExcel(paciente : UsuarioGenerico,turnos: Turno[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Turnos');

    const columns = [
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Dia', key: 'dia', width: 15 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Especialidad', key: 'especialidad', width: 25 },
      { header: 'Especialista', key: 'especialista', width: 25 },
      { header: 'Paciente', key: 'paciente', width: 25 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Comentario', key: 'comentario', width: 30 },
      { header: 'Reseña', key: 'resenia', width: 30 },
    ];

    worksheet.columns = columns;

    turnos.forEach((turno) => {
      const rowData: any = {};
      rowData['fecha'] = turno.fechaFormateada;
      rowData['dia'] = this.obtenerDia(this.convertirTimestamp(turno.fecha)); 
      rowData['hora'] = turno.hora;
      rowData['especialidad'] = turno.especialidad;
      rowData['especialista'] = this.getNombreCompleto(turno.especialista);
      rowData['paciente'] = this.getNombreCompleto(turno.paciente!);
      rowData['estado'] = turno.estado;
      rowData['comentario'] = turno.comentario;
      rowData['resenia'] = turno.resenia;


      worksheet.addRow(rowData);
    });


    worksheet.getRow(1).eachCell((cell : any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3F51B5' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
    });

    worksheet.eachRow((row : any, rowNumber : any) => {
      row.eachCell((cell : any, colNumber : any) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber != 1) {
          cell.font = {
            color: { argb: '000000' },
            bold: true,
          };
          if (rowNumber % 2 == 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '7FACF0' },
            };
          }
          else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF' },
            };
          }
        }
        if (cell.value && typeof cell.value === 'string') {
          cell.alignment = { wrapText: true };
        }
      });
    });

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: worksheet.rowCount,
        column: worksheet.columnCount,
      },
    };

    const blob = await workbook.xlsx.writeBuffer();
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = `turnos_${this.getNombreCompleto(paciente)}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getNombreCompleto(persona: UsuarioGenerico ): string {
    return `${persona.Nombre} ${persona.Apellido}`;
  }


  private capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
