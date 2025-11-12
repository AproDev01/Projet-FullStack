import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls:['./accueil.component.scss'],
  imports: [NavbarComponent,RouterModule]
})
export class AccueilComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
