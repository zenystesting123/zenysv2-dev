import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Contact,
  ContactDetails,
  SearchTerm,
  StageHistory,
} from '../contact-model';
import { ContactFormService } from './contact-form.service';
import * as firebase from 'firebase';
import { Upload } from '../data-model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {

  imageSrc: string | ArrayBuffer = null;
  urlDownload = ''; //url using for download
  private basepath: string =
    '/attachment/CTHSx7bZtEO79BS4B3AfKhOq2ZJ3/customer'; //uploads folder under files in Firebase Storage
  private uploadTask: firebase.default.storage.UploadTask; //for upload file method
  name;
  url;
  fileName;
  filesize;

  firstName: string;
  contactNo: string;
  invoiceNumber: string;
  district: string;
  superUserId: string = 'CTHSx7bZtEO79BS4B3AfKhOq2ZJ3';
  districtArray: string[] = [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad',
  ];
  docUploaded : boolean = false;
  userName = '';

  constructor(
    private _snack: MatSnackBar,
    private serviceInstance: ContactFormService
  ) {
    this.superUserId = 'CTHSx7bZtEO79BS4B3AfKhOq2ZJ3';
    this.userName =  'LG Lucky Draw';
  }

  ngOnInit(): void {}
  onSave() {
    let customerDetails = new ContactDetails();
    customerDetails.assignedTo = this.superUserId;
    customerDetails.assignedToName = 'LG Lucky Draw';
    customerDetails.alternateContactNumber = null;
    customerDetails.billingaddress1 = null;
    customerDetails.billingaddress2 = null;
    customerDetails.bpin = null;
    customerDetails.code = '+91';
    customerDetails.collectedAmount = 0;
    customerDetails.companyName = 'Individual';
    customerDetails.contactNo = this.contactNo;
    customerDetails.country = null;
    customerDetails.createdBy = this.superUserId;
    customerDetails.createdYear = new Date().getFullYear();
    customerDetails.currentStatusDate = new Date().getTime();
    customerDetails.custLeadValue = null;
    customerDetails.dateCreated = new Date().getTime();
    customerDetails.department = null;
    customerDetails.district = null;
    customerDetails.email = null;
    customerDetails.firstName = this.firstName;
    customerDetails.followUpFlag = 0;
    customerDetails.inPipeline = false;
    customerDetails.invoicedAmount = 0;
    customerDetails.isCompany = false;
    customerDetails.lost = false;
    customerDetails.month = new Date().getMonth();
    customerDetails.ongoingSales = 0;
    customerDetails.priority = 'Medium';
    customerDetails.saleOngoingValue = 0;
    customerDetails.salePipelineValue = 0;
    customerDetails.salutation = null;
    let searchTermCust: SearchTerm;
    searchTermCust = {
      firstName: this.firstName?.toLowerCase(),
      secondName: '',
      companyName: customerDetails.companyName?.toLowerCase(),
      surname: '',
    };
    customerDetails.secondName = null;
    customerDetails.selectedContactPipeline = 0;
    customerDetails.state = null;
    customerDetails.status = 'Customer-Won';
    customerDetails.surname = null;
    customerDetails.taxId = null;
    customerDetails.totalAmountCollected = 0;
    customerDetails.won = true;
    let stageValues = new StageHistory();
    stageValues.date = new Date().getTime();
    stageValues.stageName = 'Customer-Won';
    stageValues.stageNo = 3;
    customerDetails.stageHistory = [];
    customerDetails.stageHistory.push(stageValues);
    customerDetails.searchTerm = searchTermCust;
    customerDetails.additionalFieldsArr = [];
    customerDetails.additionalFieldsArr[0] = { fieldValue: this.invoiceNumber };
    customerDetails.additionalFieldsArr[1] = { fieldValue: this.district };
    this.serviceInstance
      .createContact(customerDetails, this.superUserId)
      .then((result) => {
        this.serviceInstance
        .attachmentsToCollection(
          this.superUserId,
          result.id,
          this.name,
          this.urlDownload,
          `${this.basepath}/${this.name}`,
          new Date().getTime(),
          `${this.userName}`,
          this.filesize
        )
        .then((res) => {
          // this.uploadAttachmentSizeCust.updateSize(this.superUserId, newSize);
          this._snack.open('Attachment added successfully', '', {
            duration: 2000,
          });
        })
        .catch((e) => {
          this._snack.open('Error!!! Attachment not added', '', {
            duration: 2000,
          });
        });
      });
  }

  // upload fns
  uploadDocument() {
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
              this.docUploaded = true;

              // this.loader = false;
              upload.url = this.urlDownload;
              upload.name = upload.file.name;

              this.name = upload.file.name;
              this.filesize = upload.file.size;


              // this.serviceInstance
              //   .attachmentsToCollection(
              //     upload.name,
              //     upload.url,
              //     `${this.basepath}/${upload.file.name}`,
              //     new Date().getTime(),
              //     `${this.user.firstname} ${this.user.lastname}`,
              //     upload.file.size
              //   )
              //   .then((res) => {
              //     // this.uploadAttachmentSizeCust.updateSize(this.superUserId, newSize);
              //     this._snack.open('Attachment added successfully', '', {
              //       duration: 2000,
              //     });
              //   })
              //   .catch((e) => {
              //     this._snack.open('Error!!! Attachment not added', '', {
              //       duration: 2000,
              //     });
              //   });
            }
          });
      }
    );
  }
}
