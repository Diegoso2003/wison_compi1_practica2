import { Lexer } from "../../model/Lexer";
import { ModeloGramatica } from "../../model/ModeloGramatica";
import { Sintactico } from "../../model/Sintactico";
import { ReglaLexica } from "../lexer/ReglaLexica";
import { MensajeError } from "../MensajeError";
import { Simbolo } from "../syntax/Simbolo";
import { Syntax } from "../syntax/Syntax";
import { TablaSimbolos } from "../TablaSimbolos";

export class Creador {
  private tabla: TablaSimbolos = new TablaSimbolos();
  private tokens: Map<string, number> = new Map()
  private contador: number = 0;
  private errores!: MensajeError[];
  private reglasLexicas: ReglaLexica[];
  private syntax: Syntax

  constructor(reglasLexicas: ReglaLexica[], syntax: Syntax) {
    this.tokens.set("$_EOF", this.contador++);
    this.reglasLexicas = reglasLexicas;
    this.syntax = syntax
  }

  analizar(errores: MensajeError[]): void {
    this.errores = errores;
    this.validarLexer()
    this.syntax.validarGramatica(this)
  }

  validarLexer(): void{
    this.reglasLexicas.forEach((regla) => {
      let nombre: string = regla.getNombre();
      if(!this.tokens.has(nombre)){
        this.tokens.set(nombre, this.contador++)
        this.tabla.agregarALaTabla(nombre, regla.getExpresion().obtenerExprReg(this));
      } else {
        this.errores.push({
          tipo: "Semantico",
          lexema: regla.getNombre(),
          linea: regla.getLinea(),
          columna: regla.getColumna(),
          descripcion: "token ya declarado"
        })
      }
    })
    }

    public existeTerminal(simbolo: Simbolo): boolean {
      if (this.tabla.existeEnTabla(simbolo.getNombre())) {
        return true;
      }
      this.errores.push({
        tipo: "Semantico",
        linea: simbolo.getLinea(),
        columna: simbolo.getColumna(),
        lexema: simbolo.getNombre(),
        descripcion: `El terminal con nombre: ${simbolo.getNombre()} no ha sido declarado`,
      });
      return false;
    }

  public getTabla(): TablaSimbolos {
    return this.tabla;
  }
  public setTabla(value: TablaSimbolos) {
    this.tabla = value;
  }

  public getErrores(): MensajeError[] {
    return this.errores;
  }

  public crearModeloGramatica(): ModeloGramatica {
    let lexer: Lexer = this.tabla.pasarAModelo()
    let sintactico: Sintactico = this.syntax.pasarAModelo()
    return {
      lexer: lexer,
      sintactico: sintactico
    }
  }
}