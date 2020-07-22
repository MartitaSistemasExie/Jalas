import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-config.page.html',
  styleUrls: ['./edit-config.page.scss'],
})
export class EditConfigPage implements OnInit {

  idUser;
  serviceResp;
  data = {
    idUser: '',
    name: '',
    lastName: '',
    birthday: '',
    sex: '',
    phone: '',
    updateData: [
      {
        field: 'radio',
        data: ''
      }
    ]
  };
  constructor(private alertController: AlertController,
              private http: HTTP,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
    this.getSavedID();
  }


  updateUser() {
    const service = 'users/updateUser';

    this.http.setDataSerializer('json');
    console.log('DATA:', this.data);
    this.http.post(urlBack + service, {data: this.data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.errorAlert();
        return;
      }
      this.successAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  async getSavedID() {
    await this.storage.get('idUser').then((value => {
      this.idUser = value;
      console.log('ID: ', this.idUser);
      this.getProfile();
    }));
  }

  getProfile() {

    const service = 'users/getUserProfile';
    const data = {
      idUser: this.idUser
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.fillProfile(this.serviceResp.data);
    }).catch(error => {
      console.log('ERROR: ', error);
    });

  }


  fillProfile(data) {
    this.data.idUser = this.idUser;
    this.data.name = data.userinfo.name;
    this.data.lastName = data.userinfo.lastname;
    this.data.phone = data.userinfo.phone;
    this.data.birthday = data.userinfo.birthday;
    this.data.sex = data.userinfo.sex;
    this.data.updateData[0].data = data.userconf.radio;
  }

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
      message: 'Se ha modificado correctamente tu información.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.cerrarModal();
        }
      }]
    });
    await alert.present();
  }


  cerrarModal() {
    this.modalController.dismiss();
  }

}
