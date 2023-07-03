import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, repeat, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticker24Hr } from '../models/ticker-24-hr';

@Injectable({
  providedIn: 'root',
})
export class BinanceApiService {
  private _binanceApiUrl = 'https://api.binance.com';

  constructor(private _http: HttpClient) {}

  getAveragePrice(symbol: String): Observable<Object> {
    return this._http
      .get<Ticker24Hr>(
        `${this._binanceApiUrl}/api/v3/ticker/24hr?symbol=${symbol}`
      )
      .pipe(repeat({ delay: 5000 }));
  }
}
