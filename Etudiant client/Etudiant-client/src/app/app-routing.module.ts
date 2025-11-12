import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeEtudiantsComponent } from './etudiant/liste-etudiants/liste-etudiants.component';
import { DetailsEtudiantComponent } from './etudiant/details-etudiant/details-etudiant.component';
import { AddstudentComponent } from './etudiant/addstudent/addstudent.component';
import { LoginComponent } from './GestionLogin/Login/login.component';
import { UpdateEtudiantComponent } from './etudiant/updatestudent/updatestudent.component';
import { RegisterComponent } from './GestionRegister/register/register.component';
import { DashboardComponent } from './etudiant/dashboard/dashboard.component';
import { AccueilComponent } from './etudiant/accueil/accueil.component';
import { AuthGuard } from './auth.guard';
import { resolve } from 'path';
import { DashboardResolver } from './etudiant/dashboard/dashboard-resolver.service';
import { LogsComponent } from './etudiant/logs/logs.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'accueil', component: AccueilComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
          data: DashboardResolver,
        },
      },
      { path: 'etudiants', component: ListeEtudiantsComponent },
      { path: 'etudiants/ajouter', component: AddstudentComponent },
      { path: 'etudiant/:id', component: DetailsEtudiantComponent },
      { path: 'ajouter', component: AddstudentComponent },
      { path: 'etudiants/update/:id', component: UpdateEtudiantComponent },
      { path: 'logs', component: LogsComponent },
      { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
