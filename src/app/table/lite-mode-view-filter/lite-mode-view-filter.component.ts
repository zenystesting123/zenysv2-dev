/**********************************************************
Description : Customization view popup used in lite mode customer, other module code is not removed, may needed in future

 * **********************************************************************/
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/common.service';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  DocumentViewSettingsDef,
  ExpenseViewSettingsDef, FollowupViewSettingsDef,
  PaymentViewSettingsDef,
  ServiceViewSettingsDef,
} from 'src/app/model/custom-filter.model';
import {
  taskViewSettingsDef, Branch,
  customerViewSettingsDef,
  defaultContactSettings,
  defaultExpenseSettings,
  defaultfollowUpSettings,
  defaultorganisationSettings,
  defaultPaymentSettings,
  defaultSaleSettings,
  defaultServiceSettings,
  defaultTaskSettings,
  FollowupDirection,
  FollowupOutcome,
  FollowupStatus,
  orgViewSettingsDef,
  saleViewSettingsDef,
  selectedFilterFields,
} from 'src/app/data-models';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { LiteModeViewFilterService } from './lite-mode-view-filter.service';

@Component({
  selector: 'app-lite-mode-view-filter',
  templateUrl: './lite-mode-view-filter.component.html',
  styleUrls: ['./lite-mode-view-filter.component.scss']
})
export class LiteModeViewFilterComponent implements OnInit, OnDestroy {
  selectedOption: string = 'onlyMe'; // Filter view access initialize with 'onlyMe'
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  superUserId: any; //super user id
  superUserFullName: string; // full name of super user? why do we need this?
  allSubUsers: any[] = []; // list of all subusers
  statusArray: string[] = []; //different status values defined
  pipelineNames = []; //Array to store the pipeline names for custom and sales module
  customFields: any = []; //custom fields defined for the module
  contactGroupByOptions = [
    {
      name: 'Created date',
      field: 'dateCreated',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Pipeline',
      field: 'selectedContactPipeline',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Status',
      field: 'status',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Priority',
      field: 'priority',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'In Pipeline',
      field: 'inPipeline',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },

    {
      name: 'Lost',
      field: 'lost',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Won',
      field: 'won',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Lead Source',
      field: 'custLeadValue',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Next Followup Date',
      field: 'nextFollowupDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Previous Followup Date',
      field: 'previousFollowupDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Modified Date',
      field: 'lastModifiedDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Current Stage Date',
      field: 'currentStatusDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Note Date',
      field: 'lastNoteDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    /*{
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },*/
  ];
  orgGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Modified Date',
      field: 'lastModifiedDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  module = 'customers';
  groupByOptions: any = [];
  outcomeArray: any = [];
  directionArray: string[] = FollowupDirection.DATA;// followup direction
  lineItem: selectedFilterFields = {
    queryName: null,
    queryField: null,
    queryType: null,
    operator: null,
    comparisonValue: [],
    selectionArray: [],
    fieldType: null,
    ind: null,
  }; //initializing the LineItemData interface
  primaryQueryItem: selectedFilterFields = {
    queryName: null,
    queryField: null,
    queryType: null,
    operator: null,
    comparisonValue: [],
    selectionArray: [],
    fieldType: null,
    ind: null,
  };
  viewDataTemplate = {
    primaryQuery: {
      fieldType: 'def',
      selectionArray: [],
      queryField: 'dateCreated',
      queryName: 'Created date',
      queryType: 'date',
      ind: 0,
      operator: 'This Month',
      comparisonValue: [],
    },

    filters: [],

    title: 'View Name',
  };
  itemList = [this.lineItem]; // item list input
  customeFieldsAdded: boolean;
  allData: any; //user related data read from the database
  usrProfileData: any;
  userId: string;
  viewSettings: any;
  groupByOptionsPrimary: {
    name: string;
    field: string;
    type: string;
    fieldType: string;
    ind: number;
  }[];
  dataAccessRule: any;
  salesGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Pipeline',
      field: 'selectedSalePipeline',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Stage',
      field: 'salesStage',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Priority',
      field: 'priority',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Start Date',
      field: 'startDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'End Date',
      field: 'expCompletionDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Estimate',
      field: 'estimatedValue',
      type: 'number',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'In Pipeline',
      field: 'inPipeline',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },

    {
      name: 'Lost',
      field: 'lost',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Won',
      field: 'won',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Modified Date',
      field: 'lastModifiedDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Current Stage Date',
      field: 'currentStatusDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Note Date',
      field: 'lastNoteDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  serviceGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Start Date',
      field: 'startDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'End Date',
      field: 'expCompletionDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Pipeline',
      field: 'selectedServPipeline',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Stage',
      field: 'servicesStage',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Priority',
      field: 'priority',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'In Progress',
      field: 'inPipeline',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },

    {
      name: 'Rejected',
      field: 'lost',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Closed',
      field: 'won',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Modified Date',
      field: 'lastModifiedDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Current Stage Date',
      field: 'currentStatusDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Note Date',
      field: 'lastNoteDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  taskGroupByOptions = [
    {
      name: 'Created date',
      field: 'date',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Due date',
      field: 'dueDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Status',
      field: 'status',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Priority',
      field: 'priority',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Last Modified Date',
      field: 'lastModifiedDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  followUpGroupByOptions = [
    {
      name: 'Created date',
      field: 'dateCreated',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Call date',
      field: 'callStartDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Call completed',
      field: 'completedStatus',
      type: 'boolean',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned to',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Status',
      field: 'status',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Direction',
      field: 'direction',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Outcome',
      field: 'outcome',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Branch',
      field: 'associatedBranch',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Assigned To Date',
      field: 'assignedToDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  expenseGroupByOptions = [
    { name: 'Created date', field: 'date', type: 'date', fieldType: 'def', ind: 0 },
    { name: 'Expense date', field: 'expenseDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdById', type: 'option', fieldType: 'def', ind: 0 },
  ];
  paymnetGroupByOptions = [
    {
      name: 'Created date',
      field: 'createDate',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Collection date',
      field: 'paymentDate',
      type: 'timestamp',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdById',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  documentGroupByOptions = [
    {
      name: 'Created date',
      field: 'docData.createdDate',
      type: 'date',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'document date',
      field: 'docData.docDate',
      type: 'timestamp',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  subUsers: any = [];
  userIdArray: any[];
  mode: string = '';
  viewName: any;
  displayFields: any;
  sortField: any;
  sortOrder: string = 'Asc';
  updateField: string;
  isChild1FormValid: boolean = true;
  fieldCustomsettings: any // custom field name setting
  leadCaptureArray: string[] = [];
  branches: Branch[] = [];// to store the branch
  networkConnection: boolean; // checks network connection
  fieldNameFollowup: string = 'FollowUp';// cutom fieldname followup
  fieldNameNotes: string = 'Note';//custom field name note
  taskDefaultOpn: any[] = ['Open', 'Completed']
  disableButton: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewBuilderComponent>,
    private liteModeViewFilterService: LiteModeViewFilterService,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
  ) {
    //console.log(data)
    dialogRef.disableClose = true;
  }
  enableSubmitButton(isValid: boolean) {
    this.isChild1FormValid = isValid;
  }
  ngOnInit(): void {
    this.module = this.data[0];
    this.viewSettings = this.data[1];
    this.mode = this.data[2];
    this.displayFields = this.data[3];
    this.sortField = this.displayFields[0];

    this.groupByOptions = this.contactGroupByOptions;
    this.commonService.userDatas
      .pipe(take(1))
      .subscribe((allData) => {
        this.customeFieldsAdded = false;
        this.allData = allData;
        //get the data access rule for the signed in user - this section needs to be made common and accessed through common service file to optimize dashboard performance
        this.usrProfileData = allData.usrProfileData;

        this.userId = allData.authDetails.uid;
        if (allData.userDetails.superUserId) {
          //If the superuserid is set assign it
          this.superUserId = allData.userDetails.superUserId;
        } else {
          //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
          this.superUserId = this.userId;
        }
        //custom field names
        if (allData.superUserDetails.fieldNames) {
          this.fieldNameFollowup = allData.superUserDetails.fieldNames.fieldNameFollowup;
        }
        this.superUserFullName =
          allData.superUserDetails.firstname +
            '' +
            allData.superUserDetails.lastname
            ? allData.superUserDetails.lastname
            : '';
        this.leadCaptureArray = allData.superUserDetails.custLead;// get leadsource options
        if (allData.branches) {
          this.branches = allData.branches
        }
        if (this.module == 'customers') {
          //custom field names
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameNotes =
              allData.superUserDetails.fieldNames.fieldNameContactNotes ? allData.superUserDetails.fieldNames.fieldNameContactNotes : 'Note';
          }
          //fieldname customization
          if (
            this.allData.superUserDetails.contactSettings &&
            typeof this.allData.superUserDetails.contactSettings !== 'undefined' &&
            this.allData.superUserDetails.contactSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.contactSettings;
          } else {
            this.fieldCustomsettings = defaultContactSettings.CONST_VALUE
          }

          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.contactGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          //Get the report settings
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(customerViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(customerViewSettingsDef.DATA[0]));
          }
          this.updateField = 'customerViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.contactDataAccessRule;
          this.groupByOptions = this.contactGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.contactGroupByOptions.map(
            (obj) => ({ ...obj })
          );

          this.customFields = this.allData.superUserDetails.customFieldsContact;
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.pipelineNames =
              JSON.parse(JSON.stringify(this.allData.customerPipelines));
          } else {
            this.pipelineNames[0] =
              JSON.parse(JSON.stringify(this.allData.customerPipelines))[0];
          }

          //Call function to add custom fields to group by and segment by option (categopry type)
        } else if (this.module == 'sales') {
          //custom field names
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameNotes =
              allData.superUserDetails.fieldNames.fieldNameSaleNotes ? allData.superUserDetails.fieldNames.fieldNameSaleNotes : 'Note';
          }
          //fieldname customization
          if (
            this.allData.superUserDetails.saleSettings &&
            typeof this.allData.superUserDetails.saleSettings !== 'undefined' &&
            this.allData.superUserDetails.saleSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.saleSettings;
          } else {
            this.fieldCustomsettings = defaultSaleSettings.CONST_VALUE
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.salesGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }

          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(saleViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(saleViewSettingsDef.DATA[0]));
          }
          this.updateField = 'saleViewSettings';
          this.viewName = this.viewSettings.viewName;
          this.dataAccessRule = this.usrProfileData.saleDataAccessRule;
          //this.measureSelected = this.measureByOptions[0];
          this.groupByOptions = this.salesGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.salesGroupByOptions.map((obj) => ({
            ...obj,
          }));

          this.customFields = this.allData.superUserDetails.customFieldsSale;
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.pipelineNames = JSON.parse(JSON.stringify(this.allData.salePipelines));
          } else {
            this.pipelineNames[0] = JSON.parse(JSON.stringify(this.allData.salePipelines))[0];
          }

          let temp: any = [];
        } else if (this.module == 'services') {
          //custom field names
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameNotes =
              allData.superUserDetails.fieldNames.fieldNameServiceNotes ? allData.superUserDetails.fieldNames.fieldNameServiceNotes : 'Note';
          }
          //fieldname customization
          if (
            this.allData.superUserDetails.serviceSettings &&
            typeof this.allData.superUserDetails.serviceSettings !== 'undefined' &&
            this.allData.superUserDetails.serviceSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.serviceSettings;
          } else {
            this.fieldCustomsettings = defaultServiceSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.serviceGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          if (!this.viewSettings) {

            this.viewSettings = JSON.parse(
              JSON.stringify(ServiceViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(ServiceViewSettingsDef.DATA[0]));
          }
          this.viewName = this.viewSettings.viewName;

          this.updateField = 'serviceViewSettings';
          this.dataAccessRule = this.usrProfileData.serviceDataAccessRule;
          //this.measureSelected = this.measureByOptions[0];
          this.groupByOptions = this.serviceGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.serviceGroupByOptions.map(
            (obj) => ({
              ...obj,
            })
          );

          this.customFields = this.allData.superUserDetails.customFieldsService;
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.pipelineNames =
              JSON.parse(JSON.stringify(this.allData.servicePipelines));
          } else {
            this.pipelineNames[0] =
              JSON.parse(JSON.stringify(this.allData.servicePipelines))[0];
          }
        } else if (this.module == 'tasks') {
          //fieldname customization
          if (
            this.allData.superUserDetails.taskSettings &&
            typeof this.allData.superUserDetails.taskSettings !== 'undefined' &&
            this.allData.superUserDetails.taskSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.taskSettings;
          } else {
            this.fieldCustomsettings = defaultTaskSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.taskGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(taskViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(taskViewSettingsDef.DATA[0]));
          }
          this.viewName = this.viewSettings.viewName;
          this.dataAccessRule = this.usrProfileData.taskDataAccessRule;

          this.groupByOptions = this.taskGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.taskGroupByOptions.map((obj) => ({
            ...obj,
          }));
          //getting  taskStatus option from db
          if (this.allData.superUserDetails.taskStatusOpn) {
            this.statusArray = this.allData.superUserDetails.taskStatusOpn;
          }
          else {
            this.statusArray = this.taskDefaultOpn;
          }
          this.customFields = this.allData.superUserDetails.customFieldsTask;
        } else if (this.module == 'Follow Ups') {
          //fieldname customization
          if (
            this.allData.superUserDetails.followUpSettings &&
            typeof this.allData.superUserDetails.followUpSettings !== 'undefined' &&
            this.allData.superUserDetails.followUpSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.followUpSettings;
          } else {
            this.fieldCustomsettings = defaultfollowUpSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.followUpGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(FollowupViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(FollowupViewSettingsDef.DATA[0]));
          }
          this.dataAccessRule = this.usrProfileData.followUpDataAccessRule;
          this.updateField = 'followUpViewSettings';
          this.viewName = this.viewSettings.viewName;
          this.groupByOptions = this.followUpGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.followUpGroupByOptions.map(
            (obj) => ({ ...obj })
          );

          this.customFields =
            this.allData.superUserDetails.customFieldsFollowUp;

          this.statusArray = allData.superUserDetails.followUpStatus ? allData.superUserDetails.followUpStatus : FollowupStatus.DATA; // if status is not saved fetch default status
          this.outcomeArray = allData.superUserDetails.followUpOutcome ? allData.superUserDetails.followUpOutcome : FollowupOutcome.DATA;// if outcome is not saved fetch default outcome
          this.directionArray = allData.superUserDetails.followUpDirection ? allData.superUserDetails.followUpDirection : FollowupDirection.DATA;// if outcome is not saved fetch default direction
        } else if (this.module == 'Expenses') {
          //fieldname customization
          if (
            this.allData.superUserDetails.expenseSettings &&
            typeof this.allData.superUserDetails.expenseSettings !== 'undefined' &&
            this.allData.superUserDetails.expenseSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.expenseSettings;
          } else {
            this.fieldCustomsettings = defaultExpenseSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.expenseGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(ExpenseViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(ExpenseViewSettingsDef.DATA[0]));
          }
          this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          this.updateField = "expenseViewSettings"
          this.viewName = this.viewSettings.viewName;
          this.groupByOptions = this.expenseGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.expenseGroupByOptions.map(
            (obj) => ({ ...obj })
          );

          this.customFields = this.allData.superUserDetails.customFieldsExpense;

        }
        else if (this.module == 'paymentsreceived') {
          //fieldname customization
          if (
            this.allData.superUserDetails.paymentSettings &&
            typeof this.allData.superUserDetails.paymentSettings !== 'undefined' &&
            this.allData.superUserDetails.paymentSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.paymentSettings;
          } else {
            this.fieldCustomsettings = defaultPaymentSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.paymnetGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }
          //Get the report settings
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(PaymentViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(PaymentViewSettingsDef.DATA[0]));
          }
          this.updateField = 'paymentViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          this.groupByOptions = this.paymnetGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.paymnetGroupByOptions.map(
            (obj) => ({ ...obj })
          );
          this.customFields = this.allData.superUserDetails.customFieldsPayment;
        } else if (this.module == 'Estimates') {
          //Get the report settings
          if (!this.viewSettings) {

            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
          }
          this.updateField = 'estimateViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          this.groupByOptions = this.documentGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.documentGroupByOptions.map(
            (obj) => ({ ...obj })
          );
        } else if (this.module == 'Invoices') {
          //Get the report settings
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
          }
          this.updateField = 'invoiceViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          this.groupByOptions = this.documentGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.documentGroupByOptions.map(
            (obj) => ({ ...obj })
          );
        } else if (this.module == 'Quotations') {
          //Get the report settings
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(DocumentViewSettingsDef.DATA[0]));
          }
          this.updateField = 'quotationViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          this.groupByOptions = this.documentGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.documentGroupByOptions.map(
            (obj) => ({ ...obj })
          );
        } else if (this.module == 'Organisation') {

          //fieldname customization
          if (
            this.allData.superUserDetails.organisationSettings &&
            typeof this.allData.superUserDetails.organisationSettings !== 'undefined' &&
            this.allData.superUserDetails.organisationSettings !== null
          ) {
            this.fieldCustomsettings = this.allData.superUserDetails.organisationSettings;
          } else {
            this.fieldCustomsettings = defaultorganisationSettings.CONST_VALUE;
          }
          if (this.fieldCustomsettings) {
            Object.keys(this.fieldCustomsettings).forEach((ele) => {
              this.orgGroupByOptions.forEach(element => {
                if (ele == element.field) {
                  element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              });
            });
          }

          //Get the report settings
          if (!this.viewSettings) {
            this.viewSettings = JSON.parse(
              JSON.stringify(orgViewSettingsDef.DATA[0]));
            this.viewSettings = JSON.parse(
              JSON.stringify(orgViewSettingsDef.DATA[0]));
          }
          this.updateField = 'orgViewSettings';
          this.viewName = this.viewSettings.viewName;

          this.dataAccessRule = this.usrProfileData.orgDataAccessRule;
          this.groupByOptions = this.orgGroupByOptions.map((obj) => ({
            ...obj,
          }));
          this.groupByOptionsPrimary = this.orgGroupByOptions.map(
            (obj) => ({ ...obj })
          );

          this.customFields = this.allData.superUserDetails.customFieldsOrganisation;

          //Call function to add custom fields to group by and segment by option (categopry type)
        }
        //create list of users based on data access rule for the selected module
        this.subUsers = allData.subUsers;
        this.allSubUsers = [];
        this.allSubUsers = this.createUserlist();
        // add custom fields to measure by, segment by and group by option
        if (
          this.customFields !== undefined &&
          this.customFields.length > 0 &&
          this.customeFieldsAdded == false
        ) {
          this.customeFieldsAdded = true;
          let i = 0;
          this.customFields.forEach((element) => {
            // add isAcive check while pushing custom fields to groupByOptions
            if (element.fieldType == 'number' && element.isActive) {
            } else if (element.fieldType == 'category' && element.isActive) {
              this.groupByOptions.push({
                name: element.fieldName,
                field: 'additionalFieldsArr',
                fieldType: 'Additional',
                type: 'option',
                ind: i,
              });
            } else if (element.fieldType == 'date' && element.isActive) {
              this.groupByOptions.push({
                name: element.fieldName,
                field: 'additionalFieldsArr',
                type: 'timestamp',
                fieldType: 'Additional',
                ind: i,
              });
            }
            i++;
          });
        }

        if (this.viewSettings.filters) {
          this.itemList = this.viewSettings.filters;
        }
        if (this.viewSettings.primaryQuery) {
          this.primaryQueryItem = this.viewSettings.primaryQuery;
        }
        if (this.viewSettings.sortField) {
          this.sortField = this.viewSettings.sortField;
        }
        if (this.viewSettings.sortOrder) {
          this.sortOrder = this.viewSettings.sortOrder;
        }
        if (this.fieldCustomsettings) {
          Object.keys(this.fieldCustomsettings).forEach((ele) => {
            if (this.primaryQueryItem.queryField == ele) {
              if (this.primaryQueryItem.queryName != this.fieldCustomsettings[`${ele}`]?.displayName) {
                this.primaryQueryItem.queryName = this.fieldCustomsettings[`${ele}`]?.displayName
              }
            }
            this.itemList.forEach(element => {
              if (element.queryField == ele) {
                if (element.queryName != this.fieldCustomsettings[`${ele}`]?.displayName) {
                  element.queryName = this.fieldCustomsettings[`${ele}`]?.displayName
                }
              }
            });
          });
        }
      });
  }

  createUserlist() {
    //function to create list of users as per data acces rule
    let userList = [];
    this.userIdArray = [];
    if (this.dataAccessRule == 'All') {
      if (this.allData.subUsers) {
        // create array of subuser ids and names
        this.allData.subUsers.forEach((elem) => {
          this.userIdArray.push(elem.userId);
          userList.push({
            firstname: elem.firstname,
            lastname: elem.lastname ? elem.lastname : '',
            userId: elem.userId,
          });
        });
        this.userIdArray.push(this.superUserId);
        userList.push({
          firstname: this.allData.superUserDetails.firstname,
          lastname: this.allData.superUserDetails.lastname
            ? this.allData.superUserDetails.lastname
            : '',
          userId: this.superUserId,
        });
      }
    } else if (this.dataAccessRule == 'Team') {
      if (this.allData.subUsers) {
        // assign subusers
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].reportsToId === this.allData.userId) {
            this.userIdArray.push(this.allData.subUsers[i].userId);
            userList.push({
              firstname: this.allData.subUsers[i].firstname,
              lastname: this.allData.subUsers[i].lastname
                ? this.allData.subUsers[i].lastname
                : '',
              userId: this.allData.subUsers[i].userId,
            });
          }
        }
        this.userIdArray.push(this.allData.userId);
        userList.push({
          firstname: this.allData.userDetails.firstname,
          lastname: this.allData.userDetails.lastname
            ? this.allData.userDetails.astname
            : '',
          userId: this.allData.userId,
        });
      }
    } else if (this.dataAccessRule == 'Branch') {
      let branch = '';
      if (this.allData.subUsers) {
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].userId == this.allData.userId) {
            branch = this.allData.subUsers[i].branchId;
            break;
          }
        }
        // assign subusers
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].branchId == branch) {
            this.userIdArray.push(this.allData.subUsers[i].userId);
            userList.push({
              firstname: this.allData.subUsers[i].firstname,
              lastname: this.allData.subUsers[i].lastname
                ? this.allData.subUsers[i].lastname
                : '',
              userId: this.allData.subUsers[i].userId,
            });
          }
        }
        this.userIdArray.push(this.allData.userId);
      }

    } else {
      //If data access rule is own, then only get the current user details
      this.userIdArray.push(this.allData.userId);
      userList.push({
        firstname: this.allData.userDetails.firstname,
        lastname: this.allData.userDetails.lastname
          ? this.allData.userDetails.lastname
          : '',
        userId: this.allData.userId,
      });
    }
    return userList;
  }


  public objectComparisonFunction = function (option, value): boolean {
    return option?.columnDef === value?.columnDef;
  };
  // for sabing the view
  saveView() {
    this.disableButton = true;
    // query type is date or timestamp set comparioson array as empty
    if (
      (this.primaryQueryItem.queryType == 'date' ||
        this.primaryQueryItem.queryType == 'timestamp') &&
      (this.primaryQueryItem.operator != 'During' &&
        this.primaryQueryItem.operator != 'After Date'
        && this.primaryQueryItem.operator != 'Before Date')
    ) {
      this.primaryQueryItem.comparisonValue = [];
      this.primaryQueryItem.selectionArray = [];
    }

    let viewSettingsAll = {
      primaryQuery: this.primaryQueryItem,
      filters: this.itemList,
      viewName: this.viewName,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      createdBy: null
    }
    // in edit mode
    if (this.mode == 'Edit') {
      if (!this.viewSettings.createdBy) {
         //  when access is only me save it under current user myViews
        this.liteModeViewFilterService.onEditMyView(this.userId, viewSettingsAll, this.viewSettings.id).then((res) => {
          let data = {
            viewSettings: viewSettingsAll,
            id: this.viewSettings.id
          };

          this.dialogRef.close(data);// send data to parent
        });
      } else {
        //  when access is all users save it under super user user publicViews
        viewSettingsAll.createdBy = this.viewSettings.createdBy;
        this.liteModeViewFilterService.onEditPublicViews(this.superUserId, viewSettingsAll, this.viewSettings.id).then((res) => {
          let data = {
            viewSettings: viewSettingsAll,
            id: this.viewSettings.id
          };
          this.dialogRef.close(data);// send data to parent
        });
      }
    } else {
       // in create mode
      //  when access is only me update it under current user myViews
      if (this.selectedOption == 'onlyMe') {
        this.liteModeViewFilterService.onSaveMyView(this.userId, viewSettingsAll, this.module).then((res) => {
          let data = {
            viewSettings: viewSettingsAll,
            id: res.id
          };

          this.dialogRef.close(data);// send data to parent
        });
      } else {
        //  when access is all users update it under super user user publicViews
        viewSettingsAll.createdBy = this.userId;
        this.liteModeViewFilterService.onSavePublicViews(this.superUserId, viewSettingsAll, this.module, this.userId).then((res) => {
          let data = {
            viewSettings: viewSettingsAll,
            id: res.id
          };
          this.dialogRef.close(data);// send data to parent
        });
      }
    }
  }

  disablePrimaryQueryButton() {
    let isDisable: boolean = false;
    let isOpertaorValid: boolean =
      this.primaryQueryItem.operator == 'in' ||
      this.primaryQueryItem.operator == 'not-in' ||
      this.primaryQueryItem.operator == 'During';

    if (isOpertaorValid && this.primaryQueryItem.comparisonValue.length == 0) {
      isDisable = true;
    } else if (
      this.primaryQueryItem.operator == 'During' &&
      this.primaryQueryItem.comparisonValue[1] == null
    ) {
      isDisable = true;
    }
    return isDisable;
  }
  disableSecondaryQueryButton() {
    let isDisable: boolean = false;
    this.itemList.forEach((element) => {
      if (
        (element.operator == 'in' || element.operator == 'not-in') &&
        element.comparisonValue.length == 0
      ) {
        isDisable = true;
      }
    });
    return isDisable;
  }
  disableSaveButton(viewFormValid, isChild1FormValid): boolean {
    let isDisable: boolean = false;
    let isDisablePrimaryQuery = this.disablePrimaryQueryButton();
    let isDisableSecondaryQuery = this.disableSecondaryQueryButton();
    if (
      !viewFormValid ||
      !isChild1FormValid ||
      isDisablePrimaryQuery ||
      isDisableSecondaryQuery
    ) {
      isDisable = true;
    }
    return isDisable;
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

