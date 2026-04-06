import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { InformacionService } from '../../../services/informacion.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informe-exito',
  standalone: true,
  imports: [NgbToastModule, CommonModule],
  templateUrl: './informe-exito.component.html',
  styleUrl: './informe-exito.component.scss'
})
export class InformeExitoComponent implements AfterViewInit, OnDestroy{
  mostrar:boolean = true;
  autohide = true;
  delay = 5000;

  informacion = inject(InformacionService);

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mostrarToast();
    });
  }

  ngOnDestroy(): void {
    this.ocultarToast();
  }

  mostrarToast() {
    this.mostrar = true;
  }

  ocultarToast() {
    this.mostrar = false;
    this.informacion.ocultarExito();
  }
}
