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
        produccion.forEach((p1) => {producciones.push(p1.getNombre())})
        if(produccion.length!==0){
          let p: Simbolo = produccion[0]!
        if (p.getTerminal()) {
            if(p.getNombre() === ""){
                noTerminal.agregarProduccionVacio(producciones, creador, p)
            } else if (creador.existeTerminal(p)) {
                this.agregarPrimeroTerminal(creador, p, noTerminal, producciones);
            }
        } else {
          if(this.existeNoTerminal(creador, p, tablaNoTerminales)){
            let primero: NoTerminal = tablaNoTerminales.get(p.getNombre())!
            this.agregarPrimeroNoTerminal(creador, primero, noTerminal, produccion)
          }
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

  agregarPrimeroNoTerminal(creador: Creador, p: NoTerminal, noTerminal: NoTerminal, produccion: Simbolo[]) {
    if(!noTerminal.getPrimerosSimbolos().has(p)){
      noTerminal.getPrimerosSimbolos().set(p, produccion)
    } else {
      let cadena1: string = ""; produccion.forEach((i) => cadena1.concat(i.getNombre() + " "))
      let cadena2: string = "";
      noTerminal.getPrimerosSimbolos().get(p)!.forEach((i) => cadena2.concat(i.getNombre() + " "))
      creador.getErrores().push({
        tipo: "Semantico",
        linea: this.linea,
        columna: this.columna,
        lexema: this.nombre,
        descripcion: `Conflicto entre:
        ${this.nombre} <= ${cadena1};
        ${this.nombre} <= ${cadena2};`
      })
    }
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
        let inicioVacio: NoTerminal[] = []
        let siguientes: string[] = []
        simbolos.forEach((simbolo) => {
          if(simbolo.getTerminal()){
            if(simbolo.getNombre() !== "" && creador.existeTerminal(simbolo) && anterior){
              if(anterior){
                siguientes.push(simbolo.getNombre())
                anterior.getSegundos().add(simbolo.getNombre())
              }
            }
            anterior = undefined
          } else {
            if(this.existeNoTerminal(creador, simbolo, tablaNoTerminales)){
              let noTerminal: NoTerminal = tablaNoTerminales.get(simbolo.getNombre())!
              if(anterior){
                let primeros:Map<string, string[]> = noTerminal.getPrimeros()
                primeros.forEach((producciones, terminal) => {
                  siguientes.push(terminal)
                  anterior?.getSegundos().add(terminal)
                })
              }
              anterior = noTerminal;
            } else {
              anterior = undefined
            }
          }
          inicioVacio.forEach((vacio) => {
            siguientes.forEach((siguiente) => {
              vacio.getSegundos().add(siguiente)
            })
          })
          if(!anterior){
            inicioVacio = []
          } else if (anterior.getPrimerVacios().length === 0){
            inicioVacio = [anterior]
          } else{
            inicioVacio.push(anterior)
          }
        })
        if(anterior){
          padre.agregarHijo(anterior)
        }
        inicioVacio.forEach((vacio) => {
          padre.agregarHijo(vacio)
        })
      })
    }
  }
}