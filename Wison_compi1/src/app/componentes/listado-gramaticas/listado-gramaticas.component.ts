import { Component, inject, OnInit } from '@angular/core';
import { GramaticaDatos } from '../../model/GramaticaDatos';
import { InformacionService } from '../../services/informacion.service';
import { GramaticaService } from '../../services/gramatica.service';
import { InformacionComponent } from "../../informacion/informacion/informacion.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado-gramaticas',
  standalone: true,
  imports: [InformacionComponent, CommonModule],
  templateUrl: './listado-gramaticas.component.html',
  styleUrl: './listado-gramaticas.component.scss'
})
export class ListadoGramaticasComponent implements OnInit{
  gramaticas: GramaticaDatos[] = []
  private _informacion = inject(InformacionService)
  private _gramaticaService = inject(GramaticaService)

  ngOnInit(): void {
      this._gramaticaService.obtenerTodas().subscribe({
        next: (lista: GramaticaDatos[]) => {
          console.log(lista)
          this.gramaticas = lista;
        },
        error: (err: any) => {
          this._informacion.informarError('Error al recuperar los analizadores intentar más tarde.')
        }
      })
  }

  usarAnalizador(gramatica: GramaticaDatos): void{

  }
}
