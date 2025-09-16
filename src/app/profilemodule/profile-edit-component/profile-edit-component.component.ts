
/*********************************************************************************
Description: component used for profile CRU operation
Inputs: profile images/service data/gallery images
Outputs:
***********************************************************************************/
import { HostListener, OnDestroy } from '@angular/core';
import { StatusPopupComponent } from './../../settings/status-popup/status-popup.component';
import { SearchService } from './../../search/search.service';
import { ProfileConfirmationComponent } from './../profile-confirmation/profile-confirmation.component';
import { ProfileEditComponentService } from './profile-edit-component.service';
import { Gallery, ProfileServices } from './../../data-models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { finalize, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { GalleryImagesComponent } from '../gallery-images/gallery-images.component';
import { AddNewServiceComponent } from '../../add-new-service/add-new-service.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonService } from 'src/app/common.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { getCountryCodes } from 'src/app/countryCode';
import { Location } from '@angular/common';


//interface to upload imeg details to dialog
export interface DialogDataOpinions {

  taskId: string
  smode: string;
  path: string;
  stage: string;
}
export interface DialogDataOpinion {

  taskId: string
  smode: string;
  path: string;
  stage:string;
  superUserId:string;
  userId:string;
  userName:string;
  fieldNameContactNotes:string;
  customerId:string,
  GAevent:string,
  changeLog:any
  reportSettingArray:any;
  reportId:string,
  reportsArray:any,
  currentDashboardId:string
}
export interface DialogDataImage {
  userId: any,
  imageId: any,
  orginalId: any,
  orginalPath: any;
  imageLink: string,
  path: string,

}
export interface uploadGallery{
  profileId:any;
}
export interface ServiceData {

  serviceId: any,


}
@Component({
  selector: 'app-profile-edit-component',
  templateUrl: './profile-edit-component.component.html',
  styleUrls: ['./profile-edit-component.component.scss']
})

export class ProfileEditComponentComponent implements OnInit, OnDestroy {

  protected onDestroy$ = new Subject<void>();//to set ondestroy
  firstFormGroup: FormGroup;//form group to show profile form and profile images in first mat tab
  secondFormGroup: FormGroup;//form group to show gallery and service in second mat tab
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;//to get google places api for address
  formattedAddress = "";//default value for address field
  profileState: string;//storing profile state
  filesvalue: File[] = [];//for storing profile image in array
  files: File[] = [];//to store gallery image while uploading
  isHovering: boolean;//boolean for checking is image hovering in gallery drag and drop
  submittedPro: boolean = false;//to check profile data is submitted while creating
  uploadReset: Observable<number>//to reset upload funtionality while
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  uploadProgressImage1: Observable<number>//to store profile image 1 upload status
  uploadProgressImage2: Observable<number>//to store profile image 2 upload status
  uploadProgressImage3: Observable<number>//to store profile image 3 upload status
  dpUploaded: boolean;//boolean to check is dp is uploaded or not
  profileDistrict: any[];//to store district of profile
  profileDetails: any;//variable is store users profile details while updating
  profileAct: boolean = true;//to check is the is activated or not
  locationId: any;//to store unique id of location selected by places api
  isTabletsize: boolean = false;//to check whether screen resolution is tablet
  isMobilesize: boolean = false;//to check whether screen resolution is mobile
  categories: string;//to store category of profile
  templatePathImage1MediumQty: any;//to store path of profile image 1 medium quality
  templatePathImage1HighQty: any;//to store path of profile image 1 high quality
  templatePathImage1LowQty: any;//to store path of profile image 1 low quality
  templatePathImage2MediumQty: any;//to store path of profile image 2 medium quality
  templatePathImage2HighQty: any;//to store path of profile image 2 high quality
  templatePathImage2LowQty: any;//to store path of profile image 2 low quality
  templatePathImage3MediumQty: any;//to store path of profile image 3 medium quality
  templatePathImage3HighQty: any;//to store path of profile image 3 high quality
  templatePathImage3LowQty: any;//to store path of profile image 3 low quality
  thumbnailUrlImage1MediumQty: string;//to store url of profile image 1 medium quality
  thumbnailUrlImage1HighQty: string//to store url of profile image 1 high quality
  thumbnailUrlImage1LowQty: string//to store url of profile image 1 low quality
  thumbnailUrlImage2MediumQty: string;//to store url of profile image 2 medium quality
  thumbnailUrlImage2HighQty: string//to store url of profile image 2 high quality
  thumbnailUrlImage2LowQty: string//to store url of profile image 2 low quality
  thumbnailUrlImage3MediumQty: string;//to store url of profile image 3 medium quality
  thumbnailUrlImage3LowQty: string//to store url of profile image 3 low quality
  thumbnailUrlImage3HighQty: string//to store url of profile image 3 high quality
  sublocality: any = "";//to store sublocality of profile
  profileCountry: string;//to store country of profile
  profileLocality: any;//to store locality of profile
  profileStreet: any;//to store street of profile
  gallery: Gallery[]=[];//to store gallery images array
  ProfileImage1: any = "assets/images/default.png";//getting profile image 1 url as default
  ProfileImage2: any = "assets/images/default.png";//getting profile image 2 url as default
  ProfileImage3: any = "assets/images/default.png";//getting profile image 3 url as default
  profileImages: Gallery[]=[];//to store profile images
  profileService: ProfileServices[]=[];//to store services in profile
  mode: string;//to store mode of form update/create
  fullAddress: any;//to store full address of profile
  locationIds: any;//to store location id from places api
  public userDetailsSubscription: Subscription;//subscription for userDetails
  userGallerySubscription: Subscription;//subscription for gallery
  userProfileImageSubscription: Subscription;//subscription for profile image
  userProfileSubscription: Subscription;//subscription for users profile details
  userServiceSubscription: Subscription;//subscription for profiles services
  countryCode: any;//to store country of profile
  hiddenProfile: boolean = false;//to hide profile details while creating
  profileId: string;//to store user id
  categoryList: string[] = [];//to store category list
  tasks: any;//task for uploading profile images
  userId: any;//to store user id
  publicProfileId: any;//to store public profile ID
  dpImageDownload: Observable<any>;//observavble to get dp image
  userDp: any;//to store users dp url
  constructor(
    private analytics: AngularFireAnalytics,
    private searchService: SearchService,
    private _bottomSheet: MatBottomSheet,
    public commonService: CommonService,
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    private router: Router,
    private _snackBar: MatSnackBar,
    private db: ProfileEditComponentService,
    private route: ActivatedRoute,
    private loc: Location
  ) {
    //Check screen size form common service file
    if (this.commonService.isTabletsize) {
      this.isTabletsize = true;
    }
    else {
      this.isTabletsize = false;
    }
    if (this.commonService.isMobilesize) {
      this.isMobilesize = true;
    }
    else {
      this.isMobilesize = false;
    }
    //getting service from service
    this.categoryList = this.searchService.getCategory()
    this.countryCode = "+91";
    this.mode = this.route.snapshot.paramMap.get('mode');
    //to get id from route
    this.profileId = this.route.snapshot.paramMap.get('id');
    //hidding upload datas if in create mode
    if (this.profileId == 'new') {
      this.hiddenProfile = true;
    }
    //getting values from user details in common service file
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          //geting profile ID from common service
          this.publicProfileId = allData.userDetails.publicProfileID;
          this.userId = allData.userId;
          if (allData.userDetails.publicProfileID) {
            //getting values form profile if its in update mode

              this.userProfileSubscription = this.db.getProfile('/public-profile', allData.userDetails.publicProfileID).pipe(take(1)).subscribe(p => {
                if (p) {
                  //defining all datas to bind in form
                  this.profileDetails = p;
                  this.countryCode = this.profileDetails?.countryCode
                  if (!this.profileDetails?.countryCode) {
                    this.countryCode = "+91";
                  }
                  this.profileCountry = this.profileDetails?.profileCountry;
                  this.profileState = this.profileDetails?.profileState;
                  this.profileDistrict = this.profileDetails?.profileDistrict;
                  this.categories = this.profileDetails?.category;
                  this.profileStreet = this.profileDetails?.profileStreet;
                  this.profileLocality = this.profileDetails?.profileLocality;
                  this.fullAddress = this.profileDetails?.fullAddress;
                  this.locationIds = this.profileDetails?.locationId;
                  this.sublocality = this.profileDetails?.sublocality;
                  this.profileAct = this.profileDetails?.publicProfileActv;
                  //getting dp image if uploaded
                  if (this.profileDetails?.dpImage == true) {
                    const userDp = firebase.default.storage().ref().child('dp/' + this.userId);
                    userDp.getDownloadURL().then(dpUrl => {
                      //to update users dp
                      this.userDp = dpUrl
                    });
                  }
                  //getting gallery images
                  this.userGallerySubscription = this.db.getGallery(this.publicProfileId).subscribe(data => {
                    this.gallery = data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as {}
                      } as Gallery
                    });
                  })
                  //getting profile images
                  this.userProfileImageSubscription = this.db.getProfileImages(this.publicProfileId).subscribe(data => {
                    this.profileImages = data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as {}
                      } as Gallery
                    });
                    //Top 3 images  loading and display default image if not present
                    if (this.profileImages?.length != 0) {
                      //checking corresponding image is present or not
                      let check1 = "1";
                      let check2 = "2";
                      let check3 = "3"
                      let images1 = (check1) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check1)) : this.profileImages;
                      this.ProfileImage1 = images1[0]?.thumbnailURL;
                      let images2 = (check2) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check2)) : this.profileImages;
                      this.ProfileImage2 = images2[0]?.thumbnailURL;
                      let images3 = (check3) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check3)) : this.profileImages;
                      this.ProfileImage3 = images3[0]?.thumbnailURL;
                      //if no image setting default image
                      if (!this.ProfileImage1) {
                        this.ProfileImage1 = "assets/images/default.png";
                      }
                      if (!this.ProfileImage2) {
                        this.ProfileImage2 = "assets/images/default.png";
                      }
                      if (!this.ProfileImage3) {
                        this.ProfileImage3 = "assets/images/default.png";
                      }
                    }
                  })
                  //getting services
                  this.userServiceSubscription = this.db.getServices(this.publicProfileId).subscribe(data => {
                    this.profileService = data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as {}
                      } as ProfileServices;

                    })
                  });
                }
              });

          }
        }
      })
  }
  //google maps api funtion call
  public handleAddressChange(address: any) {
    //defaulting values to null
    this.profileCountry = "";
    this.profileDistrict = null;
    this.profileState = "";
    this.profileStreet = "";
    this.profileLocality = "";
    let addressArray = address.address_components
    //for storing unique id of location
    this.locationId = address.place_id
    //seperating country,district,state,street,locality from address array
    addressArray.forEach(element => {
      if (element.types[0] == 'country') {
        this.profileCountry = element.long_name;
      }
      else if (element.types[0] == 'administrative_area_level_2') {
        this.profileDistrict = element.long_name;
      }
      else if (element.types[0] == 'administrative_area_level_1') {
        this.profileState = element.long_name;
      }
      else if (element.types[0] == 'route') {
        this.profileStreet = element.long_name;
      }
      else if (element.types[0] == 'locality') {
        this.profileLocality = element.long_name;
      }
      else if (element.types[0] == 'sublocality_level_1') {
        this.sublocality = element.long_name;
      }


    });
    //getting address value while updating and creating
    this.fullAddress = address.formatted_address
  }


  ngOnInit(): void {

  }

  TypeError() {
    //showing error in the toastng window

  }

  //while submitting form while creating profile
  onSubmit(form, GAevent) {

    let datePlaced = new Date().getTime();
    //checking for default value
    if (!form.value.website) {
      form.value.website = ""
    }
    if (!form.value.linkedin) {
      form.value.linkedin = ""
    }
    if (!form.value.instagram) {
      form.value.instagram = ""
    }
    if (!form.value.facebook) {
      form.value.facebook = ""
    }
    //checking form mode as create
    if (this.mode == 'create') {

      // adding analytics event
      if (this.isMobilesize) {
        this.analytics.logEvent('btn_create_pubprof_mob')
      } else {
        this.analytics.logEvent(GAevent)
      }

      //creating profile address from places api
      form.value.profileState = this.profileState
      form.value.profileDistrict = this.profileDistrict
      form.value.fullAddress = this.fullAddress
      form.value.locationId = this.locationId
      if (!form.value.locationId) {
        form.value.locationId = this.locationIds
      }
      form.value.profileCountry = this.profileCountry
      //creating profile as true in user data
      this.db.createProfile(this.userId);
      this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
        if (p) {
          //getting profile image and defaulting image
          let profImage1 = p.profImage1;
          let profImage3 = p.profImage3;
          let profImage2 = p.profImage2;
          if (!profImage1) {
            profImage1 = "/assets/img/listingsImages/archMain-lazy.jpg";
          }
          if (!profImage2) {
            profImage2 = "/assets/img/listingsImages/archMain-lazy.jpg";
          }
          if (!profImage3) {
            profImage3 = "/assets/img/listingsImages/archMain-lazy.jpg";
          }
          //updating profile if already created
          this.db.publicProfileUpdate(this.publicProfileId, form.value, this.userId, datePlaced, profImage1, profImage2, profImage3);
        }
        else {
          //creating profile if no profile created
          this.db.publicProfile(this.publicProfileId, form.value, this.userId, datePlaced);
        }
      })
      //creating profile if no profile created
      this.db.publicProfile(this.publicProfileId, form.value, this.userId, datePlaced).then(() => {
        //checking is dp is uploaded or not and updating to users
        if (this.dpUploaded == true) {
          this.db.dpTrue(this.publicProfileId);
        }
      });


      this.profileId = this.publicProfileId;
      this._snackBar.open("Public profile created successfully", " ", {
        duration: 2000,
      });
      //enabling more profile view and disble submit button
      this.hiddenProfile = false;
      this.submittedPro = true;


    }
    else {

      // adding analytics event
      if (this.isMobilesize) {
        this.analytics.logEvent('btn_edit_pubprof_mob')
      } else {
        this.analytics.logEvent('btn_edit_pubprof_web')
      }

      //creating profile address from places api
      form.value.profileState = this.profileState
      form.value.profileCountry = this.profileCountry
      form.value.profileDistrict = this.profileDistrict
      form.value.fullAddress = this.fullAddress
      form.value.locationId = this.locationId
      if (!form.value.locationId) {
        form.value.locationId = this.locationIds
      }
      //updating profile if already created
      this.db.updatePublicProfile(this.publicProfileId, form.value, this.userId, datePlaced)
      //checking is dp is uploaded or not and updating to users
      if (this.dpUploaded == true) {
        this.db.dpTrue(this.publicProfileId);
      }
      this._snackBar.open("Profile updated successfully", " ", {
        duration: 2000,
      });




    }
  }
  //for closing profile to profile
  close() {
    this.loc.back();
  }
  openL() {
    //logo selector fn
    let element: HTMLElement = document.getElementsByClassName('logo-selector')[0] as HTMLElement;
    element.click();
  }
  //triggered while adding service
  addService() {
    //checking whether service count exceed 5

    if (this.profileService?.length < 5) {
      this.dialog.open(AddNewServiceComponent, {
        width: '700px',
        // height:'470px',
        data: {
          profileId: this.publicProfileId
        }
      });
    }
    //if service is more than 5 show limted popup
    else {
      this.dialog.open(StatusPopupComponent, {
        data: {
          type: "profileServiceMax",
        }
      });

    }
  }
  //used to trigger upload gallery with input
  uploadGalleryImage() {

    let element: HTMLElement = document.getElementsByClassName('gallery-selector')[0] as HTMLElement;
    element.click();
  }
  //funtion to highlight border while drag and dropping gallery image
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  //funtion for drag and drop gallery images
  onDropGalleryImage(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
  //fn used to delete services
  deleteServices(id, filename, url) {
    this.dialog.open(ProfileConfirmationComponent, {
      data: {
        taskId: id, smode: "serviceDeleteProfile", title: filename,
        userId: this.publicProfileId, url: url

      }
    });
  }
  //for editing a service
  editServices(id) {
    this.dialog.open(AddNewServiceComponent, {
      width: '700px',
      data: {
        serviceId: id,
        profileId: this.publicProfileId
      }
    });
  }
  //for viewing image in gallery
  viewImage(id: string, link: string) {

    this.dialog.open(GalleryImagesComponent, {
      data: {
        imageId: id,
        imageLink: link,
        userId: this.publicProfileId,
      },
    });
  }
  //delete image in gallery
  deleteImage(id: string, path: string, path1: string) {

    this.dialog.open(ProfileConfirmationComponent, {
      data: {
        taskId: id, smode: "imageDelete", path: path,
        orginalPath: path1
      }
    });
  }

  //triggered on clicking dp image
  uploadDp() {
    let element: HTMLElement = document.getElementsByClassName('dp-selector')[0] as HTMLElement;
    element.click();
  }
  //triggered while dp image selected
  gettingDpImageUploaded(event: FileList) {
    const file = event.item(0)
    const dpPath = `dp/${this.userId}`;
    this.tasks = this.storage.upload(dpPath, file)
    const ref = this.storage.ref(dpPath);
    this.tasks.snapshotChanges().pipe(
      finalize(() => {
        //getting download url of dp image
        this.dpImageDownload = ref.getDownloadURL()
        //saving url into userDp
        this.dpImageDownload.subscribe(dpUrl => (this.userDp = dpUrl));
        //setting image as uploaded
        this.dpUploaded = true;
      })).subscribe();
  }
  // -------------------------- profile image upload starts here --------------------------
  //uploading image 1 trigger
  uploadFirstProfileImage() {
    let element: HTMLElement = document.getElementsByClassName('proImg1-selector')[0] as HTMLElement;
    element.click();
  }
  //triggered while uploading profileImage 1
  gettingFirstImageUploaded(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }
    // The storage path
    let str1 = filesvalue[0].name.split(".");
    //defining path for 3 quality images
    let thumbnailMediumQty = str1[0] + "_720x480.webp";
    let thumbnailHighQty = str1[0] + "_1920x1080.webp";
    let thumbnailLowQty = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathImage1MediumQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailMediumQty}`
    this.templatePathImage1HighQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailHighQty}`
    this.templatePathImage1LowQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailLowQty}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])
    // Progress monitoring
    this.uploadProgressImage1 = this.tasks.percentageChanges();
  }
  uploadingFirstImage() {
    //checking is id is new while creating and adding id
    if (this.profileId == "new") {
      this.profileId == this.publicProfileId;
    }

    this.uploadProgressImage1 = this.uploadReset;
    setTimeout(() => {
      //getting all image urls using path
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathImage1MediumQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage1MediumQty = url;
            this.ProfileImage1 = url;
          })
        firebase.default.storage()
          .ref(this.templatePathImage1HighQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage1HighQty = url;
          })
        firebase.default.storage()
          .ref(this.templatePathImage1LowQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage1LowQty = url;

          })
        //if we got all images url writing to db
        if (this.thumbnailUrlImage1MediumQty && this.thumbnailUrlImage1HighQty && this.thumbnailUrlImage1LowQty) {
          let datePlaced = new Date().getTime();
          this.db.createProfileImage(this.publicProfileId, this.thumbnailUrlImage1HighQty, this.thumbnailUrlImage1MediumQty, this.thumbnailUrlImage1LowQty, datePlaced, this.templatePathImage1HighQty, this.templatePathImage1MediumQty, this.templatePathImage1LowQty, "1");
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
              //if data already present updating image
              this.db.ProfileImage1(this.publicProfileId, this.thumbnailUrlImage1MediumQty);
            }
            else {
              //if data present set image value
              this.db.ProfileImage1Set(this.publicProfileId, this.thumbnailUrlImage1MediumQty);
            }
          })


          clearInterval(intv)
        }
      }, 200)
    }, 5000)
  }
  //uploading image 2 trigger
  uploadSecondProfileImage() {
    let element: HTMLElement = document.getElementsByClassName('proImg2-selector')[0] as HTMLElement;
    element.click();
  }
  //triggered while uploading profileImage 2
  gettingSecondImageUploaded(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }
    // The storage path
    let str1 = filesvalue[0].name.split(".");
    //defining path for 3 quality images
    let thumbnailMediumQty = str1[0] + "_720x480.webp";
    let thumbnailHighQty = str1[0] + "_1920x1080.webp";
    let thumbnailLowQty = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathImage2MediumQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailMediumQty}`
    this.templatePathImage2HighQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailHighQty}`
    this.templatePathImage2LowQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailLowQty}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])

    // Progress monitoring
    this.uploadProgressImage2 = this.tasks.percentageChanges();
  }
  uploadingSecondImage() {
    //checking is id is new while creating and adding id
    if (this.profileId == 'new') {
      this.profileId == this.publicProfileId;
    }
    this.uploadProgressImage2 = this.uploadReset;

    setTimeout(() => {
      //getting all image urls using path
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathImage2MediumQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage2MediumQty = url;
            this.ProfileImage2 = url;

          })
        firebase.default.storage()
          .ref(this.templatePathImage2HighQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage2HighQty = url;

          })
        firebase.default.storage()
          .ref(this.templatePathImage2LowQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage2LowQty = url;
          })
        //if we got all images url writing to db
        if (this.thumbnailUrlImage2MediumQty && this.thumbnailUrlImage2HighQty && this.thumbnailUrlImage2LowQty) {
          let datePlaced = new Date().getTime();
          this.db.createProfileImage(this.publicProfileId, this.thumbnailUrlImage2HighQty, this.thumbnailUrlImage2MediumQty, this.thumbnailUrlImage2LowQty, datePlaced, this.templatePathImage2HighQty, this.templatePathImage2MediumQty, this.templatePathImage2LowQty, "2");
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
              //if data already present updating image
              this.db.ProfileImage2(this.publicProfileId, this.thumbnailUrlImage2MediumQty);
            }
            else {
              //if data present set image value
              this.db.ProfileImage2Set(this.publicProfileId, this.thumbnailUrlImage2MediumQty);
            }
          })
          clearInterval(intv)
        }
      }, 200)
    }, 5000)
  }

  uploadthirdProfileImage() {
    let element: HTMLElement = document.getElementsByClassName('proImg3-selector')[0] as HTMLElement;
    element.click();
  }
  gettingThirdImageUploaded(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }
    // The storage path
    let str1 = filesvalue[0].name.split(".");

    let thumbnailMediumQty = str1[0] + "_720x480.webp";
    let thumbnailHighQty = str1[0] + "_1920x1080.webp";
    let thumbnailLowQty = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathImage3MediumQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailMediumQty}`
    this.templatePathImage3HighQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailHighQty}`
    this.templatePathImage3LowQty = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbnailLowQty}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])

    // Progress monitoring
    this.uploadProgressImage3 = this.tasks.percentageChanges();
  }
  uploadingThirdImage() {
    if (this.profileId == 'new') {
      this.profileId == this.publicProfileId;
    }
    this.uploadProgressImage3 = this.uploadReset;
    setTimeout(() => {
      //getting all image urls using path
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathImage3MediumQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage3MediumQty = url;
            this.ProfileImage3 = url;

          })
        firebase.default.storage()
          .ref(this.templatePathImage3LowQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage3LowQty = url;


          })
        firebase.default.storage()
          .ref(this.templatePathImage3HighQty).getDownloadURL()
          .then((url) => {
            this.thumbnailUrlImage3HighQty = url;


          })
        //if we got all images url writing to db
        if (this.thumbnailUrlImage3MediumQty && this.thumbnailUrlImage3HighQty) {

          let datePlaced = new Date().getTime();
          this.db.createProfileImage(this.publicProfileId, this.thumbnailUrlImage3HighQty, this.thumbnailUrlImage3MediumQty, this.thumbnailUrlImage3LowQty, datePlaced, this.templatePathImage3HighQty, this.templatePathImage3MediumQty, this.templatePathImage3LowQty, "3");
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
              //if data already present updating image
              this.db.ProfileImage3(this.publicProfileId, this.thumbnailUrlImage3MediumQty);
            }
            else {
              //if data present set image value
              this.db.ProfileImage3Set(this.publicProfileId, this.thumbnailUrlImage3MediumQty);
            }
          })
          clearInterval(intv)

        }
      }, 200)
    }, 5000)
  }
  //toggling profile to be active and
  profileAcv() {

    this.db.updateProfileActv(this.publicProfileId, this.profileAct)
    if (this.profileAct == true) {
      this._snackBar.open("Public profile activated successfully", " ", {
        duration: 2000,
      });
    }
    else {
      this._snackBar.open("Public profile disabled successfully", " ", {
        duration: 2000,
      });
    }

  }
  @HostListener('window:beforeunload')
  //unsubscribe subscription
  ngOnDestroy() {
    this.userDetailsSubscription?.unsubscribe
    this.userGallerySubscription?.unsubscribe
    this.userProfileImageSubscription?.unsubscribe
    this.userProfileSubscription?.unsubscribe
    this.userServiceSubscription?.unsubscribe
  }
}
