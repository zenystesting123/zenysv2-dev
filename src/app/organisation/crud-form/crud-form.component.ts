import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppCustomDirective } from 'src/app/app.validators';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { CommonService } from 'src/app/common.service';
import {
  addFieldsArr,
  Branch,
  Customer,
  customFieldsReport,
  defaultorganisationSettings,
  Expenses,
  FollowUps,
  Invoice,
  OrganisationModel,
  organisationSettings,
  PaymentReceipt,
  Sales,
  SearchTerm,
  Service,
  SubUsers,
  Task,
} from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CrudFormService } from './crud-form.service';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  crudOrgForm: FormGroup;
  orgData: OrganisationModel = {
    additionalFieldsArr: null,
    companyName: null,
    code: null,
    contactNo: null,
    website: null,
    assignedTo: '',
    assignedToName: '',
    associatedBranch: '',
    billingaddress1: null,
    billingaddress2: null,
    bpin: null,
    country: null,
    state: null,
    district: null,
    taxId: null,
    searchTerm: null,
    details: null,
    id: '',
    createdDate: 0,
    createdBy: '',
    sequenceNumber: 0,
    changeLog: null,
    invoiced: 0,
    collected: 0,
    email: '',
    lastModifiedDate: '',
    assignedToDate: null,
  };
  allSubUsers: SubUsers[] = [];
  associatedBranch = '';
  branches: Branch[] = [];
  superUserId = '';
  userId = '';
  orgSequenceNumber: number;
  scenario = '';
  orgId = '';
  changeLog: any = null;
  prevAssigned = '';
  prevAssignedDate: number = null;
  prevAssignedName = '';
  prevAssBranch = '';
  prevCompName = '';
  userName = '';
  previousForm: FormGroup;
  btnSubmitted = false;
  networkConnection: boolean; //to check wheter internet connectivity is presesnt
  customerUpdated = false;
  expenseUpdated = false;
  saleUpdated = false;
  followupUpdated = false;
  taskUpdated = false;
  paymentUpdated = false;
  quotUpdated = false;
  invUpdated = false;
  estUpdated = false;
  serviceUpdated = false;
  orgSettings: organisationSettings = defaultorganisationSettings.CONST_VALUE;
  loader = true;
  additionalFields: any[] = []; //to store addditonal fields array
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in customer
  prevCode = '+91';
  defaultCode = '+91';
  fieldNameOrganization = 'Organization';
  daTime: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  formReset: boolean = true;
  accountType = '';
  organisations: OrganisationModel[] = [];

  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  lastModifiedDate: Date;

  constructor(
    public commonService: CommonService,
    public dialogRef: MatDialogRef<CrudFormComponent>,
    private fb: FormBuilder,
    private serviceInst: CrudFormService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public networkCheck: NetworkCheckService
  ) {

    if (data) {
      this.scenario = data.scenario;
      if (data.orgId) {
        this.orgId = data.orgId;
      }
    }
  }

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          this.organisations = allData.organisations;


          this.superUserId = allData.userDetails.superUserId;
          this.userId = allData.userId;
          this.accountType = allData.userDetails.accountType;


          if (allData.superUserDetails?.fieldNames?.fieldNameOrganization) {
            this.fieldNameOrganization =
              allData.superUserDetails.fieldNames.fieldNameOrganization;
          }
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          if (allData.superUserDetails.orgSequenceNumber) {
            this.orgSequenceNumber =
              allData.superUserDetails.orgSequenceNumber + 1;
          } else {
            this.orgSequenceNumber = 1;
          }
          //customisation field
          if (
            allData.superUserDetails.organisationSettings &&
            typeof allData.superUserDetails.organisationSettings !==
              'undefined' &&
            allData.superUserDetails.organisationSettings !== null
          ) {
            this.orgSettings = allData.superUserDetails.organisationSettings;
          }
          this.defaultCode = allData.superUserDetails.countryCode
            ? allData.superUserDetails.countryCode
            : '+91';

            if(this.formReset){
              this.formReset = false;
              // additional field
              this.additionalFields = allData.superUserDetails.customFieldsOrganisation;
              this.doActions(allData);
            }
        }
      });
  }

  async doActions(allData) {
    this.branches = allData.branches;

    if (this.scenario === 'create') {
      this.orgData.code = allData.superUserDetails.countryCode
        ? allData.superUserDetails.countryCode
        : '+91';
      this.orgData.contactNo = '';
      this.orgData.companyName = null;
      this.orgData.website = null;
      this.orgData.email = null;
      this.orgData.assignedTo = allData.userId;
      this.orgData.assignedToName = allData.userDetails.lastname
        ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
        : allData.userDetails.firstname;
      if (this.orgData.assignedTo) {

        for (let i = 0; i < this.allSubUsers.length; i++) {
          if (this.orgData.assignedTo === this.allSubUsers[i].userId) {
            if (this.allSubUsers[i].branchId) {
              this.associatedBranch = this.allSubUsers[i].branchId;
            } else {
              this.associatedBranch = 'NA';
            }
          }
        }
      }
      this.orgData.billingaddress1 = null;
      this.orgData.billingaddress2 = null;
      this.orgData.bpin = null;
      this.orgData.country = null;
      this.orgData.state = null;
      this.orgData.district = null;
      this.orgData.taxId = null;
      this.orgData.searchTerm = null;
      this.orgData.details = null;
    } else if (this.scenario === 'edit') {
      const selectedOrg = this.commonService.getOrgToEdit();
      // this.orgId = selectedOrg.id;
      this.prevCompName = selectedOrg.companyName;
      this.orgData.code = selectedOrg.code
        ? selectedOrg.code
        : this.defaultCode;
      this.prevCode = selectedOrg.code;
      this.orgData.contactNo = selectedOrg.contactNo;
      this.orgData.companyName = selectedOrg.companyName;
      this.orgData.website = selectedOrg.website;
      this.orgData.email = selectedOrg.email;
      this.orgData.assignedTo = selectedOrg.assignedTo;
      this.orgData.assignedToName = this.commonService.getAssignedToName(selectedOrg.assignedTo);
      this.associatedBranch = selectedOrg.associatedBranch;
      this.prevAssigned = selectedOrg.assignedTo;
      this.prevAssignedName = this.orgData.assignedToName;
      this.prevAssBranch = selectedOrg.associatedBranch;
      this.orgData.billingaddress1 = selectedOrg.billingaddress1;
      this.orgData.billingaddress2 = selectedOrg.billingaddress2;
      this.orgData.bpin = selectedOrg.bpin;
      this.orgData.country = selectedOrg.country;
      this.orgData.state = selectedOrg.state;
      this.orgData.district = selectedOrg.district;
      this.orgData.taxId = selectedOrg.taxId;
      this.orgData.searchTerm = selectedOrg.searchTerm;
      this.orgData.details = selectedOrg.details;
      this.changeLog = selectedOrg.changeLog;
      this.lastModifiedDate = selectedOrg.lastModifiedDate ? selectedOrg.lastModifiedDate : '';
      this.prevAssignedDate = selectedOrg.assignedToDate?selectedOrg.assignedToDate: null;
      this.addFieldsArray = selectedOrg.additionalFieldsArr;
      if (selectedOrg.additionalFieldsArr) {
        const addFieldsLength = Object.keys(this.addFieldsArray).length;
        for (let i = 0; i < this.additionalFields?.length; i++) {
          this.additionalFields[i].value = '';
        }

        if (addFieldsLength != 0) {
          //storing fields value in customer to additional field array
          for (let i = 0; i < addFieldsLength; i++) {
            this.additionalFields[i].value = this.addFieldsArray[i].fieldValue;
          }
        }
      } else {
        for (let i = 0; i < this.additionalFields?.length; i++) {
          this.additionalFields[i].value = '';
        }
      }


    }
    if (this.orgData) {
      this.crudOrgForm = this.fb.group({
        companyName: [
          this.orgData?.companyName,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
            AppCustomDirective.whiteSpaceOnly
          ],
        ],
        contactNo: [this.orgData?.contactNo],
        website: [this.orgData?.website],
        email: [this.orgData?.email, Validators.email],
        details: [this.orgData?.details],
        billingaddress1: [
          this.orgData?.billingaddress1,
          [Validators.minLength(3), Validators.maxLength(100)],
        ],
        billingaddress2: [
          this.orgData?.billingaddress2,
          [Validators.minLength(3), Validators.maxLength(100)],
        ],
        district: [
          this.orgData?.district,
          [Validators.minLength(3), Validators.maxLength(50)],
        ],
        state: [
          this.orgData?.state,
          [Validators.minLength(3), Validators.maxLength(50)],
        ],
        bpin: [
          this.orgData?.bpin,
          [Validators.minLength(4), Validators.maxLength(12)],
        ],
        country: [this.orgData?.country, [Validators.minLength(2)]],
        taxId: [this.orgData?.taxId],
        additionalFields: this.fb.array([]),
      });
      //additional fields
      this.additionalFields?.forEach((field) => {

        if (field.mandatory == true) {
          if (field.fieldType == 'date') {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? field.value.toDate()
                      : ''
                    : !!field.defaultValue
                    ? field.defaultValue.toDate()
                    : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          }else if (field.fieldType == 'date_time') {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? field.value.toDate()
                      : ''
                    : !!field.defaultValue
                    ? field.defaultValue.toDate()
                    : '',
                  Validators.required,
                ],
                fieldValue2: [
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                      : ''
                    : !!field.defaultValue
                    ? new Date(field.defaultValue.seconds * 1e3).toString().split(' ')[4]
                    : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
                fieldType: field.fieldType,
              })
            );
          } else {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  this.data.scenario === 'edit'
                    ? field.value
                    : field.defaultValue,
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          }
        } else {
          if (field.fieldType == 'date') {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue:
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? field.value.toDate()
                      : ''
                    : !!field.defaultValue
                    ? field.defaultValue.toDate()
                    : '',
                fieldName: field.fieldName,
              })
            );
          } else if (field.fieldType == 'date_time') {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? field.value.toDate()
                      : ''
                    : !!field.defaultValue
                    ? field.defaultValue.toDate()
                    : '',
                ],
                fieldValue2: [
                  this.data.scenario === 'edit'
                    ? !!field.value
                      ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                      : ''
                    : !!field.defaultValue
                    ? new Date(field.defaultValue.seconds * 1e3).toString().split(' ')[4]
                    : '',
                ],
                fieldName: field.fieldName,
                fieldType: field.fieldType,
              })
            );
          } else {
            (this.crudOrgForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue:
                  this.data.scenario === 'edit'
                    ? field.value
                    : field.defaultValue,
                fieldName: field.fieldName,
              })
            );
          }
        }
      });

      // customisation starts here
      if (this.orgSettings) {
        //contactNo
        if (this.orgSettings?.contactNo?.mandatory === true) {
          this.crudOrgForm.controls['contactNo'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['contactNo'].clearValidators();
        }
        this.crudOrgForm.controls['contactNo'].updateValueAndValidity();
        //website
        if (this.orgSettings?.website?.mandatory === true) {
          this.crudOrgForm.controls['website'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['website'].clearValidators();
        }
        this.crudOrgForm.controls['website'].updateValueAndValidity();
        //email
        if (this.orgSettings?.email?.mandatory === true) {
          this.crudOrgForm.controls['email'].setValidators([
            Validators.required, Validators.email
          ]);
        }else if(this.orgSettings?.email?.display === true){
          this.crudOrgForm.controls['email'].setValidators([
            Validators.pattern(this.emailPattern)
          ]);
        } else {
          this.crudOrgForm.controls['email'].clearValidators();
        }
        this.crudOrgForm.controls['email'].updateValueAndValidity();
        //billingaddress1
        if (this.orgSettings?.billingaddress1?.mandatory === true) {
          this.crudOrgForm.controls['billingaddress1'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['billingaddress1'].clearValidators();
        }
        this.crudOrgForm.controls['billingaddress1'].updateValueAndValidity();
        //billingaddress2
        if (this.orgSettings?.billingaddress2?.mandatory === true) {
          this.crudOrgForm.controls['billingaddress2'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['billingaddress2'].clearValidators();
        }
        this.crudOrgForm.controls['billingaddress2'].updateValueAndValidity();
        //district
        if (this.orgSettings?.district?.mandatory === true) {
          this.crudOrgForm.controls['district'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['district'].clearValidators();
        }
        this.crudOrgForm.controls['district'].updateValueAndValidity();
        //state
        if (this.orgSettings?.state?.mandatory === true) {
          this.crudOrgForm.controls['state'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['state'].clearValidators();
        }
        this.crudOrgForm.controls['state'].updateValueAndValidity();
        //bpin/pinorzip
        if (this.orgSettings?.bpin?.mandatory === true) {
          this.crudOrgForm.controls['bpin'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['bpin'].clearValidators();
        }
        this.crudOrgForm.controls['bpin'].updateValueAndValidity();
        //country
        if (this.orgSettings?.country?.mandatory === true) {
          this.crudOrgForm.controls['country'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['country'].clearValidators();
        }
        this.crudOrgForm.controls['country'].updateValueAndValidity();
        //taxId
        if (this.orgSettings?.taxId?.mandatory === true) {
          this.crudOrgForm.controls['taxId'].setValidators([
            Validators.required,
          ]);
        } else {
          this.crudOrgForm.controls['taxId'].clearValidators();
        }
        this.crudOrgForm.controls['taxId'].updateValueAndValidity();
      }
      // customisation ends here
      //save the previous form to create change log
      this.previousForm = ChangeLogComponent.cloneAbstractControl(
        this.crudOrgForm
      );

      this.loader = false;
    }
  }
  //code to searchbale feld
  countryCodeEventHander($event: any) {
    this.orgData.code = $event;
  }
  //checking for network
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  orgForm(crudOrgForm) {

    this.btnSubmitted = true;
    this.loader = true;
    let contactNum = '';
    let codeNull = false;
    let additionalFields = <addFieldsArr>{};
    let fromArray = crudOrgForm.get('additionalFields') as FormArray;

    fromArray.controls.forEach((control, index) => {
      if(fromArray.at(index).value.fieldValue){
      if(fromArray.at(index).value.fieldType == 'date_time'){
        if(fromArray.at(index).value.fieldValue2 == '' || fromArray.at(index).value.fieldValue2 == undefined){
          fromArray.at(index).value.fieldValue2 = '00:00'
        }
      }
    }
      if (fromArray.at(index).value.fieldValue2) {
        var time_splitEdit = fromArray.at(index).value.fieldValue2.split(':');
        const date_timEditVal = new Date(
          new Date(fromArray.at(index).value.fieldValue).getFullYear(),
          new Date(fromArray.at(index).value.fieldValue).getMonth(),
          new Date(fromArray.at(index).value.fieldValue).getDate(),
          Number(time_splitEdit ? time_splitEdit[0] : null),
          Number(time_splitEdit ? time_splitEdit[1] : null)
        )
        this.daTime = date_timEditVal
      }
       //incase of only selecting timeValue,field is stored as null
       if(fromArray.at(index).value.fieldValue == null || fromArray.at(index).value.fieldValue == '' ){
        this.daTime = null;
      }
      additionalFields[index] = {
        fieldValue: control.value.fieldValue2 ? this.daTime : control.value.fieldValue,
      };
    });

    let searchTerm = {
      companyName: '',
    };
    searchTerm.companyName = crudOrgForm.value.companyName.toLowerCase();
    if (crudOrgForm.value.contactNo) {
      contactNum = crudOrgForm.value.contactNo + '';
    } else {
      contactNum = '';
    }
    if (
      this.orgData.code === '' ||
      this.orgData.code === null ||
      typeof this.orgData.code === 'undefined'
    ) {
      codeNull = true;
    }

    let formDetails = this.crudOrgForm.value;
    //additionalFields FormArray and contactNo values removed from form values
    //to save form value directly to db
    delete formDetails.additionalFields;
    delete formDetails.contactNo;


    // this.crudOrgForm.removeControl('additionalFields');
    // this.crudOrgForm.removeControl('contactNo');
    if (this.scenario == 'create') {
      let newOrg = {
        code: contactNum !== ''
        ? codeNull === true
          ? this.defaultCode
          : this.orgData.code
        : '',
      contactNo: contactNum,
      assignedTo: this.orgData.assignedTo,
      assignedToName: this.orgData.assignedToName,
      associatedBranch: this.associatedBranch,
      createdDate: new Date().getTime(),
      searchTerm,
      sequenceNumber: this.orgSequenceNumber,
      createdBy: this.userId,
      invoiced: 0,
      collected: 0,
      additionalFieldsArr: additionalFields,
      changeLog: ChangeLogComponent.saveLog(
        this.constructor.name,
        this.userId,
        this.userName,
        '',
        '',
        this.changeLog
      ),
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
      }
      const newOrganisation = {...newOrg, ...formDetails};
      this.serviceInst
        .addOrganisation(
          this.superUserId,
          newOrganisation
        )
        .then((response) => {
          this.serviceInst.updateOrgSequenceNumber(
            this.superUserId,
            this.orgSequenceNumber
          );
          this.loader = false;
          this.dialogRef.close();
          if(this.accountType !== 'SuperUser'){
            this.organisations.push(newOrganisation);

            // this.commonService.updateOrgDetails(this.organisations);
          }
          this.router.navigate(['dash/organisation/orgdetails/' + response.id]);
          this._snackBar.open('Successfully added', '', {
            duration: 2000,
          });
        });
    } else if (this.scenario == 'edit') {

      let additionalData = {
        curAssignedTo: {
          assignedTo: this.orgData.assignedTo,
          assignedToName: this.orgData.assignedToName,
        },
        prevAssignedTo: {
          assignedTo: this.prevAssigned,
          assignedToName: this.prevAssignedName,
        },
        ...(this.branches.length > 0 && {
          currentAssBranch: this.branches.find(
            (item) => item.id === this.associatedBranch
          )?.name
            ? this.branches.find((item) => item.id === this.associatedBranch)
                ?.name
            : 'None',
        }),
        ...(this.branches.length > 0 && {
          previousAssBranch:
            this.branches.length > 0
              ? this.branches.find((item) => item.id === this.prevAssBranch)
                  ?.name
                ? this.branches.find((item) => item.id === this.prevAssBranch)
                    ?.name
                : 'None'
              : '',
        }),
        //adding country code to changelog
        curCode:{
          code: contactNum !== ''
          ? codeNull === true
            ? this.prevCode
              ? this.prevCode
              : this.defaultCode
            : this.orgData.code
          : ''
        },
        prevCode:{
          code: this.prevCode
        }
      };

      //changeLog for sale popup
      let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
        this.constructor.name,
        this.userId,
        this.userName,
        this.previousForm,
        this.crudOrgForm,
        this.changeLog,
        additionalData
      );

      // if assigned to changed, update assignedToDate field also
      let assignedDate = this.prevAssignedDate;
      if(this.prevAssigned !== this.orgData.assignedTo){
        assignedDate = new Date().getTime();
      }

      this.serviceInst
        .updateOrganisation(
          this.superUserId,
          this.orgId,
          formDetails,
          contactNum !== ''
            ? codeNull === true
              ? this.prevCode
                ? this.prevCode
                : this.defaultCode
              : this.orgData.code
            : '',
          contactNum,
          this.orgData.assignedTo,
          this.orgData.assignedToName,
          this.associatedBranch,
          searchTerm,
          additionalFields,
          newChangeLog != null ? newChangeLog : this.changeLog,
          newChangeLog != null ?  new Date().getTime() :this.lastModifiedDate,
          assignedDate
        )
        .then((response) => {

          if (this.prevCompName !== crudOrgForm.value.companyName) {
            // update in contacts also
            this.serviceInst
              .getAllCustomers(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let contacts = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Customer;
                });
                contacts.forEach((saleElement) => {
                  this.serviceInst.onUpdateCustomerName(
                    this.superUserId,
                    saleElement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting sales data as updated
                this.customerUpdated = true;
              });

            //geting sales list for updating
            this.serviceInst
              .getAllSales(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let sales = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Sales;
                });
                //changing field name for each sales using sales id


                sales.forEach((saleElement) => {
                  this.serviceInst.onUpdateSaleCustomerName(
                    this.superUserId,
                    saleElement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting sales data as updated
                this.saleUpdated = true;
              });

            //geting service list for updating
            this.serviceInst
              .getAllServices(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let services = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Service;
                });
                //changing field name for each sales using sales id
                services.forEach((serviceElement) => {
                  this.serviceInst.onUpdateServiceCustomerName(
                    this.superUserId,
                    serviceElement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting service data as updated
                this.serviceUpdated = true;
              });

            //geting follow up list for updating
            this.serviceInst
              .getAllFollowUps(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let followUps = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as FollowUps;
                });
                //changing field name for each follow up using follow up id
                followUps.forEach((element) => {
                  this.serviceInst.onUpdateFollowUpCustomerName(
                    this.superUserId,
                    element.id,
                    crudOrgForm.value.companyName
                  );
                });
                //setting follow up data as updated
                this.followupUpdated = true;
              });
            //geting task list for updating
            this.serviceInst
              .getAllTasks(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let tasks = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Task;
                });
                //changing field name for each task using task id
                tasks.forEach((taskelement) => {
                  this.serviceInst.onUpdateTaskCustomerName(
                    this.superUserId,
                    taskelement.id,
                    crudOrgForm.value.companyName
                  );
                });
                //setting task data as updated
                this.taskUpdated = true;
              });
            //geting payment list for updating
            this.serviceInst
              .getAllPayments(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let payments = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as PaymentReceipt;
                });
                //changing field name for each payment using payment id
                payments.forEach((paymentelement) => {
                  this.serviceInst.onUpdatePaymentCustomerName(
                    this.superUserId,
                    paymentelement.id,
                    crudOrgForm.value.companyName
                  );
                });
                //setting payment data as updated
                this.paymentUpdated = true;
              });
            //geting invoice list for updating
            this.serviceInst
              .getAllInvoices(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let invoices = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Invoice;
                });
                //changing field name for each invoice using invoice id
                invoices.forEach((invelement) => {
                  this.serviceInst.onUpdateInvoiceCustomerName(
                    this.superUserId,
                    invelement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting invoice data as updated
                this.invUpdated = true;
              });
            //geting quoatation list for updating
            this.serviceInst
              .getAllQuotations(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let quotations = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Invoice;
                });
                //changing field name for each quotation using quotation id
                quotations.forEach((quoelement) => {
                  this.serviceInst.onUpdateQuotationCustomerName(
                    this.superUserId,
                    quoelement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting quotation data as updated
                this.quotUpdated = true;
              });
            //geting estimate list for updating
            this.serviceInst
              .getAllEstimates(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let estimates = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Invoice;
                });
                //changing field name for each estimate using estimate id
                estimates.forEach((estelement) => {
                  this.serviceInst.onUpdateEstimateCustomerName(
                    this.superUserId,
                    estelement.id,
                    crudOrgForm.value.companyName,
                    crudOrgForm.value.companyName
                      ? crudOrgForm.value.companyName.toLowerCase()
                      : ''
                  );
                });
                //setting estimate data as updated
                this.estUpdated = true;
              });
            //geting expense list for updating
            this.serviceInst
              .getAllExpenses(this.superUserId, this.orgId)
              .pipe(take(1))
              .subscribe((data) => {
                let expenses = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Expenses;
                });
                //changing field name for each expense using expense id
                expenses.forEach((expelement) => {
                  this.serviceInst.onUpdateExpenseCustomerName(
                    this.superUserId,
                    expelement.id,
                    crudOrgForm.value.companyName
                  );
                });
                //setting expense data as updated
                this.expenseUpdated = true;
              });

            //setting an interval to make sure updates all done
            var interval = setInterval(() => {
              // if all data is updated then closing interval and navigate to customer details
              if (
                this.expenseUpdated == true &&
                this.saleUpdated == true &&
                this.followupUpdated == true &&
                this.taskUpdated == true &&
                this.paymentUpdated == true &&
                this.quotUpdated == true &&
                this.invUpdated == true &&
                this.estUpdated == true
              ) {
                //clearing interval since all data is updated
                clearInterval(interval);
                //navigating to updated customer
                this.loader = false;
                this.dialogRef.close();
                this.router.navigate([
                  'dash/organisation/orgdetails/' + this.orgId,
                ]);
                this._snackBar.open('Successfully updated', '', {
                  duration: 2000,
                });
              }
            }, 200);
          } else {
            this.loader = false;
            this.dialogRef.close();
            this.router.navigate([
              'dash/organisation/orgdetails/' + this.orgId,
            ]);
            this._snackBar.open('Successfully updated', '', {
              duration: 2000,
            });
          }
        });
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  TypeError() {}
  //assigned to search field
  assignedToEventHander($event: any) {
    this.orgData.assignedTo = $event;
    if (this.orgData.assignedTo) {
      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (this.orgData.assignedTo === this.allSubUsers[i].userId) {
          if (this.allSubUsers[i].branchId) {
            this.associatedBranch = this.allSubUsers[i].branchId;
          } else {
            this.associatedBranch = 'NA';
          }
        }
      }
    }

  }

  assignedToNameEventHander($event: any) {
    this.orgData.assignedToName = $event;
  }
  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;

  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
