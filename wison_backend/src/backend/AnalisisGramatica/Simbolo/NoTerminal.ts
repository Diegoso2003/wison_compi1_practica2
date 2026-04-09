import { Parser } from "../Parser";
import { Token } from "../Token";
import { Simbolo } from "./Simbolo";

export class NoTerminal extends Simbolo {
  private producciones: Map<string, Simbolo[]> = new Map();
  private siguientes: Set<string> = new Set();

  analizar(parser: Parser, padre: string): void {
    let token = parser.getActual()
    if(this.producciones.has(token.getToken())){
        let nombre = parser.agregarNoTerminal(this)
        this.producciones.get(token.getToken())?.forEach((p) => {
            p.analizar(parser, nombre)
        })
        if(padre.length > 0){
            parser.agregarRelacion(padre, nombre)
        }
        return
    }
    do{
        let descripcion = this.armarDescripcion();
        parser.informarError(token, descripcion);
        if(token.getToken() === "$_EOF"){
            return
        }
        token = parser.avanzar()
    }while(!this.producciones.has(token.getToken()) && !this.siguientes.has(token.getToken()))
    if(this.producciones.has(token.getToken())){
        this.analizar(parser, padre)
    }
  }

  private armarDescripcion(): string{
    if(this.producciones.size === 0){
        return "ya no se esperaba ningún valor."
    }
    let mensaje: string = "Se esperaba: "
    this.producciones.forEach((valor, terminal) => {
        mensaje += `${terminal}, `
    })
    return mensaje
  }

  public getProducciones(): Map<string, Simbolo[]> {
    return this.producciones;
  }

  public getSiguientes(): Set<string> {
    return this.siguientes
  }
}