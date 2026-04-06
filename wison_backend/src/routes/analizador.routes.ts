import { Router } from "express";
import { analizar } from "../controller/analizador.controller";

const router = Router();

router.post("/analizar", analizar);

export default router;