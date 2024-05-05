import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameUrl: string;

  constructor(private http: HttpClient) {
    this.gameUrl = `${environment.apiUrlBase}`;
   }

   crearPartida(): Observable<any>{
    return this.http.post(`${this.gameUrl}play`, {});
   }

   generarTablero(gameId: Number): Observable<any>{
    return this.http.get<any>(`${this.gameUrl}show/${gameId}`);
   }

   generarTableroEnemigo(gameId: Number): Observable<any>{
    return this.http.get<any>(`${this.gameUrl}oponente/${gameId}`);
   }

   movimiento(gameId: Number, x: number, y: number): Observable<any>{
    const body = { x, y }
    return this.http.post<any>(`http://192.168.168.224:8000/api/hit/${gameId}`, body);
   }

   getHistorial(): Observable<any>{
    return this.http.get<any>(`${this.gameUrl}registro`);
   }
}
