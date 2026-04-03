import { Creador } from "../CreadorGramatica/Creador";
import { Expresion } from "./Expresion";

export class Secuencia extends Expresion{

    constructor(cadena: string){
        super()
        this.exprReg = cadena
    }

    obtenerExprReg(creador: Creador): string {
        return this.exprReg
    }
    
}