import { Component } from '@angular/core';
import { Etudiant } from '../Etudiant';
import { EtudiantService } from '../etudiant.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addstudent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.scss'],
})
export class AddstudentComponent {  
 // etudiant: Etudiant = {} as Etudiant;
 etudiant: Etudiant = {
  id: 0,
  nom: '',
  prenom: '',
  email: '',
  photo: '',
  matiere: [],       
  createdAt: new Date(),
};
  selectedFile: File | null = null;
  id: number = 0;
  
  matieres = ['Mathématiques', 'Informatique', 'Physique', 'Chimie'];
  constructor(
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['/etudiants']);
  }
  onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
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
  onSubmit(){
    //this.etudiant.matiere = this.etudiant.matiere?.toString().split(',') || [];
    /*
    this.etudiantService.getEtudiants().subscribe((etudiants) => {
      this.id = etudiants.length + 1;
      this.etudiant.id = this.id;

      console.log('**************', this.etudiant);

      this.etudiantService.addEtudiant(this.etudiant).subscribe({
        next: (resp) => {
          console.log('Étudiant ajouté:', resp);
          this.router.navigate(['/etudiants']);
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout de l'étudiant:", error);
        },
      });
    });*/
   
  const formData = new FormData();
  formData.append('id', this.etudiant.id.toString());
  formData.append('nom', this.etudiant.nom);
  formData.append('prenom', this.etudiant.prenom);
  formData.append('email', this.etudiant.email);
  formData.append('matiere', JSON.stringify(this.etudiant.matiere));
  formData.append('createdAt', this.etudiant.createdAt.toISOString());

  if (this.selectedFile) {
    formData.append('file', this.selectedFile, this.selectedFile.name);
  }

  this.etudiantService.addEtudiantWithPhoto(formData).subscribe({
    next: (resp) => {
      console.log('Étudiant ajouté avec photo:', resp);
      this.router.navigate(['/etudiants']);
    },
    error: (err) => console.error(err),
  });
}
}
