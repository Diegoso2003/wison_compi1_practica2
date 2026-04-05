import { Creador } from "../CreadorGramatica/Creador";
import { Simbolo } from "./Simbolo";

export class ListaSimbolos{
    private lista: Simbolo[] = []
    private listas: Simbolo[][] = [this.lista]

    public agregarSimbolo(creador: Creador, simbolo: Simbolo): void{
        this.lista.push(simbolo)
        if(simbolo.getError()) return
        if(simbolo.getTerminal()){
            if(simbolo.getNombre() !== "" && !creador.getTabla().existeEnTabla(simbolo.getNombre())){
                creador.getErrores().push({
                    tipo: "Semantico",
                    linea: simbolo.getLinea(),
                    columna: simbolo.getColumna(),
                    lexema: simbolo.getNombre(),
                    descripcion: "El terminal no ha sido declarado."
                })
                simbolo.setError(true)
                return
            }
            return
        }
        if(!creador.getTablaNoTerminales().has(simbolo.getNombre())){
            creador.getErrores().push({
                    tipo: "Semantico",
                    linea: simbolo.getLinea(),
                    columna: simbolo.getColumna(),
                    lexema: simbolo.getNombre(),
                    descripcion: "El terminal no ha sido declarado."
            })
            simbolo.setError(true)
            return
        }
        simbolo.setNoTerminal(creador.getTablaNoTerminales().get(simbolo.getNombre()))
    }

    comenzarNuevaLista(){
        this.lista = []
        this.listas.push(this.lista)
    }
}