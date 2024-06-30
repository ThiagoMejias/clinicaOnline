import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioGenerico } from '../../../interfaces/Usuarios';
import { ValidatorsService } from '../../../services/validators.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class FormUsuarioComponent implements OnChanges {

  @Input() habilitar: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() rol: string  = 'administrador';
  @Input() usuarioGenerico: UsuarioGenerico = {
    id: '',
    Nombre: '',
    Apellido: '',
    Edad: 0,
    Dni: '',
    Email: '',
    Password: '',
    Imagen: '',
    Rol: '',
    Especialidades: [],
    Autorizado: true,
    Imagen2: '',
    ObraSocial: '',
  };
  especialidadesSeleccionadas = [];
  mostrarCampoNuevaEspecialidad : boolean = false;
  public registerForm!: FormGroup;
  nuevaEspecialidad: string = '';
  @Output() public getUsuario = new EventEmitter<UsuarioGenerico>();
  especialidades : any[] = [];
  public otra: FormControl = new FormControl('', Validators.required);
  private primeraImagen! : File;
  private segundaImagen! : File;
  public loading : boolean = false;
  

  constructor(private fb: FormBuilder, private _especialidadService : EspecialidadService,private _validatorService : ValidatorsService,
    private _firebaseStorageService : FirebaseStorageService
   ) {
    this.registerForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.pattern(this._validatorService.namePattern)]],
      Apellido: ['', [Validators.required, Validators.pattern(this._validatorService.namePattern)]],
      Edad: ['', [Validators.required, Validators.pattern(this._validatorService.numberPattern), Validators.min(1), Validators.max(120)]],
      Dni: ['', [Validators.required, Validators.pattern(this._validatorService.numberPattern), Validators.maxLength(9), Validators.minLength(6)]],
      Email: ['', [Validators.required, Validators.pattern(this._validatorService.emailPattern)]],
      Password: ['', [Validators.required]],
      Imagen: ['', [Validators.required]],
      Imagen2: ['', [Validators.required]],
      ObraSocial: ['', [Validators.required]],
    });
   }

  ngOnChanges(changes: SimpleChanges): void {
   if (changes["rol"]) {
      // this._especialidadService.getData().subscribe(data => {
      //   this.especialidades = data;
        this.actualizarEspecialidades();
      // });
      
      this.actualizarValidacion(this.rol);
   }
   console.log(this.usuarioGenerico);
   
  }
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.primeraImagen = inputElement.files[0];
    }
  }

  onFile2Selected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.segundaImagen = inputElement.files[0];
    }
  }
    
  
  agregarEspecialidad(): void {
    if (this.nuevaEspecialidad.trim()) {
      this._especialidadService.addEspecialidad(this.nuevaEspecialidad.trim());
      this.mostrarCampoNuevaEspecialidad = false;
      this.actualizarEspecialidades();
    }
  }

  toggleCampoNuevaEspecialidad(): void {
    this.mostrarCampoNuevaEspecialidad = !this.mostrarCampoNuevaEspecialidad;


  }


  actualizarEspecialidades() {
    this._especialidadService.getData().subscribe(data => {
      this.especialidades = data;
        
    });


  }

  
  onEspecialidadChange(): void {
    console.log(this.especialidadesSeleccionadas);
    


  }

 

  actualizarValidacion(rol: string): void {
    console.log(rol);
    
    this.registerForm.get('ObraSocial')?.clearValidators();
    this.registerForm.get('Imagen2')?.clearValidators();  
    
    if (rol === 'paciente') {
    
      this.registerForm.get('ObraSocial')?.setValidators([Validators.required]);

    } else if (rol === 'especialista') {
      
      this.registerForm.get('Imagen2')?.setValidators([Validators.required]);
    }
  
    this.registerForm.get('ObraSocial')?.updateValueAndValidity();
    this.registerForm.get('Imagen2')?.updateValueAndValidity();
  }
  

  isValidField(field: string) {
    return this._validatorService.isValidField(this.registerForm, field);
  }



  async crearUsuario() : Promise<void>{
      this.loading = true;
      this.usuarioGenerico = this.registerForm.value;
      if(this.rol == "especialista" && this.especialidadesSeleccionadas.length < 1){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Debe seleccionar una especialidad',
          showConfirmButton: false,
          timer: 1500
        })
        this.loading = false
        return;
      }

      if(this.registerForm.valid)
      {
        this.usuarioGenerico.Rol = this.rol;
        let imagenesSubidasCorrectamente = await this.subirArchivos(this.usuarioGenerico);
        if(imagenesSubidasCorrectamente){
          console.log(this.usuarioGenerico);
          
          if(this.rol == 'especialista'){
            this.usuarioGenerico.Especialidades = this.especialidadesSeleccionadas;
            this.usuarioGenerico.Autorizado = false;
          }else{
            this.usuarioGenerico.Autorizado = true;
            this.usuarioGenerico.Especialidades = [];
          }

          this.getUsuario.emit(this.usuarioGenerico);
        }
      
      }else{
        Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Valide los datos',
                showConfirmButton: false,
                timer: 1500
        })
      }
      this.loading = false;


  }

  async subirArchivos(usuario : UsuarioGenerico){
    try{
      if (this.primeraImagen) {
        usuario.Imagen = await this._firebaseStorageService.subirImagen(`${this.usuarioGenerico.Dni}_${Date.now().toString()}`, this.primeraImagen);
      }
      
      if (this.usuarioGenerico.Rol == 'especialista' && this.segundaImagen) {
        usuario.Imagen2 = await this._firebaseStorageService.subirImagen(`${this.usuarioGenerico.Dni}_2_${Date.now().toString()}`, this.segundaImagen);
      }
      
  
      return true;
    }catch(error){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error subiendo las imagenes',
        showConfirmButton: false,
        timer: 1500
      })
      return false;
    }
    
  }
  


 


}