import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _baseUrl = `${environment.baseUrl}/config`;

  public url$ = new BehaviorSubject<String>('');

  constructor(private _http: HttpClient) {}

  getUrl(key: String): Observable<String> {
    const text = 'text';
    return this._http.get<String>(`${this._baseUrl}/${key}`, {
      responseType: 'text',
    } as Record<string, unknown>);
  }
}
