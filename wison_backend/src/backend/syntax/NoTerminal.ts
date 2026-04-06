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

  public encontrarPrimeros(
    creador: Creador,
    tablaNoTerminales: Map<string, NoTerminal>,
  ): void {
    this.contadorPrimeros = 0;
    this.encontrarPrimerosRecursivo(creador, tablaNoTerminales);
  }

  private encontrarPrimerosRecursivo(
    creador: Creador,
    tablaNoTerminales: Map<string, NoTerminal>,
  ): Map<string, string[]> {
    if (this.contadorPrimeros > 0) {
      creador.getErrores().push({
        tipo: "Semantico",
        linea: this.linea,
        columna: this.columna,
        lexema: this.nombre,
        descripcion:
          "El no terminal tiene recursividad directa o indirecta por la izquierda por lo que no es apto para LL(1).",
      });
      return this.primeros;
    }
    this.contadorPrimeros++;
    this.primerosSimbolos.forEach((produccion, simbolo) => {
      let primeros: Map<string, string[]> = simbolo.encontrarPrimerosRecursivo(
        creador,
        tablaNoTerminales,
      );
      this.contadorPrimeros = 0;
      let cadena: string[] = [];
      primeros.forEach((producciones, terminal) => {
        if (!this.primeros.has(terminal)) {
          produccion.forEach((simbolo) => {
            cadena.push(simbolo.getNombre());
          });
          this.primeros.set(terminal, cadena);
        } else {
          creador.getErrores().push({
            tipo: "Semantico",
            linea: simbolo.linea,
            columna: simbolo.columna,
            lexema: simbolo.nombre,
            descripcion: `Conflicto entre:
                    ${this.nombre} <= ${cadena.join(" ")};
                    ${simbolo.nombre} <= ${producciones.join(" ")};`,
          });
        }
      });
      if (simbolo.primerVacios.length > 0) {
        let buscar = true;
        for (let i = 1; i<produccion.length && buscar; i++) {
          if (produccion[i]!.getTerminal()) {
            if (this.primeros.has(produccion[i]!.getNombre())) {
              creador.getErrores().push({
                tipo: "Semantico",
                linea: simbolo.linea,
                columna: simbolo.columna,
                lexema: simbolo.nombre,
                descripcion: `Conflicto entre:
                    ${this.nombre} <= ${produccion.join(" ")};
                    ${this.nombre} <= ${cadena.join(" ")};`,
              });
            } else {
              this.primeros.set(simbolo.getNombre(), cadena);
            }
            buscar = false;
          } else {
            if (
              this.existeNoTerminal(creador, produccion[i]!, tablaNoTerminales)
            ) {
              let noT: NoTerminal = tablaNoTerminales.get(
                produccion[i]!.getNombre(),
              )!;
              noT.contadorPrimeros = 0;
              let primerosOtros = noT.encontrarPrimerosRecursivo(
                creador,
                tablaNoTerminales,
              );
              primerosOtros.forEach((produccion2, interes) => {
                if (this.primeros.has(interes)) {
                  creador.getErrores().push({
                    tipo: "Semantico",
                    linea: simbolo.linea,
                    columna: simbolo.columna,
                    lexema: simbolo.nombre,
                    descripcion: `Conflicto entre:
                    ${this.nombre} <= ${cadena.join(" ")};
                    ${produccion[i]!.getNombre()} <= ${produccion2.join(" ")};`,
                  });
                } else {
                  this.primeros.set(interes, cadena)
                  buscar = noT.primerVacios.length > 0
                }
              });
            } else {
              buscar = false;
            }
          }
        }
      }
    });
    this.primerosSimbolos.clear();
    return this.primeros;
  }

  public getPrimerVacios(): string[] {
    return this.primerVacios;
  }

  public agregarProduccionesVacias(creador: Creador): void {
    this.calcularSegundosHijosRecursivo();
    if(this.primerVacios.length > 0){
      this.segundos.forEach((segundo) => {
        if(!this.primeros.has(segundo)){
          this.primeros.set(segundo, this.primerVacios)
        } else {
          creador.getErrores().push({
            tipo: "Semantico",
            linea: this.linea,
            columna: this.columna,
            lexema: this.nombre,
            descripcion: `Conflicto entre: 
            ${this.nombre} <= ${this.primeros.get(segundo)!.join(" ")}
            ${this.nombre} <= ${this.primerVacios.join(" ")}`
          })
        }
      })
    }
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

  public existeNoTerminal(
    creador: Creador,
    simbolo: Simbolo,
    tablaNoTerminales: Map<string, NoTerminal>,
  ): boolean {
    if (tablaNoTerminales.has(simbolo.getNombre())) {
      return true;
    }
    creador.getErrores().push({
      tipo: "Semantico",
      linea: simbolo.getLinea(),
      columna: simbolo.getColumna(),
      lexema: simbolo.getNombre(),
      descripcion: `El no terminal con nombre: ${simbolo.getNombre()} no ha sido declarado`,
    });
    return false;
  }
}