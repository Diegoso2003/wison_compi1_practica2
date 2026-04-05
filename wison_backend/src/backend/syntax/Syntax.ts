import { Creador } from "../CreadorGramatica/Creador";
import { Inicial } from "./Inicial";
import { Produccion } from "./Produccion";

export class Syntax{
    private inicial: Inicial
    private producciones: Produccion[]

    constructor(inicial: Inicial, producciones: Produccion[]){
        this.inicial = inicial
        this.producciones = producciones
    }

    validarGramatica(creador: Creador): void{
        this.validarNoterminales(creador)
        this.validarSimboloInicial(creador)
        this.validarProducciones(creador)
        
    }

    private validarProducciones(creador: Creador): void{
        
    }

    private validarNoterminales(creador: Creador): void{
        
    }

    private validarSimboloInicial(creador:Creador): void{
        
    }
}