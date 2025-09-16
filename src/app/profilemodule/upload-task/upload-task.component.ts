import { uploadGallery } from './../profile-edit-component/profile-edit-component.component';
import { UploadTaskService } from './upload-task.service';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { Profile } from 'projects/customers/src/app/data-models';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  uid:string
  @Input() file: File;
  @Input() ProfileId: any;
  task: AngularFireUploadTask;
  user:firebase.default.UserInfo ;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  thumbnailURL:any;
  uploadProgress$: Observable<number>
  uploadReset: Observable<number>
  thumbnailURL2:any;
  thumbnailURL3:any;
  templatePath:any
  templatePath2:any;
  templatePath3:any;
  uploadComplete:boolean=false;
  thumb1:boolean=false;
  superUserId:any;
  thumb2:boolean=false;
  urlArray: string[] = [];
  form:any;
  userId:any;
  orginalId:string;
  userDetails: Observable<Profile>;
  constructor(private storage: AngularFireStorage,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: uploadGallery,
    private snack: MatSnackBar,private afAuth: AngularFireAuth,
    private db: AngularFirestore,private db1:UploadTaskService) { 
      this.uid = firebase.default.auth().currentUser.uid

  }

  ngOnInit() {

    this.startUpload();
  }

  startUpload() {

    // The storage path

    let downloadUrl : string[] = [];
    let str1 = this.file.name.split(".");
 
    let thumbname=str1[0]+"_720x480.webp";
    let thumbname2=str1[0]+"_1920x1080.webp";
    let thumbname3 = str1[0] + "_375x250.webp";
    const path = `gallery/${this.uid}/${Date.now()}_${this.file.name}`;
    this. templatePath= `gallery/${this.uid}/thumbnails/${Date.now()}_${thumbname}`
    this. templatePath2=`gallery/${this.uid}/thumbnails/${Date.now()}_${thumbname2}`
    this. templatePath3=`gallery/${this.uid}/thumbnails/${Date.now()}_${thumbname3}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file)
   
    // Progress monitoring
    this.uploadProgress$ = this.task.percentageChanges();


    
            // console.log("1",this.urlArray)
  }
  // display(perc){
  //   console.log(perc)
  // }
  resetBar(){
    this.uploadProgress$ =this.uploadReset;
    this.snack.open("Image uploaded successfully", "done", {
      duration: 5000,
    });
    setTimeout(()=>{
      var intv=setInterval(()=>{
      firebase.default.storage()
          .ref(this.templatePath).getDownloadURL()
          .then((url) => {
            this.thumbnailURL = url;  
      
            this.thumb1=true;
          
        })
        firebase.default.storage()
        .ref(this.templatePath2).getDownloadURL()
        .then((url) => {
          this.thumbnailURL2 = url;  
     
          this.thumb2=true;

      })
      firebase.default.storage()
      .ref(this.templatePath3).getDownloadURL()
      .then((url) => {
        this.thumbnailURL3 = url;  
  
        this.thumb1=true;
      
    })

    
  
        if(this.thumb1&&this.thumb2){
          let datePlaced = new Date().getTime();
          // this.db.collection('users/' + this.uid + '/gallery/' ).add( { downloadURL: this.thumbnailURL2,thumbnailURL:this.thumbnailURL, date:datePlaced,path:templatePath2,templatePath:templatePath })
          this.db.collection('public-profile/' + this.ProfileId + '/gallery/' ).add( { downloadURL: this.thumbnailURL2,thumbnailURL:this.thumbnailURL,thumbnailMob:this.thumbnailURL3, date:datePlaced,path:this.templatePath2,templatePath:this.templatePath,pathMob:this. templatePath3 })

          // this.db.collection('users/' + this.uid + '/gallery/' ).add( { downloadURL: this.thumbnailURL2,thumbnailURL:this.thumbnailURL, date:datePlaced,path:templatePath2,templatePath:templatePath })


          console.log("written to db");
          clearInterval(intv);
        }
     
        
       },200)
      },5000)
  }
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}