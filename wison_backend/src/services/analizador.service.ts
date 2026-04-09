import { CreadorArbol } from "../backend/AnalisisGramatica/CreadorArbol";
import { Analizador } from "../backend/Analizador";
import { GramaticaDAO } from "../backend/DB/GramaticaDAO";
import { GramaticaDatos } from "../model/GramaticaDatos";

const analizador = new Analizador()

export const analizar = async (data: any) => {
  return await analizador.analizar(data)
}

export const obtenerTodasGramaticas = async (): Promise<GramaticaDatos[]> => {
  let repositorio = new GramaticaDAO()
  return await repositorio.obtenerTodas();
};

export const construirArbol = async(entrada: any) => {
  let constructor = new CreadorArbol()
  return constructor.analizarEntrada(entrada)
}