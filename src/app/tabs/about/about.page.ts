import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  urlSponsor!: string;
  urlCryptoEcolo!: string;
  urlApiTutorial!: string;
  isConnected: Boolean = this._authenticationService.isConnected;

  constructor(
    private _authenticationService: AuthenticationService,
    private _configService: ConfigService
  ) {}

  ngOnInit() {
    this._configService.getUrl('sponsorshipLink').subscribe((url: any) => {
      this.urlSponsor = url;
    });
    this._configService.getUrl('cryptoEcolo').subscribe((url: any) => {
      this.urlCryptoEcolo = url;
    });
    this._configService.getUrl('apiTutorial').subscribe((url: any) => {
      this.urlApiTutorial = url;
    });
  }

  async openBrowser(url: string) {
    await Browser.open({ url: url });
  }
}
