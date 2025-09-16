import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class PushnotificationService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private deviceService: DeviceDetectorService
  ) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
    afAuth.authState.subscribe((user) => {
      // this.user = user
      if (user) {
        // console.log(user.uid)
        this.requestPermission(user.uid)
        this.receiveMessage()

      }

    })


  }
  requestPermission(userUid) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (token) {
          this.db.firestore.collection('Devices').where('token', '==', token).where('userUid', '==', userUid).get().then((devices) => {
            // console.log(devices)
            if (devices.empty) {
              // console.log("device not registered")
              const deviceInfo = this.deviceService.getDeviceInfo();
              const data = {
                token: token,
                userUid: userUid,
                deviceType: 'web',
                deviceInfo: {
                  browser: deviceInfo.browser,
                  userAgent: deviceInfo.userAgent
                },
                createdAt: Date.now()
              };
              this.db.firestore.collection('Devices').add(data).then(() => {
                // console.log('New Device Added');
              });
            }
            else{}
              //console.log("device user combination already exist")
          });
        }
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        //console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

}
