import { ReglaLexica } from "../lexer/ReglaLexica";
import { MensajeError } from "../MensajeError";
import { NoTerminal } from "../syntax/NoTerminal";
import { TablaSimbolos } from "../TablaSimbolos";

export class Creador {
  private tabla: TablaSimbolos = new TablaSimbolos();
  private tablaNoTerminales: Map<string, NoTerminal> = new Map();
  private errores: MensajeError[] = [];

  public agregarReglaLexica(regla: ReglaLexica): void{
    if(this.tabla.existeEnTabla(regla.getNombre())){
      this.errores.push({
        tipo: "Semantico",
        linea: regla.getLinea(),
        columna: regla.getColumna(),
        lexema: regla.getNombre(),
        descripcion: "El no terminal ya fue declarado."
      })
      return
    }
    let expr: string = regla.getExpresion().obtenerExprReg(this);
    this.tabla.agregarALaTabla(regla.getNombre(), expr);
  }

  public agregarNoTerminal(noTerminal: NoTerminal){
    if(this.tablaNoTerminales.has(noTerminal.getNombre())){
      this.errores.push({
        tipo: "Semantico",
        linea: noTerminal.getLinea(),
        columna: noTerminal.getColumna(),
        lexema: noTerminal.getNombre(),
        descripcion: "El no terminal ya fue declarado."
      })
      return
    }
    this.tablaNoTerminales.set(noTerminal.getNombre(), noTerminal)
  }

  public getTabla(): TablaSimbolos {
    return this.tabla;
  }

  public getErrores(): MensajeError[] {
    return this.errores;
  }

  public getTablaNoTerminales(): Map<string, NoTerminal> {
    return this.tablaNoTerminales;
  }
}