import express from "express";
import cors from "cors";
import grammarRoutes from "./routes/analizador.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/gramatica", grammarRoutes);
app.use(errorHandler);

export default app;