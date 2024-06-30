import { UsuarioGenerico } from "./Usuarios";

export interface Turno {
    id?: string;
    especialidad: string;
    especialista: UsuarioGenerico;
    fecha: Date;
    hora: string;
    paciente?: UsuarioGenerico; 
    fechaFormateada? : string;
  }
  