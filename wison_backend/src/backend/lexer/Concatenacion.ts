import { Creador } from "../CreadorGramatica/Creador";
import { Expresion } from "./Expresion";

export class Concatenacion extends Expresion{
    private expresiones: Expresion[] = []

    constructor(expresion1: Expresion, expresion2: Expresion){
        super()
        this.expresiones.push(expresion1)
        this.expresiones.push(expresion2)
    }

    agregarExpresion(expresion: Expresion){
        this.expresiones.push(expresion)
    }

    obtenerExprReg(creador: Creador): string {
        let expresion: string = ""
        for(let i = 0; i < this.expresiones.length; i++){
            expresion += this.expresiones[i]?.obtenerExprReg(creador)
        }
        return expresion;
    }

}