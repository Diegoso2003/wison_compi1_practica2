import { Analizador } from "../Analizador";
import { Automata } from "./automata/Automata";
import { Estado } from "./estados/Estado";
import { Transicion } from "./estados/Transicion";
import { Expresion } from "./Expresion";

export class Cadena extends Expresion{

    constructor(cadena: string){
        super()
        let estados: Estado[] = []
        let estadoAnterior: Estado = new Estado()
        for(let i = 0; i < cadena.length; i++){
            let caracter: string = cadena.charAt(i)
            let estado: Estado = new Estado(i === cadena.length - 1)
            let transi: Transicion = new Transicion(caracter, estado)
            estadoAnterior.agregarTransicion(transi)
            estadoAnterior = estado
        }
        this.automata.setEstados(estados)
    }

    obtenerAFND(analizador: Analizador): Automata {
        return this.automata
    }

}