import { AfterViewInit, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { InformacionService } from '../../../services/informacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-informe-error',
  standalone: true,
  imports: [],
  templateUrl: './informe-error.component.html',
  styleUrl: './informe-error.component.scss'
})
export class InformeErrorComponent implements AfterViewInit{
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
    this.informacion.ocultarError();
  }
}
