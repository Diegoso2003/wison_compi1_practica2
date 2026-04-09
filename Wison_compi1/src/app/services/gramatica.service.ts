import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Nuevo } from '../model/Nuevo';
import { Observable } from 'rxjs';
import { Resultado } from '../model/Resultado';
import { GramaticaDatos } from '../model/GramaticaDatos';
import { EntradaAnalisis } from '../model/EntradaAnalisis';
import { Arbol } from '../model/Arbol';

@Injectable({
  providedIn: 'root'
})
export class GramaticaService {

  private _http = inject(HttpClient);
  private url = 'http://localhost:3000/api/gramatica'

  crearNuevo(nuevo: Nuevo): Observable<Resultado>{
    return this._http.post<Resultado>(`${this.url}/analizar`, nuevo);
  }

  obtenerTodas(): Observable<GramaticaDatos[]>{
    return this._http.get<GramaticaDatos[]>(`${this.url}/listado`);
  }

  obtenerArbol(entrada: EntradaAnalisis): Observable<Arbol>{
    return this._http.post<Arbol>(`${this.url}/arbol`, entrada);
  }

  constructor() { }
}
