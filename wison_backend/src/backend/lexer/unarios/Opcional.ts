import { Analizador } from "../../Analizador";
import { Automata } from "../automata/Automata";
import { Estado } from "../estados/Estado";
import { Transicion } from "../estados/Transicion";
import { Unario } from "./Unario";

export class Opcional extends Unario{

    agregarLambdas(analizador: Analizador): Automata {
        let estadosAutomata: Estado[] = this.expresion.obtenerAFND(analizador).getEstados()
        if (estadosAutomata.length > 0) {
            let estadoInicial: Estado = estadosAutomata[0]!
            let estadoFinal: Estado = estadosAutomata[estadosAutomata.length - 1]!
            let transi: Transicion = new Transicion("", estadoFinal)
            estadoInicial.agregarTransicion(transi)
        }
        return new Automata(estadosAutomata)
    }
    
}