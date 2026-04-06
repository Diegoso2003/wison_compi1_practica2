import { Lexer } from "./Lexer";
import { Sintactico } from "./Sintactico";

export interface GramaticaModel{
    lexer: Lexer,
    sintactico: Sintactico
}