import { Analizador } from "../../Analizador";
import { Expresion } from "../Expresion";

export abstract class Unario extends Expresion{
    protected expresion: Expresion

    constructor(expresion: Expresion){
        super()
        this.expresion = expresion
    }

}