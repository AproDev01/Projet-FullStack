import { Component } from '@angular/core';
import { AuthService } from '../Auth.Service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  role = 'user'; // valeur par défaut

  constructor(private authService: AuthService, private router: Router) {}
  
   goToLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log('✅ Inscription réussie', res);
        // Rediriger vers login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Erreur d\'inscription', err);
        alert(err.error?.message || 'Erreur lors de l\'inscription');
      }
    });
  }
}
