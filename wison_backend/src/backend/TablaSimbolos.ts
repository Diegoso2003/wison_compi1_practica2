import { Expresion } from "./lexer/Expresion";

export class TablaSimbolos {
    private tablaSimbolos = new Map<string, Expresion>()

    public existeEnTabla(nombre: string): boolean{
        return this.tablaSimbolos.get(nombre) !== undefined
    }

    public agregarALaTabla(nombre: string, expresion: Expresion): void{
        this.tablaSimbolos.set(nombre, expresion)
    }

    public conseguirExpresion(nombre: string): Expresion{
        return this.tablaSimbolos.get(nombre)!
    }
}