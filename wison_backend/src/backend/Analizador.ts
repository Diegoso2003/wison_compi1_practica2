import { Entrada } from "../model/Entrada";
import { Creador } from "./CreadorGramatica/Creador";
import { GramaticaDAO } from "./DB/GramaticaDAO";
import { MensajeError } from "./MensajeError";

const parser = require('../analizador/wison.js');
const gramaticaDao: GramaticaDAO = new GramaticaDAO()

export class Analizador {
    
    private errores: MensajeError[] = []

    async analizar(input: Entrada): Promise<any> {
        try {
            parser.yy = { errores: [] };

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
            console.log("iniciando...")
            console.log(input.analizador)
            const resultado = parser.parse(input.analizador);
            console.log("fin")
            this.errores = parser.yy.errores || [];
            if(resultado instanceof Creador){
                console.log("es valido")
                resultado.analizar(this.errores)
                if(this.errores.length === 0){
                    await gramaticaDao.crear(resultado.crearModeloGramatica(), input.nombre)
                }
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