import { MensajeError } from "./MensajeError";
import { TablaSimbolos } from "./TablaSimbolos";

const parser = require('../analizador/wison.js');

export class Analizador {
    
    private errores: MensajeError[] = []
    private tabla: TablaSimbolos = new TablaSimbolos()

    analizar(input: string): any {
        try {
            parser.yy = {
                errores: this.errores,
                tabla: this.tabla
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

    public getTabla(): TablaSimbolos{
        return this.tabla
    }

    public getErrores(): MensajeError[]{
        return this.errores
    }

}