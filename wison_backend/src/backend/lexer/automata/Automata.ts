import { Estado } from "../estados/Estado";

export class Automata{
    private estados: Estado[] = []

    constructor(estados: Estado[] = []){
        this.estados = estados
    }

    public getEstados(): Estado[]{
        return this.estados
    }

    public setEstados(estados: Estado[]): void{
        this.estados = estados
    }
}