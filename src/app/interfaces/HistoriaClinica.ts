import { UsuarioGenerico } from "./Usuarios";

export interface HistoriaClinica {
    id? :string;
    altura: number;
    peso: number;
    temperatura: number;
    presion: string;
    datos: Datos[];
  }
  
  export interface Datos {
    [clave: string]: string;
  }