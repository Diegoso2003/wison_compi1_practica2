import { Creador } from "../CreadorGramatica/Creador";
import { Expresion } from "./Expresion";

export class Cadena extends Expresion{

    constructor(cadena: string){
        super()
        let aux: string = cadena.slice(1, -1)
        for(let i = 0; i < aux.length; i++){
            switch(aux.charAt(i)){
                case '(': case ')': case '[': case ']': case '.': case '$':
                case '+': case '*': case '?': case '{': case '}': case '\\':
                case '^': case '|':
                    this.exprReg += '\\' + aux.charAt(i)
                    break
                default:
                    this.exprReg += aux.charAt(i)
            }
        }
    }

    obtenerExprReg(creador: Creador): string {
        return this.exprReg
    }

}