import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../environments/environment';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hasSeenSlides;
  hasSession;
  sessionActive;
  idUser;
  session;
  serviceResponse;
  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private http: HTTP,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    // this.checkSlides();
    this.getSavedSession();
  }

      // Slides?

      // No -> Go Slides

      // Yes -> Check Session

      // Session?

      //  No -> Go Login

      // Yes -> Get User and verify session

      // Session Active?

      // No -> Go Login

      // Yes -> Go main tabs

  async getSavedSession() {
    console.log('GET SAVED SESSION:');
    await this.storage.get('session').then(val => {
      this.session = val;
      this.initializeApp();
    });
  }

  initializeApp() {
    console.log('Init App');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      if (this.session == undefined || this.session == null) {
        console.log('Session undefined or null');
        this.checkSlides();
      } else {
        console.log('Session saved');
        this.getUser();
      }
    });
  }


  /***
   * Check Slides
   */
  async checkSlides() {
    console.log('Check slides');
    await this.storage.get('slides').then(value => {
      this.hasSeenSlides = value;
      console.log('slides', this.hasSeenSlides);
      if (this.hasSeenSlides) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async getUser() {
    await this.storage.get('idUser').then(val => {
      this.idUser = val;
      this.verifySession();
    });
  }

  verifySession() {
    const service = 'login/verifyUserSession';
    this.http.setDataSerializer('json');
    const data = {
      idUser: this.idUser,
      idSession: this.session
    };

    this.http.post(urlBack + service, {
      data: data
    }, {}).then(async resp => {
     console.log('RESP ON SERVICE:', resp);
     this.serviceResponse = resp;

     if (this.serviceResponse.status == 0) {
      this.router.navigate(['/login']);
     } else {
       this.router.navigate(['/main-tabs']);
     }
    }).catch(error => {
      console.log('ERROR ON SERVICE:', error);
    });
  }


  // async checkSession() {
  //   await this.storage.get('session').then(val => {
  //     this.session = val;

  //     if ( this.session != undefined || this.session != null) {
  //       this.hasSession = true;
  //     }
  //     // this.appNavigation();
  //   });
  // }

}
