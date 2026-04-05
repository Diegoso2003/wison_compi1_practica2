import { Creador } from "../CreadorGramatica/Creador";
import { Simbolo } from "./Simbolo";

export class NoTerminal {
  private nombre: string;
  private linea: number;
  private columna: number;
  private contadorPrimeros: number = 0;
  private primerosSimbolos: Map<NoTerminal, Simbolo[]> = new Map();
  private segundosPosibles: Set<NoTerminal> = new Set();
  private primeros: Map<string, string[]> = new Map();
  private segundos: Set<string> = new Set();
  private primerVacios: string[] = [];
  private hijos: Set<NoTerminal> = new Set();

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

  public getPrimerosSimbolos(): Map<NoTerminal, Simbolo[]> {
    return this.primerosSimbolos;
  }

  public getSegundosPosibles(): Set<NoTerminal> {
    return this.segundosPosibles;
  }

  public getPrimeros(): Map<string, string[]> {
    return this.primeros;
  }

  public getSegundos(): Set<string> {
    return this.segundos;
  }

  public agregarProduccionVacio(
    produccion: string[],
    creador: Creador,
    simbolo: Simbolo,
  ) {
    if (this.primerVacios.length === 0) {
      this.primerVacios = produccion;
    } else {
      creador.getErrores().push({
        tipo: "Semantico",
        linea: simbolo.getLinea(),
        columna: simbolo.getColumna(),
        lexema: simbolo.getNombre(),
        descripcion: `Conflicto con:
          ${this.nombre} <= ${this.primerVacios.join(" ")};
          ${this.nombre} <= ${produccion.join(" ")}`,
      });
    }
  }

  public agregarHijo(hijo: NoTerminal): void {
    this.hijos.add(hijo);
  }

  public encontrarPrimeros(creador: Creador): void {
    this.contadorPrimeros = 0
    this.encontrarPrimerosRecursivo(creador);
  }

  private encontrarPrimerosRecursivo(creador: Creador): Map<string, string[]> {
    if (this.contadorPrimeros > 0) {
      creador.getErrores().push({
        tipo: "Semantico",
        linea: this.linea,
        columna: this.columna,
        lexema: this.nombre,
        descripcion:
          "El no terminal tiene recursividad por la izquierda por lo que no es apto para LL(1).",
      });
      return this.primeros;
    }
    this.contadorPrimeros++;
    this.primerosSimbolos.forEach((produccion, simbolo) => {
      let primeros: Map<string, string[]> =
        simbolo.encontrarPrimerosRecursivo(creador);
        this.contadorPrimeros = 0;
        let cadena: string[]= []
      primeros.forEach((producciones, terminal) => {
        if (!this.primeros.has(terminal)) {
          produccion.forEach((simbolo) => {cadena.push(simbolo.getNombre())})
          this.primeros.set(terminal, cadena);
        } else {
          creador.getErrores().push({
            tipo: "Semantico",
            linea: simbolo.linea,
            columna: simbolo.columna,
            lexema: simbolo.nombre,
            descripcion: `Conflicto entre:
                    ${this.nombre} <= ${produccion.join(" ")};
                    ${simbolo.nombre} <= ${producciones.join(" ")};`,
          });
        }
        if (simbolo.primerVacios.length > 0) {
          let otro: Simbolo = new Simbolo(
            simbolo.nombre,
            simbolo.linea,
            simbolo.columna,
            true,
          );
          this.agregarProduccionVacio(cadena, creador, otro);
        }
      });
    });
    this.primerosSimbolos.clear();
    return this.primeros;
  }

  public getPrimerVacios(): string[] {
    return this.primerVacios;
  }

  public agregarProduccionesVacias(creador: Creador): void {
    this.calcularSegundosHijosRecursivo();
  }

  private calcularSegundosHijosRecursivo(): void {
    this.hijos.forEach((hijo) => {
      let cambio = false;

      this.segundos.forEach((segundo) => {
        if (!hijo.segundos.has(segundo)) {
          hijo.segundos.add(segundo);
          cambio = true;
        }
      });

      if (cambio) {
        hijo.calcularSegundosHijosRecursivo();
      }
    });
  }
}
