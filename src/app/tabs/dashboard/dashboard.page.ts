import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Ticker24Hr } from 'src/app/models/ticker-24-hr';
import { AccountService } from 'src/app/services/account.service';
import { BinanceApiService } from 'src/app/services/binance-api.service';
import { Share } from '@capacitor/share';
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
    this._accountService.getInfo(Number(localStorage.getItem('id'))).subscribe();
    this._binanceApiService.getAveragePrice('BTCEUR').subscribe(
      (res:any) => {
        this.btcPrice$.next(res);
      }
    );
    this._accountService.accessWallet().subscribe();
    }

    async share() {
      await Share.share({
        title: 'Vous avez un nouveau filleul CryptoEcoloApp!',
        text: 'Bonjour, je viens de créer mon compte, peux-tu l\'activer stp?',
      });
    }
}
