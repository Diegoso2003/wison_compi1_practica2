import { conexionDB } from "./conexionDB";
import { ModeloGramatica } from "../../model/ModeloGramatica";
import { GramaticaDatos } from "../../model/GramaticaDatos";

export class GramaticaDAO{
    async crear(nuevo: ModeloGramatica, nombre: string): Promise<number>{
        const [result]: any = await conexionDB.query(
            "INSERT INTO Gramatica (nombre, gramatica) VALUES (?,?)",
            [nombre, JSON.stringify(nuevo)]
        )
        return result.insertId;
    }

    async obtenerTodas(): Promise<GramaticaDatos[]> {
        const [rows]: any = await conexionDB.query("SELECT nombre, id, fecha_creacion FROM Gramatica");
        return rows
    }

    async obtenerPorId(id: number): Promise<ModeloGramatica | null>{
        const [rows]: any = await conexionDB.query(
            "SELECT gramatica FROM Gramatica WHERE id = ?",
            [id]
        )
        if(rows.length === 0) return null;
        return rows[0].gramatica
    }
}