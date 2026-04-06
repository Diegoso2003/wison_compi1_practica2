import { Lexer } from "../model/Lexer"

export class TablaSimbolos {
    private tablaSimbolos = new Map<string, string>()

    public existeEnTabla(nombre: string): boolean{
        return this.tablaSimbolos.get(nombre) !== undefined
    }

    public agregarALaTabla(nombre: string, expresion: string): void{
        this.tablaSimbolos.set(nombre, expresion)
    }

    public conseguirExpresion(nombre: string): string{
        return this.tablaSimbolos.get(nombre)!
    }

    public pasarAModelo(): Lexer{
        let exprs: string[] = []
        let terminales: string[] = []
        this.tablaSimbolos.forEach((expr, terminal) => {
            exprs.push(expr)
            terminales.push(terminal)
        })
        return {
            exprs: exprs,
            terminales: terminales
        }
    }
}