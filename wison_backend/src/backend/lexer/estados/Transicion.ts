import { Estado } from "./Estado"

export class Transicion {
  private caracter: string;
  private siguiente: Estado;

  constructor(caracter: string, siguiente: Estado) {
    this.caracter = caracter;
    this.siguiente = siguiente;
  }

  public getCaracter(): string {
    return this.caracter;
  }
  public setCaracter(value: string) {
    this.caracter = value;
  }

  public getSiguiente(): Estado {
    return this.siguiente;
  }
  public setSiguiente(value: Estado) {
    this.siguiente = value;
  }
}