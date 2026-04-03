import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'wison',
        title: 'Nuevo',
        loadComponent: () => import('./componentes/nombre-form/nombre-form.component').then(m => m.NombreFormComponent)
    },
    {
        path: 'editor',
        title: 'Editor',
        loadComponent: () => import('./componentes/editor-analizador/editor-analizador.component').then(m => m.EditorAnalizadorComponent)
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
