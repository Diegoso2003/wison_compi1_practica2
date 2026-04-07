CREATE DATABASE Wison;

USE Wison;

CREATE TABLE Gramatica(
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
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
