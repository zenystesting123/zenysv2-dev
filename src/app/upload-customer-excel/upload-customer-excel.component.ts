/*********************************************************************************
Description: component used for uploading customers as csv and download dynamic customer upload template
Inputs: uploaded csv file
Outputs: downloaded dynamic customers upload template
***********************************************************************************/

import { UploadCustomerExcelService } from './upload-customer-excel.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { saveAs } from 'file-saver';
import {
  CustomersImport,
  StageValues,
} from 'projects/customers/src/app/data-models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branch, contactSettings, Customer, defaultContactSettings } from '../data-models';
import { FullLayoutComponent } from '../full-layout/full-layout.component';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-upload-customer-excel',
  templateUrl: './upload-customer-excel.component.html',
  styleUrls: ['./upload-customer-excel.component.scss'],
})
export class UploadCustomerExcelComponent implements OnInit, OnDestroy {
  public userDetailsSubscription: Subscription; //subscription for user datas
  userId: any; //for storing user's id
  plan = ''; //plan of superUser
  branches: Branch[] = []; //brnaches under superUser
  isHovering: boolean; //for checking is cursor hovering above limted rectange while uploading
  superUserId: any; //for storing super user id
  additionalFields: any; //for storing additional details array
  filteredAdditionalField: any; //for storing non disabled additional fields array
  csvLine: number; //for storing each line of uploaded csv
  fileReaded: any; //to store whole csv uploaded data
  userFirstName: any; //to store first name of the user
  userSecondName: any; //to store second name of the user
  fullAdditionalBoolean: any = []; //to store true or false array corresponding to additinal field array
  fieldsArray: any = []; //to store pushed array value of fields
  fullFieldsArrray: any = []; //to store pushed array value of fields while uploading csv
  stageHistory: any[] = []; //to store stage history array of uploading customers
  dateCreate: any; //to store created date of customers
  subUsers: any[]; //to store subusers list
  csvData = []; //used to store customer details from csv upload
  stageValues: StageValues = {
    //array defnition to store in stage history
    date: null,
    stageName: null,
    stageNo: null,
  };
  dataArray: CustomersImport = {
    orgId: null,
    surname: null,
    assignedTo: null,
    assignedToName: null,
    billingaddress1: null,
    billingaddress2: null,
    bpin: null,
    code: null,
    custLeadValue: null,
    companyName: null,
    collectedAmount: null,
    contactNo: null,
    country: null,
    dateCreated: null,
    district: null,
    email: null,
    firstName: null,
    followUpFlag: null,
    taxId: null,
    pan: null,
    priority: null,
    salutation: null,
    secondName: null,
    state: null,
    status: null,
    unConfirmedSales: null,
    amountToBeCollected: null,
    taskOpen: null,
    lifeTimeValue: null,
    totalAmountCollected: null,
    sequenceNumber: null,
    invoicedAmount: null,
    isCompany: null,
    additionalFieldsArr: null,
    searchTerm: {
      companyName: '',
      firstName: '',
      secondName: '',
      surname: '',
    },
    selectedContactPipeline: 0,
    altContactCode: null,
    associatedBranch: '',
    alternateContactNumber: '',
    department: '',
    createdBy: '',
    inPipeline: null,
    won: null,
    lost: null,
  };
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  fieldNames = null;
  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  constructor(
    public commonService: CommonService,
    public fullLayout: FullLayoutComponent,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public db: UploadCustomerExcelService
  ) {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      //getting data from common service file related to the user
      (allData) => {
        if (allData) {
          this.userId = allData.userId;
          this.plan = allData.superUserDetails.plan;
          this.superUserId = allData.userDetails.superUserId;
          this.branches = allData.branches;
          this.fieldNames = allData.superUserDetails.fieldNames;
          if(
            allData.superUserDetails.contactSettings &&
            typeof allData.superUserDetails.contactSettings !== 'undefined' &&
            allData.superUserDetails.contactSettings !== null
          ){
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          this.additionalFields = allData.superUserDetails.customFieldsContact;
          this.userSecondName = allData.userDetails.lastname;
          this.userFirstName = allData.userDetails.firstname;
          this.filteredAdditionalField = [];
          this.fullAdditionalBoolean = [];
          //setting a true or false array based on active fields in additional fields array
          for (let i = 0; i < this.additionalFields?.length; i++) {
            if (this.additionalFields[i].isActive) {
              this.fullAdditionalBoolean.push(true);
            } else {
              this.fullAdditionalBoolean.push(false);
            }
          }
          //storing all active fields in additional fields in a new array
          for (let i = 0; i < this.additionalFields?.length; i++) {
            if (this.additionalFields[i].isActive) {
              this.filteredAdditionalField.push(this.additionalFields[i]);
            }
          }
          //get sub users list and details
          this.subUsers = allData.subUsers;
        }
      }
    );
  }

  ngOnInit(): void {
    //for storing created date
    this.dateCreate = new Date().getTime();
  }
  //funtion for change dash border to solid and visual change will drag and drop csv upload
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  //for getting elemnet to upload to upload csv template
  openL() {
    let element: HTMLElement = document.getElementsByClassName(
      'csv-selector'
    )[0] as HTMLElement;
    element.click();
  }
  //triggered while downloading csv template where we create dynamic template according to users additional details
  csv_convertion() {
    this.csvData = [];
    let defaultFields;
    if (this.commonService.userPlan.branchEnabled && this.branches.length > 0) {
      //defining default fields that are not dynamic
      this.csvData = [
        `${this.contactSettings.salutation.displayName}(Mr/Mrs/Ms)`,
        `${this.contactSettings.firstName.displayName}`,
        `${this.contactSettings.secondName.displayName}`,
        `${this.contactSettings.surname.displayName}`,
        `${this.contactSettings.companyName.displayName}`,
        `${this.contactSettings.billingaddress1.displayName}`,
        `${this.contactSettings.billingaddress2.displayName}`,
        `${this.contactSettings.district.displayName}`,
        `${this.contactSettings.state.displayName}`,
        `${this.contactSettings.country.displayName}`,
        `${this.contactSettings.bpin.displayName}`,
        `Country Code(e.g 91)`,
        `${this.contactSettings.contactNo.displayName}`,
        `${this.contactSettings.email.displayName}`,
        `${this.contactSettings.taxId.displayName}`,
        `${this.contactSettings.selectedContactPipeline.displayName}`,
        `${this.contactSettings.status.displayName}`,
        `${this.contactSettings.priority.displayName}(Low/Medium/High)`,
        'Assign Id',
        'Branch', //extra associated branch field in diamond plan if branches.length > 0
        'Lead Source',
        'Alternate Country Code(e.g 91)',
        'Alternate Cont No',
        'Department',
        'Created Date(dd/MM/yyyy or dd-MM-yyyy)',
        `Next ${this.fieldNames.fieldNameFollowup} Date(dd/MM/yyyy or dd-MM-yyyy)`
      ]; //fields adding will influence the uploading function in full-layout
    } else {
      //defining default fields that are not dynamic
      this.csvData = [
        `${this.contactSettings.salutation.displayName}(Mr/Mrs/Ms)`,
        `${this.contactSettings.firstName.displayName}`,
        `${this.contactSettings.secondName.displayName}`,
        `${this.contactSettings.surname.displayName}`,
        `${this.contactSettings.companyName.displayName}`,
        `${this.contactSettings.billingaddress1.displayName}`,
        `${this.contactSettings.billingaddress2.displayName}`,
        `${this.contactSettings.district.displayName}`,
        `${this.contactSettings.state.displayName}`,
        `${this.contactSettings.country.displayName}`,
        `${this.contactSettings.bpin.displayName}`,
        `Country Code(e.g 91)`,
        `${this.contactSettings.contactNo.displayName}`,
        `${this.contactSettings.email.displayName}`,
        `${this.contactSettings.taxId.displayName}`,
        `${this.contactSettings.selectedContactPipeline.displayName}`,
        `${this.contactSettings.status.displayName}`,
        `${this.contactSettings.priority.displayName}(Low/Medium/High)`,
        'Assign Id',
        'Lead Source',
        'Alternate Country Code(e.g 91)',
        'Alternate Cont No',
        'Department',
        'Created Date(dd/MM/yyyy or dd-MM-yyyy)',
        `Next ${this.fieldNames.fieldNameFollowup} Date(dd/MM/yyyy or dd-MM-yyyy)`
      ]; //fields adding will influence the uploading function in full-layout, headers/data.length = 25;
    }

    //getting field name of all additional field into defaault fields array
    for (let i = 0; i < this.filteredAdditionalField?.length; i++) {
      if (this.filteredAdditionalField[i].fieldType === 'date') {
        this.csvData.push(
          `${this.filteredAdditionalField[i].fieldName}(dd/MM/yyyy or dd-MM-yyyy)`
        );
      }else if (this.filteredAdditionalField[i].fieldType === 'date_time') {
        this.csvData.push(
          `${this.filteredAdditionalField[i].fieldName}(dd/MM/yyyy HH:MM:SS or dd-MM-yyyy HH:MM:SS)`
        );
      } else {
        this.csvData.push(this.filteredAdditionalField[i].fieldName);
      }
    }
    //adding default fields and additional fields as heading of csv
    // this.csvData.push(defaultFields);
    // this.csvData[0] = defaultFields;
    // const replacer = (key, value) => (value === null ? '' : value);
    // //setting header data as keys
    // const header = Object.keys(this.csvData[0]);
    //stringifying heading and seprating by commas

    // let csv = this.csvData.map((row) =>
    //   header
    //     .map((fieldName) => JSON.stringify(row[fieldName], replacer))
    //     .join(',')
    // );
    // csv.unshift(header.join(','));
    //separating each heading into rows by adding lines
    let csvArray = this.csvData.toString();


    //setting file type as csv
    var blob = new Blob([csvArray], { type: 'text/csv' });
    //setting download funtionality to setted csv with name "contact_template.csv"
    saveAs(blob, 'contact_template.csv');
  }
  //triggered while trying to upload to customer template
  csvUploadFuntion(fileInput: any) {
    this.fullLayout.uploadCustomerFromFullLayout(fileInput);
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //for unsubscribe subscriptions
    this.userDetailsSubscription?.unsubscribe();
  }
}
