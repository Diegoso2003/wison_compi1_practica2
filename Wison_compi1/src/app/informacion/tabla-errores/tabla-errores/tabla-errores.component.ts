import { Component, inject, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { InformacionService } from '../../../services/informacion.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tabla-errores',
  standalone: true,
  imports: [],
  templateUrl: './tabla-errores.component.html',
  styleUrl: './tabla-errores.component.scss'
})
export class TablaErroresComponent implements OnDestroy {
  @ViewChild('modalError2') set modalError(template: TemplateRef<any>) {
    if (template && !this.modalRef) {
      setTimeout(() => this.abrirModal(template), 0);
    }
  }

  informacion = inject(InformacionService);
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  abrirModal(template: TemplateRef<any>) {
    if (this.modalRef) return;
    
    this.modalRef = this.modalService.open(template, { 
      backdrop: 'static',
      centered: true,
      size: 'xl', // 👈 Tamaño extra grande
      windowClass: 'custom-modal-window', // 👈 Clase personalizada
      modalDialogClass: 'custom-modal-dialog' // 👈 Clase para el diálogo
    });

    this.modalRef.result.finally(() => {
      this.modalRef = undefined;
    });
  }

  cerrar() {
    this.modalRef?.close();
    this.informacion.ocultarErrores();
  }

  ngOnDestroy(): void {
    this.modalRef?.dismiss();
  }
}