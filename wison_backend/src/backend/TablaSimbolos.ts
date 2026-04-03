export class TablaSimbolos {
    private tablaSimbolos = new Map<string, string>()

    public existeEnTabla(nombre: string): boolean{
        return this.tablaSimbolos.get(nombre) !== undefined
    }

    public agregarALaTabla(nombre: string, expresion: string): void{
        this.tablaSimbolos.set(nombre, expresion)
    }

    public conseguirExpresion(nombre: string): string{
        return this.tablaSimbolos.get(nombre)!
    }
}