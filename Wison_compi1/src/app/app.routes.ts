import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'wison',
        title: 'Editor',
        loadComponent: () => import('./componentes/editor-analizador/editor-analizador.component').then(m => m.EditorAnalizadorComponent)
    },
    {
        path: 'listado',
        title: 'Gramaticas creadas',
        loadComponent: () => import('./componentes/listado-gramaticas/listado-gramaticas.component').then(m => m.ListadoGramaticasComponent)
    },
    {
        path: '',
        redirectTo: 'wison',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'wison'
    }
];
