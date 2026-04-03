import { Simbolo } from "./Simbolo"

export class Produccion{
    private nombre: string
    private listaSimbolos: Simbolo[][]
    private linea: number
    private columna: number

    constructor(nombre: string, listaSimbolos: Simbolo[][], linea: number, columna: number){
        this.nombre = nombre
        this.listaSimbolos = listaSimbolos
        this.linea = linea
        this.columna = columna
    }
}