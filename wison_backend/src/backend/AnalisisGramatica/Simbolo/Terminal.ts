import { Parser } from "../Parser";
import { Simbolo } from "./Simbolo";

export class Terminal extends Simbolo{
    
    analizar(parser: Parser, padre:string): void {
        let nombre = parser.agregarTerminal(this)
        parser.agregarRelacion(padre, nombre)
        console.log(`consumo token: ${this.getNombre()}`)
        parser.consumir(this.nombre)
    }

}