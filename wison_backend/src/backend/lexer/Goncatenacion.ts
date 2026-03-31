import { Analizador } from "../Analizador";
import { Automata } from "./automata/Automata";
import { Expresion } from "./Expresion";

export class Concatenacion extends Expresion{

    obtenerAFND(analizador: Analizador): Automata {
        throw new Error("Method not implemented.")
    }

}