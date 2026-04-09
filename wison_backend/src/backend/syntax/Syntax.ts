import { NoTerminalModel } from "../../model/NoTerminalModel";
import { Sintactico } from "../../model/Sintactico";
import { TablaProduccion } from "../../model/TablaProduccion";
import { Creador } from "../CreadorGramatica/Creador";
import { Inicial } from "./Inicial";
import { NoTerminal } from "./NoTerminal";
import { Produccion } from "./Produccion";

export class Syntax{
    private noTerminales: NoTerminal[]
    private tablaNoTerminales: Map<string, NoTerminal> = new Map()
    private inicial: Inicial
    private producciones: Produccion[]

    constructor(noTerminales: NoTerminal[], inicial: Inicial, producciones: Produccion[]){
        this.inicial = inicial
        this.noTerminales = noTerminales
        this.producciones = producciones
    }

    validarGramatica(creador: Creador): void{
        this.validarNoterminales(creador)
        this.validarSimboloInicial(creador)
        this.validarProducciones(creador)
        this.tablaNoTerminales.forEach((noTerminal) => {
            noTerminal.encontrarPrimeros(creador, this.tablaNoTerminales)
        })
        this.producciones.forEach((produccion) => {
            produccion.segundos(creador, this.tablaNoTerminales)
        })
        this.tablaNoTerminales.forEach((noTerminal) => {
            noTerminal.agregarProduccionesVacias(creador)
        })
    }

    private validarProducciones(creador: Creador): void{
        this.producciones.forEach((produccion) => {
            produccion.primeros(creador, this.tablaNoTerminales)
        })
    }

    private validarNoterminales(creador: Creador): void{
        this.noTerminales.forEach((noTerminal) => {
          if (!this.tablaNoTerminales.has(noTerminal.getNombre())) {
            this.tablaNoTerminales.set(noTerminal.getNombre(), noTerminal);
          } else {
            creador.getErrores().push({
              tipo: "Semantico",
              linea: noTerminal.getLinea(),
              columna: noTerminal.getColumna(),
              lexema: noTerminal.getNombre(),
              descripcion: "El no terminal ya fue declarado.",
            });
          }
        });
    }

    private validarSimboloInicial(creador:Creador): void{
        if(!this.tablaNoTerminales.has(this.inicial.getNombre())){
            creador.getErrores().push({
                tipo: "Semantico",
                linea: this.inicial.getLinea(),
                columna: this.inicial.getColumna(),
                lexema: this.inicial.getNombre(),
                descripcion: "El no terminal no ha sido declarado."
            })
        } else {
            this.tablaNoTerminales.get(this.inicial.getNombre())!.getSegundos().add("$_EOF")
        }
    }

    public pasarAModelo(): Sintactico {
        let noTerminales: NoTerminalModel[] = []
        this.tablaNoTerminales.forEach((noTerminal, nombre) => {
            let tabla: TablaProduccion[] = []
            let segundosArreglo: string[] = []
            let primeros: Map<string, string[]> = noTerminal.getPrimeros()
            primeros.forEach((produccion, terminal) => {
                tabla.push({
                    terminal: terminal,
                    tabla: produccion
                })
            })
            let segundos: Set<string> = noTerminal.getSegundos()
            segundos.forEach((segundo) => {
                segundosArreglo.push(segundo)
            })
            noTerminales.push({
                nombre: nombre,
                segundos: segundosArreglo,
                tabla: tabla
            })
        })
        return {
            noTerminales: noTerminales,
            inicial: this.inicial.getNombre()
        }
    }
}