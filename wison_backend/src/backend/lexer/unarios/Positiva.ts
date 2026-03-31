import { Analizador } from "../../Analizador";
import { Automata } from "../automata/Automata";
import { Estado } from "../estados/Estado";
import { Transicion } from "../estados/Transicion";
import { Unario } from "./Unario";

export class Positiva extends Unario{

    agregarLambdas(analizador: Analizador): Automata {
        let estados: Estado[] = []
        let estadosAutomata: Estado[] = this.expresion.obtenerAFND(analizador).getEstados()
        if (estadosAutomata.length > 0) {
            let inicioAnterior: Estado = estadosAutomata[0]!
            let finAnterior: Estado = estadosAutomata[estadosAutomata.length - 1]!
            let estadoNuevoInicio: Estado = new Estado();
            let estadoNuevoFin: Estado = new Estado(true);
            let transi1: Transicion = new Transicion("", inicioAnterior);
            let transi2: Transicion = new Transicion("", estadoNuevoFin)
            estadoNuevoInicio.agregarTransicion(transi1)
            finAnterior.setAceptacion(false)
            finAnterior.agregarTransicion(transi1)
            finAnterior.agregarTransicion(transi2)
            estados.push(estadoNuevoInicio)
            estados.concat(estadosAutomata)
            estados.push(estadoNuevoFin)
        }
        return new Automata(estados)
    }
}