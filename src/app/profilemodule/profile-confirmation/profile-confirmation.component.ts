import { ProfileEditComponentComponent } from './../profile-edit-component/profile-edit-component.component';
import { ProfileConfirmationService } from './profile-confirmation.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'projects/customers/src/app/data-models';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDataOpinions } from '../profile-edit-component/profile-edit-component.component';

@Component({
  selector: 'app-profile-confirmation',
  templateUrl: './profile-confirmation.component.html',
  styleUrls: ['./profile-confirmation.component.scss']
})
export class ProfileConfirmationComponent implements OnInit {
  form: any;
  dataAccessRule: any;
  superUserId: any;
  userRole: any;
  userDetailsAuth: any = null; //user details from auth module
  accountType: any;
  id: any;
  attachmentSize:any;
  userid: any;
  userDetails: Observable<Profile>;
  userId: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public value: DialogDataOpinions,   public dialogRef: MatDialogRef<ProfileEditComponentComponent>, 
  private snack: MatSnackBar, private storage: AngularFireStorage,     private afAuth: AngularFireAuth,
  public db: ProfileConfirmationService,) {
    this.id = firebase.default.auth().currentUser.uid;
    if (this.id) this.db.getNews('/users', this.id).pipe(take(1)).subscribe(p => this.form = p);
    this.afAuth.authState.subscribe((user) => {
      this.userDetailsAuth = user;
      this.userId = this.userDetailsAuth.uid;
      //Get the user profile for the signed in users
      this.userDetails = this.db.getUsers(this.userId);
      this.userDetails.subscribe((data) => {

        if (data) {
          if (data.superUserId) {
            //If the superuserid is set assign it
            this.superUserId = data.superUserId;
          } else {
            //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
            this.superUserId = this.userId;
          }

          this.dataAccessRule = data.dataAccessRule;
          this.userRole = data.userRole;
          this.accountType = data.accountType;

          //Read the customer form customization settings
          this.db.getUserSettings(this.superUserId).subscribe((data) => {

            this.attachmentSize=data.totalAttachmentsSize;
            if(!this.attachmentSize){
              this.attachmentSize=0;
            }
          });
        }})

          // console.log(this.custId,this.superUserId)



          
        
    
      //Get the username of the logged in account
 
    });
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
  deletedServiceProfile(uid, id, url) {
    // this.db.deleteServices(uid,id);
    this.db.deleteServicesPP(this.form?.publicProfileID, id);
    if (url != "default") {
      let docRef = this.storage.refFromURL(url);
      docRef.delete();
    }
    this.dialogRef.close();
    this.snack.open("Service was deleted successfully", "done", {
      duration: 5000,
    });
  }
  deletedAttachmentProfile(uid: string, id: string, path: string, url: string) {
    this.db.deleteAttachmentProfile(this.form?.publicProfileID, id);

    this.dialogRef.close();

    this.snack.open("Attachment was deleted successfully", "done", {
      duration: 5000,
    });
    // let docRef = this.storage.refFromURL(url);
    // docRef.delete();
    // const storageRef = firebase.default.storage().ref();
    // var desertRef = storageRef.child(path);

    //   desertRef.delete().then(() => {

    //   })
    // --------------------------------------------------------------------------

    const storageRef = firebase.default.storage().ref();

    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    // Delete the file
    desertRef.delete().then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
    // [END storage_delete_file]

    // --------------------------------------------------------------------------
  }
  deletedImg(id: string, path: string, pathT) {
    // this.db.deleteImg(id);
    this.db.deleteImgOrginal(this.form?.publicProfileID, id)

    // let pictureRef = this.storage.refFromURL(pathT);
    // pictureRef.delete();
    const storageRef1 = firebase.default.storage().ref();
    var desertRef = storageRef1.child(pathT);

    desertRef.delete().then(() => {

    })

    const storageRef = firebase.default.storage().ref();
    var desertRef = storageRef.child(path);

    desertRef.delete().then(() => {

    })
    // let pictureRefT = this.storage.refFromURL(pathT);
    // pictureRefT.delete();
    this.dialogRef.close();
    // console.log("delete success");

    this.snack.open("Image was deleted successfully", "done", {
      duration: 5000,
    });
  }

}
