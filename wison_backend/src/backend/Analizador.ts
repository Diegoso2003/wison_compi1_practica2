import { MensajeError } from "./MensajeError";

const parser = require('../analizador/wison.js');

export class Analizador {
    
    private errores: MensajeError[] = []

    analizar(input: string): any {
        try {
            parser.yy = {
                errores: this.errores
            };

            if(input.length === 0){
                return {
                    ok: false,
                    errores: [{
                        lexema: "",
                        linea: 0,
                        columna: 0,
                        descripcion: "introducir texto valido.",
                        tipo: "Fatal"
                    }]
                };
            }

            const resultado = parser.parse(input);
            if (parser.yy.errores.length > 0) {
                return {
                    ok: false,
                    errores: parser.yy.errores
                };
            }
            return {
                ok: true,
                resultado
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