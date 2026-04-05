%{
    const { Cadena } = require('../backend/lexer/Cadena');
    const { Secuencia } = require('../backend/lexer/Secuencia')
    const { Kleene } = require('../backend/lexer/unarios/Kleene');
    const { Opcional } = require('../backend/lexer/unarios/Opcional');
    const { Positiva } = require('../backend/lexer/unarios/Positiva');
    const { IdentiExpresion } = require('../backend/lexer/IdentiExpresion');
    const { Concatenacion } = require('../backend/lexer/Concatenacion');
    const { ReglaLexica } = require('../backend/lexer/ReglaLexica');
    const { Creador } = require('../backend/CreadorGramatica/Creador');
    const { Simbolo } = require('../backend/syntax/Simbolo')
    const { NoTerminal } = require('../backend/syntax/NoTerminal')
    const { Inicial } = require('../backend/syntax/Inicial')
    const { Produccion } = require('../backend/syntax/Produccion')
    const { Syntax } = require('../backend/syntax/Syntax')
    const { ListaSimbolos } = require('../backend/syntax/ListaSimbolos')

    function errorLexico(){
        yy.creador.getErrores().push(
            {
                tipo: "Lexico",
                lexema: yytext,
                linea: yylloc.first_line,
                columna: yylloc.first_column,
                descripcion: `Caracter no reconocido: ${yytext}`
            }
        )
    }

    function traducirToken(token) {
        switch(token) {
            case "P_COMA": return ";";
            case "FLECHA": return "<-";
            case "ASIGNACION": return "<=";
            case "OR": return "|";
            case "PAREN_IZQ": return "(";
            case "PAREN_DER": return ")";
            case "KLEENE": return "*";
            case "POSITIVO": return "+";
            case "OPCIONAL": return "?";
            case "TERMINAL": return "Terminal";
            case "LEX": return "Lex";
            case "SYNTAX": return "Syntax";
            case "WISON": return "Wison";
            case "IN_LEX": return "{:";
            case "FIN_LEX": return ":}";
            case "IN_SYNTAX": return "{{:";
            case "FIN_SYNTAX": return ":}}";
            case "APERTURA": return "¿";
            case "CIERRE": return "?";
            case "NO_TERMINAL": return "No_Terminal";
            case "INICIO": return "Initial_Sim";
            case "TERMINAL_NOMBRE": return "$_NOMBRE";
            case "NO_TERMINAL_NOMBRE": return "%_NOMBRE";
            case "CADENA": return "palabra reservada";
            case "LETRAS": return "[a-zA-Z]";
            case "DIGITOS": return "[0-9]";
            default: return token;
        }
    }

    function construirDescripcionError(expected) {
        if (!expected || expected.length === 0) {
            return "Ya no se esperaba ningún token en este punto";
        }
        const tokens = expected.map(t => traducirToken(t));
        return `Se esperaba: ${tokens.join(", ")}`;
    }

    parser.parseError = function (str, hash) {
        yy.creador.getErrores().push({
            tipo: "Sintactico",
            lexema: hash.text || "",
            linea: hash.loc?.first_line || 0,
            columna: hash.loc?.first_column || 0,
            descripcion: construirDescripcionError(hash.expected)
        });
    };
%}

%lex

IDENTIFICADOR [a-zA-Z][a-zA-Z0-9_]*
NUMERO [0-9]+
WHITESPACE [ \t\r\n]+

%options locations

%x COMENTARIO
%x LEX
%x SYNTAX

%%
{WHITESPACE}                               /* Ignorar espacios en blanco */
<INITIAL,LEX,SYNTAX>"#".*                  /* Ignorar comentarios de una línea */
<INITIAL,LEX,SYNTAX>\/\*\*                 this.begin('COMENTARIO')  /* Iniciar comentario de varias líneas */
<COMENTARIO>\*\/                           this.popState()  /* Finalizar comentario de varias líneas */
<COMENTARIO>(.|\n)                         /* Ignorar el contenido del comentario */
<LEX>"Terminal"                            return 'TERMINAL'
<LEX>\$_{IDENTIFICADOR}                    return 'TERMINAL_NOMBRE'
<LEX>"<-"                                  return 'FLECHA'
<LEX>'[^ \t\r\n']+'                        return 'CADENA'
<LEX>"[a-zA-Z]"                            return 'LETRAS'
<LEX>"[0-9]"                               return 'DIGITOS'
<LEX>\*                                    return 'KLEENE'
<LEX>\+                                    return 'POSITIVO'
<LEX>\?                                    return 'OPCIONAL'
<LEX>\(                                    return 'PAREN_IZQ'
<LEX>\)                                    return 'PAREN_DER'
<LEX,SYNTAX>";"                            return 'P_COMA'
"Wison"                                    return 'WISON'
"¿"                                        return 'APERTURA'
"?"                                        return 'CIERRE'
"Lex"                                      return 'LEX'
"Syntax"                                   return 'SYNTAX'
"{{:"                                      this.begin('SYNTAX'); return 'IN_SYNTAX'
":}}"                                      this.begin('INITIAL'); return 'FIN_SYNTAX'
"{:"                                       this.begin('LEX'); return 'IN_LEX'
":}"                                       this.begin('INITIAL'); return 'FIN_LEX'
<SYNTAX>"No_Terminal"                      return 'NO_TERMINAL'
<SYNTAX>"Initial_Sim"                      return 'INICIO'
<SYNTAX>"<="                               return 'ASIGNACION'
<SYNTAX>"%_"{IDENTIFICADOR}                return 'NO_TERMINAL_NOMBRE'
<SYNTAX>"|"                                return 'OR'
<<EOF>>                                    return 'EOF'
.                                          errorLexico()

/lex
%start analizador
%%

analizador : wison EOF                              
    ;

wison : WISON APERTURA lexico sintactico 
    CIERRE WISON                                    
    ;

lexico : LEX IN_LEX reglas_lexicas FIN_LEX          { $$ = $3 }
    ;

sintactico : SYNTAX IN_SYNTAX syntax FIN_SYNTAX     { $$ = $3 }
    ;

syntax : no_terminales inicio producciones          { $$ = new Syntax($2, $3) }
    ;

reglas_lexicas : reglas_lexicas regla_lexica        
    | regla_lexica                                  
    ;

regla_lexica : TERMINAL TERMINAL_NOMBRE 
    FLECHA expr P_COMA                              {{ 
            yy.creador.agregarReglaLexica(new ReglaLexica($2, $4, @2.first_line, @2.first_column)) 
                                                    }}
    ;

expr : unario                                       { $$ = $1 }
    | combinado                                     { $$ = $1 }
    ;

combinado : combinado concatenacion                 { $1.agregarExpresion($2); $$ = $1 }
    | concatenacion concatenacion                   { $$ = new Concatenacion($1, $2) }
    ;

concatenacion : PAREN_IZQ unario PAREN_DER          { $$ = $2 }
    ;

unario : simple KLEENE                              { $$ = new Kleene($1) }
    | simple POSITIVO                               { $$ = new Positiva($1) }
    | simple OPCIONAL                               { $$ = new Opcional($1) }
    | simple                                        { $$ = $1 }
    ;

simple : CADENA                                     { $$ = new Cadena($1) }
    | LETRAS                                        { $$ = new Secuencia($1) }
    | DIGITOS                                       { $$ = new Secuencia($1) }
    | TERMINAL_NOMBRE                               { $$ = new IdentiExpresion($2, @2.first_line, @2.first_column) }
    ;

no_terminales : no_terminales no_terminal           
    | no_terminal                                   
    ;

no_terminal : NO_TERMINAL 
    NO_TERMINAL_NOMBRE P_COMA                       {{ 
                                        yy.creador.agregarNoTerminal(new NoTerminal($2, @2.first_line, @2.first_column))
                                                    }}
    ;

inicio : INICIO NO_TERMINAL_NOMBRE P_COMA           { $$ = new Inicial($2, @2.first_line, @2.first_column) }
    ;

producciones : producciones produccion              { $$ = $1; $1.push($2) }
    | produccion                                    { $$ = [$1] }
    ;

produccion : NO_TERMINAL_NOMBRE 
    ASIGNACION reglas P_COMA                        { $$ = new Produccion($1, $3, @1.first_line, @1.first_column) }
    ;

reglas : reglas OR listaSimbolos                    { $$ = $1; $1.push($3) }
    | reglas OR                                     { $$ = $1; $1.push([new Simbolo("", @$.first_line, @$.first_column, true)]) }
    | listaSimbolos                                 { $$ = [$1] }
    |                                               {[] $$ = [[new Simbolo("", @$.first_line, @$.first_column, true)]] }
    ;

listaSimbolos : listaSimbolos simbolo               { $$ = $1; $1.push($2) }
    | simbolo                                       { $$ = [$1] }
    ;

simbolo : NO_TERMINAL_NOMBRE                        { $$ = new Simbolo($1, @1.first_line, @1.first_column, false) }
    | TERMINAL_NOMBRE                               { $$ = new Simbolo($1, @1.first_line, @1.first_column, true) }
    ;