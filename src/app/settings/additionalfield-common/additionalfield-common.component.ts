/**********************************************************************************
Description: Component is for configuring additional fields for each modules in the  CRM form configuration UI.
             This is a reusable component.
Inputs: 
Outputs:
**********************************************************************************/
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/common.service';
import { customFields, Profile, UserAccessDetails } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { AdditionalfieldService } from '../additionalfields-common/additionalfield.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import { Location } from '@angular/common';
import { angularEditorConfig } from '@kolkov/angular-editor/lib/config';

@Component({
  selector: 'app-additionalfield-common',
  templateUrl: './additionalfield-common.component.html',
  styleUrls: ['./additionalfield-common.component.scss'],
})
export class AdditionalfieldCommonComponent implements OnInit {
  @Input() superUserId: string; // super user id
  userId: string; //current user id
  fieldNameFollowup: string = 'FollowUp';
  currentCustomField: customFields[] = []; //to store additional fields
  addNewField: boolean = false; //variable used to hide and show add new field
  progressBarStatus: boolean = false;// for showing loader
  dataAccessRule: string; // to check data access rule
  notEdit = true; //for setting edit mode disabled from user defention
  fieldName: string; //for storing field name while adding
  fieldType: string; //for storing field type while adding
  defaultValue: any; //for storing default value while adding
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
  date_EditDefaultValue: any; //to store default value while editing date_time
  time_EditDefaultValue: any; //to store default value while editing date_time
  editCategoriesOpn: any; //to store category options while editing
  networkConnection: boolean; //network check
  @Input() usrProfileData: UserAccessDetails; //user profile data
  @Input() superUserDetails: Profile; //to store super user details
  @Input() customFieldUnique: any[]; //to store respective custom fields
  @Input() customFieldName: string; //to store respective field names
  @Input() customDeleteKey: string; //to store respective field names
  @Input() additionalFieldArrName: string; //name of customarray to be saved in db
  @Input() componentName: string; //name of component constructor
  @Input() customFieldSettings: any[]; //to store customFieldname Setting
  fieldNames: string; // modules field name
  custSetFieldname = new Array(); //array to hole all customised field names,for duplication check
  default_date: string; // default data field for date_time type
  defaultTime: string; //default time field in daet_time type
  constructor(
    private snack: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private db: AdditionalfieldService,
    public dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    //function to get  fieldnames to prevent same fieldname
    this.duplicate_Check();
    if (this.customFieldName) {
      //getting field name to display
      this.fieldNames = this.customFieldName;
    }
    //for storing all followup fields from db
    if (this.customFieldUnique) {
      this.currentCustomField = this.customFieldUnique;
    }
    //for checking which fields are enabled
    let usrProfileData;
    if (this.componentName === 'SalesettingsComponent') {
      usrProfileData = this.usrProfileData[0];
    } else {
      usrProfileData = this.usrProfileData;
    }
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
  //function used to get date field value,for date_time type additional field
  onChange(newValue) {
    this.date_EditDefaultValue = newValue;
  }
  //function used to get time field value,for date_time type additional field
  onChangeTime(newValue) {
    this.time_EditDefaultValue = newValue;
  }
  //function to get  fieldnames to prevent same fieldname
  duplicate_Check() {
    if (this.customFieldSettings != undefined) {
      return Object.keys(this.customFieldSettings).forEach((elem) => {
        this.custSetFieldname.push(this.customFieldSettings[elem].displayName);
      });
    }
  }
  //triggered while clicking add field button
  addField() {
    let activeFieldsLength = 0;
    //get the no of active additional fields
    this.currentCustomField?.forEach((field) => {
      if (field.isActive) {
        activeFieldsLength = activeFieldsLength + 1;
      }
    });
    //additional field limit based on plan
    if (
      activeFieldsLength >= this.commonService.userPlan.additionalFieldLimit
    ) {
      this.snack.open(
        `You can add to a maximum of ${this.commonService.userPlan.additionalFieldLimit} additional fields only!`,
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
    if (this.customFieldUnique == undefined) {
      if (this.custSetFieldname.includes(this.fieldName)) {
        this.snack.open('Field name already exist!', '', {
          duration: 2000,
        });
      } else {
        //if no additional field previously added
        if (!this.currentCustomField) {
          this.currentCustomField = [];
        }
        let options;
        let optionArray = [];
        //setting new value in customfields array
        this.customFields.fieldName = this.fieldName;
        this.customFields.fieldType = this.fieldType;
        if (this.fieldType == 'date_time') {
          if (this.defaultTime == '' || this.defaultTime == undefined) {
            this.defaultTime = '00:00';
          }
          if (this.defaultTime && this.default_date) {
            const date = this.default_date;
            let time_split = this.defaultTime.split(':');
            const test = new Date(
              new Date(this.default_date).getFullYear(),
              new Date(this.default_date).getMonth(),
              new Date(this.default_date).getDate(),
              Number(time_split[0]),
              Number(time_split[1])
            );
            this.defaultValue = test;
          } else {
            this.defaultValue = this.default_date;
          }
        }
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
        this.currentCustomField.push(this.customFields);
        //storing this new updated custom field array to db

        //reseting all variable after updating
        this.fieldName = null;
        this.fieldType = null;
        this.defaultValue = null;
        this.categories = null;
        this.mandatory = false;
        this.addNewField = false;
        this.defaultTime = null;
        this.default_date = null;
        // this.customFields.defaultValue = null;

        this.db
          .updateCustomFields(
            this.superUserId,
            this.additionalFieldArrName,
            this.currentCustomField
          )
          .then(() => {
            this.snack.open('Custom field added successfully', '', {
              duration: 2000,
            });
          });
      }
    } else {
      //getting fieldNames for duplicate check whose isActive value is true
      let fieldNameDb = this.customFieldUnique
        ?.filter((value) => value.isActive === true)
        .map((value) => value.fieldName);
      const fieldNameDbLower = fieldNameDb.map((element) => {
        return element.toLowerCase();
      });
      if (
        fieldNameDbLower.includes(this.fieldName.toLowerCase()) ||
        this.custSetFieldname.includes(this.fieldName)
      ) {
        this.snack.open('Field name already exist!', '', {
          duration: 2000,
        });
      } else {
        //if no additional field previously added
        if (!this.currentCustomField) {
          this.currentCustomField = [];
        }
        let options;
        let optionArray = [];
        //setting new value in customfields array
        this.customFields.fieldName = this.fieldName;
        this.customFields.fieldType = this.fieldType;
        if (this.fieldType == 'date_time') {
          if (this.defaultTime == '' || this.defaultTime == undefined) {
            this.defaultTime = '00:00';
          }
          if (this.defaultTime && this.default_date) {
            const date = this.default_date;
            let time_split = this.defaultTime.split(':');
            const test = new Date(
              new Date(this.default_date).getFullYear(),
              new Date(this.default_date).getMonth(),
              new Date(this.default_date).getDate(),
              Number(time_split[0]),
              Number(time_split[1])
            );
            this.defaultValue = test;
          } else {
            this.defaultValue = this.default_date;
          }
        }
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
        this.currentCustomField.push(this.customFields);
        //storing this new updated custom field array to db

        //reseting all variable after updating
        this.fieldName = null;
        this.fieldType = null;
        this.defaultValue = null;
        this.categories = null;
        this.mandatory = false;
        this.addNewField = false;
        this.defaultTime = null;
        this.default_date = null;

        this.db
          .updateCustomFields(
            this.superUserId,
            this.additionalFieldArrName,
            this.currentCustomField
          )
          .then(() => {
            this.snack.open('Custom field added successfully', '', {
              duration: 2000,
            });
          });
      }
    }
  }

  //editing a field in additional field triggered while clicking update button in edit additional field
  editField(i) {
    this.editIndex = i;
    //for enabling expanded view in accordian
    this.editedField = true;
    //for binding data in fields
    this.editFname = this.currentCustomField[i].fieldName;
    this.editFieldType = this.currentCustomField[i].fieldType;
    this.editMandatory = this.currentCustomField[i].mandatory;
    if (this.editFieldType == 'date') {
      this.editDefaultValue = !!this.currentCustomField[i].defaultValue
        ? this.currentCustomField[i].defaultValue.toDate
          ? this.currentCustomField[i].defaultValue.toDate()
          : this.currentCustomField[i].defaultValue
        : null;
    } else if (this.editFieldType == 'date_time') {
      if (!!this.currentCustomField[i].defaultValue) {
        this.date_EditDefaultValue =
          this.currentCustomField[i].defaultValue.toDate();
        this.time_EditDefaultValue = new Date(
          this.currentCustomField[i].defaultValue.seconds * 1000
        )
          .toString()
          .split(' ')[4];
      } else {
        this.date_EditDefaultValue = null;
        this.time_EditDefaultValue = null;
      }
    } else this.editDefaultValue = this.currentCustomField[i].defaultValue;

    this.editCategoriesOpn = this.currentCustomField[i].categoriesOpn;
  }

  //for deleting an additional field on clicking delete icon in additional fields
  deleteField(i) {
    let index = i;
    //opening pop up for delete confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: this.customDeleteKey,
        uid: this.superUserId,
        statusArray: this.currentCustomField,
        currentIndex: index,
      },
    });
  }
  //function used for checking network connection
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //triggered while clicking submit in edit from accordian
  submitEditField(index) {
    //getting fieldNames for duplicate check,for those objects which have isActive value as true & index of those fields in the original array
    let fieldNameDb = this.customFieldUnique
      ?.filter((value) => value.isActive === true)
      .map((value) => ({
        fieldName: value.fieldName,
        position: this.customFieldUnique.findIndex(
          (item) => item.fieldName === value.fieldName && item.isActive == true
        ),
      }));
    //converting the fieldNames to lowerCase
    let fieldNameDbLowerCase = fieldNameDb.map((value) => ({
      fieldName: value.fieldName.toLowerCase(),
      position: value.position,
    }));
    //finding item with same index,that of editIndex

    const itemWithSameIndex = fieldNameDbLowerCase.find(
      (element) => element.position === this.editIndex
    );

    if (`${itemWithSameIndex.fieldName}` != this.editFname.toLowerCase()) {
      if (
        fieldNameDbLowerCase.some(
          (element) => element.fieldName === this.editFname.toLowerCase()
        ) ||
        this.custSetFieldname.includes(this.editFname)
      ) {
        this.snack.open('Field name already exist!', '', {
          duration: 2000,
        });
      } else {
        //if no additional field previously added
        if (!this.currentCustomField) {
          this.currentCustomField = [];
        }
        let options;
        let optionArray = [];
        //setting new value in customfields array
        this.customFields.fieldName = this.editFname;
        this.customFields.fieldType = this.editFieldType;
        if (this.editFieldType == 'date_time') {
          if (
            this.time_EditDefaultValue == '' ||
            this.time_EditDefaultValue == undefined
          ) {
            this.time_EditDefaultValue = '00:00';
          }
          if (this.time_EditDefaultValue && this.date_EditDefaultValue) {
            var time_splitEdit = this.time_EditDefaultValue.split(':');
            const date_timEditVal = new Date(
              new Date(this.date_EditDefaultValue).getFullYear(),
              new Date(this.date_EditDefaultValue).getMonth(),
              new Date(this.date_EditDefaultValue).getDate(),
              Number(time_splitEdit ? time_splitEdit[0] : null),
              Number(time_splitEdit ? time_splitEdit[1] : null)
            );
            this.editDefaultValue = date_timEditVal;
          } else {
            this.editDefaultValue = this.date_EditDefaultValue;
          }
        }
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
        this.currentCustomField[this.editIndex] = this.customFields;
        //storing this new updated custom field array to db
        this.db.updateCustomFields(
          this.superUserId,
          this.additionalFieldArrName,
          this.currentCustomField
        );
        //reseting all variable after updating
        this.fieldName = null;
        this.fieldType = null;
        this.defaultValue = null;
        this.categories = null;
        this.mandatory = false;
        this.addNewField = false;
        this.editedField = false;
        this.editDefaultValue = null;
        this.defaultTime = null;
        this.default_date = null;
        this.time_EditDefaultValue = null;
        this.date_EditDefaultValue = null;
        this.snack.open('Custom field updated successfully', '', {
          duration: 2000,
        });
      }
    } else {
      //if no additional field previously added
      if (!this.currentCustomField) {
        this.currentCustomField = [];
      }
      let options;
      let optionArray = [];
      //setting new value in customfields array
      this.customFields.fieldName = this.editFname;
      this.customFields.fieldType = this.editFieldType;
      //adding default value if default value exists
      if (this.editFieldType == 'date_time') {
        if (
          this.time_EditDefaultValue == '' ||
          this.time_EditDefaultValue == undefined
        ) {
          this.time_EditDefaultValue = '00:00';
        }

        if (this.time_EditDefaultValue && this.date_EditDefaultValue) {
          var time_splitEdit = this.time_EditDefaultValue.split(':');
          const date_timEditVal = new Date(
            new Date(this.date_EditDefaultValue).getFullYear(),
            new Date(this.date_EditDefaultValue).getMonth(),
            new Date(this.date_EditDefaultValue).getDate(),
            Number(time_splitEdit ? time_splitEdit[0] : null),
            Number(time_splitEdit ? time_splitEdit[1] : null)
          );
          this.editDefaultValue = date_timEditVal;
        } else {
          this.editDefaultValue = this.date_EditDefaultValue;
        }
      }
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
      this.currentCustomField[this.editIndex] = this.customFields;
      //storing this new updated custom field array to db
      this.db.updateCustomFields(
        this.superUserId,
        this.additionalFieldArrName,
        this.currentCustomField
      );
      //reseting all variable after updating
      this.fieldName = null;
      this.fieldType = null;
      this.defaultValue = null;
      this.categories = null;
      this.mandatory = false;
      this.addNewField = false;
      this.editedField = false;
      this.editDefaultValue = null;
      this.time_EditDefaultValue = null;
      this.date_EditDefaultValue = null;
      this.snack.open('Custom field updated successfully', '', {
        duration: 2000,
      });
    }
  }
  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }
}
