import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

export function AuthenticationGuard(): CanActivateFn {
  return () => {
    const authenticationService = inject(AuthenticationService);
    const router = inject(Router);
    const navController = inject(NavController);
    if (
      authenticationService.isConnected == true &&
      localStorage.getItem('token') !== null
    ) {
      return true;
    } else {
      navController.navigateRoot('/login');
      return false;
    }
  };
}
