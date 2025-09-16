import { DialogDataImage, ProfileEditComponentComponent } from './../profile-edit-component/profile-edit-component.component';
import { GalleryImagesService } from './gallery-images.service';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gallery } from '../../data-models';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-gallery-images',
  templateUrl: './gallery-images.component.html',
  styleUrls: ['./gallery-images.component.scss']
})
export class GalleryImagesComponent implements OnInit {
  gallery: Gallery[];
  imageUrl: any;
  user: any
  isTabletsize:boolean=false;
  isMobilesize:boolean=false;
  maxIndex: number = 1;
  // eachUrl:string[];
  eachUrl: Array<any> = [];
  index: number = 1;
  id: any;
  forms: any;
  constructor(@Inject(MAT_DIALOG_DATA) public value: DialogDataImage,
  private breakpointObserver: BreakpointObserver,   private afAuth: AngularFireAuth, public db: GalleryImagesService, public dialogRef: MatDialogRef<ProfileEditComponentComponent>, private elementRef: ElementRef) {
   
      breakpointObserver.observe([
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.isTabletsize = true;
        }
        else {
          this.isTabletsize = false;
        }
      });
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.isMobilesize = true;
        }
        else {
          this.isMobilesize = false;
        }
      });
    //   this.id = firebase.default.auth().currentUser.uid;
    // if (this.id) this.db.getNew('/users', this.id).pipe(take(1)).subscribe(p => this.forms = p);
  }

  ngOnInit(): void {

    var myVar = setInterval(() => {
      if (!this.value.userId) {


        
           
            this.db.getGallery(this.forms?.publicProfileID).subscribe(data => {
              this.gallery = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data() as {}
                } as Gallery
              });

            })
       
      }
      if (this.value.userId) {


       
            this.db.getGallery(this.value.userId).subscribe(data => {
              this.gallery = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data() as {}
                } as Gallery
              });

       
        })
      }
      if (this.gallery) {
        this.index = this.value.imageId;
        this.maxIndex = this.gallery?.length;

        for (let j = 0; j < this.gallery.length; j++) {
          // console.log(this.gallery[j].downloadURL)
          this.eachUrl.push(this.gallery[j].downloadURL)
          //  this.imageUrl.push(this.eachUrl)

        }
        clearInterval(myVar);
      }
    }, 200)


  }
  close() {
    this.dialogRef.close();
  }
  next() {
    this.index++;
    if (this.index >= this.maxIndex) {
      this.index = 0;
    }
  }
  prev() {

    this.index--;
    if (this.index < 0) {
      this.index = this.maxIndex - 1;
    }
  }
  //   ngAfterViewInit(){
  //     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  //  }
}
