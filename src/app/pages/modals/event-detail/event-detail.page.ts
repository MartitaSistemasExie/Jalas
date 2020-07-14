import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NavParams, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../../environments/environment';

declare var mapboxgl: any;
const urlBack = environment.urlBackend;
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit, AfterViewInit {

  public id = this.navParams.get('id');
  event;
  serviceResp;
  establishmentProfile = environment.establishmentImg + 'profile/';
  eventBanner = environment.eventImg + 'banner/';

  constructor(private navParams: NavParams,
              public actionSheetController: ActionSheetController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private http: HTTP) {
    console.log('Received ID:', this.id);
   }

  ngOnInit() {
    this.getEvent();
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF5ZGV2OTYiLCJhIjoiY2tjM241ZnZqMDEwcTJycDVsbHJpNXBiNyJ9.aUS6ve1DQm7J-ZkT-7UfJg';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.event.longitude, this.event.latitude],
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
                    .setLngLat([this.event.longitude, this.event.latitude])
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


  getEvent() {
    this.presentLoading();
    const service = 'events/getEventInfo';
    const data = {
      idEvent: this.id
    };

    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data:data}, {}).then(resp => {
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      this.event = this.serviceResp.data;
    }).catch(error => {
      console.log('ERROR: ', error);
    });
  }

  async showMapOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ir Con',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Google Maps',
        handler: () => {
          console.log('Delete clicked');
          const destination = this.event.latitude + ',' + this.event.longitude;
          // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
          window.open(' https://www.google.com/maps/search/?api=1&query=' + this.event.latitude + ',' + this.event.longitude, '_system');
          // window.open('https://www.google.com/maps/@' + this.event.latitude + ',' + this.event.longitude + ',6z', '_system');
        }
      }, {
        text: 'Waze',
        handler: () => {
          console.log('Share clicked');
          window.open('https://waze.com/ul?ll=' + this.event.latitude + ',' + this.event.longitude + '&z=10&navigate=yes', '_system');
        }
      }, {
        text: 'Cancel',
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
      message: 'Espera por favor...'
    });
    await loading.present();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }
}
