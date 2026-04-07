import { MensajeError } from "./MensajeError";

export class ErrorM {
    private static instance: ErrorM;
    private errores: MensajeError[] = [];

    private constructor() {}

    public static getInstance(): ErrorM {
        if (!ErrorM.instance) {
            ErrorM.instance = new ErrorM();
        }
        return ErrorM.instance;
    }

    public agregarError(error: MensajeError): void {
        this.errores.push(error);
    }

    public getErrores(): MensajeError[] {
        return this.errores
    }

    public clear(): void {
        this.errores = [];
    }

    public hasErrors(): boolean {
        return this.errores.length > 0;
    }

    public getErrorCount(): number {
        return this.errores.length;
    }

    public printErrors(): void {
        console.log(`Total errores: ${this.errores.length}`);
        this.errores.forEach((error, index) => {
            console.log(`Error ${index + 1}:`, error);
        });
    }
}