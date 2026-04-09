export class Token {
  private linea: number;
  private columna: number;
  private lexema: string;
  private token: string;

  constructor(linea: number, columna: number, lexema: string, token: string) {
    this.linea = linea;
    this.columna = columna;
    this.lexema = lexema;
    this.token = token;
  }

  public getLinea(): number {
    return this.linea;
  }

  public getColumna(): number {
    return this.columna;
  }

  public getLexema(): string {
    return this.lexema;
  }

  public getToken(): string {
    return this.token;
  }
}