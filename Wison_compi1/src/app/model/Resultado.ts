import { MensajeError } from "./MensajeError";

export interface Resultado{
    ok: boolean,
    errores: MensajeError[]
}