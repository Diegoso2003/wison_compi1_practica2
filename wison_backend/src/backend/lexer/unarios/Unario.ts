import { Analizador } from "../../Analizador";
import { Automata } from "../automata/Automata";
import { Expresion } from "../Expresion";

export abstract class Unario extends Expresion{
    protected expresion: Expresion

    constructor(expresion: Expresion){
        super()
        this.expresion = expresion
    }

    abstract agregarLambdas(analizador: Analizador): Automata

    obtenerAFND(analizador: Analizador): Automata {
        return this.agregarLambdas(analizador)
    }
    
}