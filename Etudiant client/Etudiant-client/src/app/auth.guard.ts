
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Vérifie si on est côté navigateur
    if (typeof window !== 'undefined' && window.localStorage) {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Si pas de localStorage, rediriger vers login par sécurité
      this.router.navigate(['/login']);
      return false;
    }
  }
}
