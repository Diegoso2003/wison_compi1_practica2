import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validador } from '../../backend/validador-form';
import { NgClass } from '@angular/common';
import { InformacionService } from '../../services/informacion.service';
import { GramaticaService } from '../../services/gramatica.service';
import { Nuevo } from '../../model/Nuevo';
import { Resultado } from '../../model/Resultado';
import { InformacionComponent } from '../../informacion/informacion/informacion.component';

@Component({
  selector: 'app-editor-analizador',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, InformacionComponent],
  templateUrl: './editor-analizador.component.html',
  styleUrl: './editor-analizador.component.scss'
})
export class EditorAnalizadorComponent implements AfterViewInit {
  @ViewChild('codeEditor') codeEditor!: ElementRef<HTMLTextAreaElement>;
  
  editorForm: FormGroup;
  private _validador!: Validador;
  private _informacion = inject(InformacionService)
  private _gramatica = inject(GramaticaService)
  
  lineaActual: number = 1;
  columnaActual: number = 1;
  
  constructor(private formBuilder: FormBuilder){
    this.editorForm = this.formBuilder.group({
      analizador: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
    this._validador = new Validador(this.editorForm);
  }

  ngAfterViewInit(): void {
    this.setupEditorListeners();
  }

  setupEditorListeners(): void {
    const textarea = this.codeEditor.nativeElement;
    
    textarea.addEventListener('click', () => this.actualizarPosicion());
    textarea.addEventListener('keyup', () => this.actualizarPosicion());
    textarea.addEventListener('keydown', () => this.actualizarPosicion());
    textarea.addEventListener('input', () => this.actualizarPosicion());
  }

  actualizarPosicion(): void {
    const textarea = this.codeEditor.nativeElement;
    const texto = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    const textoAntes = texto.substring(0, cursorPos);
    const lineas = textoAntes.split('\n');
    this.lineaActual = lineas.length;
    this.columnaActual = lineas[lineas.length - 1].length + 1;
  }

  esAnalizadorValido(){
    return this._validador.esValido('analizador')
  }

  esAnalizadorInvalido(){
    return this._validador.tieneError('analizador')
  }

  esNombreInvalido(){
    return this._validador.tieneError('nombre')
  }

  esNombreValido(){
    return this._validador.esValido('nombre');
  }

  crear(){
    if(this.editorForm.valid){
      let nuevo: Nuevo = this.editorForm.value as Nuevo
      this._gramatica.crearNuevo(nuevo).subscribe({
        next: (resultado: Resultado) => {
          if(resultado.ok){
            this._informacion.informarExito('Analizador creado exitosamente.')
          } else {
            this._informacion.informarErrores(resultado.errores)
          }
        },
        error: (error) => {
          this._informacion.informarError('Error al crear el analizador, intente más tarde')
        }
      });
    } else {
      this._informacion.informarError('Ingrese una entrada valida.')
      this.editorForm.markAllAsTouched();
    }
  }

  cargarArchivo(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const archivo = input.files[0];

  // Validar extensión opcional
  if (!archivo.name.endsWith('.wison')) {
    this._informacion.informarError('Seleccione un archivo .wison válido');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const contenido = reader.result as string;

    this.editorForm.patchValue({
      analizador: contenido
    });

    setTimeout(() => {
  const textarea = this.codeEditor.nativeElement;
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
  textarea.focus();
  this.editorForm.get('analizador')?.markAsTouched();
  this.actualizarPosicion();
});
  };

  reader.onerror = () => {
    this._informacion.informarError('Error al leer el archivo');
  };

  reader.readAsText(archivo);
}
}