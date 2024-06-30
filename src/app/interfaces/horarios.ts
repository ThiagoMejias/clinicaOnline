import { UsuarioGenerico } from "./Usuarios";
import { FranjaHoraria } from "./franja-horaria";

export interface Horarios {
  id? : string;
  Especialista: UsuarioGenerico;
  Especialidad : String;
  franjaHoraria : FranjaHoraria[];
}
