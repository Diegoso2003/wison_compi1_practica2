import { Parser } from "../Parser"
import { Token } from "../Token"

export abstract class Simbolo{
    protected nombre: string

    constructor(nombre: string){
        this.nombre = nombre
    }

    abstract analizar(parser: Parser, padre: string): void

    public getNombre():string{
        return this.nombre
    }
}