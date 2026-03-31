import { Router } from "express";
import { getUsers, createUser } from "../controller/analizador.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;