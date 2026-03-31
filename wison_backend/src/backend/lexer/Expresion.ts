import { Analizador } from "../Analizador";
import { Automata } from "./automata/Automata";

export abstract class Expresion{
    protected automata: Automata = new Automata()

    abstract obtenerAFND(analizador: Analizador): Automata;
}