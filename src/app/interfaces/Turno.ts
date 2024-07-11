import { HistoriaClinica } from "./HistoriaClinica";
import { UsuarioGenerico } from "./Usuarios";


export interface Encuesta{
  experienciaGeneral : string;
  tiempoDeEspera : string;
  sugerencias : string;
}


export interface Turno {
    id?: string;
    especialidad: string;
    especialista: UsuarioGenerico;
    fecha: Date;
    hora: string;
    estado : string;
    resenia : string; 
    paciente?: UsuarioGenerico; 
    fechaFormateada? : string;
    comentario? : string;
    calificacion? : number;
    encuesta? : Encuesta;
    historiaClinica? : HistoriaClinica
  }
