import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-signin-info',
  templateUrl: './signin-info.page.html',
  styleUrls: ['./signin-info.page.scss'],
})
export class SigninInfoPage implements OnInit {

  musicTypes = [
    {id: 0, name: 'Rock', isChecked: false},
    {id: 1, name: 'Reggaeton', isChecked: false},
    {id: 2, name: 'Banda', isChecked: false},
    {id: 3, name: 'Electronica', isChecked: false},
    {id: 4, name: 'Pop', isChecked: false},
    {id: 5, name: 'Jazz', isChecked: false},
    {id: 6, name: 'Ritmos latinos', isChecked: false},
    {id: 7, name: 'Metal', isChecked: false},
    {id: 8, name: 'Reg. Mexicano', isChecked: false},
    {id: 9, name: 'Hip-Hop', isChecked: false},
    {id: 10, name: 'Reggae', isChecked: false},
    {id: 11, name: '80’s', isChecked: false},
    {id: 12, name: '90’s', isChecked: false},
    {id: 13, name: 'Disco', isChecked: false},
    {id: 14, name: 'Indie', isChecked: false}
  ];

  data = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthday: '',
    sex: '',
    phone: '',
    conf: {
      location: {
        city: '',
        state: ''
      },
      genres: [],
      radio: 10
    }
  };
  birthday;
  sex;
  state;
  city;
  phone;
  accountData: any;
  serviceResp;
  serviceErr;
  idUser;
  userSession;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private route: ActivatedRoute,
              private router: Router,
              private storage: Storage) {
    this.route.queryParams.subscribe(params => {
      if (params && params.user) {
        console.log('params: ', params.user);
        this.accountData = JSON.parse(params.user);
      }
    });
  }

  ngOnInit() {
  }


  checkMusicType(type: any) {
    type.isChecked = !type.isChecked;
  }

  createAccount() {
    this.fillData();
    // tslint:disable-next-line: max-line-length
    if (this.data.birthday === '' || this.data.sex  === '' || this.data.conf.location.state  === '' || this.data.conf.location.city  === '' || this.data.phone  === '' || this.data.conf.genres.length === 0) {
      console.log('Estan vacios los campos');
      this.presentEmptyAlert();
      return;
    } else {
      console.log('No estan vacios los campos');
      this.createUser();
    }
  }

  createUser() {
    console.log('DATA: ', this.data);
    this.presentLoading();
    const service = 'users/createUser';
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: this.data}, {}).then(resp => {
      this.loadingController.dismiss();
      console.log('RESP SERVICIO:');
      console.log(resp.data);
      this.serviceResp = JSON.parse(resp.data);
      if (this.serviceResp.status == 0) {
        this.presentServiceError();
        return;
      }
      this.idUser = this.serviceResp.idUser;
      this.userSession = this.serviceResp.idSession;
      this.saveUserID();
    }).catch(error => {
      console.log('ERROR: ', error);
      this.presentServiceError();
      return;
    });
  }

  async saveUserID() {
    await this.storage.set('idUser', this.idUser).then( () => {
      this.storage.set('session', this.userSession).then( () => {
        this.router.navigate(['/welcome']);
      });
    });
  }

  fillData() {
    this.data.name = this.accountData.name;
    this.data.lastName = this.accountData.lastName;
    this.data.email = this.accountData.email;
    this.data.password = this.accountData.pswd;
    this.data.birthday = this.birthday.split('T')[0];
    this.data.sex = this.sex;
    this.data.phone = this.phone;
    this.data.conf.location.city = this.city;
    this.data.conf.location.state = this.state;
    for (const v in this.musicTypes) {
      if (this.musicTypes[v].isChecked) {
        this.data.conf.genres.push(this.musicTypes[v].id);
      }
    }
  }

  async presentEmptyAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Debes llenar todos los campos.',
      message: '',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  async presentServiceError() {
    const alert = await this.alertController.create({
      subHeader: 'Ocurrio un error.',
      message: 'Verifica tu conexión e intenta más tarde.',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor'
    });
    await loading.present();
  }

}
