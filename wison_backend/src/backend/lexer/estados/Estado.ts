import { Transicion } from "./Transicion"

export class Estado {
  private estados: Transicion[] = [];
  private aceptacion: boolean;

  constructor(aceptacion: boolean = false) {
    this.aceptacion = aceptacion;
  }

  public agregarTransicion(transicion: Transicion): void {
    this.estados.push(transicion);
  }

  public getEstados(): Transicion[] {
    return this.estados;
  }

  public getAceptacion(): boolean {
    return this.aceptacion;
  }
  public setAceptacion(value: boolean) {
    this.aceptacion = value;
  }
}