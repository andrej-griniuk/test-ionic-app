import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import { Geolocation } from '@ionic-native/geolocation';
//import { ImagePicker } from '@ionic-native/image-picker';
//import { GalleryPage } from '../gallery/gallery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private nativeAudio: NativeAudio,
    private qrScanner: QRScanner,
    private mediaCapture: MediaCapture,
    private geoLocation: Geolocation,
    //private imagePicker: ImagePicker,
    public navCtrl: NavController) {

  }

  startRecording() {
    this.mediaCapture.captureVideo()
      .then(
        (data: MediaFile[]) => {
          console.log(data);
          alert('Recorded')
        },
        (err: CaptureError) => {
          console.error(err);
          alert('Capture error');
        }
      );
    //this-.
    //MediaCapture.captureVideo((videodata) => {
    //  alert(JSON.stringify(videodata));
    //})
  }

  startScanning() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert('Scanned!');
            window.document.querySelector('ion-content').classList.remove('hidden');

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          window.document.querySelector('ion-app').classList.add('transparentBody');
          //window.document.querySelector('ion-content').classList.add('transparentBody');
          window.document.querySelector('ion-content').classList.add('hidden');

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          alert('Camera permission denied permanently');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          alert('Camera permission denied temporarily');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  startPlaying() {
    let nativeAudio = this.nativeAudio;
    nativeAudio.preloadSimple('uniqueId1', 'assets/imgs/track.mp3').then(() => {
      nativeAudio.play('uniqueId1', () => alert('Audio is done playing'));
    }, (onError) => alert('Error loading audio: ' + onError));

  }

  getLocation() {
    this.geoLocation.getCurrentPosition().then((resp) => {
      alert('Location: ' + resp.coords.latitude + ' ' + resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  setFontSize(size: string) {
    window.document.querySelector('ion-content').classList.remove('font-smaller');
    window.document.querySelector('ion-content').classList.remove('font-bigger');
    window.document.querySelector('ion-content').classList.remove('font-normal');
    window.document.querySelector('ion-content').classList.add('font-' + size);
  }

}
