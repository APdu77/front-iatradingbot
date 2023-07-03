import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/account';
import { AccountService } from '../services/account.service';
import { mustMatch } from '../tools/matching-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss', '../app.component.scss'],
})
export class SignupPage implements OnInit {
  newAccountForm!: FormGroup;
  verificationForm!: FormGroup;
  account$: BehaviorSubject<Account> = this._accountService.account$;
  isValidated: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _alertController: AlertController,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this.newAccountForm = this._formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*@[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*[.][a-zA-Z]{2,4}$'
            ),
          ],
        ],
        confirmEmail: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*@[a-zA-Z_0-9]+([.-]?[a-zA-Z_0-9]+)*[.][a-zA-Z]{2,4}$'
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!"#$%&\'*+,-./:;<=>?@^_`{|}~])([!"#$%&\'*+,-./:;<=>?@^_`{|}~a-zA-Z0-9]{12,255})$'
            ),
            Validators.minLength(12),
            Validators.maxLength(255),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!"#$%&\'*+,-./:;<=>?@^_`{|}~])([!"#$%&\'*+,-./:;<=>?@^_`{|}~a-zA-Z0-9]{12,255})$'
            ),
            Validators.minLength(12),
            Validators.maxLength(255),
          ],
        ],
      },
      {
        validator: [
          mustMatch('password', 'confirmPassword'),
          mustMatch('email', 'confirmEmail'),
        ],
      }
    );
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
      this._accountService.createOne(form.value).subscribe({
        error: () => {
          this.creationErrorAlert();
        },
      });
    }
  }

  async validationAlert() {
    const alert = await this._alertController.create({
      header: 'Vérification OK',
      subHeader: "Votre compte CryptoEcoloApp vient d'être crée",
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

  async creationErrorAlert() {
    const alert = await this._alertController.create({
      header: 'Erreur lors de la création',
      message: "L'adresse email est déjà associée à un compte",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.newAccountForm.reset();
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
      //message: "L'adresse email est déjà associée à un compte",
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

  onVerify(form: FormGroup) {
    if (form.valid) {
      this._accountService.validateOne(form.value.validationKey).subscribe({
        next: (res: Account) => {
          this.validationAlert();
        },
        error: (err) => {
          this.validationErrorAlert(err.error.message);
        },
      });
    }
  }
}
