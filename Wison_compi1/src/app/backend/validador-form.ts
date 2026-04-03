import { FormGroup } from "@angular/forms";

export class Validador{
    form : FormGroup;
      
    constructor(form: FormGroup) {
        this.form = form;
    }
      
    public hasErrors(field: string, typeError: string): boolean | undefined{
        return this.form.get(field)?.hasError(typeError) && this.form.get(field)?.touched;
    }
    
    public esValido(field: string): boolean | undefined{
        return this.form.get(field)?.valid && this.form.get(field)?.touched;
    }

    public tieneError(field: string): boolean | undefined {
        return this.form.get(field)?.invalid && this.form.get(field)?.touched;
    }

}