import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validador } from '../../backend/validador-form';

@Component({
  selector: 'app-nombre-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './nombre-form.component.html',
  styleUrl: './nombre-form.component.scss'
})
export class NombreFormComponent {
  nombreForm: FormGroup;
  private _validador!: Validador;
  private _router: Router = inject(Router)

  constructor(private formBuilder: FormBuilder){
    this.nombreForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]]
    });
    this._validador = new Validador(this.nombreForm);
  }

  crear(){
    if(this.nombreForm.valid){
      localStorage.setItem('nombre', this.nombreForm.get('nombre')?.value)
      this._router.navigate(['/editor'])
    } else {
      this.nombreForm.markAllAsTouched();
    }
  }

  esNombreInvalido(){
    return this._validador.tieneError('nombre')
  }

  esNombreValido(){
    return this._validador.esValido('nombre');
  }
}
