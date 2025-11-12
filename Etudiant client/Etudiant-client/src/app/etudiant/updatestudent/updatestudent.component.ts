import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../etudiant.service';
import { Etudiant } from '../Etudiant';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-etudiant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './updatestudent.component.html',
  styleUrls: ['./updatetudiant.component.scss']
})
export class UpdateEtudiantComponent implements OnInit {
  etudiant: Etudiant = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    photo: '',       
    matiere: [],
    createdAt: new Date() 
  };

  matieres: string[] = ['Math', 'Physique', 'Informatique', 'Chimie'];

  constructor(
    private etudiantService: EtudiantService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.etudiantService.getEtudiantById(id).subscribe({
      next: (data) => this.etudiant = data,
      error: (err) => console.error(err)
    });
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.etudiant.matiere.push(value);
    } else {
      const index = this.etudiant.matiere.indexOf(value);
      if (index > -1) {
        this.etudiant.matiere.splice(index, 1);
      }
    }
  }

  onSubmit() {
    this.etudiantService.updateEtudiant(this.etudiant.id, this.etudiant).subscribe({
      next: () => this.router.navigate(['/etudiants']),
      error: (err) => console.error(err)
    });
  }

  goBack() {
    this.router.navigate(['/etudiants']);
  }
}
