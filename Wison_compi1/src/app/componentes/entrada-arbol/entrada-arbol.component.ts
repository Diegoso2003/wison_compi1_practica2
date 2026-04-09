import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { InformacionComponent } from "../../informacion/informacion/informacion.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validador } from '../../backend/validador-form';
import { InformacionService } from '../../services/informacion.service';
import { GramaticaService } from '../../services/gramatica.service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaAnalisis } from '../../model/EntradaAnalisis';
import { Arbol } from '../../model/Arbol';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-entrada-arbol',
  standalone: true,
  imports: [InformacionComponent, NgClass, ReactiveFormsModule],
  templateUrl: './entrada-arbol.component.html',
  styleUrl: './entrada-arbol.component.scss'
})
export class EntradaArbolComponent implements AfterViewInit, OnInit{
@ViewChild('codeEditor')
set codeEditorSetter(element: ElementRef<HTMLTextAreaElement> | undefined) {
  if (element) {
    this.codeEditor = element;
    this.setupEditorListeners();
  }
}

codeEditor!: ElementRef<HTMLTextAreaElement>; 
  entradaForm: FormGroup;
  private id: number | undefined
  private _validador!: Validador;
  private _informacion = inject(InformacionService)
  private _activeRouter = inject(ActivatedRoute)
  private _router = inject(Router)
  private _gramatica = inject(GramaticaService)
  private _sanitizer = inject(DomSanitizer)
  
  lineaActual: number = 1;
  columnaActual: number = 1;
  arbol: boolean = false;
  svgContent: SafeHtml = ''
  
  constructor(private formBuilder: FormBuilder){
    this.entradaForm = this.formBuilder.group({
      entrada: ['', Validators.required]
    });
    this._validador = new Validador(this.entradaForm);
  }

  ngOnInit(): void {
    let idParam = this._activeRouter.snapshot.params['id'];
    let idGramatica = Number(idParam);
    if(isNaN(idGramatica)){
      this._informacion.informarError("id no valido.")
      this._router.navigate(['/listado'])
    } else {
      this.id = idGramatica
    }
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

  esEntradaValida(){
    return this._validador.esValido('entrada')
  }

  esEntradaInvalida(){
    return this._validador.tieneError('entrada')
  }

  analizar(){
    if(this.entradaForm.valid){
      let entrada: EntradaAnalisis = this.entradaForm.value as EntradaAnalisis
      entrada.id = this.id!
      this._gramatica.obtenerArbol(entrada).subscribe({
        next: (arbol: Arbol) => {
          if(arbol.errores.length > 0){
            this._informacion.informarErrores(arbol.errores)
          } else {
            this.svgContent = this._sanitizer.bypassSecurityTrustHtml(arbol.svg)
            this.arbol = true
          }
        },
        error: (error: any) => {
          console.log(error)
          this._informacion.informarError("error al generar el árbol intentar más tarde.")
        }
      })
    } else {
      this.entradaForm.markAllAsTouched()
      this._informacion.informarError("Ingrese una entrada valida")
    }
  }

  volver(){
    this.arbol = false
  }
}