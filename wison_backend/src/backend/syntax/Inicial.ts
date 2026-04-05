export class Inicial {
  private nombre: string;
  private linea: number;
  private columna: number;

  constructor(nombre: string, linea: number, columna: number) {
    this.nombre = nombre;
    this.linea = linea;
    this.columna = columna;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getLinea(): number {
    return this.linea;
  }

  public getColumna(): number {
    return this.columna;
  }
}