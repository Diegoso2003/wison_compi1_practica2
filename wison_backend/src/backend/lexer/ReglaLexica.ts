import { Expresion } from "./Expresion"

export class ReglaLexica {
  private nombre: string;
  private linea: number;
  private columna: number;
  private expresion: Expresion;

  constructor(
    nombre: string,
    expresion: Expresion,
    linea: number,
    columna: number,
  ) {
    this.nombre = nombre;
    this.expresion = expresion;
    this.columna = columna;
    this.linea = linea;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getExpresion(): Expresion {
    return this.expresion;
  }

  public getLinea(): number {
    return this.linea;
  }

  public getColumna(): number {
    return this.columna;
  }
}