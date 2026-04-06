import { Request, Response, NextFunction } from "express";
import * as analizadorService from "../services/analizador.service";

export const analizar = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const resultado = await analizadorService.analizar(req.body);
    res.json(resultado)
  } catch (error: any) {
    res.status(error.status || 500).json({
      ok: false,
      message: error.message || "Error interno"
    })
  }
}