import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,      
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    const userData = { email: this.email, password: this.password };
    this.loginService.login(userData).subscribe({
      next: (response) => {
        console.log('✅ Token reçu :', response.token);
        // Stocker le token
        localStorage.setItem('token', response.token);
        localStorage.setItem('isLoggedIn', 'true');//nécessaire pour AuthGuard
        // Rediriger vers une autre page
        this.router.navigate(['/accueil']);
      },
      error: (err) => {
        console.error('❌ Erreur de connexion :', err);
      },
    });
  }
}
