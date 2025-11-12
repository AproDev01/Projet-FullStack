import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { EtudiantService } from '../etudiant.service';
import { Etudiant } from '../Etudiant';
import { UserService } from '../Gestion-user/user.service';
import { User } from '../Gestion-user/User';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalEtudiants: number = 0;
  totalUsers: number = 0; // exemple, tu peux créer un service user
  totalCours: number = 0; // exemple, tu peux créer un service cours
  alerts: { message: string; type: string; time: string }[] = []; // tableau d’alertes

  constructor(
    private etudiantService: EtudiantService,
    private userService: UserService,
    private socketservice: SocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les données préchargées par le resolver
    const data = this.route.snapshot.data['data'];
    this.totalEtudiants = data.etudiants.total;
    this.totalUsers = data.users.length;
    // Charger les étudiants une seule fois
    this.coutEtudiant();
    // Récupérer le total des utilisateurs
    this.coutUser();
    this.socketservice.onlisten('etudiantDeleted').subscribe((event) => {
      this.coutEtudiant();
      this.addAlert(
        `Étudiant supprimé : ${this.getNomComplet(event)}`,
        'danger'
      );
    });
    this.socketservice.onlisten('etudiantAdded').subscribe((event) => {
      this.coutEtudiant();
      this.addAlert(
        `Nouvel étudiant ajouté : ${this.getNomComplet(event)}`,
        'success'
      );
    });
    this.socketservice.onlisten('etudiantUpdated').subscribe((event) => {
      this.coutEtudiant();
      this.addAlert(`Etudiant modefier : ${this.getNomComplet(event)}`, 'info');
    });
    this.socketservice.onlisten('NewUser').subscribe((event) => {
      this.coutEtudiant();
      this.addAlert(
        `Nouvel utilisateur inscrit : ${this.getNomComplet(event)}`,
        'info'
      );
    });
  }
  coutEtudiant(): void {
    this.etudiantService.getEtudiants2().subscribe((res) => {
      this.totalEtudiants = res.total;
    });
  }
  coutUser(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      console.log('Utilisateurs reçus:', users);
      this.totalUsers = users.length;
    });
  }

   goToLogs() {
    this.router.navigate(['/logs']);
  }

  addAlert(message: string, type: string): void {
    const time = new Date().toLocaleTimeString();
    this.alerts.unshift({ message, type, time });
    console.log('Nouvelle alerte :', alert); // ajoute en haut du tableau
    // Supprime automatiquement après 10 secondes
    /*setTimeout(() => {
      this.alerts.pop();
    }, 10000);*/
  }
  getNomComplet(event: any): string {
    if (event?.nom && event?.prenom) {
      return `${event.nom} ${event.prenom}`;
    } else if (event?.nom) {
      return event.nom;
    } else if (event?.prenom) {
      return event.prenom;
    } else {
      return 'Nom inconnu';
    }
  }
}
