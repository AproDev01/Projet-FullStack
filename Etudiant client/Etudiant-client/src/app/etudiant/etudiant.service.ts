import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Etudiant } from './Etudiant';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  apiUrl: string = 'http://localhost:3000/etudiants';
  apiup: string = 'http://localhost:3000/api/upload';

  // Pour partager la liste d'étudiants dans toute l'application
  private etudiantsSubject = new BehaviorSubject<Etudiant[]>([]);
  etudiants$ = this.etudiantsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getToken(): string {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('token') || ''
      : '';
  }

  // Récupérer tous les étudiants (sans pagination)
  getEtudiants(): Observable<Etudiant[]> {
    const token = this.getToken();
    return this.http
      .get<Etudiant[]>(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((resp) => {
          console.table(resp);
          this.etudiantsSubject.next(resp);
        }) /* tap((resp: any) => {
          console.table(resp.etudiants);
          this.etudiantsSubject.next(resp.etudiants);
        }),*/,

        catchError((error) => {
          console.error('Erreur lors de la récupération des étudiants:', error);
          return of([]);
        })
      );
  }

  // Récupérer les étudiants avec pagination et filtre par nom
  getEtudiants2(
    page: number = 1,
    limit: number = 6,
    name: string = '',
    matiere: string = '',
    append: boolean = false
  ): Observable<{ etudiants: Etudiant[]; pages: number, total: number }> {
    const token = this.getToken();
    return this.http
      .get<{ etudiants: Etudiant[]; pages: number, total: number }>(
        `${this.apiUrl}?page=${page}&limit=${limit}&name=${name}&matiere=${matiere}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          observe: 'body',
        }
      )
      .pipe(
        /*tap((resp) => {
          console.table(resp.etudiants);
          this.etudiantsSubject.next(resp.etudiants);*/
        tap((resp) => {
          console.table(resp.etudiants);
          const current = this.etudiantsSubject.getValue();
          this.etudiantsSubject.next(
            append ? [...current, ...resp.etudiants] : resp.etudiants
          );
        }),
        catchError((error) => {
          console.error('Erreur lors de la récupération des étudiants:', error);
          return of({ etudiants: [], pages: 1, total: 0});
        })
      );
  }

  // Recherche simple par nom
  searchEtudiants(name: string): Observable<Etudiant[]> {
    const token = this.getToken();
    return this.http
      .get<Etudiant[]>(`${this.apiUrl}?name=${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((resp) => this.etudiantsSubject.next(resp)),
        catchError((err) => {
          console.error('Erreur lors de la recherche:', err);
          return of([]);
        })
      );
  }

  // CRUD
  addEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.apiUrl, etudiant).pipe(
      tap((resp) => {
        console.log('Étudiant ajouté:', resp);
        const current = this.etudiantsSubject.getValue();
        this.etudiantsSubject.next([...current, resp]);
      }),
      catchError((error) => {
        console.error("Erreur lors de l'ajout de l'étudiant:", error);
        return throwError(() => error);
      })
    );
  }
addEtudiantWithPhoto(formData: FormData): Observable<any> {
  const token = this.getToken();
  return this.http.post(`${this.apiup}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
  updateEtudiant(id: number, etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/${id}`, etudiant).pipe(
      tap((resp) => {
        const current = this.etudiantsSubject.getValue();
        const index = current.findIndex((e) => e.id === id);
        if (index !== -1) {
          current[index] = resp;
          this.etudiantsSubject.next([...current]);
        }
      }),
      catchError((err) => {
        console.error("Erreur lors de la mise à jour de l'étudiant:", err);
        return throwError(() => err);
      })
    );
  }

  getEtudiantById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/${id}`).pipe(
      tap((resp) => console.log(resp)),
      catchError((error) => {
        console.error("Erreur lors de la récupération de l'étudiant:", error);
        return throwError(() => error);
      })
    );
  }

  deleteEtudiant(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        console.log(`Étudiant avec l'ID ${id} supprimé.`);
        const current = this.etudiantsSubject
          .getValue()
          .filter((e) => e.id !== id);
        this.etudiantsSubject.next(current);
      },
      error: (error) =>
        console.error("Erreur lors de la suppression de l'étudiant:", error),
    });
  }
}
