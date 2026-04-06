import { TablaProduccion } from "./TablaProduccion";

export interface NoTerminalModel{
    nombre: string,
    tabla: TablaProduccion[],
    segundos: string[]
}