import { Lexer } from "./Lexer";
import { Sintactico } from "./Sintactico";

export interface ModeloGramatica {
    lexer: Lexer,
    sintactico: Sintactico
}