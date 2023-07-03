import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { NavController } from '@ionic/angular';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isConnected: Boolean = false;

  private _baseUrl = `${environment.baseUrl}/account`;

  constructor(
    private _accountService: AccountService,
    private _httpClient: HttpClient
  ) {}

  login(formValues: any): Observable<Object> {
    return this._httpClient
      .post<Object>(`${this._baseUrl}/login`, JSON.stringify(formValues))
      .pipe(
        tap((res: any) => {
          if (res.message == 'OK') {
            localStorage.setItem('token', res.token);
            localStorage.setItem('email', formValues.email.toString());
            this.isConnected = true;
          }
        })
      );
  }

  isConnectedFunction(): Boolean {
    let token = localStorage.getItem('token');
    if (token !== null) {
      return true;
    } else return false;
  }

  logout(): Observable<Object> {
    let token = localStorage.getItem('token');
    return this._httpClient.post<String>(`${this._baseUrl}/logout`, token).pipe(
      tap(() => {
        if (token !== null) {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          this.isConnected = false;
        } else {
          this.isConnected = false;
        }
      })
    );
  }
}
