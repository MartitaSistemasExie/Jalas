import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../environments/environment';

const urlBack = environment.urlBackend;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  idUser;
  bannerImg;
  avatarImg;
  selectedBanner;
  selectedAvatar;
  serviceResp;
  // https://jalas-bucket.s3.us-east-1.amazonaws.com/public/images/establishment/banner/default.jpg
  // profileServer = urlBack + '/images/user/profile/';
    // bannerServer = urlBack + '/images/user/banner/';

  profileServer = environment.userImg + 'profile/';
  bannerServer = environment.userImg + 'banner/';
  constructor(private alertController: AlertController,
              private camera: Camera,
              private http: HTTP,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private storage: Storage) { }

  ngOnInit() {
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
    this.avatarImg = this.profileServer + data.userconf.images.profileImage + '.jpg';
    this.bannerImg = this.bannerServer + data.userconf.images.bannerImage + '.jpg';
  }

  addBannerImage() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: 200
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedBanner = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.selectedBanner);
      this.callUpdateBanner();
    }, (err) => {
      // Handle error
    });

  }

  callUpdateBanner() {
    // this.presentLoading();
    const service = 'users/setBannerImage';
    const data = {
      idUser: this.idUser,
      image: this.selectedBanner
    };
    console.log('DATA UPDATE BANNER:', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
      if (error.status == 413) {
        this.presentErrorImage();
      }
    });
  }

  addAvatarImage() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: 75,
      targetWidth: 75
    };
    console.log('CAMERA OPTS: ', options);
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('Image DATA', imageData);
      this.selectedAvatar = 'data:image/jpeg;base64,' + imageData;
      console.log('SELECTED BANNER', this.selectedBanner);
      this.callUpdateAvatar();
    }, (err) => {
      // Handle error
    });

  }

  callUpdateAvatar() {
    // this.presentLoading();
    const service = 'users/setProfileImage';
    const data = {
      idUser: this.idUser,
      image: this.selectedAvatar
    };
    console.log('DATA UPDATE AVATAR:', data);
    this.http.setDataSerializer('json');
    this.http.post(urlBack + service, {data: data}, {}).then(resp => {
      this.loadingController.dismiss();
      this.serviceResp = JSON.parse(resp.data);
      console.log('RESP: ', this.serviceResp);
      if (this.serviceResp.status != 1) {
        this.presentErrorAlert();
        return;
      }
      this.presentSuccessAlert();
    }).catch(error => {
      console.log('ERROR: ', error);
      if (error.status == 413) {
        this.presentErrorImage();
      }
    });
  }


  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Verifica tu internet e intenta más tarde',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
    });
    await alert.present();
  }

  /***
   * Present Error Image
   */
  async presentErrorImage() {
    const alert = await this.alertController.create({
      header: 'Lo sentimos',
      message: 'Tu imagen es demasiado grande, intenta con una con menos resolución',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
    });
    await alert.present();
  }

  /***
   * Present Success Alert
   */
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Listo',
      message: 'Agregado correctamente',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.cerrarModal();
          }
        }
      ]
    });
    await alert.present();
  }

  /***
   * Cerrar Modal
   */
  cerrarModal() {
    this.modalController.dismiss();
  }


}
