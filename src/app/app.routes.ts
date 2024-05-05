import { Routes } from '@angular/router';
import { tokenGuard } from './core/guards/token.guard';
import { authCodeGuard } from './core/guards/auth-code.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Inicio',
    loadComponent: () => import('./Views/home/home.component'),
  },
  {
    path: 'signUp',
    title: 'Registrarse',
    loadComponent: () => import('./Views/sign-up/sign-up.component'),
  },
  {
    path: 'login',
    title: 'Inicio de sesión',
    loadComponent: () => import('./Views/login/login.component'),
  },
  {
    path: 'game',
    title: 'game',
    loadComponent: () => import('./Views/game-board/game-board.component'),
    canActivate: [tokenGuard]
  },
  {
    path: 'waitingPlayers',
    title: 'Esperando al segundo jugador...',
    loadComponent: () => import('./Views/search-players/search-players.component'),
    canActivate: [tokenGuard]
  },
  {
    path: 'auth-code',
    title: 'Código de verificación',
    loadComponent: () => import('./Views/auth-code/auth-code.component'),
    canActivate: [authCodeGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    title: 'OOPS... algo salio mal',
    loadComponent: () =>
      import('./Views/page-not-found/page-not-found.component'),
  },
];
