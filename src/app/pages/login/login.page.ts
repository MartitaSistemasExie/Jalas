import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { environment } from '../../../environments/environment';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = {
    email: '',
    password: ''
  };

  serviceResponse;
  serviceError;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
  }

  doLogin() {
    if (this.usuario.email === '' || this.usuario.password === '') {
      this.presentEmptyFieldsAlert();
    }
    const data = {
      email: this.usuario.email,
      password: this.usuario.password
    };

    console.log('Login DATA: ', data);
    console.log('JSON: ', JSON.stringify(data));
    this.presentLoading();
    const service = 'login/validateCredentials';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {
      data: data
    }, {}).then(async resp => {
     await this.loadingController.dismiss();
     console.log('RESP ON SERVICE:', JSON.parse(resp.data));
     this.serviceResponse = JSON.parse(resp.data);
     if (this.serviceResponse.status === 0 || this.serviceResponse.type === 'establishment') {
        console.log('USER OR INVALID');
        this.presentInvalidUserAlert();
        return;
      }

     if ( this.serviceResponse.type === 'user') {
        console.log('GOING TO user TABS');
        this.saveID(this.serviceResponse.data, this.serviceResponse.idSession);
      }
    }).catch(error => {
      console.log('ERROR ON SERVICE:', error);
    });
  }



  async saveID(id, session) {
    await this.storage.set('idUser', id).then( () => {
      this.storage.set('session', session).then( () => {
        this.router.navigate(['/main-tabs']);
      });
    });
  }

  async presentEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes llenar todos los campos',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }


  async presentInvalidUserAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Usuario incorrecto',
      message: 'Revisa tus credenciales e intenta de nuevo.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }


  async presentLoading() {
    const loader = await this.loadingController.create({
      message: ' Espera por favor',
    });
    await loader.present();
  }

}
