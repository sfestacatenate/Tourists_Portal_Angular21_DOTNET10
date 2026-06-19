import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Clienti } from './pages/clienti/clienti';
import { Destinazioni } from './pages/destinazioni/destinazioni';
import { Pacchetti } from './pages/pacchetti/pacchetti';
import { Guide } from './pages/guide/guide';
import { Profilo } from './pages/profilo/profilo';
import { LoginComponent } from './pages/login/login';
import { MainLayout } from './main-layout/main-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Homepage
      },
      {
        path: 'clienti',
        component: Clienti
      },
      {
        path: 'destinazioni',
        component: Destinazioni
      },
      {
        path: 'pacchetti',
        component: Pacchetti
      },
      {
        path: 'guide',
        component: Guide
      },
      {
        path: 'profilo',
        component: Profilo
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'clienti'
  }
];
