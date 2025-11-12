import { Component, OnInit } from '@angular/core';
import { LoginService } from '../GestionLogin/login.service';
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: 'app-etudiants',
  standalone: true,
  template: `
    <div class="etudiants-container">
      <h2>Liste des étudiants</h2>
      <ul>
        <li *ngFor="let etudiant of etudiants">
          {{ etudiant.nom }} {{ etudiant.prenom }} - {{ etudiant.email }}
        </li>
      </ul>
    </div>
  `,
  imports: [BrowserModule],
})
export class EtudiantComponent implements OnInit {
  etudiants: any[] = [];

  constructor(private loginService: LoginService) {}

  ngOnInit() {
  this.loginService.getEtudiants().subscribe({
    next: (data: any[]) => this.etudiants = data, 
    error: (err) => console.error('Erreur récupération étudiants :', err)
  });
}
}
