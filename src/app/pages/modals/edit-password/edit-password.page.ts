import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {environment} from '../../../../environments/environment.prod';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {

  idUser;
  password;
  secondPswd;
  serviceResp;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
    this.getSiteID();
  }


  updatePassword() {

    if (this.password != this.secondPswd) {
      this.passwordsAlert();
      return;
    }
    console.log('PSWD:', this.password);
    const service = 'users/updateUserPassword';
    const data = {
      idUser: this.idUser,
      password: this.password
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if(this.serviceResp.status != 1) {
        this.errorAlert();
        return;
      }
      this.successAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }

  async getSiteID() {
    await this.storage.get('idUser').then((value => {
      this.idUser = value;
      console.log('ID: ', this.idUser);
    }));
  }

  cerrarModal() {
    this.modalController.dismiss();
  }


  /***
   * ErrorAlert
   */
  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Verifica tu internet e intenta de nuevo.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }

  /***
   * Success Alert
   */
  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Listo',
      message: 'Se ha modificado correctamente tu contraseña.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }

  /***
   * PasswordsAlert
   */
  async passwordsAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: ' Las contraseñas no coinciden.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
