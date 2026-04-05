import { Creador } from "../CreadorGramatica/Creador";
import { ListaSimbolos } from "./ListaSimbolos";
import { NoTerminal } from "./NoTerminal";
import { Simbolo } from "./Simbolo";

export class Produccion {
  private nombre: string;
  private listaSimbolos: ListaSimbolos;
  private linea: number;
  private columna: number;

  constructor(
    nombre: string,
    listaSimbolos: ListaSimbolos,
    linea: number,
    columna: number,
  ) {
    this.nombre = nombre;
    this.listaSimbolos = listaSimbolos;
    this.linea = linea;
    this.columna = columna;
  }

  primeros(
    creador: Creador,
    tablaNoTerminales: Map<string, NoTerminal>,
  ): void {
    
  }

  public agregarPrimeroTerminal(
    creador: Creador,
    simbolo: Simbolo,
    noTerminal: NoTerminal,
    producciones: string[],
  ): void {
    if (!noTerminal.getPrimeros().has(simbolo.getNombre())) {
      noTerminal.getPrimeros().set(simbolo.getNombre(), producciones);
    } else {
      creador.getErrores().push({
        tipo: "Semantico",
        linea: simbolo.getLinea(),
        columna: simbolo.getColumna(),
        lexema: simbolo.getNombre(),
        descripcion:
          `Conflicto entre: 
          ${noTerminal.getNombre()} <= ${noTerminal.getPrimeros().get(simbolo.getNombre())!.join(" ")};
          ${noTerminal.getNombre()} <= ${producciones.join(" ")};
          factorizar para eliminar la ambigüedad.`,
      });
    }
  }

  segundos(creador: Creador, tablaNoTerminales: Map<string, NoTerminal>) {

  }
}