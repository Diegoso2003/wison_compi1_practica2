export class Simbolo {
  private nombre: string;
  private linea: number;
  private columna: number;
  private terminal: boolean;

  constructor(
    nombre: string,
    linea: number,
    columna: number,
    terminal: boolean,
  ) {
    this.nombre = nombre;
    this.linea = linea;
    this.columna = columna;
    this.terminal = terminal;
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

  public getTerminal(): boolean {
    return this.terminal;
  }
}