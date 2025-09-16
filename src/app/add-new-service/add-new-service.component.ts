/*********************************************************************************
Description: Used as a popup from for CRU operation of services in public profile
Inputs:
Outputs: 
***********************************************************************************/

import { ServiceData, uploadGallery, ProfileEditComponentComponent } from './../profilemodule/profile-edit-component/profile-edit-component.component';
import { ProfileServices } from './../data-models';
import { AddNewServiceService } from './add-new-service.service';
import { Component, HostListener, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, takeUntil} from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { Currencies } from '../currencies';

@Component({
  selector: 'app-add-new-service',
  templateUrl: './add-new-service.component.html',
  styleUrls: ['./add-new-service.component.scss']
})
export class AddNewServiceComponent implements OnInit , OnDestroy {
  checked: boolean = false;//for storing the boolean value of pricing details
  user: any;//for storing user details
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  serviceData: ProfileServices = {//used to store values in form with data type profile service
    imageURL: null,
    title: null,
    description: null,
    currency: null,
    price: null,
    unit: null,
    rateFixed: true,
    pricing: false,
    imagePath: null,
    date: null,
    id: null
  };
  taskUploadImage: AngularFireUploadTask;//used for uploading service images
  id: any;//used for storing users id
  pricing: boolean//boolean for checking pricing checkbox selected
  dbL: boolean = true;//used to check database has the service image uploaded or not
  prvL: boolean = false;//boolean used to check the service image is uploaded now and preview is present
  currencyValue: string;//variable to store value of currency
  currencyList: any = [];//array used to store currency list from common service file
  imageURL: string;//used to store uploaded images url
  snapshot: any;//used to capture upload status while uploading service image
  superUserId: any;//for storing the super users id
  downloadURL: Observable<string>;//to store download url of service image while uploading
  percentage: any;//used to store upload percentage of service image
  defaultImage: string = "https://firebasestorage.googleapis.com/v0/b/zenysdevelopment-f6491.appspot.com/o/Templates%2Fdefault-image-720x530.jpg?alt=media&token=bfdf9a1d-25a8-4b82-a5c0-fac10a0d3759"//used to store default service images
  imagePath: string;//to store uploaded service images path
  userId: any;//used for storing users id
  userDetailsSubscription: Subscription;//subscription for userdetails
  serviceSubscription: Subscription;//subscription for service while updating
  rate: boolean;//used to store boolean value such as fixed rate or starting rate
  constructor(@Inject(MAT_DIALOG_DATA) public value: ServiceData,
    public commonService: CommonService, @Optional() @Inject(MAT_DIALOG_DATA) public data: uploadGallery, private db: AddNewServiceService, private storage: AngularFireStorage, public dialogRef: MatDialogRef<ProfileEditComponentComponent>, private _snackBar: MatSnackBar) {
    this.rate = false;//defaulting rate to starting rate
    this.currencyList = Currencies.getCurencies();//for getting currency from common service file
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      //getting data from common service file related to the user
      (allData) => {
        if (allData) {
     
          this.userId = allData.userId;
          //condition to check where the user is a super user or not
          if (allData.userDetails.superUserId) {
            this.superUserId = allData.userDetails.superUserId;
            this.currencyValue = allData.userDetails.currency

          }
          else {
            this.superUserId = allData.userId;
            this.currencyValue = allData.superUserDetails.currency

          }
          //checking whether service id is present if so consider it to be update
          if (this.value.serviceId) {
            //getting details or service while in update mode using service id
            this.serviceSubscription = this.db.getServiceDetails(this.data.profileId, this.value.serviceId).pipe(takeUntil(this.onDestroy$)).subscribe(p => {
              this.serviceData = p;
              this.checked=p?.pricing;
              this.rate = p?.rateFixed;
              this.currencyValue = p?.currency

            });
          }
          else {

          }
        }
      })
  }

  ngOnInit(): void {

  }
  TypeError() {
    //showing error in the toastng window
    this._snackBar.open("Please fill mandatory field", " ", {
      duration: 2000,
    });

  }

 uploadImage() {
    //event listner to upload service image
    let element: HTMLElement = document.getElementsByClassName('logo-selector')[0] as HTMLElement;
    element.click();
  }

  startUploadImage(event: FileList) {
    //uploading service images to firestore
    const file = event.item(0)
    //setting path of upload 
    const logoPath = `profile/${this.id}/${Date.now()}`;
    const customMetadata = { app: 'mvp!' };
    //uploading image using storage
    this.taskUploadImage = this.storage.upload(logoPath, file, { customMetadata })
    //enabling database image disabled and new image enabled
    this.dbL = false;
    this.prvL = true;
    //getting reference from uploaded data to get uploaded images url
    const ref = this.storage.ref(logoPath);
    this.taskUploadImage.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL()
        this.downloadURL.subscribe(url => (this.imageURL = url));
      })
    )
      .subscribe();


  }
  //used for enabling pricing as starting price true while pricing details checked
  check(e) {
    if (this.checked == true) {
      this.pricing = true;
    }
    else {
      this.pricing = false;
    }
  }
  //for submiting form details same for update and create
  onSubmit(form) {
    //if pricing details is checked
    if (this.checked) {
      form.value.pricing = true;
    }
    if (!this.checked) {
      form.value.pricing = false;
    }
    //setting default unit as empty
    if (!form.value.unit) {
      form.value.unit = " ";
    }
    //if service id is present its consider to update mode or else create mode
    if (!this.value.serviceId) {
      //setting default image url as default
      if (!this.imageURL) {
        this.imageURL = "default";
      }
      //setting pricing details as false
      if (form.value.active) {
        form.value.active = false;
      }

      let date = new Date().getTime();//for getting create time
      //creating new service file to db
      this.db.createService(this.data.profileId, date, form.value, this.imageURL);

      this.dialogRef.close();
      //if any case fail to get public profile id 
      if (this.data.profileId) {
        this._snackBar.open("Products and Services added successfully", " ", {
          duration: 2000,
        });
      }
      else {
        this._snackBar.open("service creation failed try again", " ", {
          duration: 2000,
        });
      }
    }
    //if in update mode
    if (this.value.serviceId) {
      //if image not uploaded
      if (!this.imageURL) {
        //updating service according to form if no image is uploaded
        this.db.updateService(this.data.profileId, this.value.serviceId, form.value);
        //close popup
        this.dialogRef.close();
        //if any case fail to get public profile id 
        if (this.data.profileId) {
          this._snackBar.open("Products and Services updated successfully", " ", {
            duration: 2000,
          });
        }
        else {
          this._snackBar.open("service creation failed try again", " ", {
            duration: 2000,
          });
        }

      }
      //if image uploaded
      if (this.imageURL) {
        //updating service according to form if image is uploaded
        this.db.updateService1(this.data.profileId, this.value.serviceId, form.value, this.imageURL);
        //close popup
        this.dialogRef.close();
        //if any case fail to get public profile id 
        if (this.data.profileId) {
          this._snackBar.open("Products and Services added successfully", " ", {
            duration: 2000,
          });
        }
        else {
          this._snackBar.open("service creation failed try again", " ", {
            duration: 2000,
          });
        }
      }
    }
  }
  close() {
    //for closing popup
    this.dialogRef.close();
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //for unsubscribing subscription
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.serviceSubscription?.unsubscribe;
    this.userDetailsSubscription?.unsubscribe;

  }


}
