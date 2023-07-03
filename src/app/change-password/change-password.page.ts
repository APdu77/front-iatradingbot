import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { AuthenticationService } from '../services/authentication.service';
import { mustMatch } from '../tools/matching-validator';
import { mustNotMatch } from '../tools/not-matching-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss', '../app.component.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePasswordForm!: FormGroup;
  errorMessage = "Votre mot de passe actuel n'est pas correct";
  rebootMessage =
    "En fermant cette fenêtre, l'application va vous renvoyer à la page de connexion";

  constructor(
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _authenticationService: AuthenticationService,
    private _alertController: AlertController,
    private _navCtrl: NavController
  ) {}

  ngOnInit() {
    this.changePasswordForm = this._formBuilder.group(
      {
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
        newPassword: [
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
          mustMatch('newPassword', 'confirmPassword'),
          mustNotMatch('password', 'newPassword'),
        ],
      }
    );
  }

  async errorAlert(cause: string) {
    const alert = await this._alertController.create({
      header: 'Changement non autorisé',
      message: cause,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async rebootAlert(cause: string) {
    const alert = await this._alertController.create({
      header: 'Changement effectué',
      message: cause,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this._authenticationService.logout().subscribe();
          },
        },
      ],
      backdropDismiss: false,
      animated: true,
    });
    await alert.present();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this._accountService.changePassword(form.value).subscribe({
        next: (res: any) => {
          if (res.message == 'OK') {
            this.rebootAlert(this.rebootMessage);
          } else if (res.message == 'KO' && res.cause == 'wrong password') {
            this.errorAlert(this.errorMessage);
          }
        },
      });
    }
  }
}
