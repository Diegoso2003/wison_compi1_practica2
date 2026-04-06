import { Entrada } from "../model/Entrada";
import { Creador } from "./CreadorGramatica/Creador";
import { MensajeError } from "./MensajeError";

const parser = require('../analizador/wison.js');

export class Analizador {
    
    private errores: MensajeError[] = []

    analizar(input: Entrada): any {
        try {
            parser.yy = {
                errores: this.errores
            };

            if(input.analizador.length === 0 || input.nombre.length === 0){
                return {
                    ok: false,
                    errores: [{
                        lexema: "",
                        linea: 0,
                        columna: 0,
                        descripcion: "introducir informacion valida.",
                        tipo: "Fatal"
                    }]
                };
            }

            const resultado = parser.parse(input.analizador);
            if(resultado instanceof Creador){
                resultado.analizar(this.errores)
                // pedir que lo guarde
            }
            if (parser.yy.errores.length > 0) {
                return {
                    ok: false,
                    errores: parser.yy.errores
                };
            }
            return {
                ok: true
            };
        } catch (error: any) {
            return {
                ok: false,
                errores: [...(parser.yy?.errores || []),
                {
                    lexema: "",
                    linea: 0,
                    columna: 0,
                    descripcion: error.message || "Error inesperado",
                    tipo: "Fatal"
                }]
            };
        }
    }

    public getErrores(): MensajeError[]{
        return this.errores
    }

}