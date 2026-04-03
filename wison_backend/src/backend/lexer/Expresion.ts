import { Creador } from "../CreadorGramatica/Creador";

export abstract class Expresion{
    protected exprReg: string = ""

    abstract obtenerExprReg(creador: Creador): string;
}