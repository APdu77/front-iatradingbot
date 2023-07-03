import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss','../app.component.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  alert: string = "Identifiant et/ou mot de passe invalide(s)";
  
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private _alertController: AlertController,
    private _navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      "email": [
        "", [
          Validators.required,
          Validators.pattern('^[a-zA-Z_0-9]+([\.-]?[a-zA-Z_0-9]+)*@[a-zA-Z_0-9]+([\.-]?[a-zA-Z_0-9]+)*[.][a-zA-Z]{2,4}$')
        ]
      ],
      "password": [
        "", [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!"#$%&\'*+,-./:;<=>?@^_`{|}~])([!"#$%&\'*+,-./:;<=>?@^_`{|}~a-zA-Z0-9]{12,255})$'),
          Validators.minLength(12),
          Validators.maxLength(255),
        ]
      ]
    });
  }

  async loginAlert(cause: string, email: string) {
    const alert = await this._alertController.create({
      header: 'Connexion impossible',
      //subHeader: email,
      message: cause,
      buttons: ['OK'],
    });
    await alert.present();
  }

  onSubmit(form: FormGroup) {
    this.isSubmitted = true;

    if (form.valid) {
      this._authService
        .login(form.value)
        .subscribe({
          next: (res: any) => {
            if (res.message == "OK") {
              this._navCtrl.navigateRoot('/tabs/dashboard');
            }
            else {
              this.loginAlert(this.alert, form.value.email);
            }
          },
        })
    }

  }

}


