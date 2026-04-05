import { ReglaLexica } from "../lexer/ReglaLexica";
import { MensajeError } from "../MensajeError";
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
    for(let i = 0; i < this.reglasLexicas.length; i++){
        let nombre: string = this.reglasLexicas[i]!.getNombre()
        if(!this.tokens.has(nombre)){
            this.tokens.set(nombre, this.contador++)
            this.tabla.agregarALaTabla(nombre, this.reglasLexicas[i]!.getExpresion().obtenerExprReg(this));
        } else {
            this.errores.push({
                tipo: "Semantico",
                lexema: this.reglasLexicas[i]!.getNombre(),
                linea: this.reglasLexicas[i]!.getLinea(),
                columna: this.reglasLexicas[i]!.getColumna(),
                descripcion: "token ya declarado"
            })
        }
    }
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
  public setErrores(value: MensajeError[]) {
    this.errores = value;
  }
}