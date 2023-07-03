import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, repeat, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _baseUrl = `${environment.baseUrl}/account`;

  public account$ = new BehaviorSubject<Account>({});

  constructor(private _http: HttpClient) {}

  getInfo(id: number): Observable<Object> {
    const headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('token')!
    );
    return this._http
      .get<Account>(`${this._baseUrl}/${id}`, { headers: headers })
      .pipe(
        tap((account: Account) => {
          this.account$.next(account);
        })
      );
  }

  createOne(user: Account) {
    return this._http.post<Account>(`${this._baseUrl}/creation`, user).pipe(
      tap((accountCreated: Account) => {
        this.account$.next(accountCreated);
      })
    );
  }

  validateOne(validationKey: String) {
    return this._http
      .post<Account>(`${this._baseUrl}/validation`, validationKey)
      .pipe(
        tap((accountValidated: Account) => {
          localStorage.setItem('id', JSON.stringify(accountValidated.id));
          this.account$.next(accountValidated);
        })
      );
  }

  validateMailChange(validationKey: String) {
    return this._http
      .post<Account>(`${this._baseUrl}/newemail`, validationKey)
      .pipe(
        tap((account: Account) => {
          this.account$.next(account);
        })
      );
  }

  updateOne(user: Account): Observable<Object> {
    const headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('token')!
    );
    return this._http
      .put<Account>(`${this._baseUrl}/`, user, { headers: headers })
      .pipe(
        tap((accountUpdated: Account) => {
          this.account$.next(accountUpdated);
        })
      );
  }

  changePassword(formValues: any): Observable<Object> {
    const headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('token')!
    );
    return this._http.post<Object>(`${this._baseUrl}/password`, formValues, {
      headers: headers,
    });
  }

  changeEmail(user: Account): Observable<Account> {
    const headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('token')!
    );
    return this._http
      .post<Account>(`${this._baseUrl}/email`, user, { headers: headers })
      .pipe(
        tap((res: any) => {
          this.account$.next(res);
        })
      );
  }

  accessWallet(): Observable<Object> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', token!);

    return this._http
      .post<Account>(`${this._baseUrl}/wallet`, token, { headers: headers })
      .pipe(
        repeat({ delay: 5000 }),
        tap((res: any) => {
          this.account$.next({ ...this.account$.value, wallet: res });
        })
      );
  }
}
