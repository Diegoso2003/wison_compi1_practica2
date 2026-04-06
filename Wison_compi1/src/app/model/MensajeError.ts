export interface MensajeError{
    tipo: string,
    linea: number,
    columna: number,
    lexema: string,
    descripcion: string
}