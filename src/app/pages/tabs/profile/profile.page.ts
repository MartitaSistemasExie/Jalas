import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EventDetailPage } from '../../modals/event-detail/event-detail.page';
import { EstablishmentDetailPage } from '../../modals/establishment-detail/establishment-detail.page';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

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
  latitude;
  longitude;
  serviceResp;
  eventsGen;
  emptyEvents = true;
  emptyPlaces = true;
  noEventsFound = true;
  // profileServer = urlBack + '/images/user/profile/';
  // bannerServer = urlBack + '/images/user/banner/';
  profileServer = environment.userImg + 'profile/';
  bannerServer = environment.userImg + 'banner/';
  eventBanner = environment.eventImg + 'banner/';
  establishmentProfile = environment.establishmentImg + 'profile/';
  establishmentBanner = environment.establishmentImg + 'banner/';
  userGeneres;
  slideOpts = {
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 1.5,
    speed: 400
  };
  constructor(private http: HTTP,
              private alertController: AlertController,
              private modalController: ModalController,
              private geolocation: Geolocation,
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
    this.userGeneres = data.userconf.genres;
    this.saveRadio();
  }

  async saveRadio() {
    await this.storage.set('userRadio', this.user.radio).then(() => {
      this.locationAlert();
    });
  }

  async locationAlert() {
    const alert = await this.alertController.create({
      header: 'Encontrando Eventos',
      message: 'Estámos utilizando tu ubicación para encontrar los eventos más adecuados para ti',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Obtener',
          handler: () => {
            console.log('Confirm Okay clicked');
            this.getEvents();
          }
        }
      ]
    });
    await alert.present();
  }

  getEvents() {
    this.getLatAndLong();
    this.getEventsPerGeneres();
  }

  getLatAndLong() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('full Location Data: ', resp);
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('LAT: ', this.latitude, ' AND LONG: ', this.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentLocationErrorAlert();
    });
  }


  getEventsPerGeneres() {
      const service = 'search/searchEventsPerGenres';
      const data = {
        latitude: this.latitude,
        longitude: this.longitude,
        distance: this.user.radio,
        genres: this.userGeneres
      };
      console.log('SEARCH WITH: ', data);
      this.http.setDataSerializer('json');
      this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      if (this.serviceResp.data.length > 0) {
        this.noEventsFound = false;
      }
      console.log('RESP: ', this.serviceResp);
      this.eventsGen = this.serviceResp.data;

    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  removeEvent(event){
    console.log('Remove Event: ', event);
    const service = 'conf/removeEvent';
    const data = {
      idUser: this.idUser,
      idEvent: event.idEvent
    };
    console.log('Fav WITH: ', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status == 1) {
        this.singleAlert('Listo!', 'Quitaste correctamente a ' + event.name + ' de tu lista de eventos a asistir');
      }
    }).catch(error => {
      this.singleAlert('Ocurrió un Error', error);
    });
  }

  addEvent(event){
    console.log('Profile Add  Event: ', event);
    const service = 'conf/addEvent';
    const data = {
      idUser: this.idUser,
      idEvent: event.idevent
    };
    console.log('Fav WITH: ', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status == 1) {
        this.singleAlert('Listo!', 'Agregarste correctamente a ' + event.name + '  tu lista de eventos a asistir');
      }
    }).catch(error => {
      this.singleAlert('Ocurrió un Error', error);
    });
  }

  removeFavorite(site){
    console.log('Remove Event: ', site);
    const service = 'conf/removeFavorite';
    const data = {
      idUser: this.idUser,
      idEstablishment: site.idestablishment
    };
    console.log('Fav WITH: ', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status == 1) {
        this.singleAlert('Listo!', 'Quitaste correctamente a ' + site.name + ' de tu lista de lugares favoritos.');
      }
    }).catch(error => {
      this.singleAlert('Ocurrió un Error', error);
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getProfile();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async openEstablishmentDetail(site) {
    console.log('openEstablishmentDetail: ', site);
    const modal = await this.modalController.create({
      component: EstablishmentDetailPage,
      componentProps: {
        id: site.idestablishment
      }
    });
    modal.onDidDismiss().then(() => {
      this.getProfile();
    });
    return await modal.present();
  }

  async singleAlert(title, body) {
    const alert = await this.alertController.create({
      header: title,
      message: body,
      backdropDismiss: false,
      buttons: ['OK']
    });
    alert.onDidDismiss().then( () => {
      this.getProfile();
    });
    return await alert.present();
  }

  async presentLocationErrorAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Ocurrió un error al obtener tu ubicación',
      message: ' Revisa tu internet y permisos e intenta de nuevo. ',
      buttons: ['Ok']
    });
    await alert.present();
  }


  async openEventDetail(event) {
    console.log('event: ', event.idEvent);
    const modal = await this.modalController.create({
      component: EventDetailPage,
      componentProps: {
        id: event.idEvent
      }
    });
    modal.onDidDismiss().then(() => {
      this.getProfile();
    });
    return await modal.present();
  }


}
