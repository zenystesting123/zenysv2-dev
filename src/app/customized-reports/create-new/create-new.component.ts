import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Router } from '@angular/router';
import { Profile } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ReportServiceService } from '../report-view/report-service.service';


@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})

export class CreateNewComponent implements OnInit {
  superUserDetails: Profile = null; //superuser details from commonservice
  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameMeeting: string = 'Meeting';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  moduleList = [];
  reportDataTemplate = { title: '', module: '' }

  reportDataTemplate_Task = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "date",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdBy",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "tasks",
    "title": "Tasks created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdBy",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_FollowUp = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "dateCreated",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdBy",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "tasks",
    "title": "Tasks created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdBy",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_SalesDoc = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "docData.createdDate",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdBy",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "services",
    "title": "Tickets created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdBy",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_Expenses = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "date",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdById",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "Expenses",
    "title": "Tickets created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdById",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_Payments = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "createDate",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdById",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "paymentsreceived",
    "title": "Tickets created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdById",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_Products = {
    "primaryQuery": {
      "fieldType": "def",
      "selectionArray": [],
      "queryField": "createdDate",
      "queryName": "Created date",
      "queryType": "date",
      "ind": 0,
      "operator": "Today",
      "comparisonValue": []
    },
    "summaryType": "Card",
    "measureSelected": {
      "fieldType": "def",
      "field": "NA",
      "name": "Count",
      "ind": 0
    },
    "dateGrouping": "Daily",
    "pipelineSelected": 0,
    "filters": [],
    "groupingSelected": {
      "fieldType": "def",
      "field": "createdBy",
      "name": "Created by",
      "ind": 0,
      "type": "option"
    },
    "module": "products",
    "title": "Sales created today",
    "segmentSelected": {
      "ind": 0,
      "field": "createdBy",
      "type": "option",
      "name": "Created by",
      "fieldType": "def"
    }
  }
  reportDataTemplate_Customer:any;
  reportDataTemplate_Sale:any;
  reportDataTemplate_Support:any;
  moduleSelected = "customers";
  reportTitle: string = '';
  userId: string;
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  networkConnection: boolean; // checks network connection
  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string, superUserDetails: Profile },
    private router: Router, private snackBar: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private reportService: ReportServiceService) { 
      this.reportDataTemplate_Customer = {
        "primaryQuery": {
          "fieldType": "def",
          "selectionArray": [],
          "queryField": "dateCreated",
          "queryName": "Created date",
          "queryType": "date",
          "ind": 0,
          "operator": "Today",
          "comparisonValue": []
        },
        "summaryType": "Card",
        "measureSelected": {
          "fieldType": "def",
          "field": "NA",
          "name": "Count",
          "ind": 0
        },
        "dateGrouping": "Daily",
        "pipelineSelected": this.commonService.customerPipelines[0].pipelineId,
        "filters": [],
        "groupingSelected": {
          "fieldType": "def",
          "field": "createdBy",
          "name": "Created by",
          "ind": 0,
          "type": "option"
        },
        "module": "customers",
        "title": "Customers created today",
        "segmentSelected": {
          "ind": 0,
          "field": "createdBy",
          "type": "option",
          "name": "Created by",
          "fieldType": "def"
        }
      }
      this.reportDataTemplate_Sale = {
        "primaryQuery": {
          "fieldType": "def",
          "selectionArray": [],
          "queryField": "createdDate",
          "queryName": "Created date",
          "queryType": "date",
          "ind": 0,
          "operator": "Today",
          "comparisonValue": []
        },
        "summaryType": "Card",
        "measureSelected": {
          "fieldType": "def",
          "field": "NA",
          "name": "Count",
          "ind": 0
        },
        "dateGrouping": "Daily",
        "pipelineSelected": this.commonService.salePipelines[0].pipelineId,
        "filters": [],
        "groupingSelected": {
          "fieldType": "def",
          "field": "createdBy",
          "name": "Created by",
          "ind": 0,
          "type": "option"
        },
        "module": "sales",
        "title": "Sales created today",
        "segmentSelected": {
          "ind": 0,
          "field": "createdBy",
          "type": "option",
          "name": "Created by",
          "fieldType": "def"
        }
      }
      this.reportDataTemplate_Support = {
        "primaryQuery": {
          "fieldType": "def",
          "selectionArray": [],
          "queryField": "createdDate",
          "queryName": "Created date",
          "queryType": "date",
          "ind": 0,
          "operator": "Today",
          "comparisonValue": []
        },
        "summaryType": "Card",
        "measureSelected": {
          "fieldType": "def",
          "field": "NA",
          "name": "Count",
          "ind": 0
        },
        "dateGrouping": "Daily",
        "pipelineSelected": this.commonService.servicePipelines[0].pipelineId,
        "filters": [],
        "groupingSelected": {
          "fieldType": "def",
          "field": "createdBy",
          "name": "Created by",
          "ind": 0,
          "type": "option"
        },
        "module": "services",
        "title": "Tickets created today",
        "segmentSelected": {
          "ind": 0,
          "field": "createdBy",
          "type": "option",
          "name": "Created by",
          "fieldType": "def"
        }
      }
      
    }

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.superUserDetails = this.data.superUserDetails; //superuserdata is assigning to local variable
    // customisable field names assigning
    if (this.superUserDetails.fieldNames) {
      this.fieldNameContact =
        this.superUserDetails.fieldNames.fieldNameContact;
      this.fieldNameSale =
        this.superUserDetails.fieldNames.fieldNameSale;
      this.fieldNameTask =
        this.superUserDetails.fieldNames.fieldNameTask;
      this.fieldNameMeeting =
        this.superUserDetails.fieldNames.fieldNameMeeting;
      this.fieldNameFollowup =
        this.superUserDetails.fieldNames.fieldNameFollowup;
      this.fieldNameEstimate =
        this.superUserDetails.fieldNames.fieldNameEstimate;
      this.fieldNameQuotation =
        this.superUserDetails.fieldNames.fieldNameQuotation;
      this.fieldNameInvoice =
        this.superUserDetails.fieldNames.fieldNameInvoice;
      this.fieldNameCollection =
        this.superUserDetails.fieldNames.fieldNameCollection;
      this.fieldNameExpense =
        this.superUserDetails.fieldNames.fieldNameExpense;
      this.fieldNameItems =
        this.superUserDetails.fieldNames.fieldNameItems;
      this.fieldNameService = this.superUserDetails.fieldNames.fieldNameService;
    }
    if (this.superUserDetails.plan == 'leadManagement') {
      this.moduleList = [
        { dispName: this.fieldNameContact, module: "customers" },
        { dispName: this.fieldNameTask, module: "tasks" },
        { dispName: this.fieldNameFollowup, module: "Follow Ups" },
      ];
    } else {
      this.moduleList = [{ dispName: this.fieldNameContact, module: "customers" },
      { dispName: this.fieldNameSale, module: "sales" },
      { dispName: this.fieldNameItems, module: "products" },
      { dispName: this.fieldNameService, module: "services" },
      { dispName: this.fieldNameTask, module: "tasks" },
      { dispName: this.fieldNameFollowup, module: "Follow Ups" },
      { dispName: this.fieldNameInvoice, module: "Invoices" },
      { dispName: this.fieldNameQuotation, module: "Quotations" },
      { dispName: this.fieldNameEstimate, module: "Estimates" },
      { dispName: this.fieldNameCollection, module: "paymentsreceived" },
      { dispName: this.fieldNameExpense, module: "Expenses" },
      ];
    }
  }
  savetoDB() {
    // based on the module selected save the report with default data
    if (this.moduleSelected == 'customers') {
      this.reportDataTemplate = this.reportDataTemplate_Customer;
    } else if (this.moduleSelected == 'sales') {
      this.reportDataTemplate = this.reportDataTemplate_Sale;
    } else if (this.moduleSelected == 'services') {
      this.reportDataTemplate = this.reportDataTemplate_Support;
    } else if (this.moduleSelected == 'tasks') {
      this.reportDataTemplate = this.reportDataTemplate_Task;
    } else if (this.moduleSelected == 'Follow Ups') {
      this.reportDataTemplate = this.reportDataTemplate_FollowUp;
    } else if (this.moduleSelected == 'Invoices' || this.moduleSelected == 'Quotations' || this.moduleSelected == 'Estimates') {
      this.reportDataTemplate = this.reportDataTemplate_SalesDoc;
    } else if (this.moduleSelected == 'Expenses') {
      this.reportDataTemplate = this.reportDataTemplate_Expenses;
    } else if (this.moduleSelected == 'paymentsreceived') {
      this.reportDataTemplate = this.reportDataTemplate_Payments;
    } else if (this.moduleSelected == 'products') {
      this.reportDataTemplate = this.reportDataTemplate_Products;
    }
    this.reportDataTemplate.title = this.reportTitle;// report title
    this.reportDataTemplate.module = this.moduleSelected;// selected module add as module
    // save the report
    this.reportService.createReport(this.userId, this.reportDataTemplate).then(resp => {
      this.router.navigate(['dash/custom-report/report/' + resp.id]);
      this.snackBar.open('New report created', '', { duration: 2000 });
    })
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck() && (this.reportTitle.length > 0));
  }
}
