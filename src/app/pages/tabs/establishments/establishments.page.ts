import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../../../environments/environment';
import { EstablishmentDetailPage } from '../../modals/establishment-detail/establishment-detail.page';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.page.html',
  styleUrls: ['./establishments.page.scss'],
})
export class EstablishmentsPage implements OnInit {

  searchText;
  serviceResp;
  noSites = true;
  distance = 10;
  latitude;
  longitude;
  establishments;
  idUser;
  constructor(private alertController: AlertController,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private nativeGeocoder: NativeGeocoder,
              private geolocation: Geolocation,
              private router: Router,
              private storage: Storage) { }

  ngOnInit() {
    this.locationAlert();
  }

  async locationAlert() {
    const alert = await this.alertController.create({
      header: 'Encontrando Lugares',
      message: 'Estámos utilizando tu ubicación para encontrar los lugares más cercanos a ti',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Obtener',
          handler: () => {
            console.log('Confirm Okay clicked');
            this.getEstablishments();
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter() {
    this.getEstablishments();
  }

  getEstablishments() {
    // this.presentLoading();
    this.getUserRadio();
    this.getLatAndLong();
    this.callSearchEstablishments();
  }


  callSearchEstablishments() {
    const service = 'search/searchEstablishments';
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
      this.establishments = this.serviceResp.data;
    }).catch(error => {
      this.loadingController.dismiss();
      console.log('ERROR: ', error);
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




  async getUserRadio() {
    await this.storage.get('userRadio').then(val => {
        this.distance = val;
    });
  }


  searchName(event) {
    this.searchText = event.detail.value;
    if (this.searchText.length == 0) {
      this.getEstablishments();
    }
    if (this.searchText.length > 3) {
      const service = 'search/searchEstablishmentsPerName';
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
      this.establishments = this.serviceResp.data;
    }).catch(error => {
      this.loadingController.dismiss();
      console.log('ERROR: ', error);
    });
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getEstablishments();
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
      this.getEstablishments();
    });
    return await modal.present();
  }

  async makeFavorite(site) {
    console.log('Favourite IdEstablishment', site);
    await this.storage.get('idUser').then(val => {
      this.idUser = val;
    });
    const service = 'conf/addFavorite';
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
        this.singleAlert('Listo!', 'Haz agregado Correctamente a ' + site.name + ' en tu lista de favoritos');
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
    this.getEstablishments();
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


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor...'
    });
    await loading.present();
  }

}
