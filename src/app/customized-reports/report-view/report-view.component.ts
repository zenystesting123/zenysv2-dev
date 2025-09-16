import { Component, OnInit,Input, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import {
  FollowupOutcome,
  FollowupStatus,
  modules,
  ProductCategories,
  ProductModel,
  ProductListItem,
  QueryOptions,
  ReportSettings,
  selectedFilterFields,
  SubUsers,
  defaultContactSettings,
  defaultSaleSettings,
  defaultProductSettings,
  defaultServiceSettings,
  defaultTaskSettings,
  defaultfollowUpSettings,
  defaultExpenseSettings,
  defaultPaymentSettings,
  Branch,
  FollowupDirection,
} from 'src/app/data-models';
import { dateRangeValues } from 'src/app/data-models';
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ReportServiceService } from './report-service.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewComponent } from '../create-new/create-new.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  colors: string[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  labels?: string[];
  fill: ApexFill;
  markers?: ApexMarkers;
  theme: ApexTheme;
  responsive: ApexResponsive[];
};
var $primary = '#2A6AF6',
  $success = '#F77E17',
  $info = '#2fe69d',
  $warning = '#c168f9',
  $danger = '#F55252';
var themeColors = [$primary, $warning, $success, $danger, $info];


@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})

export class ReportViewComponent implements OnInit, OnDestroy {
  dateGroupingArray:String[]=['Daily','Weekly','Monthly','Yearly'];
  @Input() reportIdWhenChild: string;
  reportId: string;
  panelOpenState = true; //keep the graph area open by default
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  // reportSettings: ReportSettings; //Variable for storing the settings stored in db for the current report
  startDate: any;
  endDate: any;
  dataAccessRule: string;
  userIdArray: any[];
  subuserNameList: any[];
  superUserId: any;
  userId: string;
  usrProfileData: any;
  dataRead: any;
  summaryType: string = 'Card';
  reportSummaryType: string;
  pipelineNames = []; //Array to store the pipeline names for custom and sales module
  pipelineSelected ; //Initializing the pipeline selected
  stackBy: string; //field to be used for stacking
  cardSummaryType: string; //Show count or value
  noOfRecords: number = 0; // number of records read from the db
  chartPrepared: boolean = false;
  dialogRef: any;
  followUpOutcomeArray: string[] = FollowupOutcome.DATA;
  followUpStatusArray: string[] = FollowupStatus.DATA;

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
  ];
  contactsegmentByOptions = [
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
  ];
  contactMeasureByOptions = [
    { name: 'Count', field: 'NA', fieldType: 'def', ind: 0 },
    {
      name: 'Invoiced Amount',
      field: 'invoicedAmount',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Collected Amount',
      field: 'totalAmountCollected',
      fieldType: 'def',
      ind: 0,
    },
  ];
  salesGroupByOptions = [
    { name: 'Created date', field: 'createdDate', type: 'date', fieldType: 'def', ind: 0 },
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    {
      name: 'Pipeline',
      field: 'selectedSalePipeline',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    { name: 'Stage', field: 'salesStage', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0 },
    // { name: 'Product Category', field: 'prodCategory', type: 'option', fieldType: 'def', ind: 0 },
    // { name: 'Product', field: 'productId', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Start Date', field: 'startDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'End Date', field: 'expCompletionDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'Estimate', field: 'estimatedValue', type: 'number', fieldType: 'def', ind: 0 },
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
  salessegmentByOptions = [
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'string' },
    { name: 'Stage', field: 'salesStage', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0 },
    // { name: 'Product Category', field: 'prodCategory', type: 'option', fieldType: 'def', ind: 0 },
    // { name: 'Product', field: 'productId', type: 'option', fieldType: 'def', ind: 0 },
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
  ];
  salesMeasureByOptions = [
    { name: 'Count', field: 'NA' },
    { name: 'Value', field: 'estimatedValue' },
    { name: 'Invoiced Amount', field: 'invoicedAmount' },
    { name: 'Collected Amount', field: 'collectedAmount' },
    { name: 'Expense', field: 'expenseAmount' },
  ]
  productGroupByOptions = [
    { name: 'Created date', field: 'createdDate', type: 'date', fieldType: 'def', ind: 0 },
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Pipeline', field: 'selectedSalePipeline', type: 'option', fieldType: 'def', ind: 0, },
    { name: 'Product Category', field: 'prodCategory', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Product', field: 'productId', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Stage', field: 'salesStage', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Start Date', field: 'startDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'End Date', field: 'expCompletionDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'In Pipeline', field: 'inPipeline', type: 'boolean', fieldType: 'def', ind: 0, },
    { name: 'Lost', field: 'lost', type: 'boolean', fieldType: 'def', ind: 0, },
    { name: 'Won', field: 'won', type: 'boolean', fieldType: 'def', ind: 0, },
  ];
  productSegmentByOptions = [
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'string' },
    { name: 'Stage', field: 'salesStage', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Product Category', field: 'prodCategory', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Product', field: 'productId', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'In Pipeline', field: 'inPipeline', type: 'boolean', fieldType: 'def', ind: 0, },
    { name: 'Lost', field: 'lost', type: 'boolean', fieldType: 'def', ind: 0, },
    { name: 'Won', field: 'won', type: 'boolean', fieldType: 'def', ind: 0, },
  ];
  productMeasureByOptions = [
    { name: 'Count', field: 'NA' },
    { name: 'Total value', field: 'rate' },
    { name: 'Total value after discount', field: 'amountAfterDiscount' },
  ];
  serviceGroupByOptions = [
    { name: 'Created date', field: 'createdDate', type: 'date', fieldType: 'def', ind: 0, },
    {
      name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0,
    },
    {
      name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0,
    },
    { name: 'Start Date', field: 'startDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'End Date', field: 'expCompletionDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'Pipeline', field: 'selectedServPipeline', type: 'option', fieldType: 'def', ind: 0, },
    { name: 'Stage', field: 'servicesStage', type: 'option', fieldType: 'def', ind: 0, },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0, },
    { name: 'In Progress', field: 'inPipeline', type: 'boolean', fieldType: 'def', ind: 0, },

    { name: 'Rejected', field: 'lost', type: 'boolean', fieldType: 'def', ind: 0, },
    { name: 'Closed', field: 'won', type: 'boolean', fieldType: 'def', ind: 0, },
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
  servicesegmentByOptions = [
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'string' },
    { name: 'Stage', field: 'servicesStage', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0 },
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
  ];
  serviceMeasureByOptions = [
    { name: 'Count', field: 'NA' },
  ];
  taskGroupByOptions = [
    { name: 'Created date', field: 'date', type: 'date', fieldType: 'def', ind: 0 },
    { name: 'Due date', field: 'dueDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Status', field: 'status', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0 },
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
  tasksegmentByOptions = [
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Status', field: 'status', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Priority', field: 'priority', type: 'option', fieldType: 'def', ind: 0 },
  ];
  taskMeasureByOptions = [{ name: 'Count', field: 'NA' }];

  followUpGroupByOptions = [
    { name: 'Created date', field: 'dateCreated', type: 'date', fieldType: 'def', ind: 0 },
    { name: 'Call date', field: 'callStartDate', type: 'timestamp', fieldType: 'def', ind: 0 },
    { name: 'Call completed', field: 'completedStatus', type: 'boolean', fieldType: 'def', ind: 0 },
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Status', field: 'status', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Direction', field: 'direction', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Outcome', field: 'outcome', type: 'option', fieldType: 'def', ind: 0 },
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
  followUpsegmentByOptions = [
    { name: 'Call completed', field: 'completedStatus', type: 'boolean', fieldType: 'def', ind: 0 },
    { name: 'Assigned to', field: 'assignedTo', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Created by', field: 'createdBy', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Status', field: 'status', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Direction', field: 'direction', type: 'option', fieldType: 'def', ind: 0 },
    { name: 'Outcome', field: 'outcome', type: 'option', fieldType: 'def', ind: 0 },
  ];
  expenseGroupByOptions = [
    {
      name: 'Created date',
      field: 'date',
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Expense date',
      field: 'expenseDate',
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
  expenseSegmentByOptions = [
    {
      name: 'Created by',
      field: 'createdById',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  expenseMeasureByOptions = [
    {
      name: 'Count',
      field: 'NA',
    },
    {
      name: 'Amount',
      field: 'amount',
      type: 'number',
      fieldType: 'def',
      ind: 0,
    },

  ];
  paymentGroupByOptions = [
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
    /* {
       name: 'Payment type',
       field: 'paymentType',
       type: 'option',
       fieldType: 'def',
       ind: 0,
     },
     {
       name: 'Payment mode',
       field: 'paymentMode',
       type: 'option',
       fieldType: 'def',
       ind: 0,
     },*/

  ];
  paymentSegmentByOptions = [

    {
      name: 'Created by',
      field: 'createdById',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Payment type',
      field: 'paymentType',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
    {
      name: 'Payment mode',
      field: 'paymentMode',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },

  ];

  paymentMeasureByOptions =
    [{ name: 'Count', field: 'NA' }, { name: 'Amount', field: 'amountCollected', fieldType: 'def' }]


  invoiceGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Document date',
      field: 'docDate',
      type: 'timestamp',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Due date',
      field: 'dueDate',
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
  invoiceSegmentByOptions = [

    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  invoiceMeasureByOptions = [{ name: 'Count', field: 'NA' }, { name: 'Amount excl tax', field: 'total', fieldType: 'docData' }, { name: 'Amount Incl tax', field: 'totalInclTax', fieldType: 'docData' }, { name: 'Collected', field: 'collectedAmount' }];

  quotationGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Document date',
      field: 'docDate',
      type: 'timestamp',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Validit till',
      field: 'docValidity',
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
  quotationSegmentByOptions = [

    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  quotationMeasureByOptions = [{ name: 'Count', field: 'NA' }, { name: 'Amount excl tax', field: 'total', fieldType: 'docData' }, { name: 'Amount Incl tax', field: 'totalInclTax', fieldType: 'docData' }];

  estimateGroupByOptions = [
    {
      name: 'Created date',
      field: 'createdDate',
      type: 'date',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Document date',
      field: 'docDate',
      type: 'timestamp',
      fieldType: 'docData',
      ind: 0,
    },
    {
      name: 'Validit till',
      field: 'docValidity',
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
  estimateSegmentByOptions = [

    {
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      fieldType: 'def',
      ind: 0,
    },
  ];
  estimateMeasureByOptions = [{ name: 'Count', field: 'NA' }, { name: 'Amount excl tax', field: 'total', fieldType: 'docData' }, { name: 'Amount Incl tax', field: 'totalInclTax', fieldType: 'docData' }];


  followUpMeasureByOptions = [{ name: 'Count', field: 'NA' }];
  measureByOptions: any = this.contactMeasureByOptions; //Initializing to contact measure by
  measureByOptionsCopy: any = this.contactMeasureByOptions; //Initializing to contact measure by
  groupByOptions = [];
  groupByOptionsCopy = [];
  segmentByOptions = [];
  segmentByOptionsCopy = [];

  groupingSelected: any = this.contactGroupByOptions[1]; //grouping object selected based on the module, need to chane initialization to default value
  measureSelected: any = this.contactMeasureByOptions[1]; //Selected option for displaying value (count/ sum of value etc)
  segmentSelected: any = this.contactsegmentByOptions[1]; //Selected option for segmenting value (Created by, assigned, stage to etc)
  dateGrouping: string = 'Daily';
  module: string = 'customers'; // the module corresponding to the report
  allData: any; //user related data read from the database

  groupingArrayValues = []; //Grouping array values for comparison while running filteration loops
  groupingArrayNames = []; //Grouping names to be displayed in chart
  segmentingValues = []; //Segmenting array values for comparison while running filteration loops
  segmentNames = []; //Segmenting names to be displayed in chart
  countArray = []; //array to store count values based on grouping
  valueArray = []; //array to store the summation values based on grouping
  segmentCountArray = []; //array to store count values based on grouping
  segmentValueArray = []; //array to store the summation values based on grouping
  graphOptions: Partial<ChartOptions>; // sale estimate funnel chart option
  cardSummaryValue: number = 0;
  Months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  customFields: any = [];
  displayColumnsSaved: any[];
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
  itemList = [this.lineItem]; // item list input
  superUserFullName: string;
  allSubUsers: any[] = [];
  subUsers: SubUsers[] = [];
  statusArray: string[] = [];
  outcomeArray: string[] = [];
  directionArray:string[]=FollowupDirection.DATA;// followup direction
  reportSetting: ReportSettings;// selected report
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineStages = [];
  reportDataloaded: boolean = false;
  groupByOptionsPrimary: any[] = []; //Group by option without the additional fields to be used for primary query creation
  newReportNo: number;
  titleEditMode: boolean = false;
  showFilters: boolean = true;
  dataReadTableData: any;
  isChild1FormValid: boolean = true;
  prodCategoryArray: string[] = []
  prodArray: ProductModel[] = []
  fieldCustomsettings: any // custom field name setting
  leadCaptureArray: string[] = [];
  itemListed: boolean = false;
  isLoaded: boolean = false;
  alertPopupStatus:boolean=false;// to open the alert dialoge once
  branches: Branch[] = [];// to store the branch
  networkConnection: boolean; // checks network connection
  reportListSubscription: Subscription;
  fieldNameFollowup: string = 'FollowUp';// cutom fieldname followup
  fieldNameNotes: string = 'Note';//custom field name note
  taskDefaultOpn :any[]= ['Open','Completed']
  taskStatusArray: any;
  constructor(
    private route: ActivatedRoute,
    public commonService: CommonService,
    private db: ReportServiceService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}
  enableSubmitButton(isValid: boolean) {
    this.isChild1FormValid = isValid;
  }
  createGroupingArrayPipeline() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    this.pipelineNames.forEach(element => {
      groupingArrayNames.push(element.pipelineName)
      groupingArrayValues.push(element.pipelineId)
    });
    return [groupingArrayValues, groupingArrayNames];
  }
  createGroupingArrayProductId() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    this.prodArray.forEach(item => {
      groupingArrayValues.push(item.id)
      groupingArrayNames.push(item.prodName)
    })

    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupingArrayProductCategory() {
    // let groupingArrayValues = [];
    // let groupingArrayNames = [];


    return [this.prodCategoryArray, this.prodCategoryArray];
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
      //this.subuserNameList = [];
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
      //console.log("All users",this.allData.userId, this.allData.subUsers )
      //this.subuserNameList = [];
      let branch = '';
      if (this.allData.subUsers) {
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].userId == this.allData.userId) {
            branch = this.allData.subUsers[i].branchId;
            //console.log("Branch of user", branch)
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
        /*userList.push({
          firstname: this.allData.userDetails.firstname,
          lastname: this.allData.userDetails.lastname
            ? this.allData.userDetails.astname
            : '',
          userId: this.allData.userId,
        });*/
      }

    }else {
      //If data access rule is own, then only get the current user details
      // console.log("user details", this.allData.userDetails)
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

  createGroupigArrayBranch() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    this.branches.forEach((elem)=>
    {
      groupingArrayValues.push(elem.id);
      groupingArrayNames.push(elem.name)
    }
    )
    return [groupingArrayValues, groupingArrayNames];

  }
  createGroupigArrayAssignedTo() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];

    //function to create grouping array for assigned to based on the data access rule
    if (this.dataAccessRule == 'All') {
      //this.subuserNameList = [];
      if (this.allData.subUsers) {
        // create array of subuser ids and names
        this.allData.subUsers.forEach((elem) => {
          groupingArrayValues.push(elem.userId);
          groupingArrayNames.push(
            elem.firstname + ' ' + (elem.lastname ? elem.lastname : '')
          );
          //console.log("Grouping array values", this.groupingArrayValues);
          //console.log("Grouping array names", this.groupingArrayNames)
        });
        //add the super user data to the arrays
        groupingArrayValues.push(this.superUserId);
        groupingArrayNames.push(
          this.allData.superUserDetails.firstname +
          ' ' +
          (this.allData.superUserDetails.lastname
            ? this.allData.superUserDetails.lastname
            : '')
        );
      }
    } else if (this.dataAccessRule == 'Team') {
      //this.subuserNameList = [];
      if (this.allData.subUsers) {
        // assign subusers
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].reportsToId === this.allData.userId) {
            groupingArrayValues.push(this.allData.subUsers[i].userId);
            groupingArrayNames.push(
              this.allData.subUsers[i].firstname +
              ' ' +
              (this.allData.subUsers[i].lastname
                ? this.allData.subUsers[i].lastname
                : '')
            );
          }
        }
        //Add the details of the current user to the list
        groupingArrayValues.push(this.allData.userId);
        groupingArrayNames.push(
          this.allData.userDetails.firstname +
          ' ' +
          (this.allData.userDetails.lastname
            ? this.allData.userDetails.lastname
            : '')
        );
      }
    } else if (this.dataAccessRule == 'Branch') {
      //console.log("All users",this.allData.userId, this.allData.subUsers )
      //this.subuserNameList = [];
      let branch = '';
      if (this.allData.subUsers) {
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].userId == this.allData.userId) {
            branch = this.allData.subUsers[i].branchId;
            //console.log("Branch of user", branch)
            break;
        }
      }
        // assign subusers
        for (let i = 0; i < this.allData.subUsers.length; i++) {
          if (this.allData.subUsers[i].branchId == branch) {
            groupingArrayValues.push(this.allData.subUsers[i].userId);
            groupingArrayNames.push(
              this.allData.subUsers[i].firstname +
              ' ' +
              (this.allData.subUsers[i].lastname
                ? this.allData.subUsers[i].lastname
                : '')
            );
          }
        }
        this.userIdArray.push(this.allData.userId);
        /*userList.push({
          firstname: this.allData.userDetails.firstname,
          lastname: this.allData.userDetails.lastname
            ? this.allData.userDetails.astname
            : '',
          userId: this.allData.userId,
        });*/
      }

    }
    else {
      //If data access rule is own, then only get the current user details
      groupingArrayValues = [this.allData.userId];
      groupingArrayNames = [
        this.allData.userDetails.firstname +
        ' ' +
        (this.allData.userDetails.lastname
          ? this.allData.userDetails.lastname
          : ''),
      ];
    }
    return [groupingArrayValues, groupingArrayNames];
  }

  createSegmentingArrayStatus(pipeLineList) {
    let segmentingValues = [];
    let segmentingNames = [];
    pipeLineList.forEach(element => {
      if(element.pipelineId  == this.pipelineSelected){
        element.pipelineStages.forEach(data => {
          segmentingValues.push(data.stageId);
          segmentingNames.push(data.name);
        });
      }
    });
    return [segmentingValues, segmentingNames];
  }

  createGroupigArrayStatus(pipeLineList) {
    //Create the grouping array if grouping is based on customer status
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    pipeLineList.forEach(element => {
      if(element.pipelineId  == this.pipelineSelected){
        element.pipelineStages.forEach(data => {
          groupingArrayValues.push(data.stageId);
          groupingArrayNames.push(data.name);
        });
      }
    });
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupingArrayPaymentType() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = ['Against Invoice', 'Advance payment'];
    groupingArrayNames = ['Against Invoice', 'Advance payment'];
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupingArrayPaymentMode() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = ['Cash', 'Account Transfer', 'Cheque'];
    groupingArrayNames = ['Cash', 'Account Transfer', 'Cheque'];
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayTaskStatus() {
    //Create the grouping array if grouping is based on customer status
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = this.statusArray;
    groupingArrayNames = this.statusArray
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayTaskPriority() {
    //Create the grouping array if grouping is based on customer status
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = ['LOW', 'MEDIUM', 'HIGH'];
    groupingArrayNames = ['LOW', 'MEDIUM', 'HIGH'];
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayPriority() {
    //console.log("Called grouping array by stages function", this.allData.superUserDetails.saleStatus)
    //Create the grouping array if grouping is based on customer status
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = ['Low', 'Medium', 'High'];
    groupingArrayNames = ['Low', 'Medium', 'High'];
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayLeadSource() {
    //console.log("Called grouping array by stages function", this.allData.superUserDetails.saleStatus)
    //Create the grouping array if grouping is based on customer status
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    groupingArrayValues = this.allData.superUserDetails.custLead;
    groupingArrayNames = this.allData.superUserDetails.custLead;
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupingArrayDate() {
    let dateArray: any = [];
    if (this.groupingSelected.fieldType == 'Additional') {
      this.dataRead.forEach((element) => {
        let addnlFieldArr = element.additionalFieldsArr;
        let date = addnlFieldArr[this.groupingSelected.ind]?.fieldValue;
        if (date > 0 && this.groupingSelected.type == 'date') {
          dateArray.push(date);
        } else if (date > 0 && this.groupingSelected.type == 'timestamp') {
          dateArray.push(date.seconds * 1000);
        }
      });
    } else if (this.groupingSelected.fieldType == 'docData') {
      this.dataRead.forEach((element) => {
        let date = element.docData[this.groupingSelected.field];
        if (date > 0 && this.groupingSelected.type == 'date') {
          dateArray.push(date);
        } else if (date > 0 && this.groupingSelected.type == 'timestamp') {
          dateArray.push(date.seconds * 1000);
        }
      });
      dateArray.sort((a, b) => (a < b ? -1 : 1));
    } else {
      this.dataRead.forEach((element) => {
        let date = element[this.groupingSelected.field];
        if (date > 0 && this.groupingSelected.type == 'date') {
          dateArray.push(date);
        } else if (date > 0 && this.groupingSelected.type == 'timestamp') {
          dateArray.push(date.seconds * 1000);
        }
      });
      dateArray.sort((a, b) => (a < b ? -1 : 1));
    }
    this.startDate = dateArray[0];
    this.endDate = dateArray[dateArray.length - 1];
    //console.log("start and end date", this.startDate, this.endDate)

    //start date = lowest value of date from the filtered data
    //end date = highest value of date from the filtered data
    //Create the grouping array if grouping is based on date

    let groupingArrayValues = [];
    let groupingArrayNames = [];
    if(this.startDate){
    if (this.dateGrouping == 'Daily') {
      let tempDate: Date = new Date(this.startDate); //convert timein milliseconds to daate

      let tempEndDate: Date = new Date(this.endDate); //convert timein milliseconds to daate
      tempEndDate.setDate(tempEndDate.getDate() + 1);
      while (tempDate <= tempEndDate ) {
        //console.log('Date range', tempDate.getDate())
        //groupingArrayValues.push([tempDate.getDate(),tempDate.getMonth()]);
        groupingArrayValues.push(
          this.datepipe.transform(tempDate, 'yyyy-MM-dd')
        );
        groupingArrayNames.push(
          tempDate.getDate().toString() + ' ' + this.Months[tempDate.getMonth()]
        );
        tempDate.setDate(tempDate.getDate() + 1);
      }

    } else if (this.dateGrouping == 'Monthly') {
      let tempDate: Date = new Date(this.startDate); //convert timein milliseconds to daate

      let nextDate = new Date(this.startDate);
      nextDate.setDate(tempDate.getDate() + 1);

      let tempEndDate: Date = new Date(this.endDate); //convert timein milliseconds to daate
      tempEndDate.setDate(tempEndDate.getDate() + 31);
      groupingArrayValues.push(this.datepipe.transform(tempDate, 'MM-yyyy'));
      //groupingArrayNames.push(this.datepipe.transform(tempDate, 'MM-yyyy'));
      while (tempDate <= tempEndDate) {
        //console.log('Date range', tempDate.getDate())
        if (
          this.datepipe.transform(nextDate, 'MM-yyyy') !=
          this.datepipe.transform(tempDate, 'MM-yyyy')
        ) {
          groupingArrayValues.push(
            this.datepipe.transform(tempDate, 'MM-yyyy')
          );
          //groupingArrayNames.push(this.datepipe.transform(tempDate, 'MM-yyyy'));
        }

        tempDate.setDate(tempDate.getDate() + 1);
        nextDate.setDate(nextDate.getDate() + 1);
      }
      //remove duplicate values
      groupingArrayValues = groupingArrayValues.filter(function (
        elem,
        index,
        self
      ) {
        return index === self.indexOf(elem);
      });
      groupingArrayNames = groupingArrayValues;

    } else if (this.dateGrouping == 'Weekly') {
      let tempDate: Date = new Date(this.startDate); //convert timein milliseconds to daate
      let nextDate = new Date(this.startDate);
      nextDate.setDate(tempDate.getDate() + 1);

      let tempEndDate: Date = new Date(this.endDate); //convert timein milliseconds to daate
      tempEndDate.setDate(tempEndDate.getDate() + 7);
      groupingArrayValues.push(this.datepipe.transform(tempDate, 'ww-yyyy'));
      groupingArrayNames.push(
        'W' + this.datepipe.transform(tempDate, 'ww-yyyy')
      );
      while (tempDate <= tempEndDate) {
        //console.log('Date range', tempDate.getDate())
        if (
          this.datepipe.transform(nextDate, 'ww-yyyy') !=
          this.datepipe.transform(tempDate, 'ww-yyyy')
        ) {
          groupingArrayValues.push(
            this.datepipe.transform(tempDate, 'ww-yyyy')
          );
          groupingArrayNames.push(
            'W' + this.datepipe.transform(tempDate, 'ww-yyyy')
          );
        }

        tempDate.setDate(tempDate.getDate() + 1);
        nextDate.setDate(nextDate.getDate() + 1);
      }
      //remove duplicate values
      groupingArrayValues = groupingArrayValues.filter(function (
        elem,
        index,
        self
      ) {
        return index === self.indexOf(elem);
      });
      groupingArrayNames = groupingArrayNames.filter(function (
        elem,
        index,
        self
      ) {
        return index === self.indexOf(elem);
      });
    } else if (this.dateGrouping == 'Yearly') {
      let tempDate: Date = new Date(this.startDate); //convert timein milliseconds to daate
      let nextDate = new Date(this.startDate);
      nextDate.setDate(tempDate.getDate() + 365);

      let tempEndDate: Date = new Date(this.endDate); //convert timein milliseconds to daate
      groupingArrayValues.push(this.datepipe.transform(tempDate, 'yyyy'));
      groupingArrayNames.push(this.datepipe.transform(tempDate, 'yyyy'));
      while (tempDate <= tempEndDate) {
        //console.log('Date range', tempDate.getDate())
        if (
          this.datepipe.transform(nextDate, 'yyyy') !=
          this.datepipe.transform(tempDate, 'yyyy')
        ) {
          groupingArrayValues.push(this.datepipe.transform(tempDate, 'yyyy'));
          groupingArrayNames.push(this.datepipe.transform(tempDate, 'yyyy'));
        }
        tempDate.setDate(tempDate.getDate() + 1);
        nextDate.setDate(nextDate.getDate() + 1);
      }
      //remove duplicate values
      groupingArrayValues = groupingArrayValues.filter(function (
        elem,
        index,
        self
      ) {
        return index === self.indexOf(elem);
      });
      groupingArrayNames = groupingArrayNames.filter(function (
        elem,
        index,
        self
      ) {
        return index === self.indexOf(elem);
      });
    }
   }
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayFollowUpStatus() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    if (this.allData.superUserDetails.followUpStatus){
      groupingArrayValues = this.allData.superUserDetails.followUpStatus;
    } else{
      groupingArrayValues = this.followUpStatusArray
    }
    //groupingArrayValues = this.allData.followUpStatus;
    groupingArrayNames = groupingArrayValues;
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayFollowUpOutcome() {

    let groupingArrayValues = [];
    let groupingArrayNames = [];
    if (this.allData.superUserDetails.followUpOutcome){
      groupingArrayValues = this.allData.superUserDetails.followUpOutcome;
    } else{
      groupingArrayValues = this.followUpOutcomeArray;
    }
    groupingArrayNames = groupingArrayValues;
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigArrayFollowUpDirection() {

    let groupingArrayValues = [];
    let groupingArrayNames = [];

    groupingArrayValues = this.allData.superUserDetails.followUpDirection ?this.allData.superUserDetails.followUpDirection :FollowupDirection.DATA;
    groupingArrayNames = this.allData.superUserDetails.followUpDirection ?this.allData.superUserDetails.followUpDirection :FollowupDirection.DATA;
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupigAryAdditionalFieldCategory() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    //groupingArrayValues = this.allData.followUpStatus;
    //groupingArrayNames = this.allData.followUpStatus;
    return [groupingArrayValues, groupingArrayNames];
  }

  createGroupingArray() {
    //function for creating the grouping array based on the module and the filed for grouping
    if (this.groupingSelected.fieldType == 'Additional') {
      //If the grouping is done based on an additional field
      if (
        this.groupingSelected.type == 'date' ||
        this.groupingSelected.type == 'timestamp'
      ) {
        //If the grouping is based on date or timestamp
        [this.groupingArrayValues, this.groupingArrayNames] =
          this.createGroupingArrayDate();
      } else {
        //If the grouping is based on category, assign the custom field category values
        this.groupingArrayValues =
          this.customFields[this.groupingSelected.ind].categories;
        this.groupingArrayNames =
          this.customFields[this.groupingSelected.ind].categories;
      }
    } else {
      if (this.groupingSelected.type == 'boolean') {
        this.groupingArrayValues = [true, false];
        this.groupingArrayNames = ['True', 'False'];
      }
      if (this.groupingSelected.field == 'associatedBranch') {
        [this.groupingArrayValues, this.groupingArrayNames] =
        this.createGroupigArrayBranch();
      }

      //If module is customers
      if (this.module == modules.customers) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is pipeline
        if (this.groupingSelected.field == 'selectedContactPipeline') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPipeline();
        }

        //if the grouping selected is status
        if (this.groupingSelected.field == 'status') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayStatus(JSON.parse(JSON.stringify(this.allData.customerPipelines)));
        }

        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayPriority();
        }
                //if the grouping selected is lead source
                if (this.groupingSelected.field == 'custLeadValue') {
                  [this.groupingArrayValues, this.groupingArrayNames] =
                    this.createGroupigArrayLeadSource();
                }

        //if the grouping selected is date
        if (this.groupingSelected.type == 'date' || this.groupingSelected.type == 'timestamp') {
          //console.log('cust date branch');
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is sales
      else if (this.module == modules.sales) {
        //console.log('Grouping selected', this.groupingSelected);

        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is pipeline
        if (this.groupingSelected.field == 'selectedSalePipeline') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPipeline();
        }
        //if the grouping selected is status
        if (this.groupingSelected.field == 'salesStage') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayStatus(JSON.parse(JSON.stringify(this.allData.salePipelines)));
        }
        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayPriority();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is sales
      else if (this.module == modules.products) {
        //console.log('Grouping selected', this.groupingSelected);

        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is pipeline
        if (this.groupingSelected.field == 'selectedSalePipeline') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPipeline();
        }

        //if the grouping selected is product
        if (this.groupingSelected.field == 'productId') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            //this.createGroupingArrayPipeline();
            this.createGroupingArrayProductId();

        }

        //if the grouping selected is product
        if (this.groupingSelected.field == 'prodCategory') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            //this.createGroupingArrayPipeline();
            this.createGroupingArrayProductCategory();
        }
        //if the grouping selected is status
        if (this.groupingSelected.field == 'salesStage') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayStatus(JSON.parse(JSON.stringify(this.allData.salePipelines)));
        }
        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayPriority();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is service
      else if (this.module == modules.services) {
        //console.log('Grouping selected', this.groupingSelected);

        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is pipeline
        if (this.groupingSelected.field == 'selectedServPipeline') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPipeline();
        }
        //if the grouping selected is status
        if (this.groupingSelected.field == 'servicesStage') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayStatus(JSON.parse(JSON.stringify(this.allData.servicePipelines)));
        }
        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayPriority();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is Tasks
      else if (this.module == modules.tasks) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected
        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is status
        if (this.groupingSelected.field == 'status') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayTaskStatus();
        }
        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayTaskPriority();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is Follow ups
      else if (this.module == modules.FollowUps) {
//console.log("Grouping selected", this.groupingSelected.field)
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is status
        if (this.groupingSelected.field == 'status') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayFollowUpStatus();
        }

                //if the grouping selected is direction
                if (this.groupingSelected.field == 'direction') {
                  [this.groupingArrayValues, this.groupingArrayNames] =
                    this.createGroupigArrayFollowUpDirection();
                }


                //if the grouping selected is direction
                if (this.groupingSelected.field == 'outcome') {
                  [this.groupingArrayValues, this.groupingArrayNames] =
                    this.createGroupigArrayFollowUpOutcome();
                }

        //if the grouping selected is priority
        if (this.groupingSelected.field == 'priority') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayTaskPriority();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }
      //If module is Follow ups
      else if (this.module == modules.invoices || this.module == modules.quotations || this.module == modules.estimates) {

        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      //If module is Follow ups
      else if (this.module == modules.expenses) {

        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.field == 'assignedTo' ||
          this.groupingSelected.field == 'createdById'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is date
        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
      }

      else if (this.module == modules.paymentsreceived) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp'
        ) {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayDate();
        }
        //if the grouping selected is created by
        if (this.groupingSelected.field == 'createdById') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupigArrayAssignedTo();
        } else if (this.groupingSelected.field == 'paymentMode') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPaymentMode();
        } else if (this.groupingSelected.field == 'paymentType') {
          [this.groupingArrayValues, this.groupingArrayNames] =
            this.createGroupingArrayPaymentType();
        }

      }
    }
  }

  createSegmentingArray() {
    //function for creating the segmenting array based on the module and the filed for grouping
    if (this.segmentSelected.fieldType == 'Additional') {
      //If the grouping is done based on an additional field
      if (
        this.segmentSelected.type == 'date' ||
        this.groupingSelected.type == 'timestamp'
      ) {
        //If the grouping is based on date or timestamp
        [this.segmentingValues, this.segmentNames] =
          this.createGroupingArrayDate();
      } else {
        //If the segmenting is based on category, assign the custom field category values
        this.segmentingValues =
          this.customFields[this.segmentSelected.ind].categories ? this.customFields[this.segmentSelected.ind].categories:[];
        this.segmentNames =
          this.customFields[this.segmentSelected.ind].categories ? this.customFields[this.segmentSelected.ind].categories:[];
      }
    } else {
      if (this.segmentSelected.type == 'boolean') {
        this.segmentingValues = [true, false];
        this.segmentNames = ['True', 'False'];
      }
      //If module is customers
      else if (this.module == modules.customers) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (
          this.segmentSelected.field == 'assignedTo' ||
          this.segmentSelected.field == 'createdBy'
        ) {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is status
        if (this.segmentSelected.field == 'status') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createSegmentingArrayStatus(JSON.parse(JSON.stringify(this.allData.customerPipelines)));
        }
        //if the grouping selected is status
        if (this.segmentSelected.field == 'priority') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayPriority();
        }
      }

      //If module is sales
      else if (this.module == modules.sales) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (this.segmentSelected.field == 'assignedTo' ||
          this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is stage
        if (this.segmentSelected.field == 'salesStage') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createSegmentingArrayStatus(JSON.parse(JSON.stringify(this.allData.salePipelines)));
        }
        //if the grouping selected is stage
        if (this.segmentSelected.field == 'priority') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayPriority();
        }
      }
      //If module is products
      else if (this.module == modules.products) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (this.segmentSelected.field == 'assignedTo' ||
          this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is stage
        if (this.segmentSelected.field == 'salesStage') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createSegmentingArrayStatus(JSON.parse(JSON.stringify(this.allData.salePipelines)));
        }
        //if the grouping selected is stage
        if (this.segmentSelected.field == 'priority') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayPriority();
        }

        //if the grouping selected is product
        if (this.segmentSelected.field == 'productId') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            //this.createGroupingArrayPipeline();
            this.createGroupingArrayProductId();

        }

        //if the grouping selected is product
        if (this.segmentSelected.field == 'prodCategory') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            //this.createGroupingArrayPipeline();
            this.createGroupingArrayProductCategory();
        }
      }



      //If module is service
      else if (this.module == modules.services) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (this.segmentSelected.field == 'assignedTo' ||
          this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is stage
        if (this.segmentSelected.field == 'servicesStage') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createSegmentingArrayStatus(JSON.parse(JSON.stringify(this.allData.servicePipelines)));
        }
        //if the grouping selected is stage
        if (this.segmentSelected.field == 'priority') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayPriority();
        }
      }

      //If module is tasks
      else if (this.module == modules.tasks) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected

        if (this.segmentSelected.field == 'assignedTo' || this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is stage
        if (this.segmentSelected.field == 'status') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayTaskStatus();
        }
        //if the grouping selected is stage
        if (this.segmentSelected.field == 'priority') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayTaskPriority();
        }
      }
      //If module is follow ups
      else if (this.module == modules.FollowUps) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected


        if (this.segmentSelected.field == 'assignedTo' ||
          this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to or created by, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }

        //if the grouping selected is complation status
        if (this.segmentSelected.field == 'completedStatus') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          this.segmentingValues = [true, false];
          this.segmentNames = [true, false];

        }
        //if the grouping selected is created by
        if (this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }
        //if the grouping selected is status by
        if (this.segmentSelected.field == 'direction') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          this.segmentingValues = this.directionArray ? this.directionArray:[];
          this.segmentNames = this.directionArray ? this.directionArray:[];
        }
        //if the grouping selected is direction
        if (this.segmentSelected.field == 'status') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] = [this.statusArray, this.statusArray]
        }

        //if the grouping selected is status by
        if (this.segmentSelected.field == 'outcome') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] = [this.outcomeArray, this.outcomeArray]
        }

      }
      //If module is sales documents - Estimate/ Quotation/ Invoice
      else if (this.module == modules.invoices || this.module == modules.quotations || this.module == modules.estimates) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected


        //if the grouping selected is created by
        if (this.segmentSelected.field == 'createdBy') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }


      }           //If module is sales documents - Estimate/ Quotation/ Invoice
      else if (this.module == modules.expenses) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected


        //if the grouping selected is created by
        if (this.segmentSelected.field == 'createdById') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        }


      } else if (this.module == modules.paymentsreceived) {
        //if the grouping selected is of type date, then create the groupings based on dateGrouping selected


        //if the grouping selected is created by
        if (this.segmentSelected.field == 'createdById') {
          //If the grouping selected is assigned to, then create the grouping based on the assigned to names as per the data aces rule
          [this.segmentingValues, this.segmentNames] =
            this.createGroupigArrayAssignedTo();
        } else if (this.segmentSelected.field == 'paymentMode') {
          [this.segmentingValues, this.segmentNames] =
            this.createGroupingArrayPaymentMode();
        } else if (this.segmentSelected.field == 'paymentType') {
          [this.segmentingValues, this.segmentNames] =
            this.createGroupingArrayPaymentType();
        }

      }
      // console.log('Segmenting arrays', this.segmentingValues, this.segmentNames);
    }
  }

  getSumAddnlField(data) {
    //function to get summatedvalue based on an additional field of type number
    let sum = 0;
    //If the measure to be calculated is based on an addiitonal field
    data.forEach((element) => {
      let AddnlField = element.additionalFieldsArr;
      let AddnlFieldVal = 0;
      try {
        //If additional field date is present
        AddnlFieldVal = AddnlField[this.measureSelected.ind].fieldValue;
        sum = sum + AddnlFieldVal;
      } catch {
        //If additional field date is not present
        AddnlFieldVal = 0;
      }
    });
    return Math.round((sum + Number.EPSILON) * 100) / 100;;
  }

  getSumDocDataField(data) {
    return data
      .map((a) => a.docData[this.measureSelected.field])
      .reduce(function (a, b) {
        return Math.round((a + b + Number.EPSILON) * 100) / 100;
      });
  }

  getSumStdField(data) {
    //function to summate a std field (non addiitonal field)


    return data
      .map((a) => a[this.measureSelected.field])
      .reduce(function (a, b) {
        return Math.round((a + b + Number.EPSILON) * 100) / 100;
      });
  }

  groupingValueCheck(record, groupingVal) {
    //console.log("comparison values",this.module, record[this.groupingSelected.field], groupingVal )
    if (this.groupingSelected.fieldType == 'Additional') {
      let AddnlField = record.additionalFieldsArr;
      let AddnlFieldVal: any = 0;
      try {
        //If additional field date is present
        AddnlFieldVal = AddnlField[this.groupingSelected.ind]?.fieldValue ? AddnlField[this.groupingSelected.ind]?.fieldValue :0;
      } catch {
        //If additional field date is not present
        AddnlFieldVal = 0;
      }
      //console.log("Additional field", AddnlField)
      //If the selected field is a standard field
      if (this.groupingSelected.type == 'date' && AddnlFieldVal != 0) {
        //if the comparison is with a date
        if (this.dateGrouping == 'Daily') {
          return (
            this.datepipe.transform(new Date(AddnlFieldVal), 'yyyy-MM-dd') ===
            groupingVal
          );
        } else if (this.dateGrouping == 'Monthly') {
          return (
            this.datepipe.transform(new Date(AddnlFieldVal), 'MM-yyyy') ===
            groupingVal
          );
        } else if (this.dateGrouping == 'Weekly') {
          return (
            this.datepipe.transform(new Date(AddnlFieldVal), 'ww-yyyy') ===
            groupingVal
          );
        } else if (this.dateGrouping == 'Yearly') {
          return (
            this.datepipe.transform(new Date(AddnlFieldVal), 'yyyy') ===
            groupingVal
          );
        }
      } else if (
        this.groupingSelected.type == 'timestamp' &&
        AddnlFieldVal != 0
      ) {
        if (this.dateGrouping == 'Daily') {
          return (
            this.datepipe.transform(
              new Date(AddnlFieldVal.seconds * 1000),
              'yyyy-MM-dd'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Monthly') {
          return (
            this.datepipe.transform(
              new Date(AddnlFieldVal.seconds * 1000),
              'MM-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Weekly') {
          return (
            this.datepipe.transform(
              new Date(AddnlFieldVal.seconds * 1000),
              'ww-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Yearly') {
          return (
            this.datepipe.transform(
              new Date(AddnlFieldVal.seconds * 1000),
              'yyyy'
            ) === groupingVal
          );
        }
      } else if (
        (this.groupingSelected.type == 'date' ||
          this.groupingSelected.type == 'timestamp') &&
        AddnlFieldVal == 0
      ) {
        return false;
      } else {
        //else if the comparison is with a field value
        return AddnlFieldVal === groupingVal;
      }
    } else if (this.groupingSelected.fieldType == 'docData') {
      //If the selected field is a standard field
      if (this.groupingSelected.type == 'date') {
        //if the comparison is with a date
        if (this.dateGrouping == 'Daily') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field]),
              'yyyy-MM-dd'
            ) === groupingVal
          );
        }
        else if (this.dateGrouping == 'Monthly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field]),
              'MM-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Weekly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field]),
              'ww-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Yearly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field]),
              'yyyy'
            ) === groupingVal
          );
        }
      } else if (this.groupingSelected.type == 'timestamp') {
        if (this.dateGrouping == 'Daily') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field].seconds * 1000),
              'yyyy-MM-dd'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Monthly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field].seconds * 1000),
              'MM-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Weekly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field].seconds * 1000),
              'ww-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Yearly') {
          return (
            this.datepipe.transform(
              new Date(record.docData[this.groupingSelected.field].seconds * 1000),
              'yyyy'
            ) === groupingVal
          );
        }
      } else if (this.groupingSelected.type == 'boolean') {
        //If the grouping selected in customer status, check if the pipeline and status are matching
        return (
          record.docData[this.groupingSelected.field] === groupingVal);
      }
      else {
        //else if the comparison is with a field value
        return record.docData[this.groupingSelected.field] === groupingVal;
      }
    } else {
      //If the selected field is a standard field
      if (this.groupingSelected.type == 'date') {
        if (record[this.groupingSelected.field]){
          //if value is present for field
        //if the comparison is with a date
        if (this.dateGrouping == 'Daily') {
          return (
            this.datepipe.transform(
              new Date(record[this.groupingSelected.field]),
              'yyyy-MM-dd'
            ) === groupingVal
          );
        }
        else if (this.dateGrouping == 'Monthly') {
          return (
            this.datepipe.transform(
              new Date(record[this.groupingSelected.field]),
              'MM-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Weekly') {
          return (
            this.datepipe.transform(
              new Date(record[this.groupingSelected.field]),
              'ww-yyyy'
            ) === groupingVal
          );
        } else if (this.dateGrouping == 'Yearly') {
          return (
            this.datepipe.transform(
              new Date(record[this.groupingSelected.field]),
              'yyyy'
            ) === groupingVal
          );
        }
        }
        else {
          //if value is not present, then return false
          return false
        }

      } else if (this.groupingSelected.type == 'timestamp') {
        if(record[this.groupingSelected.field]){
          //if value is present
          if (this.dateGrouping == 'Daily') {
            return (
              this.datepipe.transform(
                new Date(record[this.groupingSelected.field].seconds * 1000),
                'yyyy-MM-dd'
              ) === groupingVal
            );
          } else if (this.dateGrouping == 'Monthly') {
            return (
              this.datepipe.transform(
                new Date(record[this.groupingSelected.field].seconds * 1000),
                'MM-yyyy'
              ) === groupingVal
            );
          } else if (this.dateGrouping == 'Weekly') {
            return (
              this.datepipe.transform(
                new Date(record[this.groupingSelected.field].seconds * 1000),
                'ww-yyyy'
              ) === groupingVal
            );
          } else if (this.dateGrouping == 'Yearly') {
            return (
              this.datepipe.transform(
                new Date(record[this.groupingSelected.field].seconds * 1000),
                'yyyy'
              ) === groupingVal
            );
          }

        } else{
          //if value is not present, then return false
          return false;
        }

      } else if (this.groupingSelected.type == 'boolean') {
        //If the grouping selected in customer status, check if the pipeline and status are matching
        return (
          record[this.groupingSelected.field] === groupingVal);
      }
      else if (this.groupingSelected.field == 'status' && this.module == 'customers') {
        //If the grouping selected in customer status, check if the pipeline and status are matching
        return (
          record[this.groupingSelected.field] === groupingVal &&
          record.selectedContactPipeline == this.pipelineSelected
        );
      } else if (this.groupingSelected.field == 'status' && this.module == 'tasks') {
        //If the grouping selected in customer status, check if the pipeline and status are matching

        return (
          record[this.groupingSelected.field] === groupingVal
        );
      } else if (
        this.groupingSelected.field == 'salesStage') {
        //If the grouping selected in sale stage, check if the pipeline and stage are matching
        return (
          record[this.groupingSelected.field] === groupingVal &&
          record.selectedSalePipeline == this.pipelineSelected
        );
      } else if (
        this.groupingSelected.field == 'servicesStage'
      ) {
        //If the grouping selected in sale stage, check if the pipeline and stage are matching
        return (
          record[this.groupingSelected.field] === groupingVal &&
          record.selectedServPipeline == this.pipelineSelected
        );
      } else {
        //else if the comparison is with a field value
        return record[this.groupingSelected.field] === groupingVal;
      }
    }
  }

  segmentingValueCheck(record, segment) {
    //console.log("seg check", record[this.segmentSelected],segment)
    if (this.segmentSelected.fieldType == 'Additional') {
      //If the segmenting field is an additional field
      let AddnlField = record.additionalFieldsArr;
      let AddnlFieldVal: any = '';
      try {
        //If additional field date is present
        AddnlFieldVal = AddnlField[this.segmentSelected.ind].fieldValue;
        return AddnlFieldVal === segment;
      } catch {
        //If additional field date is not present
        AddnlFieldVal = '';
        return false;
      }
    } else if (this.segmentSelected.fieldType == 'docData') {
      //If the selected field is a standard field
      return record.docData[this.segmentSelected.field] === segment;
    } else {
      //If the selected field is a standard field
      return record[this.segmentSelected.field] === segment;
    }
  }

  summarizeData() {

    let displayHorizontal: boolean = false;

    //Set the display as horizontal or vertical
    if (
      this.summaryType == 'Vertical Bar' ||
      this.summaryType == 'Vertical Stacked Bar'
    ) {
      displayHorizontal = false;
    } else {
      displayHorizontal = true;
    }
    if (this.summaryType != 'Card') {
      this.createGroupingArray();
      this.createSegmentingArray();
    }
    //console.log("Summarize data inputs", this.summaryType, this.segmentingValues, this.groupingArrayValues)
    this.countArray = []; //initialize data to prevent double entry if subscription is called twice
    this.valueArray = []; //initialize data to prevent double entry if subscription is called twice
    this.segmentCountArray = [];
    this.segmentValueArray = [];
    this.cardSummaryValue = 0;// initialise summary value
    let dataSeries = [];
    this.cardSummaryValue = 0;
    //If the summarization selected is card, get the total number of records or sum of value field selected
    if (this.summaryType == 'Card' && this.dataRead.length > 0) {
      //If summary selected is count
      if (this.measureSelected.name == 'Count') {
        this.cardSummaryValue = this.dataRead.length;
      } else {
        //If summation of field value is required
        if (this.measureSelected.fieldType == 'Additional') {
          //If summation if for addiitonal fields
          this.cardSummaryValue = this.getSumAddnlField(this.dataRead);
          if (isNaN(this.cardSummaryValue)) {
            this.cardSummaryValue = 0;
          }
        } else if (this.measureSelected.fieldType == 'docData') {
          this.cardSummaryValue = this.getSumDocDataField(this.dataRead);
          if (isNaN(this.cardSummaryValue)) {
            this.cardSummaryValue = 0;
          }
        } else {
          //If summation is for std field

          this.cardSummaryValue = this.getSumStdField(this.dataRead);
          if (isNaN(this.cardSummaryValue)) {
            this.cardSummaryValue = 0;
          }
          //If the measure to be calculated is based on a std field
        }
      }
    } else if (
      this.summaryType == 'Vertical Bar' ||
      this.summaryType == 'Horizontal Bar'
    ) {
      //For other types of summary graphs
      let tempArray = [];
      let groupingLoopCounter = 0;
      this.groupingArrayValues.forEach((element) => {
        //console.log("groupingArrayValues", this.groupingArrayValues)
        //loop through the grouping array and apply filter to extract the matching values
        tempArray = this.dataRead.filter((record) =>
          this.groupingValueCheck(record, element)
        );
        //        tempArray = this.dataRead.filter((record) => eval(evalexp));
        if (tempArray != null) {
          {
            //update the count and value if there are records meeting the filteration criteria
            this.countArray.push(tempArray.length);
            if (this.measureSelected.name != 'Count') {
              //instead of the grouping we should use the summarization field
              //if the grouping element is a number, then calculate the sum
              let sum: number = 0;
              let evalExpSum = 'a[this.measureSelected.field]';
              if (tempArray.length > 0) {
                if (this.measureSelected.fieldType == 'Additional') {
                  //If summation if for addiitonal fields
                  sum = this.getSumAddnlField(tempArray);
                } else if (this.measureSelected.fieldType == 'docData') {
                  //If summation if for doc data fields (estimate/ invoice/ Quote)
                  sum = this.getSumDocDataField(tempArray);
                } else {
                  //If summation if for addiitonal fields
                  sum = this.getSumStdField(tempArray);
                }
              }
              this.valueArray.push(sum);
            }
          }
        }

        groupingLoopCounter++; //Increment the grouping loop counter
        //console.log("Seg count values", this.segmentCountArray)
        //console.log("Seg sum values", this.segmentValueArray)
      });

      //set the data for displaying
      dataSeries = [{ name: '', data: [] }];
      if (this.measureSelected.name == 'Count') {
        dataSeries[0].name = this.measureSelected.name;
        dataSeries[0].data = this.countArray;
      } else {
        dataSeries[0].name = this.measureSelected.name;
        dataSeries[0].data = this.valueArray;
        //displayData = this.valueArray;
      }
    } else if (
      this.summaryType == 'Vertical Stacked Bar' ||
      this.summaryType == 'Horizontal Stacked Bar'
    ) {
      let segmentLoopCounter = 0;
      let segArray = []; //Initialize the segment array

      let evalexpSegment = 'record2[this.segmentSelected.field] === segElement';
      this.segmentingValues.forEach((segElement) => {
        this.segmentCountArray[segmentLoopCounter] = []; //Initialize array position
        this.segmentValueArray[segmentLoopCounter] = []; //Initialize array position
        //console.log('grouping counter, segment counter', groupingLoopCounter, segmentLoopCounter)
        //segArray = this.dataRead.filter((record2) => eval(evalexpSegment));segmentingValueCheck
        segArray = this.dataRead.filter((record2) =>
          this.segmentingValueCheck(record2, segElement)
        );

        //if filtered values based on segment value is present

        if (segArray.length > 0) {
          //loop by the grouping array
          let tempArray = [];

          let groupingLoopCounter = 0;
          this.groupingArrayValues.forEach((element) => {
            //loop through the grouping array and apply filter to extract the matching values
            //tempArray = segArray.filter((record) => eval(evalexp));
            tempArray = segArray.filter((record) =>
              this.groupingValueCheck(record, element)
            );
            //(record) => this.groupingValueCheck(record, element)

            if (tempArray.length > 0) {
              {
                this.segmentCountArray[segmentLoopCounter][
                  groupingLoopCounter
                ] = tempArray.length;
                let segSum: number = 0;
                let segEvalExpSum = 'a[this.measureSelected.field]';
                if (this.measureSelected.fieldType == 'Additional') {
                  segSum = this.getSumAddnlField(tempArray);
                }
                else if (this.measureSelected.fieldType == 'docData') {
                  segSum = this.getSumDocDataField(tempArray);
                }
                else {
                  segSum = this.getSumStdField(tempArray);
                }

                this.segmentValueArray[segmentLoopCounter][
                  groupingLoopCounter
                ] = segSum;
                //update the count and value if there are records meeting the filteration criteria
                /*--------------------------------------------------------------
                Section copied from vertical bar
                this.countArray.push(tempArray.length);
                  //instead of the grouping we should use the summarization field
                  //if the grouping element is a number, then calculate the sum
                  let sum: number = 0;
                  let evalExpSum = 'a[this.measureSelected.field]';
                  if (tempArray.length > 0) {
                    sum = tempArray
                      .map((a) => eval(evalExpSum))
                      .reduce(function (a, b) {
                        return a + b;
                      });
                  }
                  this.valueArray.push(sum);
                  ------------------------------------------------------*/
              }
            } else {
              this.segmentCountArray[segmentLoopCounter][
                groupingLoopCounter
              ] = 0;
              this.segmentValueArray[segmentLoopCounter][
                groupingLoopCounter
              ] = 0;
            }

            groupingLoopCounter++; //Increment the grouping loop counter
            //console.log("Seg count values", this.segmentCountArray)
            //console.log("Seg sum values", this.segmentValueArray)
          });
        } else {
          //set 0 vallues for the arraay
          let groupingLoopCounter = 0;
          this.groupingArrayValues.forEach((element) => {
            this.segmentCountArray[segmentLoopCounter].push(0);
            this.segmentValueArray[segmentLoopCounter].push(0);

            groupingLoopCounter++;
          });
        }
        segmentLoopCounter++;
      });

      //console.log("Segment count and value arrays", this.segmentCountArray, this.segmentValueArray)
      //set the data for displaying

      let i = 0;
      for (i = 0; i < this.segmentNames.length; i++) {
        dataSeries[i] = { name: '', data: [] };
        dataSeries[i].name = this.segmentNames[i];
        if (this.measureSelected.name == 'Count') {
          dataSeries[i].data = this.segmentCountArray[i];
        } else {
          dataSeries[i].data = this.segmentValueArray[i];
        }
      }
    }

    //set the graph display options
    this.graphOptions = {
      chart: {
        height: 300,
        type: 'bar',
        stacked: true,
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: displayHorizontal,
          columnWidth: '20%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: dataSeries,
      xaxis: {
        categories: this.groupingArrayNames,
      },
      yaxis: {
        tickAmount: 5,
      },
    };
    this.chartPrepared = true;
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.name === o2.name : o2 === o2;
  }

  getDateRange(dateRange: string) {
    //function to get the start and end date based on the date range selected
    let startDate: any;
    let endDate: any;
    switch (dateRange) {
      case dateRangeValues.Today: {
        startDate = new Date(); //This is created with current time as well, needs to be corrected
        endDate = new Date(); //This is created with current time as well, needs to be corrected
        break;
      }
      case dateRangeValues.This_Week: {
        let date = new Date();
        startDate = startOfWeek(date).getTime(); //find first day of the week
        endDate = endOfWeek(date).getTime(); // find lastday of the week
        break;
      }
      case dateRangeValues.This_Month: {
        let date = new Date();
        startDate = startOfMonth(date).getTime(); //find first day of the week
        endDate = endOfMonth(date).getTime(); // find lastday of the week
        break;
      }
    }

    return [startDate, endDate];
  }

  ngOnInit(): void {
    let today = new Date();
    if (!!this.reportIdWhenChild || this.reportIdWhenChild == '0') {
      this.showFilters = false
      this.reportId = this.reportIdWhenChild
    }
    else{
      this.reportId = this.route.snapshot.paramMap.get('id'); // get router param for report id and convert to number
    }
    //console.log("Report id is", this.reportId+1)
    this.commonService.userDatas
      .pipe(take(1))
      .subscribe(async (allData) => {

        // this.customeFieldsAdded = false;
        this.allData = allData;
        this.createGroupigArrayAssignedTo();
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
        if (allData.superUserDetails.fieldNames) {
          this.fieldNameFollowup = allData.superUserDetails.fieldNames.fieldNameFollowup;
        }
        this.superUserFullName =
          allData.superUserDetails.firstname +
            '' +
            allData.superUserDetails.lastname
            ? allData.superUserDetails.lastname
            : '';

        if (
          allData.superUserDetails.productCategories
        ) {
          this.prodCategoryArray = allData.superUserDetails.productCategories;

        } else {
          this.prodCategoryArray = this.getCats();
        }
        this.leadCaptureArray = allData.superUserDetails.custLead;// get leadsource options

        // get a specific report
       this.reportListSubscription = this.db
        .getReport(this.userId, this.reportId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(async (data) => {
          if(data){

            this.reportSetting = data;
            this.summaryType = this.reportSetting.summaryType;
            this.measureSelected = this.reportSetting.measureSelected;
            this.groupingSelected =  this.reportSetting.groupingSelected;
            this.segmentSelected = this.reportSetting.segmentSelected;
            this.pipelineSelected = this.reportSetting.pipelineSelected;

            this.dateGrouping = this.reportSetting.dateGrouping;

            this.module = this.reportSetting.module;

            if(allData.branches){
              this.branches=allData.branches
            }
            if (this.module == 'customers') {
              // custom field name
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



              this.dataAccessRule = this.usrProfileData.contactDataAccessRule;
              this.measureByOptions = this.contactMeasureByOptions;
              this.measureByOptionsCopy = this.contactMeasureByOptions;
              //console.log("measure selected first option",  this.measureSelected)
              this.groupByOptions = this.contactGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.contactGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.contactGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.contactsegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.contactsegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsContact;
              //if there is multiple pipeline access, show all five pipelines else show single pipeline
              if(this.commonService.userPlan.multiPipelineAccess)
                this.pipelineNames = JSON.parse(JSON.stringify(this.allData.customerPipelines));

              else
              //if no multiple pipeline access, show only first pipeline
                this.pipelineNames[0] =JSON.parse(JSON.stringify(this.allData.customerPipelines))[0];


              let temp: any = [];
              // [this.statusArray, temp] = this.createSegmentingArrayCustomerStatus(); //create array with unique stage values from all pipelines

              //Call function to add custom fields to group by and segment by option (categopry type)
            } else if (this.module == 'sales') {
              // custom field name
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
              this.dataAccessRule = this.usrProfileData.saleDataAccessRule;
              // console.log('Entered sales module loop');
              this.measureByOptions = this.salesMeasureByOptions;
              this.measureByOptionsCopy = this.salesMeasureByOptions;
              this.groupByOptions = this.salesGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.salesGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.salesGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptions = this.salessegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.salessegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsSale;

              if(this.commonService.userPlan.multiPipelineAccess)
                //if there is multiple pipeline access, show all five pipelines
                this.pipelineNames = JSON.parse(JSON.stringify(this.allData.salePipelines));
              else
                //if no multiple pipeline access, show only first pipeline
                this.pipelineNames[0] = JSON.parse(JSON.stringify(this.allData.salePipelines))[0];

              let temp: any = [];
              // [this.statusArray, temp] = this.createSegmentingArrayCustomerStatus(); //create array with unique stage values from all pipelines
            }
            else if (this.module == 'products') {
              // in order to avoid daterange reset in report filter
              if (!this.itemListed) {
                await this.getItems();
                this.itemListed = true;
              }

              //fieldname customization
              if (
                this.allData.superUserDetails.productSettings &&
                typeof this.allData.superUserDetails.productSettings !== 'undefined' &&
                this.allData.superUserDetails.productSettings !== null
              ) {
                this.fieldCustomsettings = this.allData.superUserDetails.productSettings;
              } else {
                this.fieldCustomsettings = defaultProductSettings.CONST_VALUE
              }
              if (this.fieldCustomsettings) {
                Object.keys(this.fieldCustomsettings).forEach((ele) => {
                  this.productGroupByOptions.forEach(element => {
                    if (ele == element.field) {
                      element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                    }
                  });
                });
              }
              this.dataAccessRule = this.usrProfileData.saleDataAccessRule;
              this.measureByOptions = this.productMeasureByOptions;
              this.measureByOptionsCopy = this.productMeasureByOptions;
              //created a new object for group by options in case of products since the groupByOptionsPrimary array is modified in filter component to remove product and category
              this.groupByOptions = this.productGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.productGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.productGroupByOptions.map((obj) => ({
                ...obj,
              }));


              // this.groupByOptionsPrimary.forEach((item, index) => {
              //   if (item.field === 'prodCategory') this.groupByOptionsPrimary.splice(index, 1);
              // });

              // this.groupByOptionsPrimary.forEach((item, index) => {
              //   if (item.field === 'productId') this.groupByOptionsPrimary.splice(index, 1);
              // });


              this.segmentByOptions = this.productSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.productSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsProduct;
              if(this.commonService.userPlan.multiPipelineAccess)
                //if there is multiple pipeline access, show all five pipelines
                this.pipelineNames = JSON.parse(JSON.stringify(this.allData.salePipelines));
              else
                //if no multiple pipeline access, show only first pipeline
                this.pipelineNames[0] = JSON.parse(JSON.stringify(this.allData.salePipelines))[0];

              let temp: any = [];
              // [this.statusArray, temp] = this.createSegmentingArrayCustomerStatus(); //create array with unique stage values from all pipelines
            } else if (this.module == 'services') {
              // custom field name
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
              this.dataAccessRule = this.usrProfileData.serviceDataAccessRule;
              this.measureByOptions = this.serviceMeasureByOptions;
              this.measureByOptionsCopy = this.serviceMeasureByOptions;
              this.groupByOptions = this.serviceGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.serviceGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.serviceGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptions = this.servicesegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.servicesegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsService;
              if(this.commonService.userPlan.multiPipelineAccess)
                //if there is multiple pipeline access, show all five pipelines
                this.pipelineNames = JSON.parse(JSON.stringify(this.allData.servicePipelines));
              else
                //if no multiple pipeline access, show only first pipeline
                this.pipelineNames[0] = JSON.parse(JSON.stringify(this.allData.servicePipelines))[0];

              //console.log("Pipeline Names", this.pipelineNames)

              let temp: any = [];
              // [this.statusArray, temp] = this.createSegmentingArrayCustomerStatus(); //create array with unique stage values from all pipelines
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
              this.dataAccessRule = this.usrProfileData.taskDataAccessRule;
              this.measureByOptions = this.taskMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.taskMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.taskGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.taskGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.taskGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptions = this.tasksegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.tasksegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsTask;
                //getting  taskStatus option from db
              if (this.allData.superUserDetails.taskStatusOpn) {
                this.statusArray = this.allData.superUserDetails.taskStatusOpn;
                // this.taskStatusArray = this.allData.superUserDetails.taskStatusOpn;
              }
              else {
                this.statusArray = this.taskDefaultOpn;
                // this.taskStatusArray = this.taskDefaultOpn;
              }
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
              this.dataAccessRule = this.usrProfileData.followUpDataAccessRule;
              this.measureByOptions = this.followUpMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.followUpMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.followUpGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.followUpGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.followUpGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.followUpsegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.followUpsegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsFollowUp;
              if (allData.superUserDetails.followUpStatus) {
                this.statusArray = allData.superUserDetails.followUpStatus;
              } else {
                this.statusArray = this.followUpStatusArray;
              }
              if (allData.superUserDetails.followUpOutcome) {
                this.outcomeArray = allData.superUserDetails.followUpOutcome;
              } else {
                this.outcomeArray = this.followUpOutcomeArray;
              }
              this.directionArray=allData.superUserDetails.followUpDirection?allData.superUserDetails.followUpDirection:FollowupDirection.DATA;
              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
            } else if (this.module == 'Invoices') {
               this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              this.measureByOptions = this.invoiceMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.invoiceMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.invoiceGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.invoiceGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.invoiceGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.invoiceSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.invoiceSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsInvoices;

              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
            } else if (this.module == 'Quotations') {
               this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              this.measureByOptions = this.quotationMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.quotationMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.quotationGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.quotationGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.quotationGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.quotationSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.quotationSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsQuotation;

              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
            } else if (this.module == 'Estimates') {
               this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              this.measureByOptions = this.estimateMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.estimateMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.estimateGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.estimateGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.estimateGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.estimateSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.estimateSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsEstimate;

              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
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
             this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              this.measureByOptions = this.expenseMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.expenseMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.expenseGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.expenseGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.expenseGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.expenseSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.expenseSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsExpense;

              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
            } else if (this.module == 'paymentsreceived') {
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
                  this.paymentGroupByOptions.forEach(element => {
                    if (ele == element.field) {
                      element.name = this.fieldCustomsettings[`${ele}`]?.displayName
                    }
                  });
                });
              }
              this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              this.measureByOptions = this.paymentMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.measureByOptionsCopy = this.paymentMeasureByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptions = this.paymentGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsCopy = this.paymentGroupByOptions.map((obj) => ({
                ...obj,
              }));
              this.groupByOptionsPrimary = this.paymentGroupByOptions.map(
                (obj) => ({ ...obj })
              );
              this.segmentByOptions = this.paymentSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.segmentByOptionsCopy = this.paymentSegmentByOptions.map((obj) => ({
                ...obj,
              }));
              this.customFields = this.allData.superUserDetails.customFieldsPayment;

              //this.statusArray = allData.superUserDetails.followUpStatus;
              //this.outcomeArray = allData.superUserDetails.followUpOutcome;
            }
            //console.log("Data access rule", this.module, this.dataAccessRule)
            //create list of users based on data access rule for the selected module
            this.subUsers = allData.subUsers;
            this.allSubUsers = [];
            this.allSubUsers = this.createUserlist();


            if (this.reportSetting.displayColumns !== undefined) {
              this.displayColumnsSaved = this.reportSetting.displayColumns;
            }
            if (this.reportSetting.filters) {
              this.itemList = this.reportSetting.filters;
            }
            if (this.reportSetting.primaryQuery) {
              this.primaryQueryItem = this.reportSetting.primaryQuery;
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

            // primary query data fetch start
            // check if primary query is present
            if (this.reportSetting.primaryQuery) {
              // open a popup if deleted additional field is used in custom view query
              if (this.reportSetting.primaryQuery.queryField == 'additionalFieldsArr'
                && !this.customFields[this.reportSetting.primaryQuery.ind]?.isActive) {
                if (!this.alertPopupStatus) {
                  this.dialog.open(StatusPopupComponent, {
                    disableClose: true,
                    data: {
                      type: 'Addtional_field_custom_view',
                    },
                  });
                }
                this.alertPopupStatus = true;
              } else {
                this.reportSetting.filters?.forEach(element => {
                  if (element.queryField == 'additionalFieldsArr'
                    && !this.customFields[element.ind]?.isActive) {
                    if (!this.alertPopupStatus) {
                      this.dialog.open(StatusPopupComponent, {
                        disableClose: true,
                        data: {
                          type: 'Addtional_field_custom_view',
                        },
                      });
                    }
                    this.alertPopupStatus = true;
                  }
                });
              }
              // get the data from specific format
              let queryData = this.getQueryData(this.reportSetting.primaryQuery);
              //console.log("Query data", queryData, this.module)
              if (queryData) {
                this.dataRead = await this.db.readPrimaryDataFromReport(this.superUserId, this.module, queryData);

                
                // this.db
                //   .readPrimaryData(this.superUserId, this.module, queryData)
                //   .pipe(take(1))
                //   .subscribe((data) => {
                //     console.log("Data fetched")
                //     this.dataRead = data.map((e) => {
                //       return {
                //         id: e.payload.doc.id,
                //         ...(e.payload.doc.data() as {}),
                //       } as any;

                //     });
                    //console.log("Total recoords read", this.dataRead.length)

                    //If the primary query is based on created by, then dont filter out the records based on assigned to rules
                    if (queryData.queryField == "createdBy") {
                      //Else if the primary query is not based on createdBy field, then apply data access rule based on assigned to
                      if (this.dataAccessRule == 'Team' || this.dataAccessRule  == 'Own') {
                        if (this.userIdArray) {
                          this.dataRead = this.dataRead.filter((element) =>
                            this.userIdArray.includes(element.createdBy)
                          );
                        } else {
                          [this.userIdArray, this.userIdArray] =
                            this.commonService.createUserlist(
                              this.dataAccessRule ,
                              this.userId
                            );
                          this.dataRead = this.dataRead.filter((element) =>
                            this.userIdArray.includes(element.createdBy)
                          );
                        }
                      } else if (this.dataAccessRule  == 'Branch') {
                        let branchId = this.commonService.getBranch(this.userId)
                        //console.log("Branch fetched", branchId)
                        this.dataRead = this.dataRead.filter(element =>
                          element.associatedBranch === branchId
                        );

                      }

                    }

                    //Filter he data read according to the data access rule of the user);
                    else if (this.module != 'Invoices' && this.module != 'Quotations' && this.module != 'Estimates' && this.module != 'paymentsreceived' && this.module != 'Expenses') {
                      if (this.dataAccessRule == 'Branch') {
                        //If data access rule is for branch, then filter the data read by branch
                        let branchId = this.commonService.getBranch(this.userId)
                        this.dataRead = this.dataRead.filter(element =>
                          element.associatedBranch === branchId
                        );

                      } else { //If Data access rule is equal to all/ own/ team
                        this.dataRead = this.dataRead.filter((element) =>
                          this.userIdArray.includes(element.assignedTo)
                        );
                      }

                    } //Filter he data read according to the data access rule of the user);
                    else if (this.module == 'Invoices' || this.module == 'Quotations' || this.module == 'Estimates' ) {
                      if (this.dataAccessRule == 'Branch') {

                        this.dataRead = this.dataRead.filter((element) =>
                          this.userIdArray.includes(element.createdBy) && !element.docData.cancel//cancelled invoice removed
                        );

                      } else { //If Data access rule is equal to all/ own/ team
                        this.dataRead = this.dataRead.filter((element) =>
                          this.userIdArray.includes(element.createdBy) && !element.docData.cancel//cancelled invoice removed
                        );
                      }
                    }
                    else if ( this.module == 'paymentsreceived' || this.module == 'Expenses') {
                      // console.log("Entered the invoice part")
                      if (this.dataAccessRule == 'Branch') {
                        // console.log("Entered branch filter",  this.userIdArray)
                        this.dataRead = this.dataRead.filter((element) =>
                          this.userIdArray.includes(element.createdById)
                        );

                      } else { //If Data access rule is equal to all/ own/ team
                        // console.log("Entered all/ own filter", this.userIdArray)
                        this.dataRead = this.dataRead.filter((element) =>
                          this.userIdArray.includes(element.createdById)
                        );
                      }

                    }


                    //if the module is product, then create a new data table based on the data format for listing products in sale
                    if (this.module == 'products') {
                      let prodList: ProductListItem[] = [];
                      for (var val of this.dataRead) {
                        if (val.itemsArray != undefined) {
                          let items: any[] = Object.values(val.itemsArray);
                          if (items.length > 0) {
                            for (var ele of items) {
                              let amount = ele.unitPrice * (1 - ele.discount / 100);
                              let amtAfterDisc = ele.quantity * amount;

                              let fullName = val.secondName
                                ? val.firstName + ' ' + val.secondName
                                : val.firstName;

                              let item = new ProductListItem(
                                ele.prodName,
                                ele.productId,
                                ele.prodCategory ? ele.prodCategory : null,
                                ele.quantity,
                                ele.unitPrice,
                                ele.discount,
                                amtAfterDisc,
                                val.saleTitle,
                                val.salesStage,
                                val.selectedSalePipeline,
                                fullName,
                                val.createdDate,
                                val.startDate,
                                val.expCompletionDate,
                                val.assignedToName,
                                ele.additionalFieldsArr ? ele.additionalFieldsArr : [],
                                val.createdBy,
                                val.assignedTo,
                                val.inPipeline,
                                val.won,
                                val.lost
                              );
                              prodList.push(item);
                            }
                          }
                        }
                      }
                      this.dataRead = prodList; // apply the new format to dataRead
                    }

                    this.noOfRecords = this.dataRead.length; //
                    // check if filter is present
                    if (this.reportSetting.filters.length > 0) {
                      let filterData = this.reportSetting.filters;
                      filterData.forEach((element) => {
                        let querFiled = element.queryField;
                        let filterQuery = this.getQueryData(element);
                        this.dataRead = this.dataRead.filter((record) =>
                          this.commonService.filterData(record, filterQuery)
                        );
                        // console.log("Filtered data", this.dataRead.length)
                      });
                    }
                    this.dataReadTableData = this.dataRead;
                    [this.userIdsArray, this.userNamesArray] = this.createGroupigArrayAssignedTo(); //Get the list of user id and names
                    this.summarizeData(); //Process the data as per the summary type
                  // });
              }
            }
            this.reportDataloaded = true;


            // add custom fields to measure by, segment by and group by option
            if (this.customFields !== undefined && this.customFields.length > 0 ) {
              this.measureByOptions = JSON.parse(JSON.stringify(this.measureByOptionsCopy));
              this.groupByOptions = JSON.parse(JSON.stringify(this.groupByOptionsCopy));
              this.segmentByOptions = JSON.parse(JSON.stringify(this.segmentByOptionsCopy));
              this.groupByOptionsPrimary = JSON.parse(JSON.stringify(this.groupByOptionsCopy));
              if(this.module == 'products'){
                this.groupByOptionsPrimary.forEach((item, index) => {
                  if (item.field === 'prodCategory') this.groupByOptionsPrimary.splice(index, 1);
                });

                this.groupByOptionsPrimary.forEach((item, index) => {
                  if (item.field === 'productId') this.groupByOptionsPrimary.splice(index, 1);
                });
              }
              let i = 0;
              this.customFields.forEach((element) => {
                 // add isAcive check while pushing custom fields to groupByOptions
                if (element.fieldType == 'number'  && element.isActive) {
                  this.measureByOptions.push({
                    name: element.fieldName,
                    field: 'additionalFieldsArr',
                    fieldType: 'Additional',
                    ind: i,
                  });
                } else if (element.fieldType == 'category'  && element.isActive) {
                  this.groupByOptions.push({
                    name: element.fieldName,
                    field: 'additionalFieldsArr',
                    fieldType: 'Additional',
                    type: 'option',
                    ind: i,
                  });
                  this.groupByOptionsPrimary.push({
                    name: element.fieldName,
                    field: 'additionalFieldsArr',
                    fieldType: 'Additional',
                    type: 'option',
                    ind: i,
                  });
                  this.segmentByOptions.push({
                    name: element.fieldName,
                    field: 'additionalFieldsArr',
                    type: 'option',
                    fieldType: 'Additional',
                    ind: i,
                  });
                } else if (element.fieldType == 'date'  && element.isActive) {
                  this.groupByOptions.push({
                    name: element.fieldName,
                    field: 'additionalFieldsArr',
                    type: 'timestamp',
                    fieldType: 'Additional',
                    ind: i,
                  });
                  this.groupByOptionsPrimary.push({
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
            // for changing the header by custom field name
            this.measureByOptions.forEach((ele) => {
              if (ele?.field == 'lastNoteDate') {
                ele.name = 'Last ' + this.fieldNameNotes + ' Date';
              }
              else if (ele?.field == 'nextFollowupDate') {
                ele.name = 'Next ' + this.fieldNameFollowup + ' Date';
              }
              else if (ele?.field == 'previousFollowupDate') {
                ele.name = 'Previous ' + this.fieldNameFollowup + ' Date';
              }
            })
            this.segmentByOptions.forEach((ele) => {
              if (ele?.field == 'lastNoteDate') {
                ele.name = 'Last ' + this.fieldNameNotes + ' Date';
              }
              else if (ele?.field == 'nextFollowupDate') {
                ele.name = 'Next ' + this.fieldNameFollowup + ' Date';
              }
              else if (ele?.field == 'previousFollowupDate') {
                ele.name = 'Previous ' + this.fieldNameFollowup + ' Date';
              }
            })
            this.groupByOptions.forEach((ele) => {
              if (ele?.field == 'lastNoteDate') {
                ele.name = 'Last ' + this.fieldNameNotes + ' Date';
              }
              else if (ele?.field == 'nextFollowupDate') {
                ele.name = 'Next ' + this.fieldNameFollowup + ' Date';
              }
              else if (ele?.field == 'previousFollowupDate') {
                ele.name = 'Previous ' + this.fieldNameFollowup + ' Date';
              }
            })
            this.isLoaded = true
          }
        })
      });

  }
  // for getting the quey with specific format
  getQueryData(reporyQuery): QueryOptions {
    let queryData: QueryOptions = {
      queryField: '',
      queryType: '',
      operator: '<',
      comparisonValue: [],
      fieldType: '',
      ind: 0,
    };
    queryData.queryField = reporyQuery.queryField; // query filed
    queryData.queryType = reporyQuery.queryType; // query type
    queryData.fieldType = reporyQuery.fieldType;
    queryData.ind = reporyQuery.ind;

    // if query type is date get the comparison value as number format
    if (reporyQuery.queryType == 'date') {
      queryData.operator = null;
      let date = new Date();
      if (reporyQuery.operator == 'During') {
        let firstDay = reporyQuery.comparisonValue[0];
        let lastDay = reporyQuery.comparisonValue[1];
        queryData.comparisonValue[0] = new Date(firstDay).getTime();
        let last = new Date(lastDay);
        last.setHours(23, 59, 59, 999);
        queryData.comparisonValue[1] = last.getTime();
      } else if (reporyQuery.operator == 'Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'This Week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'This Month') {
        let firstDay = new Date(startOfMonth(date)); //find first day of the week
        let lastDay = new Date(endOfMonth(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Before Date') {
        let firstDay = reporyQuery.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay).getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }else if (reporyQuery.operator == 'After Date') {
        let firstDay = reporyQuery.comparisonValue[0];
        let last = new Date(firstDay);
        last.setHours(23, 59, 59, 999);
        queryData.comparisonValue[0] = last.getTime();
        queryData.comparisonValue[1] = 'After Date';// for query data only date greater than the date
      }
      else if (reporyQuery.operator == 'Before Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();


        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date This Week') {
        let firstDay = new Date(startOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date This Week') {
        let firstDay = new Date(endOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date This Month') {
        let firstDay = new Date(startOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date This Month') {
        let firstDay = new Date(endOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else {
      }
    }
    // if query type is timestamp get the comparison value as number format
    else if (reporyQuery.queryType == 'timestamp') {
      queryData.operator = null;
      let date = new Date();
      if (reporyQuery.operator == 'During') {
        let firstDay = reporyQuery.comparisonValue[0];
        let lastDay = reporyQuery.comparisonValue[1];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[1] = new Date(lastDay);
        queryData.comparisonValue[1].setHours(23, 59, 59, 999);
      } else if (reporyQuery.operator == 'Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'This Week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'This Month') {
        let firstDay = new Date(startOfMonth(date)); //find first day of the week
        let lastDay = new Date(endOfMonth(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (reporyQuery.operator == 'Before Date') {
        let firstDay = reporyQuery.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[1] = 'Before Date';// for query data only date less than the date
      }else if (reporyQuery.operator == 'After Date') {
        let firstDay = reporyQuery.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[0].setHours(23, 59, 59, 999);
        queryData.comparisonValue[1] = 'After Date';// for query data only date greater than the date
      }
      else if (reporyQuery.operator == 'Before Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date This Week') {
        let firstDay = new Date(startOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date This Week') {
        let firstDay = new Date(endOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'Before Date This Month') {
        let firstDay = new Date(startOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      }
      else if (reporyQuery.operator == 'After Date This Month') {
        let firstDay = new Date(endOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      }
      else {
      }
    }      // if query type is number or option
    else if (reporyQuery.queryType == 'boolean') {
      queryData.operator = reporyQuery.operator;
      queryData.comparisonValue = reporyQuery.comparisonValue;
    }
    // if query type is number or option
    else {
      queryData.operator = reporyQuery.operator;
      queryData.comparisonValue = reporyQuery.comparisonValue;
    }
    return queryData;
  }

  // for saving query data
  onSaveQuery() {
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
    this.reportSetting.primaryQuery = this.primaryQueryItem;
    this.reportSetting.filters = this.itemList;
    this.reportSetting.summaryType = this.summaryType;
    this.reportSetting.measureSelected =
      this.measureSelected;
    this.reportSetting.groupingSelected =
      this.groupingSelected;
    this.reportSetting.segmentSelected =
      this.segmentSelected;
    this.reportSetting.pipelineSelected =
      this.pipelineSelected ? this.pipelineSelected : this.pipelineNames[0]?.pipelineId ?this.pipelineNames[0]?.pipelineId:0;
    this.reportSetting.dateGrouping = this.dateGrouping;
    this.isLoaded = false;
    this.db.onSaveFilter(this.userId,this.reportId,this.reportSetting).then(resp => {
    });
  }


  setTitleEditMode() {
    this.titleEditMode = true;
  }
  updateTitle() {
    this.titleEditMode = false;
    this.db.onUpdateReport(this.userId,this.reportId, this.reportSetting.title);
  }
  cancelTitleUpdate() {
    this.titleEditMode = false;
  }

  // exportTojson() {
  //   // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
  //   let exportData = this.reportSettingsAll;
  //   return saveAs(
  //     new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }), 'sample.json'
  //   );
  // }
  disablePrimaryQueryButton() {
    let isDisable: boolean = false;
    let isOpertaorValid: boolean = this.primaryQueryItem.operator == 'in' || this.primaryQueryItem.operator == 'not-in'
      || this.primaryQueryItem.operator == 'During'

    if (isOpertaorValid && this.primaryQueryItem.comparisonValue.length == 0) {
      isDisable = true;
    }
    else if (this.primaryQueryItem.operator == 'During' && this.primaryQueryItem.comparisonValue[1] == null) {
      isDisable = true;
    }
    return isDisable
  }
  disableSecondaryQueryButton() {
    let isDisable: boolean = false;
    this.itemList.forEach(element => {
      if ((element.operator == 'in' || element.operator == 'not-in') && element.comparisonValue.length == 0) {
        isDisable = true
      }
    });
    return isDisable
  }
  disableSaveButton(viewFormValid, isChild1FormValid): boolean {
    let isDisable: boolean = false;
    let isDisablePrimaryQuery = this.disablePrimaryQueryButton();
    let isDisableSecondaryQuery = this.disableSecondaryQueryButton();
    if (!viewFormValid || !isChild1FormValid || isDisablePrimaryQuery || isDisableSecondaryQuery) {
      isDisable = true;
    }
    return isDisable
  }
  // get categoriess
  getCats(): string[] {
    let category = new ProductCategories();
    return category.prodCats;
  }
  async getItems() {
    this.prodArray = await this.db.getProducts(
      this.superUserId,
    );
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.reportListSubscription?.unsubscribe();
  }
    onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // delete report
  deleteReport() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_report',
        viewName: this.reportSetting.title,
        reportId: this.reportId,
        userId:this.userId,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'reportdeleted') {
        this.snackBar.open('Report has been deleted', '', { duration: 2000 });
        this.router.navigate(['dash/custom-report/list']);
      }
    });
  }
}
