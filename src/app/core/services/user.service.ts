import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl: string;
  private token: string | null = null;
  private code: string | null = null;

  constructor(private http: HttpClient, private cookies: CookieService) {
    this.userUrl = `${environment.apiUrlBase}`;
  }

  getUsers(userId: any): Observable<any>{
    return this.http.get<any>(`${this.userUrl}users/${userId}`);
  }

  newUser(userData: any): Observable<any> {
    return this.http.post(`${this.userUrl}signup`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.userUrl}login`, userData);
  }

  getToken(){
    this.token = this.cookies.get('token');
    return this.token;
  }

  authCode(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}codeCheck`, data);
  }

  getUserInfo(): Observable<any>{
    return this.http.get<any>(`${this.userUrl}user-info`);
  }

  logout(data: ''): Observable<any>{
    return this.http.post(`${this.userUrl}logout`, data);
  }

  getAuthCode(){
    this.code = this.cookies.get('code');
    return this.code;
  }
}
