import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validador } from '../../backend/validador-form';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-editor-analizador',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './editor-analizador.component.html',
  styleUrl: './editor-analizador.component.scss'
})
export class EditorAnalizadorComponent {
  editorForm: FormGroup;
  private _validador!: Validador;
  
  constructor(private formBuilder: FormBuilder){
    this.editorForm = this.formBuilder.group({
      analizador: ['', Validators.pattern(/^(?!\s*$).+/)]
    });
    this._validador = new Validador(this.editorForm);
  }

  esAnalizadorValido(){
    return this._validador.esValido('analizador')
  }

  esAnalizadorInvalido(){
    return this._validador.tieneError('analizador')
  }

  crear(){
    if(this.editorForm.valid){
      let nombre: string = localStorage.getItem('nombre') || 'analizador_nuevo';
    } else {
      this.editorForm.markAllAsTouched();
    }
  }
}
