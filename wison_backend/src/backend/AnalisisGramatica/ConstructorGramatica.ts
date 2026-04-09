import { EntradaAnalisis } from "../../model/EntradaAnalisis";
import { ModeloGramatica } from "../../model/ModeloGramatica";
import { NoTerminalModel } from "../../model/NoTerminalModel";
import { GramaticaDAO } from "../DB/GramaticaDAO";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { NoTerminal } from "./Simbolo/NoTerminal";
import { Simbolo } from "./Simbolo/Simbolo";
import { Terminal } from "./Simbolo/Terminal";

export class ConstructorGramatica{
    private simbolos: Map<string, Simbolo> = new Map()

    construirGramatica(gramatica: ModeloGramatica): Parser {
        let lexer: Lexer = new Lexer(gramatica.lexer.terminales)
        lexer.añadirReglas(gramatica.lexer.exprs)
        return this.construirParser(lexer, gramatica)
    }

    private construirParser(lexer: Lexer, gramatica: ModeloGramatica): Parser{
        let inicial: Simbolo = this.obtenerNoTerminal(gramatica.sintactico.inicial)
        let parser = new Parser(lexer, inicial)
        let noTerminales: NoTerminalModel[] = gramatica.sintactico.noTerminales
        noTerminales.forEach((noTerminal) => {
            let noTerm = this.obtenerNoTerminal(noTerminal.nombre)
            noTerminal.tabla.forEach((p) => {
                let simbolos: Simbolo[] = []
                p.tabla.forEach((simbolo) => {
                    simbolos.push(this.obtenerSimbolo(simbolo))
                })
                noTerm.getProducciones().set(p.terminal, simbolos)
            })
            noTerminal.segundos.forEach((segundo) => {
                noTerm.getSiguientes().add(segundo)
            })
        })
        return parser;
    }

    private obtenerSimbolo(nombre: string): Simbolo{
        if(nombre.charAt(0) === "$") return this.obtenerTerminal(nombre)
        return this.obtenerNoTerminal(nombre)
    }

    private obtenerNoTerminal(nombre: string): NoTerminal{
        if(this.simbolos.has(nombre)){
            return this.simbolos.get(nombre) as NoTerminal
        }
        let nuevo: NoTerminal = new NoTerminal(nombre)
        this.simbolos.set(nombre, nuevo)
        return nuevo
    }

    private obtenerTerminal(nombre: string): Simbolo{
        if(this.simbolos.has(nombre)){
            return this.simbolos.get(nombre)!
        }
        let nuevo: Simbolo = new Terminal(nombre)
        this.simbolos.set(nombre, nuevo)
        return nuevo
    }
}