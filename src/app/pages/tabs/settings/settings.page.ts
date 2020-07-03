import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { ModalController } from '@ionic/angular';
import { EditPasswordPage } from '../../modals/edit-password/edit-password.page';
import { EditConfigPage } from '../../modals/edit-config/edit-config.page';
import { EditProfilePage } from '../../modals/edit-profile/edit-profile.page';
import { Router } from '@angular/router';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  user = {
    name: '',
    phone: '',
    birthday: '',
    profileImage: '',
    bannerImage: '',
    events: [],
    favorites: [],
    city: '',
    state: '',
    radio: ''
  };
  idUser;
  serviceResp;
  emptyEvents = true;
  emptyPlaces = true;
  profileServer = urlBack + '/images/user/profile/';
  bannerServer = urlBack + '/images/user/banner/';
  constructor(private http: HTTP,
              private modalController: ModalController,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
    this.getSavedID();
  }

  ionViewWillEnter() {
    console.log('View will enter profile');
    this.getSavedID();
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

    // this.user = data;
    this.user.name = data.userinfo.name + ' ' + data.userinfo.lastname;
    this.user.phone = data.userinfo.phone;
    this.user.birthday = data.userinfo.birthday;
    this.user.profileImage = this.profileServer + data.userconf.images.profileImage + '.jpg';
    this.user.bannerImage = this.bannerServer + data.userconf.images.bannerImage + '.jpg';
    this.user.events = data.events;
    this.user.favorites = data.favorites;
    this.user.city = data.userconf.location.city + ', ' + data.userconf.location.state;
    this.user.radio = data.userconf.radio;

    if (this.user.events.length > 0) {
      this.emptyEvents = false;
    }

    if (this.user.favorites.length > 0) {
      this.emptyPlaces = false;
    }
  }

  async openEditPassword() {
    const modal = await this.modalController.create({
      component: EditPasswordPage
    });
    modal.onDidDismiss().then(() => {
      this.getProfile();
    });
    return await modal.present();
  }

  async openEditInfo() {
    const modal = await this.modalController.create({
      component: EditConfigPage
    });
    modal.onDidDismiss().then(() => {
      this.getProfile();
    });
    return await modal.present();
  }

  async openEditProfile() {
    const modal = await this.modalController.create({
      component: EditProfilePage
    });
    modal.onDidDismiss().then( () => {
      this.getProfile();
    });
    return await modal.present();
  }


  async logOut() {
    await this.storage.remove('session').then(() => {
      this.storage.remove('idUser').then(() => {
        this.router.navigate(['/login']);
      });
    });
  }
}
