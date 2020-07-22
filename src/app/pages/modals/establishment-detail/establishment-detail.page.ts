import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NavParams, ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { EstablishmentGalleryPage } from '../establishment-gallery/establishment-gallery.page';


declare var mapboxgl: any;
const urlBack = environment.urlBackend;
@Component({
  selector: 'app-establishment-detail',
  templateUrl: './establishment-detail.page.html',
  styleUrls: ['./establishment-detail.page.scss'],
})
export class EstablishmentDetailPage implements OnInit, AfterViewInit {

  establishmentGallery = environment.establishmentImg + 'gallery/';
  establishmentProfile = environment.establishmentImg + 'profile/';
  establishmentBanner = environment.establishmentImg + 'banner/';
  public id = this.navParams.get('id');
  establishment;
  serviceResp;
  slideOpts = {
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 1.5,
    speed: 400
  };
  constructor(private navParams: NavParams,
              private photoViewer: PhotoViewer,
              private actionSheetController: ActionSheetController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private http: HTTP) { }

  ngOnInit() {
    this.getEstablishment();
  }

  openPhoto(image) {
    this.photoViewer.show(this.establishmentGallery + image + '.jpg');
  }

  async openEstablishmentGallery() {
    console.log('openEstablishmentGallery: ', this.id);
    const modal = await this.modalController.create( {
      component: EstablishmentGalleryPage,
      componentProps: {
        id: this.id
      }
    });
    modal.onDidDismiss().then(() => {
      this.getEstablishment();
    });
    return await modal.present();
    // const modal = await this.modalController.create({
    //   component: EstablishmentDetailPage,
    //   componentProps: {
    //     id: site.idestablishment
    //   }
    // });
    // modal.onDidDismiss().then(() => {
    //   this.getEstablishments();
    // });
    // return await modal.present();
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF5ZGV2OTYiLCJhIjoiY2tjM241ZnZqMDEwcTJycDVsbHJpNXBiNyJ9.aUS6ve1DQm7J-ZkT-7UfJg';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.establishment.conf.location.longitude, this.establishment.conf.location.latitude],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    // tslint:disable-next-line: only-arrow-functions
    map.on('load', () => {

      // MARKER
      const marker = new mapboxgl.Marker()
                    .setLngLat([this.establishment.conf.location.longitude, this.establishment.conf.location.latitude])
                    .addTo(map);
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',

          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
      );
    });
    this.loadingController.dismiss();
  }

  getEstablishment() {
    // this.presentLoading();
    const service = 'establishments/getEstablishmentInfo';
    const data = {
      idEstablishment: this.id
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.establishment = this.serviceResp.data;
    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  async showMapOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ir con:',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Google Maps',
        handler: () => {
          console.log('Maps clicked');
          // tslint:disable-next-line: max-line-length
          window.open(' https://www.google.com/maps/search/?api=1&query=' + this.establishment.conf.location.latitude + ',' + this.establishment.conf.location.longitude, '_system');
          // window.open('https://www.google.com/maps/@' + this.event.latitude + ',' + this.event.longitude + ',6z', '_system');
        }
      }, {
        text: 'Waze',
        handler: () => {
          console.log('Waze clicked');
          // tslint:disable-next-line: max-line-length
          window.open('https://waze.com/ul?ll=' + this.establishment.conf.location.latitude + ',' + this.establishment.conf.location.longitude + '&z=10&navigate=yes', '_system');
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Espera por favor'
    });
    await loading.present();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
