import { FileUpload ,Profile } from './../data-models';
import { ImageUploadService } from './image-upload.service';
import { Component, OnInit, Directive, HostListener, Output, EventEmitter } from '@angular/core';
import {  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { finalize, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage,AngularFireUploadTask,AngularFireStorageReference} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent  {

   //can adjust image size limiter
   imagesize:number=256000;
   form:any;
   id:string;
   task:AngularFireUploadTask;
   percentage1:Observable<number>;
   percentage2:Observable<number>;
   snapshot: Observable<any>;
   downloadURL:Observable<string>;
   downloadURL1:Observable<string>;
   // downloadUR:Observable<string>;
   isHovering:boolean;
   user:firebase.default.UserInfo ;
   profile:  AngularFirestoreCollection<Profile>;
   [signpath: string]: any;
   ref: AngularFireStorageReference;
   idlink= firebase.default. storage();
   pathReference:any;
   link:any;
   view:string="choose";
   sign:string;
   logo:string;
   dbL:boolean=true;
   prvL:boolean=false;
   dbS:boolean=true;
   prvS:boolean=false;
   selectedFiles: FileList;
   currentFileUpload: FileUpload;
   progress: { percentage: number } = { percentage: 0 };
   // signpath:any;
   // @Output() dropped = new EventEmitter<FileList>();
   // @Output() hovered = new EventEmitter<boolean>();
 
   
   
 
   constructor(
               private refer: ChangeDetectorRef,
               private router: Router,
               private route:ActivatedRoute,
               public db:ImageUploadService ,
               private afAuth : AngularFireAuth,
               private dbr: AngularFirestore,
               private storage:AngularFireStorage,
               private snack: MatSnackBar
              //  public toastr: ToastrService
               // private usersCollection: AngularFirestoreCollection,
               ) {
 
                 this.profile = this.dbr.collection('profile', (ref) => ref.orderBy('createdOn'));
                 this.id=this.route.snapshot.paramMap.get('id');
                 if(this.id) this.db.getNew("/profile",this.id).pipe(take(1)).subscribe(p=>this.form=p);
                 afAuth.authState.subscribe(user => this.user=user);
 
                         // console.log(this.user.uid);   
                // setInterval(()=>{
                //   console.log(this.image)
                // },300)
   }
 
 
 
 
 
 
 
   @HostListener('drop',['$event'])
   onDrop($event)
   {
     $event.preventDefault();
     this.dropped.emit($event.dataTransfer.files);
     this.hovered.emit(false);
 
   }
   @HostListener('dragover',['$event'])
   onDragLeave($event)
   {
     $event.preventDefault();
     this.hovered.emit(false);
 
   }
 
 
   toggleHover(event:boolean){
     this.isHovering=event;
 
   }
   openL() {

    let element: HTMLElement = document.getElementsByClassName('logo-selector')[0] as HTMLElement;
    element.click();
  }
 
   startUpload(event: FileList){
     const file =event.item(0)
 
     if(file.type.split('/')[0] !== 'image')
     {
      this.snack.open("Please upload a image file ", "ok", {
        duration: 5000,
      });
       return;
     }
     if(file.size>this.imagesize){
      this.snack.open("size of logo must be below 250kb", "ok", {
        duration: 5000,
      });
         
       return ;
     }
 
     const logopath = `logo/${this.user.uid}`;  
     const customMetadata = { app: 'mvp!'};
     this.task= this.storage.upload(logopath,file,{ customMetadata })
 
     this.db.updateImg1("users",this.user.uid, logopath );
     
 
    
 
     this.percentage1=this.task.percentageChanges();
     // const downloadUR=this.task.task.snapshot.ref.getDownloadURL()
     // console.log(downloadUR)
 
 
     const ref = this.storage.ref(logopath);
    //  console.log('Image uploaded!');

     this.task.snapshotChanges().pipe(
     finalize(() => {
       // console.log(this.downloadURL)
   
 
       this.downloadURL = ref.getDownloadURL();
       // console.log(this.downloadURL);
     
       this.downloadURL.subscribe(url => (this.logo = url));
       this.prvL=true;
       this.dbL=false;
       // this.db.updateurl1("users",this.user.uid,this.url );
       // this.dbr.doc('users/' + this.user.uid + this.downloadURL).update(this.downloadURL);
       // this.dbr.collection('users/' + this.user.uid + '/customers').add(this.url);
       // console.log(this.url)
       // console.log(this.downloadURL)
     })
     )
     .subscribe();
 
 
     }
 
 

 
   toggleHover1(event:boolean){
     this.isHovering=event;
 
   }
   openS() {
    let element: HTMLElement = document.getElementsByClassName('sign-selector')[0] as HTMLElement;
    element.click();
  }
   startUpload1(event: FileList){
     const file =event.item(0)
 
     if(file.type.split('/')[0] !== 'image')
     {
      this.snack.open("Please upload a image file ", "ok", {
        duration: 5000,
      });
       return;
     }
     if(file.size>this.imagesize){
      this.snack.open("size of logo must be below 250kb", "ok", {
        duration: 5000,
      });
         
       return ;
     }
     const signpath = `sign/${this.user.uid}`;
     const customMetadata = { app: 'mvp!'};
     this.task= this.storage.upload(signpath,file,{ customMetadata })
 
 
     // this.dbr.collection('users/' + this.user.uid+'/signature').add({ path });
     // this.db.update("/users",this.user.uid,){ path });
     this.db.updateImg2("users",this.user.uid, signpath );
     // this.dbr.doc('users/' + this.user.uid  + '/sign'+signpath);
 

 
     this.percentage2=this.task.percentageChanges();
     // this.snapshot=this.task.snapshotChanges().pipe(
     //   tap(snap => {
     //     if(snap.bytesTransferred===snap.totalBytes){
     //       // console.log("working start!")
     //       // this.dbr.collection("photos").add({ path,size:snap.totalBytes});
     //       console.log("working end!")
     //     }
     //   })
     // )
 
     const ref = this.storage.ref(signpath);
    
 
     //  this.link=this.task.task.snapshot.ref.getDownloadURL()
     //  console.log(this.link);
       
 
     this.task.snapshotChanges().pipe(
     finalize(() => {
       // console.log(this.downloadURL1)
       this.downloadURL1 = ref.getDownloadURL()
      
       this.downloadURL1.subscribe(url1 => (this.sign = url1));
       this.prvS=true;
       this.dbS=false
     })
     )
     .subscribe();
     // this.downloadURL=this.task.downloadURL();
   }
   logoStatusUpdate(){
    this.db.logoStatus(this.user.uid,this.logoStatus);
   }
   signStatusUpdate(){
    this.db.signStatus(this.user.uid,this.signStatus);
   }
  }