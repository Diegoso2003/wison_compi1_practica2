import { MensajeError } from "../MensajeError";
import { Lexer } from "./Lexer";
import { Simbolo } from "./Simbolo/Simbolo";
import { Token } from "./Token";

export class Parser {
  private lexer: Lexer;
  private dot: string[] = [];
  private simboloInicial: Simbolo;
  private errores: MensajeError[] = [];
  private actual!: Token;
  private contador: number = 0;

  constructor(lexer: Lexer, inicial: Simbolo) {
    this.lexer = lexer;
    this.agregarDotPrincipal();
    this.simboloInicial = inicial;
  }

  public analizar(input: string): void {
    try {
      this.lexer.analizarEntrada(input, this.errores);
      this.actual = this.lexer.siguiente();
      this.simboloInicial.analizar(this, "");
    } catch (error) {}
    if(this.errores.length === 0){
        this.dot.push("\n}")
    }
  }

  public consumir(token: string) {
    if (token !== this.actual.getToken()) {
      this.informarError(this.actual, `Se esperaba: '${token}'`);
    }
    this.actual = this.lexer.siguiente();
  }

  public avanzar(): Token {
    this.actual = this.lexer.siguiente();
    return this.actual;
  }

  public informarError(token: Token, descripcion: string) {
    this.errores.push({
      tipo: "Sintáctico",
      linea: token.getLinea(),
      columna: token.getColumna(),
      lexema: token.getLexema(),
      descripcion: descripcion,
    });
  }

  public agregarNoTerminal(simbolo: Simbolo): string {
    let nombre: string = `Nodo${this.contador++}`;
    this.dot.push(`\n${nombre} [label="${simbolo.getNombre()}"];`);
    return nombre;
  }

  public agregarTerminal(simbolo: Simbolo): string {
    let nombre: string = `Nodo${this.contador++}`;
    this.dot.push(
      `\n${nombre} [label="${simbolo.getNombre()}",fillcolor="#e6b450", fontcolor="#1e1e2e"];`,
    );
    return nombre;
  }

  public agregarRelacion(padre: string, hijo: string): void {
    this.dot.push(`\n${padre} -> ${hijo};`);
  }

  public getActual(): Token {
    return this.actual;
  }

  private agregarDotPrincipal() {
    this.dot.push(`digraph G {
    rankdir=TB;
    bgcolor="#ffffff";
    nodesep=1.0;
    ranksep=1.5;

    node [
        shape=box,
        style=filled,
        fillcolor="#6b9e7e"
        fontname="Consolas",
        fontsize=14,
        color="#313244",
        fontcolor="#ffffff"
    ];

    edge [
        color="#6c6f93"
    ];`);
  }

  public getErrores(): MensajeError[] {
    return this.errores;
  }

  public getDot(): string{
    return this.dot.join("")
  }
}