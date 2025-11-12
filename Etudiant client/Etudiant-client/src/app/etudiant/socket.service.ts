import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connecte au serveur Socket.IO
    this.socket = io('http://localhost:3000');
  }

  // Écoute un événement et retourne un Observable avec cleanup
  onlisten(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      const handler = (data: any) => subscriber.next(data);

      // Ajouter l'écouteur
      this.socket.on(eventName, handler);

      // Fonction de cleanup appelée à l'unsubscribe
      return () => {
        this.socket.off(eventName, handler);
      };
    });
  }
}
