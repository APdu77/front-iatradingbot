import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Account } from '../models/account';
import { AlertController, NavController } from '@ionic/angular';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss', '../app.component.scss'],
})
export class ChangeEmailPage implements OnInit {
  changeEmailForm!: FormGroup;
  verificationForm!: FormGroup;
  account$: BehaviorSubject<Account> = this._accountService.account$;

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _alertController: AlertController,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this.changeEmailForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*@[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*[.][a-zA-Z]{2,4}$'
          ),
        ],
      ],
    });
    this.verificationForm = this._formBuilder.group({
      validationKey: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([a-f0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[89ab][a-z0-9]{3}-[a-z0-9]{12})$'
          ),
        ],
      ],
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this._accountService
        .changeEmail({ ...form.value, id: localStorage.getItem('id') })
        .subscribe({
          error: (err: any) => {
            this.changeErrorAlert(err.error.message);
          },
        });
    }
  }

  onVerify(form: FormGroup) {
    if (form.valid) {
      this._accountService
        .validateMailChange(form.value.validationKey)
        .subscribe({
          next: (res: Account) => {
            this.validationAlert();
          },
          error: (err) => {
            this.validationErrorAlert(err.error.message);
          },
        });
    }
  }

  async validationAlert() {
    const alert = await this._alertController.create({
      header: 'Vérification OK',
      subHeader: 'Votre adresse email a bien été modifiée',
      message: 'Vous allez être redirigé vers la page de connexion',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this._navController.navigateRoot('/login');
          },
        },
      ],
      backdropDismiss: false,
      animated: true,
    });
    await alert.present();
  }

  async changeErrorAlert(cause: string) {
    const alert = await this._alertController.create({
      header: cause,
      //message: "L'adresse email est déjà associée à un compte",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.changeEmailForm.reset();
          },
        },
      ],
      backdropDismiss: false,
      animated: true,
    });
    await alert.present();
  }

  async validationErrorAlert(cause: string) {
    const alert = await this._alertController.create({
      header: cause,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (cause.includes('exp')) {
              window.location.reload();
            } else this.verificationForm.reset();
          },
        },
      ],
      backdropDismiss: false,
      animated: true,
    });
    await alert.present();
  }
}
