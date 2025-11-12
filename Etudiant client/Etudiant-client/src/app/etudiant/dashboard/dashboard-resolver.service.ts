import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { EtudiantService } from '../etudiant.service';
import { UserService } from '../Gestion-user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<any> {
  constructor(
    private etudiantService: EtudiantService,
    private userService: UserService
  ) {}

  resolve(): Observable<any> {
    // forkJoin permet de récupérer plusieurs observables en parallèle
    return forkJoin({
      etudiants: this.etudiantService.getEtudiants2(),
      users: this.userService.getUsers()
    });
  }
}
