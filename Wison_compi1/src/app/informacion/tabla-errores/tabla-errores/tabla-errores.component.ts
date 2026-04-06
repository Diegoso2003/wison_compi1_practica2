import { AfterViewInit, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { InformacionService } from '../../../services/informacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tabla-errores',
  standalone: true,
  imports: [],
  templateUrl: './tabla-errores.component.html',
  styleUrl: './tabla-errores.component.scss'
})
export class TablaErroresComponent implements AfterViewInit{
  @ViewChild('modalError') modalError!: TemplateRef<any>;

  informacion = inject(InformacionService);
  constructor(private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.abrirModal();
    });
  }

  abrirModal() {
    this.modalService.open(this.modalError, { 
      backdrop: 'static'
    });
  }

  cerrar(){
    this.modalService.dismissAll();
    this.informacion.ocultarErrores();
  }
}
