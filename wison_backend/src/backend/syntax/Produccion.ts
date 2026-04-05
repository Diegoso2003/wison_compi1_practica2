import { Creador } from "../CreadorGramatica/Creador";
import { NoTerminal } from "./NoTerminal";
import { Simbolo } from "./Simbolo";

export class Produccion {
  private nombre: string;
  private listaSimbolos: Simbolo[][];
  private linea: number;
  private columna: number;

  constructor(
    nombre: string,
    listaSimbolos: Simbolo[][],
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
    if (tablaNoTerminales.has(this.nombre)) {
      let noTerminal: NoTerminal = tablaNoTerminales.get(this.nombre)!;
      this.listaSimbolos.forEach((produccion) => {
        let producciones: string[] = [];
        let p: Simbolo = produccion[0]!
        if (p.getTerminal()) {
            if(p.getNombre() === ""){
                noTerminal.agregarProduccionVacio(producciones, creador, p)
            } else if (this.existeTerminal(creador, p)) {
                this.agregarPrimeroTerminal(creador, p, noTerminal, producciones);
            }
        }
      });
    } else {
      creador.getErrores().push({
        tipo: "Semantico",
        linea: this.linea,
        columna: this.columna,
        lexema: this.nombre,
        descripcion: "El no terminal no ha sido declarado.",
      });
    }
  }

  private existeTerminal(creador: Creador, simbolo: Simbolo): boolean {
    if (creador.getTabla().existeEnTabla(simbolo.getNombre())) {
      return true;
    }
    creador.getErrores().push({
      tipo: "Semantico",
      linea: simbolo.getLinea(),
      columna: simbolo.getColumna(),
      lexema: simbolo.getNombre(),
      descripcion: `El terminal con nombre: ${simbolo.getNombre()} no ha sido declarado`,
    });
    return false;
  }

  private existeNoTerminal(
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
    if(tablaNoTerminales.has(this.nombre)){
      let padre: NoTerminal = tablaNoTerminales.get(this.nombre)!
      this.listaSimbolos.forEach((simbolos) => {
        let anterior: NoTerminal | undefined
        let vacios: NoTerminal[] = []
        simbolos.forEach((simbolo) => {
        let segundos: string[] = []
          if(simbolo.getTerminal()){
            if(simbolo.getNombre() !== "" && this.existeTerminal(creador, simbolo) && anterior){
              segundos.push(simbolo.getNombre())
            }
            anterior = undefined
          } else {
            if(this.existeNoTerminal(creador, simbolo, tablaNoTerminales)){
              let noTerminal: NoTerminal = tablaNoTerminales.get(simbolo.getNombre())!
              if(anterior){
                let primeros:Map<string, string[]> = noTerminal.getPrimeros()
                primeros.forEach((producciones, terminal) => {
                  if(!anterior!.getSegundos().has(terminal)){
                    anterior?.getSegundos().add(terminal)
                  }
                  segundos.push(terminal)
                })
              }
              anterior = noTerminal;
            } else {
              anterior = undefined
            }
          }
          vacios.forEach((noTerminal) => {
            segundos.forEach((segundo) => {
              noTerminal.getSegundos().add(segundo)
            })
          })
          if(!anterior || anterior.getPrimerVacios().length === 0){
            vacios = []
          } else {
            vacios.push(anterior)
          }
        })
        if(anterior){
          padre.agregarHijo(anterior)
          vacios.forEach((noTerminal) => {
            padre.agregarHijo(noTerminal)
          })
        }
      })
    }
  }
}