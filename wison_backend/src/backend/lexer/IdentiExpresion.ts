import { Analizador } from "../Analizador";
import { MensajeError } from "../MensajeError";
import { TablaSimbolos } from "../TablaSimbolos";
import { Expresion } from "./Expresion";
import { Automata } from "./automata/Automata";

export class IdentiExpresion extends Expresion{
    private nombre: string
    private linea: number
    private columna: number

    constructor(nombre: string, linea: number, columna: number){
        super()
        this.nombre = nombre
        this.columna = columna
        this.linea = linea
    }

    obtenerAFND(analizador: Analizador): Automata {
        let tablaSimbolos: TablaSimbolos = analizador.getTabla()
        if(tablaSimbolos.existeEnTabla(this.nombre)){
            return tablaSimbolos.conseguirExpresion(this.nombre).obtenerAFND(analizador)
        }
        let mensaje: MensajeError = {
            descripcion: "expresion no declarada",
            tipo: "Semantico",
            lexema: this.nombre,
            linea: this.linea,
            columna: this.columna
        }
        analizador.getErrores().push(mensaje)
        return new Automata
    }

}