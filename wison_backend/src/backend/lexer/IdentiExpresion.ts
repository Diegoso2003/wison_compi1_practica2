import { Creador } from "../CreadorGramatica/Creador";
import { TablaSimbolos } from "../TablaSimbolos";
import { Expresion } from "./Expresion";

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

    obtenerExprReg(creador: Creador): string {
        let tablaSimbolos: TablaSimbolos = creador.getTabla()
        if(tablaSimbolos.existeEnTabla(this.nombre)){
            return tablaSimbolos.conseguirExpresion(this.nombre)
        }
        creador.getErrores().push({
            descripcion: "terminal no declarado",
            tipo: "Semantico",
            lexema: this.nombre,
            linea: this.linea,
            columna: this.columna
        })
        return "error"
    }

}