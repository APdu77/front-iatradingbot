import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage:any = 'LoginPage';

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.setStyle({ style: Style.Default });
      SplashScreen.hide();
    });
  }
}
