import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { EventDetailPage } from '../../modals/event-detail/event-detail.page';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  searchText;
  searchDate;
  serviceResp;
  noSites = true;
  distance = 10;
  latitude;
  longitude;
  events;
  emptyEvents = true;
  idUser;
  eventBanner = environment.eventImg + 'banner/';
  establishmentProfile = environment.establishmentImg + 'profile/';
  constructor(private alertController: AlertController,
              private http: HTTP,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private nativeGeocoder: NativeGeocoder,
              private geolocation: Geolocation,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
    this.locationAlert();
  }

  ionViewWillEnter() {
    this.getEvents();
  }

  async locationAlert() {
    const alert = await this.alertController.create({
      header: 'Encontrando Eventos',
      message: 'Estámos utilizando tu ubicación para encontrar los eventos más cercanos para ti',
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
    // this.presentLoading();
    this.getUserRadio();
    this.getLatAndLong();
    this.callSearchEvents();
  }

  async getUserRadio() {
    await this.storage.get('userRadio').then(val => {
        this.distance = val;
    });
  }

  getLatAndLong() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadingController.dismiss();
      console.log('full Location Data: ', resp);
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log('LAT: ', this.latitude, ' AND LONG: ', this.longitude);
    }).catch((error) => {
      this.loadingController.dismiss();
      console.log('Error getting location', error);
      this.presentLocationErrorAlert();
    });
  }

  callSearchEvents() {
    const service = 'search/searchEvents';
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.distance
    };
    console.log('SEARCH WITH: ', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.events = this.serviceResp.data;
      if (this.events.length > 0) {
        this.emptyEvents = false;
      }
    }).catch(error => {
      this.loadingController.dismiss();
      console.log('ERROR: ', error);
    });
  }

  searchName(event) {
    this.searchText = event.detail.value;
    if (this.searchText.length == 0) {
      this.getEvents();
    }
    if (this.searchText.length > 3) {
      const service = 'search/searchEventsPerName';
      const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.distance,
      name: this.searchText
    };
      console.log('SEARCH WITH: ', data);
      this.http.setDataSerializer('json');
      this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.events = this.serviceResp.data;
    }).catch(error => {
      this.loadingController.dismiss();
      console.log('ERROR: ', error);
    });
    }
  }

  async openEventDetail(event) {
    console.log('event: ', event);
    const modal = await this.modalController.create({
      component: EventDetailPage,
      componentProps: {
        id: event.idevent
      }
    });
    modal.onDidDismiss().then(() => {
      this.getEvents();
    });
    return await modal.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getEvents();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  // searchByDate() {
  //   console.log('DATE: ', this.searchDate.split('T')[0]);
  //   const service = 'search/searchEventsPerDate';
  //   const data = {
  //     latitude: this.latitude,
  //     longitude: this.longitude,
  //     distance: this.distance,
  //     date: this.searchDate.split('T')[0]
  //   };
  //   console.log('SEARCH WITH: ', data);
  //   this.http.setDataSerializer('json');
  //   this.http.post(urlBack + service, {data:data}, {}).then(resp => {
  //     this.loadingController.dismiss();
  //     this.serviceResp = JSON.parse(resp.data);
  //     console.log('RESP: ', this.serviceResp);
  //     this.events = this.serviceResp.data;
  //   }).catch(error => {
  //     this.loadingController.dismiss();
  //     console.log('ERROR: ', error);
  //   });
  // }



  async addEvent(event) {
    console.log('AddEvent: ', event);
    await this.storage.get('idUser').then(val => {
      this.idUser = val;
    });
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
        this.singleAlert('Listo!', 'Agregaste correctamente a ' + event.name + ' en tu lista de eventos a asistir');
      }
    }).catch(error => {
      this.singleAlert('Ocurrió un Error', error);
    });
  }


  async singleAlert(title, body) {
    const alert = await this.alertController.create({
      header: title,
      message: body,
      backdropDismiss: false,
      buttons: ['OK']
    });
    alert.onDidDismiss().then( () => {
      this.getEvents();
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

}
