import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../../environments/environment';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-establishment-gallery',
  templateUrl: './establishment-gallery.page.html',
  styleUrls: ['./establishment-gallery.page.scss'],
})
export class EstablishmentGalleryPage implements OnInit {
  public id = this.navParams.get('id');
  establishment;
  serviceResp;
  slideOpts = {
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 400
  };
  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private http: HTTP) { }

  ngOnInit() {
    this.getEstablishment();
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

  closeModal() {
    this.modalController.dismiss();
  }

}
