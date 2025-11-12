import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListeEtudiantsComponent } from './liste-etudiants/liste-etudiants.component';
import { DetailsEtudiantComponent } from './details-etudiant/details-etudiant.component';
import { HttpClientModule } from '@angular/common/http';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ListeEtudiantsComponent,AddstudentComponent ,HttpClientModule, FormsModule,RouterModule , ReactiveFormsModule,DetailsEtudiantComponent,LogsComponent],

})
export class EtudiantModule {}
