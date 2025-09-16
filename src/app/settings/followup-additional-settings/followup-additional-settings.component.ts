import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { takeUntil } from 'rxjs/operators';
import { customFields, Profile, UserAccessDetails } from 'src/app/data-models';
import { CustomersettingsService } from '../customersettings/customersettings.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
@Component({
  selector: 'app-followup-additional-settings',
  templateUrl: './followup-additional-settings.component.html',
  styleUrls: ['./followup-additional-settings.component.scss'],
})
export class FollowupAdditionalSettingsComponent implements OnInit, OnChanges {
  @Input() superUserId: string; // super user id
  userId: string; //current user id
  fieldNameFollowup: string = 'FollowUp';
  currentFollowupField: customFields[] = []; //to store additional fields
  addNewField: boolean = false; //variable used to hide and show add new field
  progressBarStatus: boolean = false;
  @Input() superUserDetails: Profile; //to store super user details
  dataAccessRule: string;
  notEdit = true; //for setting edit mode disabled from user defention
  fieldName: string; //for storing field name while adding
  fieldType: string; //for storing field type while adding
  defaultValue: string; //for storing default value while adding
  categories: string; //for storing categories while adding
  editedField: boolean = false; //edited value while adding new field
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
  mandatory: boolean = false; //seting mandatory as false;
  editIndex: number; //for storing index of edited variable
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
  networkConnection: boolean; //network check
  @Input() usrProfileData: UserAccessDetails; //user profile data
  constructor(
    private snack: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private db: CustomersettingsService,
    public dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.superUserDetails.fieldNames) {
      //getting field name to display
      this.fieldNameFollowup =
        this.superUserDetails.fieldNames.fieldNameFollowup;
    }

    //for storing all followup fields from db
    if (this.superUserDetails.customFieldsFollowUp) {
      this.currentFollowupField = this.superUserDetails.customFieldsFollowUp;
    }

    //for checking which fields are enabled
    let usrProfileData = this.usrProfileData;
    if (usrProfileData) {
      this.dataAccessRule = usrProfileData.dialogdataAccessRule;
      if (usrProfileData.isCheckedSett == false) {
        this.notEdit = true;
      } else {
        if (usrProfileData.settView == false) {
          this.notEdit = true;
        } else {
          this.notEdit = false;
        }
      }
    }
    //disabling loader
    this.progressBarStatus = true;
  }
  //triggered while clicking add field button
  addField() {
    if (this.currentFollowupField?.length >= 10) {
      this.snack.open(
        'You can add to a maximum of 10 additional fields only!',
        '',
        {
          duration: 2000,
        }
      );
    } else {
      this.addNewField = true;
    }
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
  //triggered while in add field div submit button
  submitField() {
    //if no additional field previously added
    if (!this.currentFollowupField) {
      this.currentFollowupField = [];
    }
    let options;
    let optionArray = [];
    //setting new value in customfields array
    this.customFields.fieldName = this.fieldName;
    this.customFields.fieldType = this.fieldType;
    //adding default value if default value exists
    if (this.defaultValue) {
      this.customFields.defaultValue = this.defaultValue;
    } else {
      this.customFields.defaultValue = null;
    }
    //if data type is category we have to split options to an array to list in form
    if (this.categories) {
      options = this.categories?.split(',');
      // pushing variable in to array as array elemnts
      for (var i = options?.length - 1; i >= 0; i--) {
        optionArray.push(options[i].trim());
      }
      // setting options and default value if type is category
      this.customFields.categories = optionArray;
      this.customFields.categoriesOpn = this.categories;
    } else {
      //for setting null if no options are given in category option
      this.customFields.categories = null;
      this.customFields.categoriesOpn = null;
    }
    //setting field active as default
    this.customFields.isActive = true;
    //setting mandatory field to array as false if not selected
    if (!this.mandatory) {
      this.customFields.mandatory = false;
    } else {
      this.customFields.mandatory = this.mandatory;
    }
    // pushing new field array to existing additionalfields array
    this.currentFollowupField.push(this.customFields);
    //storing this new updated custom field array to db

    //reseting all variable after updating
    this.fieldName = null;
    this.fieldType = null;
    this.defaultValue = null;
    this.categories = null;
    this.mandatory = false;
    this.addNewField = false;
    // this.customFields.defaultValue = null;

    this.db
      .updateFollowUpFields(this.superUserId, this.currentFollowupField)
      .then(() => {
        this.snack.open('Custom field added successfully', '', {
          duration: 2000,
        });
      });
  }
  //editing a field in additional field triggered while clicking update button in edit additional field
  editField(i) {
    this.editIndex = i;
    //for enabling expanded view in accordian
    this.editedField = true;
    //for binding data in fields
    this.editFname = this.currentFollowupField[i].fieldName;
    this.editFieldType = this.currentFollowupField[i].fieldType;
    this.editMandatory = this.currentFollowupField[i].mandatory;
    if (this.editFieldType == 'date') {
      this.editDefaultValue = !!this.currentFollowupField[i].defaultValue
        ? this.currentFollowupField[i].defaultValue.toDate
          ? this.currentFollowupField[i].defaultValue.toDate()
          : this.currentFollowupField[i].defaultValue
        : null;
    } else this.editDefaultValue = this.currentFollowupField[i].defaultValue;

    this.editCategoriesOpn = this.currentFollowupField[i].categoriesOpn;
  }

  //for deleting an additional field on clicking delete icon in additional fields
  deleteField(i) {
    let index = i;
    //opening pop up for delete confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'deleteFieldFollowup',
        uid: this.superUserId,
        statusArray: this.currentFollowupField,
        currentIndex: index,
      },
    });
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //triggered while clicking submit in edit from accordian
  submitEditField(index) {
    //if no additional field previously added
    if (!this.currentFollowupField) {
      this.currentFollowupField = [];
    }
    let options;
    let optionArray = [];
    //setting new value in customfields array
    this.customFields.fieldName = this.editFname;
    this.customFields.fieldType = this.editFieldType;
    //adding default value if default value exists
    if (this.editDefaultValue) {
      this.customFields.defaultValue = this.editDefaultValue;
    }
    //if no default value setting it as null
    else {
      this.customFields.defaultValue = null;
    }
    //if data type is category we have to split options to an array to list in form
    if (this.editCategoriesOpn) {
      options = this.editCategoriesOpn?.split(',');
      // pushing variable in to array as array elemnts
      for (var i = options?.length - 1; i >= 0; i--) {
        optionArray.push(options[i].trim());
      }
      // setting options and default value if type is category
      this.customFields.categories = optionArray;
      this.customFields.categoriesOpn = this.editCategoriesOpn;
    } else {
      //for setting null if no options are given in category option
      this.customFields.categories = null;
      this.customFields.categoriesOpn = null;
    }
    //setting mandatory field to array
    this.customFields.mandatory = this.editMandatory;
    //setting field active as default
    this.customFields.isActive = true;
    //storing setted customfield to main customfield array from db
    this.currentFollowupField[this.editIndex] = this.customFields;
    //storing this new updated custom field array to db
    this.db.updateFollowUpFields(this.superUserId, this.currentFollowupField);
    //reseting all variable after updating
    this.fieldName = null;
    this.fieldType = null;
    this.defaultValue = null;
    this.categories = null;
    this.mandatory = false;
    this.addNewField = false;
    this.editedField = false;
    this.editDefaultValue = null;
    this.snack.open('Custom field updated successfully', '', {
      duration: 2000,
    });
  }
  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }
}
