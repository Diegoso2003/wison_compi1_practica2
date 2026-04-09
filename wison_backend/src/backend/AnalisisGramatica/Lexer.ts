import { MensajeError } from "../MensajeError"
import { Token } from "./Token"

export class Lexer{
    private tokens: string[]
    private reglasLexicas: RegExp[] = []
    private linea: number = 1
    private columna: number = 1
    private input: string = ""
    private saltosLinea: RegExp = /^(?:[\r\n|\r|\n])/
    private ignorados: RegExp = /^(?:[ \t]+)/
    private errores: MensajeError[] = []

    constructor(tokens: string[]){
        this.tokens = tokens
    }

    añadirReglas(reglas:string[]){
        reglas.forEach((regla) => {
            this.reglasLexicas.push(new RegExp(`^(?:${regla})`))
        })
    }

    analizarEntrada(entrada: string, errores:MensajeError[]){
        this.input = entrada
        this.errores = errores
    }

    siguiente():Token{
        let indice = -1;
        while(this.input.length > 0){
            let salto = this.input.match(this.saltosLinea)
            if(salto){
                this.linea++
                this.columna = 1
                this.input = this.input.slice(salto[0].length)
                continue
            }
            let ignora = this.input.match(this.ignorados)
            if(ignora){
                this.input = this.input.slice(ignora[0].length)
                this.columna += ignora[0].length
                continue
            }
            let match: RegExpMatchArray | null
            let posibleMatch: RegExpMatchArray | null
            this.reglasLexicas.forEach((regla, index) => {
                posibleMatch = this.input.match(regla)
                if(posibleMatch && posibleMatch[0].length > 0 
                    && (!match || posibleMatch[0].length > match[0].length)){
                    match = posibleMatch
                    indice = index
                }
            })
            if(indice >= 0){
                let token = new Token(this.linea, this.columna, match![0], this.tokens[indice]!)
                this.actualizarColumnas(match![0].length)
                return token
            } else {
                this.informarErrorLexico()
            }
        }
        return new Token(this.linea, this.columna, "$_EOF", "$_EOF")
    }

    private actualizarColumnas(columnas: number){
        this.columna += columnas
        this.input = this.input.slice(columnas)
    }

    private informarErrorLexico(){
        this.errores.push({
            tipo: "Léxico",
            linea: this.linea,
            columna: this.columna++,
            lexema: this.input.charAt(0),
            descripcion: "Caracter no reconocido."
        })
        this.input = this.input.slice(1)
    }
}