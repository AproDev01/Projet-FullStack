import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../etudiant/Etudiant'; // ton interface

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = 'http://localhost:3000/auth/login';
  private etudiantsUrl = 'http://localhost:3000/etudiants';
  private registerUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) {}


  login(userData: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, userData);
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }
  getEtudiants(): Observable<Etudiant[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Etudiant[]>(this.etudiantsUrl, { headers }); 
  }
}
