import { EntradaAnalisis } from "../../model/EntradaAnalisis";
import { ModeloGramatica } from "../../model/ModeloGramatica";
import { GramaticaDAO } from "../DB/GramaticaDAO";
import { ConstructorGramatica } from "./ConstructorGramatica";
import { Parser } from "./Parser";
const { instance } = require("@viz-js/viz");


export class CreadorArbol{

    async analizarEntrada(entrada: EntradaAnalisis): Promise<any>{
        if(!entrada.id || !entrada.entrada){
            throw new Error("ingresar correctamente los datos solicitados.")
        }
        let conexionDB = new GramaticaDAO()
        let gramatica: ModeloGramatica | null = await conexionDB.obtenerPorId(entrada.id)
        if(gramatica === null){
            throw new Error(`No se encontro ninguna gramatica con id: ${entrada.id}`)
        }
        let constructor = new ConstructorGramatica()
        let parser: Parser = constructor.construirGramatica(gramatica)
        parser.analizar(entrada.entrada)
        if(parser.getErrores().length > 0){
            return {
                errores: parser.getErrores(),
                svg: ""
            }
        }
        const viz = await instance();
        const svg = await viz.renderString(parser.getDot(),{ 
                format: 'svg',
                engine: 'dot'
            });
        return {
            errores: [],
            svg: svg
        }
    }
}