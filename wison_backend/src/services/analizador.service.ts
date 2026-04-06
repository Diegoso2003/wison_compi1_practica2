import { Analizador } from "../backend/Analizador";

const analizador = new Analizador()

export const analizar = async (data: any) => {
  return await analizador.analizar(data)
}