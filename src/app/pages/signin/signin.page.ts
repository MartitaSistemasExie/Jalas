import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../environments/environment';
import { Router, NavigationExtras } from '@angular/router';

const urlBack = environment.urlBackend;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  /***
   * Development Variables
   */
  // user = {
  //   name: 'User',
  //   lastName: 'Test',
  //   email: 'user1@test.com',
  //   pswd: 'user'
  // };
  // secondPswd = 'user';


  /***
   * Prod Variables
   */
  user = {
    name: '',
    lastName: '',
    email: '',
    pswd: ''
  };
  secondPswd;

  serviceResponse;
  serviceError;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit() {
  }

/***
 * Create User
 */
  createUser() {
    if (this.user.pswd !== this.secondPswd) {
      this.presentPasswordAlert();
    } else if (this.user.email === '' || this.user.name === '' || this.user.pswd === '' || this.user.lastName === '') {
      this.presentEmptyAlert();
    } else {
      this.verifyEmail();
    }
  }


  /***
   * Verify Email
   */
  verifyEmail() {
    const data = {
      email: this.user.email
    };

    this.presentLoading();
    const service1 = 'establishments/verifyMail';
    const service2 = 'users/verifyMail';
    this.http.setDataSerializer('json');
    // tslint:disable-next-line: object-literal-shorthand
    this.http.post(urlBack + service1, {data: data}, {}).then(async resp => {
      await this.loadingController.dismiss();
      console.log('Establishment RESP: ', JSON.parse(resp.data));
      this.serviceResponse = JSON.parse(resp.data);
      if (this.serviceResponse.status === 1) {

        this.presentEmailAlert();
        return;
      }
      if (this.serviceResponse.status === 0) {
        this.http.post(urlBack + service2, {data: data}, {}).then(resp => {
          this.serviceResponse = JSON.parse(resp.data);
          console.log('USER RESP: ', this.serviceResponse);
          this.loadingController.dismiss();
          if (this.serviceResponse.status === 1 ){
            this.presentEmailAlert();
            return;
          }
          if ( this.serviceResponse.status === 0) {
            this.goToInfoScreen();
          }
        }).catch(error => {
          console.log('error: ', error);
        });
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  }


   /***
   * Go To Info Screen:
   */
  goToInfoScreen() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        user: JSON.stringify(this.user)
      }
    };
    this.router.navigate(['/signin-info'], navigationExtras);
  }


   /***
   * Present Password Alert:
   */
  async presentPasswordAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Las contraseñas no coinciden.',
      buttons: ['OK']
    });

    await alert.present();
  }


  /***
   * Present Empty Alert:
   */
  async presentEmptyAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes completar todos los campos.',
      buttons: ['OK']
    });

    await alert.present();
  }


  /***
   * Present Email Alert
   */
  async presentEmailAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Ya existe una cuenta con ese email.',
      buttons: [
        {
          text: 'Verificar',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Recuperar contraseña',
          handler: () => {
            this.router.navigate(['/reset-password'])
          }
        }
      ]
    });

    await alert.present();
  }


  /***
   * Present Loading
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor'
    });
    await loading.present();
    return ;
  }

}
