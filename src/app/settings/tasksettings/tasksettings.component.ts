/*********************************************************************************
Description: component used for adding/editing/deleteing  additional fields of task
Inputs: task additional fields
Outputs:
***********************************************************************************/

import {
  customFields, defaultTaskSettings, fieldNameLEngth, taskSettings,
} from './../../data-models';
import { StatusPopupComponent } from './../status-popup/status-popup.component';
import { TasksettingsService } from './tasksettings.service';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasksettings',
  templateUrl: './tasksettings.component.html',
  styleUrls: ['./tasksettings.component.scss'],
})
export class TasksettingsComponent implements OnInit, OnDestroy {
  value: string; //to store value of edit
  addNewField: boolean = false; //variable used to hide and show add new field
  panelOpenState = false; //to set mat accordian collapsed as default
  replaced: string; //to store edited string
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
  mandatory: boolean = false; //seting mandatory as false;
  statusArray: any[]; //to share current status array

  userDetailsSubscription: Subscription; //for subscribing to user details
  profileDefinitionSubscription: Subscription; //for subscribing to profile definition
  edited: boolean = false; //setting editing div as hidden
  added: boolean = false; //setting editing div as hidden
  private onDestroy$: Subject<void> = new Subject<void>(); //for destorying subscription
  user: any; //for storing user details
  editIndex: number; //for storing index of edited variable
  editArray: any = []; //for storing array while editing
  notEditMode = true; //for setting edit mode disabled
  superUserId: string; //for storing super user id
  notEdit = true; //for setting edit mode disabled from user defention
  fieldName: string; //for storing field name while adding
  categories: string; //for storing categories while adding
  defaultValue: string; //for storing default value while adding
  fieldType: string; //for storing field type while adding
  changes: boolean = false; //to disable save change button
  progressBarStatus: boolean = false; //for hidding loader
  editedField: boolean = false; //edited value while adding new field
  accountType: string; //to store users account type
  isMobilesize: Boolean = false; //store to check mobile view
  isTabletsize: Boolean = false; //store to check tablet view
  userProfileData: any;
  networkConnection: boolean; //network check
  usrProfileData: any;
  superUserDetails: any; //to store super user details
  fieldNameTask: any; //to sore task name
  currentCustomField: any = []; //to store additional fields
  customFields: customFields = {
    //to store values of additional field while editing and adding
    fieldName: null, //to store fields name
    fieldType: null, //to store the fields type
    categoriesOpn: null, //to store options if category type selected
    value: null, //to store value of that field while editing
    defaultValue: null, //to store default values
    mandatory: null, //to check where field is set as mandatory
    categories: null, //array to store options of category
    isActive: null, //to check wheter the field is activated or not
  };
  dataAccessRule: string;
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  settingsConfigured: boolean = false;
  fieldCustomisationForm: FormGroup;
  editTask: boolean = false;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  statusOptions: any[]; //to store options in lead source
  defaultStatusOptions: any[]= ['Open','Completed']
  constructor(
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private db: TasksettingsService,
    private location: Location,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService
  ) {
    //Check screen size form common service file
    if (this.commonService.isTabletsize) {
      this.isTabletsize = true;
    } else {
      this.isTabletsize = false;
    }
    if (this.commonService.isMobilesize) {
      this.isMobilesize = true;
    } else {
      this.isMobilesize = false;
    }

    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserId = allData.userDetails.superUserId;

          this.superUserDetails = allData.superUserDetails;
          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameTask =
              this.superUserDetails.fieldNames.fieldNameTask;
          }

          //for storing all custom fields from db
          this.currentCustomField = this.superUserDetails.customFieldsTask;


          //for checking which fields are enabled
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;

            if (this.usrProfileData.isCheckedSett == false) {
              this.notEdit = true;
            } else {
              if (this.usrProfileData.settView == false) {
                this.notEdit = true;
              } else {
                this.notEdit = false;
              }
            }
          }
          //disabling loader
          this.progressBarStatus = true;

          //customisation fields starts here
          if (
            typeof allData.superUserDetails.taskSettings === 'undefined' ||
            allData.superUserDetails.taskSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.taskSettings = allData.superUserDetails.taskSettings;
          }
          if (allData.superUserDetails.taskSettings) {
            this.commonService.checkCustomField(
              defaultTaskSettings.CONST_VALUE,
              allData.superUserDetails.taskSettings
            );
          }
          
          //form initialisation
          this.fieldCustomisationForm = new FormGroup({
            taskStatus: new FormGroup({
              taskStatusOpn: new FormControl(this.superUserDetails.taskStatusOpn ? this.superUserDetails.taskStatusOpn : this.defaultStatusOptions, Validators.required)
              // taskStatusOpn: new FormControl(this.superUserDetails.taskStatusOpn ? this.superUserDetails.taskStatusOpn.map(({ name }) => { return name; }) : taskOpns, Validators.required)
            }),
            title: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.title.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.taskSettings?.title?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.taskSettings?.title?.mandatory,
                Validators.required
              ),
            }),
            priority: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.priority.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.taskSettings?.priority?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.taskSettings?.priority?.mandatory,
                Validators.required
              ),
            }),
            dueDate: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.dueDate.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.taskSettings?.dueDate?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.taskSettings?.dueDate?.mandatory,
                Validators.required
              ),
            }),
            description: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.description.displayName
              ),
              display: new FormControl(
                this.taskSettings?.description?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.description?.mandatory
              ),
            }),
            selectedCust: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.selectedCust.displayName
              ),
              display: new FormControl(
                this.taskSettings?.selectedCust?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.selectedCust?.mandatory
              ),
            }),
            isCompany: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.isCompany.displayName
              ),
              display: new FormControl(
                this.taskSettings?.isCompany?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.isCompany?.mandatory
              ),
            }),
            saleTitle: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.saleTitle.displayName
              ),
              display: new FormControl(
                this.taskSettings?.saleTitle?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.saleTitle?.mandatory
              ),
            }),
            serviceTitle: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.serviceTitle.displayName
              ),
              display: new FormControl(
                this.taskSettings?.serviceTitle?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.serviceTitle?.mandatory
              ),
            }),
            assignedTo: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.assignedTo.displayName
              ),
              display: new FormControl(
                this.taskSettings?.assignedTo?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.assignedTo?.mandatory
              ),
            }),
            status: new FormGroup({
              displayName: new FormControl(
                this.taskSettings?.status.displayName
              ),
              display: new FormControl(
                this.taskSettings?.status?.display
              ),
              mandatory: new FormControl(
                this.taskSettings?.status?.mandatory
              ),
            }),
          });
          //title
          this.fieldCustomisationForm.get('title.display').setValue(true);
          this.fieldCustomisationForm.get('title.display').disable();
          this.fieldCustomisationForm.get('title.mandatory').setValue(true);
          this.fieldCustomisationForm.get('title.mandatory').disable();
          //priority
          this.fieldCustomisationForm.get('priority.display').setValue(true);
          this.fieldCustomisationForm.get('priority.display').disable();
          this.fieldCustomisationForm.get('priority.mandatory').setValue(true);
          this.fieldCustomisationForm.get('priority.mandatory').disable();
          //dueDate
          this.fieldCustomisationForm.get('dueDate.display').setValue(true);
          this.fieldCustomisationForm.get('dueDate.display').disable();
          this.fieldCustomisationForm.get('dueDate.mandatory').setValue(true);
          this.fieldCustomisationForm.get('dueDate.mandatory').disable();
          //assignedTo
          this.fieldCustomisationForm.get('assignedTo.display').setValue(true);
          this.fieldCustomisationForm.get('assignedTo.display').disable();
          this.fieldCustomisationForm.get('assignedTo.mandatory').setValue(true);
          this.fieldCustomisationForm.get('assignedTo.mandatory').disable();
          //status
          this.fieldCustomisationForm.get('status.display').setValue(true);
          this.fieldCustomisationForm.get('status.display').disable();
          this.fieldCustomisationForm.get('status.mandatory').setValue(true);
          this.fieldCustomisationForm.get('status.mandatory').disable();
          this.disableDescription();
          this.disableSelectedCust();
          this.disableIsCompany();
          this.disableSaleTitle();
          this.disableServiceTitle();
          //this.disableStatus();

        }
      }
    );
  }

  ngOnInit(): void { }

  onUpdatingTaskStatusOptions(form) {
    
    // making the field disabled after updating
    this.notEditMode = !this.notEditMode;
  
    // // if no task status option given, setting it with default value
    // if (!form.value.taskStatus.taskStatusOpn) {
    //   form.value.taskStatus.taskStatusOpn = "Open,Completed";
    // }
  
    // storing options into separate array
    const newOptions = form.value.taskStatus.taskStatusOpn?.split(",");
    let statusOptions = [];
  
    newOptions.forEach((option) => {
      const trimmedOption = option.trim();
      if (
        trimmedOption !== "" &&
        !statusOptions
          .map((option) => option.toLowerCase())
          .includes(trimmedOption.toLowerCase())
      ) {
        statusOptions.push(trimmedOption.replace(/completed/i, "Completed"));
      }
    });
    // remove completed if exist and push it to the end
    const completedIndex = statusOptions
      .map((option) => option.toLowerCase())
      .indexOf("completed");
      
    if (completedIndex !== -1) {
      statusOptions.splice(completedIndex, 1);
    }
    //add default values
    if (statusOptions.length === 0) {
      statusOptions.push("Open");
    }
  
    statusOptions.push("Completed");
    // store new lead source into user level
    this.db.updateTaskstatus("/users", this.superUserId, statusOptions);
  
    this.snack.open("Settings updated successfully", "", {
      duration: 2000,
    });
  }
  
  
  disableDescription(){
    // description
    if (this.fieldCustomisationForm.get('description.mandatory').value === true) {
      this.fieldCustomisationForm.get('description.display').setValue(true);
      this.fieldCustomisationForm.get('description.display').disable();

    } else {
      let val = this.taskSettings.description.display;
      this.fieldCustomisationForm.get('description.display').setValue(val);
      this.fieldCustomisationForm.get('description.display').enable();
    }
  }
  disableSelectedCust(){
    // selectedCust
    if (this.fieldCustomisationForm.get('selectedCust.mandatory').value === true) {
      this.fieldCustomisationForm.get('selectedCust.display').setValue(true);
      this.fieldCustomisationForm.get('selectedCust.display').disable();

    } else {
      let val = this.taskSettings.selectedCust.display;
      this.fieldCustomisationForm.get('selectedCust.display').setValue(val);
      this.fieldCustomisationForm.get('selectedCust.display').enable();
    }
  }

  disableIsCompany(){
    // isCompany
    if (this.fieldCustomisationForm.get('isCompany.mandatory').value === true) {
      this.fieldCustomisationForm.get('isCompany.display').setValue(true);
      this.fieldCustomisationForm.get('isCompany.display').disable();

    } else {
      let val = this.taskSettings.isCompany.display;
      this.fieldCustomisationForm.get('isCompany.display').setValue(val);
      this.fieldCustomisationForm.get('isCompany.display').enable();
    }
  }

  disableSaleTitle(){
    // saleTitle
    if (this.fieldCustomisationForm.get('saleTitle.mandatory').value === true) {
      this.fieldCustomisationForm.get('saleTitle.display').setValue(true);
      this.fieldCustomisationForm.get('saleTitle.display').disable();

    } else {
      let val = this.taskSettings.saleTitle.display;
      this.fieldCustomisationForm.get('saleTitle.display').setValue(val);
      this.fieldCustomisationForm.get('saleTitle.display').enable();
    }
  }

  disableServiceTitle(){
    // serviceTitle
    if (this.fieldCustomisationForm.get('serviceTitle.mandatory').value === true) {
      this.fieldCustomisationForm.get('serviceTitle.display').setValue(true);
      this.fieldCustomisationForm.get('serviceTitle.display').disable();

    } else {
      let val = this.taskSettings.serviceTitle.display;
      this.fieldCustomisationForm.get('serviceTitle.display').setValue(val);
      this.fieldCustomisationForm.get('serviceTitle.display').enable();
    }
  }
/*
  disableStatus(){
    // status
    if (this.fieldCustomisationForm.get('status.mandatory').value === true) {
      this.fieldCustomisationForm.get('status.display').setValue(true);
      this.fieldCustomisationForm.get('status.display').disable();

    } else {
      let val = this.taskSettings.status.display;
      this.fieldCustomisationForm.get('status.display').setValue(val);
      this.fieldCustomisationForm.get('status.display').enable();
    }
  }
*/
  onSubmitCustField(){
        //selectedCust
        if (this.fieldCustomisationForm.getRawValue().selectedCust.displayName === '') {
          this.fieldCustomisationForm
            .get('selectedCust.displayName')
            .setValue(defaultTaskSettings.CONST_VALUE.selectedCust.displayName);
        }
        //description
        if (this.fieldCustomisationForm.getRawValue().description.displayName === '') {
          this.fieldCustomisationForm
            .get('selectedescriptiondCust.displayName')
            .setValue(defaultTaskSettings.CONST_VALUE.description.displayName);
        }
        this.fieldCustomisationForm.removeControl('taskStatus')

        this.db.updateFieldCustomization(
          this.superUserId,
          this.fieldCustomisationForm.getRawValue()
        );
        this.snack.open('Successfully updated', '', {
          duration: 2000,
        });
  }
  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }
  //clear defaultValue field on selection change
  clear() {
    this.defaultValue = '';
  }
 
  //triggered while cliking close button in add div used for closing
  submitFieldClose() {
    this.addNewField = false;
  }
  //triggered while closing mat accordian
  EditFieldClose() {
    this.editedField = false;
  }

  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
     // edit button on Task field actions
     editTaskfn() {
      this.editTask = true;
    }
    // clear button on Task field actions
    clearTask() {
      this.editTask = false;
      this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
    }
    // save button on Task field actions
    saveTask() {
      this.editTask = false;
      this.db.updateTaskfieldName(
        this.superUserId,
        this.fieldNameTask
      );
      this.snack.open('Successfully updated', '', {
        duration: 500,
      });
    }

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.profileDefinitionSubscription?.unsubscribe;
    this.userDetailsSubscription?.unsubscribe;
    this.onDestroy$.next();
  }
}
