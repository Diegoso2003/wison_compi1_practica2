import { Component, inject } from '@angular/core';
import { InformacionService } from '../../services/informacion.service';
import { InformeErrorComponent } from '../informe-error/informe-error/informe-error.component';
import { InformeExitoComponent } from '../informe-exito/informe-exito/informe-exito.component';
import { TablaErroresComponent } from '../tabla-errores/tabla-errores/tabla-errores.component';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [InformeErrorComponent, InformeExitoComponent, TablaErroresComponent],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
  informacion = inject(InformacionService);
}
