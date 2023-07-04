import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss', '../../app.component.scss'],
})
export class AccountPage implements OnInit {
  account$: BehaviorSubject<Account> = this._accountService.account$;
  idForm!: FormGroup;
  apiKeyForm!: FormGroup;
  ApiSecretForm!: FormGroup;

  constructor(
    private _accountService: AccountService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController,
    private _navCtrl: NavController
  ) {}

  ngOnInit() {
    this._accountService
      .getInfo(Number(localStorage.getItem('id')))
      .subscribe();
    this.idForm = this._formBuilder.group({
      accountId: [
        '',
        [
          Validators.required,
          //Validators.pattern('^pattern id a definir$')
        ],
      ],
    });
    this.apiKeyForm = this._formBuilder.group({
      apiKey: [
        '',
        [
          Validators.required,
          //Validators.pattern('^pattern key a definir$')
        ],
      ],
    });
    this.ApiSecretForm = this._formBuilder.group({
      secretKey: [
        '',
        [
          Validators.required,
          //Validators.pattern('^pattern key a definir$')
        ],
      ],
    });
  }

  editBinanceId(form: FormGroup) {
    if (form.valid) {
      this._accountService
        .updateOne({
          ...this.account$.value,
          binanceAccountId: form.value.accountId,
        })
        .subscribe(() => {
          form.reset();
        });
    }
  }

  editBinanceApiKey(form: FormGroup) {
    if (form.valid) {
      this._accountService
        .updateOne({ ...this.account$.value, binanceApiKey: form.value.apiKey })
        .subscribe(() => {
          form.reset();
        });
    }
  }

  editBinanceSecretKey(form: FormGroup) {
    if (form.valid) {
      this._accountService
        .updateOne({
          ...this.account$.value,
          binanceApiSecret: form.value.secretKey,
        })
        .subscribe(() => {
          form.reset();
        });
    }
  }

  async logoutAlert() {
    const alert = await this._alertController.create({
      header: 'Déconnexion reussie !!',
      message: 'Vous allez être redirigé vers la page de connexion',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this._navCtrl.navigateRoot('/login');
            window.location.reload();
          },
        },
      ],
      backdropDismiss: false,
      animated: true,
    });
    await alert.present();
  }
  logout() {
    this._authenticationService.logout().subscribe(() => {
      this.logoutAlert();
    });
  }
}
