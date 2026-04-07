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

    const { ErrorM } = require('../backend/ErrorM');
    const errorManager = ErrorM.getInstance();

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
        errorManager.agregarError({
            tipo: "Sintactico",
            lexema: hash.token || this.lexer?.yytext || "",
            linea: (hash.loc?.first_line || 0),
            columna: (hash.loc?.first_column || 0),
            descripcion: construirDescripcionError(hash.expected)
        });
        
        return;
    };
%}

%lex

%options locations
%options flex

%x COMENTARIO
%x LEX
%x SYNTAX

%%
<INITIAL,LEX,SYNTAX>\#[^\n]*               /* Ignorar comentarios de una línea */
<INITIAL,LEX,SYNTAX>[ \t\r\n]+             /* Ignorar espacios en blanco */
<INITIAL,LEX,SYNTAX>\/\*\*                 this.begin('COMENTARIO')  /* Iniciar comentario de varias líneas */
<COMENTARIO>\*\/                           this.popState()  /* Finalizar comentario de varias líneas */
<COMENTARIO>(.|\n)                         /* Ignorar el contenido del comentario */
<LEX>"Terminal"                            return 'TERMINAL'
<LEX,SYNTAX>\$_[a-zA-Z][a-zA-Z0-9_]*       return 'TERMINAL_NOMBRE'
<LEX>"<-"                                  return 'FLECHA'
<LEX>"'"[^ \t\r\n']+"'"                    return 'CADENA'
<LEX>"[aA-zZ]"                             return 'LETRAS'
<LEX>"[0-9]"                               return 'DIGITOS'
<LEX>\*                                    return 'KLEENE'
<LEX>\+                                    return 'POSITIVO'
<LEX>\?                                    return 'OPCIONAL';
<LEX>\(                                    return 'PAREN_IZQ'
<LEX>\)                                    return 'PAREN_DER'
<LEX,SYNTAX>";"                            return 'P_COMA'
<INITIAL>"Wison"                           return 'WISON'
<INITIAL>"¿"                               return 'APERTURA'
<INITIAL>"?"                               return 'CIERRE'
<INITIAL>"Lex"                             return 'LEX'
<INITIAL>"Syntax"                          return 'SYNTAX'
<INITIAL>"{{:"                             this.begin('SYNTAX'); return 'IN_SYNTAX'
<SYNTAX>":}}"                              this.begin('INITIAL'); return 'FIN_SYNTAX'
<INITIAL>"{:"                              this.begin('LEX'); return 'IN_LEX'
<LEX>":}"                                  this.begin('INITIAL'); return 'FIN_LEX'
<SYNTAX>"No_Terminal"                      return 'NO_TERMINAL'
<SYNTAX>"Initial_Sim"                      return 'INICIO'
<SYNTAX>"<="                               return 'ASIGNACION'
<SYNTAX>"%"_[a-zA-Z][a-zA-Z0-9_]*            return 'NO_TERMINAL_NOMBRE'
<SYNTAX>"|"                                return 'OR'
<<EOF>>                                    return 'EOF'
<INITIAL,LEX,SYNTAX>.                      {
    if (yytext && yytext.length > 0) {
        const errorLexico = {
            tipo: "Lexico",
            lexema: yytext,
            linea: yylloc.first_line,
            columna: yylloc.first_column+1,
            descripcion: `Caracter no reconocido: '${yytext}' (código ASCII: ${yytext.charCodeAt(0)})`
        };
        
        errorManager.agregarError(errorLexico);
    }
}

/lex
%start analizador
%%

analizador : wison EOF                              { $$ = $1; return $1;}
    | error wison                                   { $$ = $2; }
    | wison error                                   { $$ = $1; }
    | error EOF                                     { $$ = {}; }             
    ;

wison : WISON APERTURA lexico sintactico 
    CIERRE WISON                                    { $$ = new Creador($3, $4); }
    ;

lexico : LEX IN_LEX reglas_lexicas FIN_LEX          { $$ = $3 }
    ;

sintactico : SYNTAX IN_SYNTAX syntax FIN_SYNTAX     { $$ = $3 }
    ;

syntax : no_terminales inicio producciones          { $$ = new Syntax($1, $2, $3) }
    ;

reglas_lexicas : reglas_lexicas regla_lexica        { $$ = $1; $1.push($2) }
    | regla_lexica                                  { $$ = [$1]; }
    ;

regla_lexica : TERMINAL TERMINAL_NOMBRE 
    FLECHA expr P_COMA                              { $$ = new ReglaLexica($2, $4, @2.first_line, @2.first_column) }
    ;

expr : unario                                       { $$ = $1 }
    | combinado                                     { $$ = $1 }
    ;

combinado : combinado concatenacion                 { $1.agregarExpresion($2); $$ = $1 }
    | concatenacion                                 { $$ = new Concatenacion($1) }
    ;

concatenacion : PAREN_IZQ unario PAREN_DER          { $$ = $2 }
    ;

unario : simple KLEENE                              { $$ = new Kleene($1) }
    | simple POSITIVO                               { $$ = new Positiva($1) }
    | simple OPCIONAL                               { $$ = new Opcional($1) }
    | simple                                        { $$ = $1 }
    ;

simple : CADENA                                     { $$ = new Cadena($1) }
    | LETRAS                                        { $$ = new Secuencia("[a-zA-ZñÑ]") }
    | DIGITOS                                       { $$ = new Secuencia($1) }
    | TERMINAL_NOMBRE                               { $$ = new IdentiExpresion($1, @1.first_line, @1.first_column) }
    ;

no_terminales : no_terminales no_terminal           { $$ = $1; $1.push($2) }
    | no_terminales error                           { $$ = $1; }
    | no_terminal                                   { $$ = [$1] }
    | error                                         { $$ = [] }
    ;

no_terminal : NO_TERMINAL 
    NO_TERMINAL_NOMBRE P_COMA                       { $$ = new NoTerminal($2, @2.first_line, @2.first_column) }
    ;

inicio : INICIO NO_TERMINAL_NOMBRE P_COMA           { $$ = new Inicial($2, @2.first_line, @2.first_column) }
    ;

producciones : producciones produccion              { $$ = $1; $1.push($2) }
    | producciones error                            { $$ = $1 }
    | produccion                                    { $$ = [$1] }
    | error                                         { $$ = [] }
    ;

produccion : NO_TERMINAL_NOMBRE 
    ASIGNACION reglas P_COMA                        { $$ = new Produccion($1, $3, @1.first_line, @1.first_column) }
    ;

reglas : reglas OR listaSimbolos                    { $$ = $1; $1.push($3) }
    | reglas OR                                     { $$ = $1; $1.push([new Simbolo("", @$.first_line, @$.first_column, true)]) }
    | listaSimbolos                                 { $$ = [$1] }
    |                                               { $$ = [[new Simbolo("", @$.first_line, @$.first_column, true)]] }
    ;

listaSimbolos : listaSimbolos simbolo               { $$ = $1; $1.push($2) }
    | listaSimbolos error                           { $$ = $1 }
    | simbolo                                       { $$ = [$1] }
    | error                                         { $$ = [] }
    ;

simbolo : NO_TERMINAL_NOMBRE                        { $$ = new Simbolo($1, @1.first_line, @1.first_column, false) }
    | TERMINAL_NOMBRE                               { $$ = new Simbolo($1, @1.first_line, @1.first_column, true) }
    ;