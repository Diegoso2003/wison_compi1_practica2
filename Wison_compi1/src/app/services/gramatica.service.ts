import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Nuevo } from '../model/Nuevo';
import { Observable } from 'rxjs';
import { Resultado } from '../model/Resultado';

@Injectable({
  providedIn: 'root'
})
export class GramaticaService {

  private _http = inject(HttpClient);
  private url = 'http://localhost:3000/api/gramatica'

  crearNuevo(nuevo: Nuevo): Observable<Resultado>{
    return this._http.post<Resultado>(`${this.url}/analizar`, nuevo);
  }
  constructor() { }
}
