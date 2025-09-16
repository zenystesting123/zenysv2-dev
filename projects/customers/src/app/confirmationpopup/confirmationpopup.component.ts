// import { DialogDataOpinion } from './../profile/profile.component';
import { ConfirmationpopupService } from './confirmationpopup.service';
import { TaskboardComponent } from './../taskboard/taskboard.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Profile } from '../data-models';
import { AngularFireAuth } from '@angular/fire/auth';
export interface DialogDataOpinion {

  taskId: string
  smode: string;
  path: string;
  stage:string;
}

@Component({
  selector: 'app-confirmationpopup',
  templateUrl: './confirmationpopup.component.html',
  styleUrls: ['./confirmationpopup.component.scss']
})
export class ConfirmationpopupComponent implements OnInit {
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
  constructor(@Inject(MAT_DIALOG_DATA) public value: DialogDataOpinion,
  private snack: MatSnackBar, private storage: AngularFireStorage,
  private afAuth: AngularFireAuth,
  public dialogRef: MatDialogRef<TaskboardComponent>,
  public db: ConfirmationpopupService,) {
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
  deleted(id: string,superId) {
    this.db.deleteT(id,superId);

      this.dialogRef.close();



    this.snack.open("Task was deleted successfully", "done", {
      duration: 5000,
    });
  }
  deletedAttachment(uid: string, sid: string, id: string, path: string, url: string,size:any) {
    this.db.deleteAttachment(uid, sid, id);
    let newSize=this.attachmentSize-size;
    this.db.updateSize(uid,newSize)
    this.dialogRef.close();
    this.snack.open("Attachment was deleted successfully", "done", {
      duration: 5000,
    });

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
  deletedAttachmentCust(uid: string, cid: string, id: string, path: string, url: string,size:any) {
    this.db.deleteAttachmentCust(uid, cid, id);
    let newSize=this.attachmentSize-size;
    this.db.updateSize(uid,newSize)
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
  completed(id: string,superId) {
    this.db.updateTaskStatus(id,superId);
    this.dialogRef.close();
    this.snack.open("Task updated as completed", "done", {
      duration: 5000,
    });
  }
  close() {
    this.dialogRef.close();
  }

}
