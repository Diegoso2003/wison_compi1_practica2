import { Entrada } from "../model/Entrada";
import { Creador } from "./CreadorGramatica/Creador";
import { GramaticaDAO } from "./DB/GramaticaDAO";
import { ErrorM } from "./ErrorM";
import { MensajeError } from "./MensajeError";

const gramaticaDao: GramaticaDAO = new GramaticaDAO()

export class Analizador {

    async analizar(input: Entrada): Promise<any> {
        
        const erroM = ErrorM.getInstance()
        try {
            let parser = require('../analizador/wison.js');
            erroM.clear()
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
            if (resultado && resultado.constructor.name === "Creador"){
                resultado.analizar(erroM.getErrores())
                if(!erroM.hasErrors()){
                    await gramaticaDao.crear(resultado.crearModeloGramatica(), input.nombre)
                }
            }
            if (erroM.hasErrors()) {
                return {
                    ok: false,
                    errores: erroM.getErrores()
                };
            }
            return {
                ok: true
            };
        } catch (error: any) {
            console.log(error)
            const erroresParser:MensajeError[] = erroM.getErrores()
            
            return {
                ok: false,
                errores: [
                    ...erroresParser,
                    {
                        lexema: "",
                        linea: 0,
                        columna: 0,
                        descripcion: error.message || "Error inesperado durante el análisis",
                        tipo: "Fatal"
                    }
                ]
            };
        }
    }

}