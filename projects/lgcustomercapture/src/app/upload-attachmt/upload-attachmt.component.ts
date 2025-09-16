import { Component, OnInit } from '@angular/core';
import { Upload } from '../data-model';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadAttachmtService } from './upload-attachmt.service';

@Component({
  selector: 'app-upload-attachmt',
  templateUrl: './upload-attachmt.component.html',
  styleUrls: ['./upload-attachmt.component.scss']
})
export class UploadAttachmtComponent implements OnInit {

  user= null
  imageSrc: string | ArrayBuffer = null;
  urlDownload = ''; //url using for download
  private basepath: string = '/attachment/CTHSx7bZtEO79BS4B3AfKhOq2ZJ3/customer'; //uploads folder under files in Firebase Storage
  private uploadTask: firebase.default.storage.UploadTask; //for upload file method

  constructor(
    private _snack: MatSnackBar,
    private serviceInstance: UploadAttachmtService
    ) {
    this.serviceInstance.getNew().subscribe(user=>{
      this.user = user;
      console.log(user);
    })
  }

  ngOnInit(): void {
  }
  uploadDocument(){
    let element: HTMLElement = document.getElementsByClassName(
      'attachment-selector'
    )[0] as HTMLElement;
    element.click();
  }

  upload($event) {
    // this.loader = true;
    if ($event.target.files && $event.target.files[0]) {
      const file = $event.target.files[0];
      // if (file.size > 512000) {
      //   this.loader = false;
      //   this.dialog.open(ConfirmationpopupComponent, {
      //     width: '300px',
      //     data: {
      //       smode: 'employeePhotoSize',
      //     },
      //   });
      // } else {
        // preview showing codes
        const reader = new FileReader();
        reader.onload = (e) => (this.imageSrc = reader.result);

        reader.readAsDataURL(file);
        // delete already existing from storage if scenario is edit
        // if (this.data.scenario == 'view' && this.UrlToDelete) {
        //   return this.storageFire.storage
        //     .refFromURL(this.UrlToDelete)
        //     .delete()
        //     .then((res) => {
        //       // codes for firebase storage
        //       let currentupload = new Upload(file);
        //       this.pushUpload(currentupload);
        //     });
        // } else {
          // codes for firebase storage
          let currentupload = new Upload(file);
          this.pushUpload(currentupload);
        // }
      // }
    }
  }

  // selected file after limit check is uploading to firebase storage
  pushUpload(upload: Upload) {
    let storageRef = firebase.default.storage().ref();
    this.uploadTask = storageRef
      .child(`${this.basepath}/${upload.file.name}`)
      .put(upload.file);

    this.uploadTask.on(
      firebase.default.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storageRef
          .child(`${this.basepath}/${upload.file.name}`)
          .getDownloadURL()
          .then((ref) => {
            this.urlDownload = ref;
            if (this.urlDownload) {
              // this.loader = false;
              upload.url = this.urlDownload;
              upload.name = upload.file.name;
              this.serviceInstance.attachmentsToCollection(
                upload.name, upload.url, `${this.basepath}/${upload.file.name}`, new Date().getTime(), `${this.user.firstname} ${this.user.lastname}`, upload.file.size
              ).then(res =>{
                // this.uploadAttachmentSizeCust.updateSize(this.superUserId, newSize);
                this._snack.open('Attachment added successfully', '', {
                  duration: 2000,
                });
              }).catch(e =>{
                this._snack.open('Error!!! Attachment not added', '', {
                  duration: 2000,
                });
              })

            }
          });
      }
    );
  }

}
