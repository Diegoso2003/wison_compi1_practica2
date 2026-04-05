import { NoTerminal } from "./NoTerminal";

export class Simbolo {
  private nombre: string;
  private linea: number;
  private columna: number;
  private terminal: boolean;
  private noTerminal: NoTerminal | undefined;
  public error: boolean = false;

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

  public getNoTerminal(): NoTerminal | undefined {
    return this.noTerminal;
  }
  public setNoTerminal(value: NoTerminal | undefined) {
    this.noTerminal = value;
  }

  public getError(): boolean {
    return this.error;
  }
  public setError(value: boolean) {
    this.error = value;
  }
}