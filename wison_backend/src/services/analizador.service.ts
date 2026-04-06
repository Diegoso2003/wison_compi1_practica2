import { Analizador } from "../backend/Analizador";

const analizador = new Analizador()

export const analizar = (data: any) => {
  return analizador.analizar(data)
}