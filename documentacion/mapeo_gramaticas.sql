CREATE DATABASE Wison;

USE Wison;

CREATE TABLE Gramatica(
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	gramatica JSON NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

Wison ¿

Lex {:
    Terminal $_id <- 'id';
    Terminal $_num <- 'num';
    Terminal $_mas <- '+';
    Terminal $_por <- '*';
    Terminal $_parA <- '(';
    Terminal $_parC <- ')';
:}

Syntax {{:

    No_Terminal %_E;
    No_Terminal %_Eprima;
    No_Terminal %_T;
    No_Terminal %_Tprima;
    No_Terminal %_F;

    Initial_Sim %_E;

    %_E <= %_T %_Eprima;

    %_Eprima <= $_mas %_T %_Eprima
              | ;

    %_T <= %_F %_Tprima;

    %_Tprima <= $_por %_F %_Tprima
              | ;

    %_F <= $_id
         | $_num
         | $_parA %_E $_parC;

:}}

? Wison



#----------------------------------
# Ejemplo Wison COMPLEJO (LL(1))
# con vacío estilo Jison
#----------------------------------

Wison ¿

Lex {:

    # Operadores
    Terminal $_MAS       <- '+' ;
    Terminal $_MENOS     <- '-' ;
    Terminal $_POR       <- '*' ;
    Terminal $_DIV       <- '/' ;

    # Símbolos
    Terminal $_P_AB      <- '(' ;
    Terminal $_P_CE      <- ')' ;
    Terminal $_IGUAL     <- '=' ;
    Terminal $_PYC       <- ';' ;

    # Palabras reservadas
    Terminal $_IF        <- 'if' ;
    Terminal $_WHILE     <- 'while' ;
    Terminal $_FIN       <- 'FIN' ;

    # Datos
    Terminal $_LETRA     <- [aA-zZ] ;
    Terminal $_NUM       <- [0-9]+ ;

:}

Syntax {{:

    #-----------------------------
    # No terminales
    #-----------------------------
    No_Terminal %_S;
    No_Terminal %_LISTA;
    No_Terminal %_LISTA_PRIMA;
    No_Terminal %_SENT;
    No_Terminal %_BLOQUE;
    No_Terminal %_EXPR;
    No_Terminal %_EXPR_PRIMA;
    No_Terminal %_TERM;
    No_Terminal %_TERM_PRIMA;
    No_Terminal %_FACTOR;

    #-----------------------------
    # Símbolo inicial
    #-----------------------------
    Initial_Sim %_S;

    #-----------------------------
    # Producciones
    #-----------------------------

    %_S <= %_LISTA $_FIN ;

    # Lista de sentencias
    %_LISTA <= %_SENT %_LISTA_PRIMA ;
    %_LISTA_PRIMA <= %_SENT %_LISTA_PRIMA | ;

    # Sentencias
    %_SENT <= $_LETRA $_IGUAL %_EXPR $_PYC
            | $_IF $_P_AB %_EXPR $_P_CE %_SENT
            | $_WHILE $_P_AB %_EXPR $_P_CE %_SENT
            | %_BLOQUE ;

    # Bloque separado (evita recursión problemática)
    %_BLOQUE <= $_P_AB %_LISTA $_P_CE ;

    # Expresiones
    %_EXPR <= %_TERM %_EXPR_PRIMA ;
    %_EXPR_PRIMA <= $_MAS %_TERM %_EXPR_PRIMA
                  | $_MENOS %_TERM %_EXPR_PRIMA
                  | ;

    %_TERM <= %_FACTOR %_TERM_PRIMA ;
    %_TERM_PRIMA <= $_POR %_FACTOR %_TERM_PRIMA
                  | $_DIV %_FACTOR %_TERM_PRIMA
                  | ;

    %_FACTOR <= $_P_AB %_EXPR $_P_CE
              | $_NUM
              | $_LETRA ;

:}}

?Wison
