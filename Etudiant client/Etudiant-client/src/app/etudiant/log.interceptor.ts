import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LogInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && ['POST', 'PUT', 'DELETE'].includes(req.method)) {

          //logs pour éviter boucle infinie
          if (req.url.includes('/logs')) return;

          // Récupération du token et décodage pour extraire userId
          const token = localStorage.getItem('token');
          let userId: string | null = null;

          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1])); // décodage du payload JWT
              userId = payload.id || payload._id || null;
            } catch (err) {
              console.error('❌ Erreur lors du décodage du token', err);
            }
          }

          const log = {
            actionType: req.method === 'POST' ? 'ajout' :
                        req.method === 'PUT' ? 'modification' : 'suppression',
            etudiantId: req.body?._id || req.body?.id || req.body?.etudiantId || null,
             userId: userId,
          };
          const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` })
                                : new HttpHeaders();;
          // Envoi du log au backend
          this.http.post('http://localhost:3000/logs', log, { headers }).subscribe({
            next: () => console.log('📘 Log envoyé:', log),
            error: err => console.error('❌ Erreur en envoyant le log', err)
          });
        }
      })
    );
  }
}
