import { Component } from '@angular/core';
import { EtudiantService } from '../etudiant.service';
import { Etudiant } from '../Etudiant';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-liste-etudiants',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './liste-etudiants.component.html',
  styleUrls: ['./liste-etudiants.component.scss'],
})
export class ListeEtudiantsComponent {
  listEtudiant: Etudiant[] = [];
  currentPage: number = 1;
  pageSize: number = 6; // nombre d'étudiants par page
  searchControl = new FormControl('');
  searchMatiereControl = new FormControl('');
  totalEtudiants: number = 0;

  constructor(
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // --------------------------
    // Recherche avec debounce
    // --------------------------
    // Ici, on combine recherche et pagination : à chaque changement de valeur du champ
    // de recherche, on revient à la page 1 et on recharge les étudiants filtrés.
    // Combine les deux recherches (nom + matière)
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.searchMatiereControl.valueChanges.pipe(startWith('')),
    ])
      .pipe(
        startWith(''), // initialise avec une chaîne vide
        debounceTime(500), // attend 500ms après la dernière frappe
        distinctUntilChanged() // ignore les mêmes valeurs successives
      )
      .subscribe(([name, matiere]) => {
        this.currentPage = 1;
        this.loadEtudiants(name || '', matiere || '');
      });
    // --------------------------
    // Chargement initial sans filtre
    // --------------------------
    this.loadEtudiants();
  }

  loadEtudiants(name: string = '', matiere: string = ''): void {
    // On passe toujours la valeur de searchControl.value pour filtrer côté serveur
    this.etudiantService
      .getEtudiants2(this.currentPage, this.pageSize, name, matiere)
      .subscribe((resp: any) => {
        // Si le serveur renvoie un objet avec .etudiants
        if (resp && resp.etudiants) {
          this.listEtudiant = resp.etudiants;
          this.totalEtudiants = resp.pages * this.pageSize; // calcul du total
        }
        // Sinon si le serveur renvoie un tableau
        else if (Array.isArray(resp)) {
          this.listEtudiant = resp;
          this.totalEtudiants = resp.length;
        }
        // Sinon aucun étudiant trouvé
        else {
          this.listEtudiant = [];
          this.totalEtudiants = 0;
        }
        // Si aucun étudiant ne correspond au double critère :
        // Applique les filtres séparément, pas uniquement quand les deux sont remplis
        this.listEtudiant = this.listEtudiant.filter((e) => {
          const nomStr = Array.isArray(e.nom) ? e.nom.join(' ') : e.nom;
          const matiereStr = Array.isArray(e.matiere)
            ? e.matiere.join(' ')
            : e.matiere;

          const matchNom = name
            ? nomStr.toLowerCase().includes(name.toLowerCase())
            : true;
          const matchMatiere = matiere
            ? matiereStr.toLowerCase().includes(matiere.toLowerCase())
            : true;

          return matchNom && matchMatiere;
        });

        console.log('Étudiants reçus:', this.listEtudiant);
        console.log('Total:', this.totalEtudiants);
      });
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/etudiant', id]);
  }

  goToAddStudent() {
    this.router.navigate(['/etudiants/ajouter']);
  }

  // Pagination

  totalPages(): number {
    return Math.ceil(this.totalEtudiants / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadEtudiants(
        this.searchControl.value || '',
        this.searchMatiereControl.value || ''
      );
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEtudiants(
        this.searchControl.value || '',
        this.searchMatiereControl.value || ''
      );
    }
  }
}
