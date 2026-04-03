import { Creador } from "../../CreadorGramatica/Creador";
import { Unario } from "./Unario";

export class Positiva extends Unario{

    obtenerExprReg(creador: Creador): string {
        return `(${this.expresion.obtenerExprReg(creador)})+`
    }

}