import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private storage: Storage,
              private router: Router) {}
 /***
   * Continuar App
   */
  async continuarApp() {
    await this.storage.set('slides', true).then(() => {
        this.goToLoginPage();
      }
    );
  }

  /***
   * Go To Login Page
   */
  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
