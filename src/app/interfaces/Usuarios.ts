import { Turno } from "./Turno";

export interface UsuarioGenerico{
    id: string;
    Nombre: string;
    Apellido: string;
    Edad: number;
    Dni: string;
    Email: string;
    Password: string;
    Imagen: string;
    Rol: string;
    Especialidades: any[];
    Autorizado: boolean;
    Imagen2: string;
    ObraSocial: string;
  }
  
  export interface Especialista{
    id: string;
    Nombre: string;
    Apellido: string;
    Imagen:string;
    Especialidades: string[];
  }
  export interface Paciente{
    id: string;
    Nombre: string;
    Apellido: string;
    Edad: number;
    Email: string;
    Imagen: string;
    Imagen2: string;
    ObraSocial: string;
}


export interface PacienteConTurnos {
  paciente: UsuarioGenerico;
  turnos: Turno[];
}