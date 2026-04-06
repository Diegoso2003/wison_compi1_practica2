import { Injectable } from '@angular/core';
import { MensajeError } from '../model/MensajeError';

@Injectable({
  providedIn: 'root',
})
export class InformacionService {
  private hayError: boolean = false;
  private mensaje: string = '';
  private exito: boolean = false;
  private mostrarAlertaExito: boolean = false;
  private hayErrores: boolean = false;
  private errores: MensajeError[] = [];

  public informarError(mensaje: string) {
    this.hayError = true;
    this.mensaje = mensaje;
    this.exito = false;
  }

  public informarExito(mensaje: string) {
    this.hayError = false;
    this.mensaje = mensaje;
    this.exito = true;
    this.mostrarAlertaExito = true;
  }

  public informarErrores(errores: MensajeError[]) {
    this.hayError = false;
    this.exito = false;
    this.mensaje = '';
    this.mostrarAlertaExito = false;
    this.hayErrores = true;
    this.errores = errores;
  }

  public ocultarErrores() {
    this.errores = [];
    this.hayErrores = false;
  }

  public ocultarAlertaExito() {
    this.mostrarAlertaExito = false;
  }

  public getHayError(): boolean {
    return this.hayError;
  }

  public getMensaje(): string {
    return this.mensaje;
  }

  public getExito(): boolean {
    return this.exito;
  }

  public getMostrarAlertaExito(): boolean {
    return this.mostrarAlertaExito;
  }

  public ocultarError(): void {
    this.hayError = false;
    this.mensaje = '';
  }

  public ocultarExito(): void {
    this.exito = false;
    this.mensaje = '';
  }

  public getErrores(): MensajeError[] {
    return this.errores;
  }

  public getHayErrores(): boolean {
    return this.hayErrores;
  }
}
