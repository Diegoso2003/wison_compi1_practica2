import { conexionDB } from "./conexionDB";
import { ModeloGramatica } from "./ModeloGramatica";

export class GramaticaDAO{
    async crear(nuevo: ModeloGramatica): Promise<number>{
        const [result]: any = await conexionDB.query(
            "INSERT INTO Gramatica (nombre, gramatica) VALUES (?,?)",
            []
        )
        //data.nombre, JSON.stringif(data.gramatica)
        return result.insertId;
    }

    async obtenerTodas(): Promise<ModeloGramatica[]> {
        const [rows]: any = await conexionDB.query("SELECT nombre, id FROM Gramatica");
        return rows.map((row: any) => ({
            ...row,
            //gramatica: JSON.parse(row.gramatica)
        }))
    }

    async obtenerPorId(id: number): Promise<ModeloGramatica | null>{
        const [rows]: any = await conexionDB.query(
            "SELECT * FROM Gramatica WHERE id = ?",
            [id]
        )
        if(rows.length === 0) return null;

        return{
            ...rows[0],
            //gramatica: JSON.parse(rows[0].gramatica)
        }
    }
}