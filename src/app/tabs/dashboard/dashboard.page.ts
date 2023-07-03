import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Ticker24Hr } from 'src/app/models/ticker-24-hr';
import { AccountService } from 'src/app/services/account.service';
import { BinanceApiService } from 'src/app/services/binance-api.service';
import '@angular/common/locales/global/fr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  account$: BehaviorSubject<Account> = this._accountService.account$;
  public ethPrice$ = new BehaviorSubject<Ticker24Hr>({});
  public btcPrice$ = new BehaviorSubject<Ticker24Hr>({});
  public bnbPrice$ = new BehaviorSubject<Ticker24Hr>({});
  
  constructor(
    private _accountService: AccountService,
    private _binanceApiService: BinanceApiService,
  ) { }

  ngOnInit() {
    this._accountService.getInfo(Number(localStorage.getItem('id'))).subscribe({
      next: () => {
        //this.account$.next(accountFound);
      },
      error: (err) => {
        //this.account$.next(accountFound);
      },
    });
    this._binanceApiService.getAveragePrice('BTCEUR').subscribe(
      (res:any) => {
        //res.name = res.symbol.substring(0,3);
        this.btcPrice$.next(res);
      }
    );
    this._accountService.accessWallet().subscribe();
    }
}
