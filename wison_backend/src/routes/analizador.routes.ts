import { Router } from "express";
import { analizar } from "../controller/analizador.controller";
import { obtenerTodas } from "../controller/analizador.controller";
import { arbolGramatica } from "../controller/analizador.controller";

const router = Router();

router.post("/analizar", analizar);
router.get("/listado", obtenerTodas);
router.post("/arbol", arbolGramatica)

export default router;