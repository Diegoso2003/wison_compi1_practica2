import { Inicial } from "./Inicial";
import { NoTerminal } from "./NoTerminal";
import { Produccion } from "./Produccion";

export class Syntax{
    private noTerminales: NoTerminal[]
    private inicial: Inicial
    private producciones: Produccion[]

    constructor(noTerminales: NoTerminal[], inicial: Inicial, producciones: Produccion[]){
        this.inicial = inicial
        this.noTerminales = noTerminales
        this.producciones = producciones
    }
}