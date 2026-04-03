import { Creador } from "../../CreadorGramatica/Creador";
import { Unario } from "./Unario";

export class Kleene extends Unario{

    obtenerExprReg(creador: Creador): string {
        return `(${this.expresion.obtenerExprReg(creador)})*`
    }

}