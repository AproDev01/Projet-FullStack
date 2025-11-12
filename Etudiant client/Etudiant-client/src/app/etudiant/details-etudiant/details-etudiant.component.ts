import { Component } from '@angular/core';
import { Etudiant } from '../Etudiant';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../etudiant.service';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-details-etudiant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-etudiant.component.html',
  styleUrl: './details-etudiant.component.scss',
})
export class DetailsEtudiantComponent {
  etudiant: Etudiant = {} as Etudiant;
  etudiantId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etudiantService: EtudiantService,
    private socketserver: SocketService
  ) {
    this.etudiantId = Number(this.route.snapshot.paramMap.get('id'));
  }
  updateEtudiant(id: number) {
    console.log('Naviguer vers update avec id =', id);
    this.router.navigate(['/etudiants/update', id]);
  }
  goBack() {
    this.router.navigate(['/etudiants']);
  }

  delete() {
    this.etudiantService.deleteEtudiant(this.etudiantId);
    this.goBack();
  }

  ngOnInit(): void {
    this.etudiantService.getEtudiantById(this.etudiantId).subscribe({
      next: (etud) => {
        this.etudiant = etud;
        console.log('Étudiant chargé :', this.etudiant);
      },
      error: (err) => console.error(err),
    });
    // Écouter l'événement de suppression via Socket.IO
    this.socketserver.onlisten('etudiantDeleted').subscribe((data) => {
      console.log('Étudiant supprimé (Socket) :', data);
      // Si l'étudiant affiché est celui supprimé, on retourne à la liste
      if (data.id === this.etudiantId) {
        alert('Cet étudiant a été supprimé !');
        this.goBack();
      }
    });
  }
}
