/**************************************************************************
 * Description :Child of table/customer-list component,
 *  Customer lite mode component with inifite scroll grid view  each status is show as a component.while scrolling it loads more data
 * 
 * *************************************************************************/
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Customer, contactSettings, defaultContactSettings, messageTemplateModel, modules } from 'src/app/data-models';
import { CustomerListGridViewService } from './customer-list-grid-view.service';
import { TableService } from '../customer-list/table.service';
import { CommonService } from 'src/app/common.service';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { emailTemplateModel } from 'src/app/settings/email-template-settings/email-template.model';
import { CommonListDataService } from 'src/app/common-list-data.service';
import { CustomerlistService } from 'src/app/contact/customerlist/customerlist.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-customer-list-grid-view',
  templateUrl: './customer-list-grid-view.component.html',
  styleUrls: ['./customer-list-grid-view.component.scss']
})
export class CustomerListGridViewComponent implements OnInit,OnDestroy ,AfterViewChecked{
  isLoaded:boolean = false;
  displayedData = new BehaviorSubject<Customer[]>([]);;
  pageSize = 20;
  loading = false;
  hasMoreData = true; // Initialize to true since we assume there's more data initially
  networkConnection: boolean; //to check network connection
  @Input() userId: string = '';
  @Input() superUserId: string = '';
  @Input() stageId: string = '';
  @Input() disableEditContact: boolean = false;
  @Input() fieldNameContact: string;
  @Input() fieldNameOrganization: string;
  @Input() fieldNameContactNotes: string = 'Note';
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameSale: string = 'Sale';
  @Input() fieldNameService: string = 'Support';
  @Input() index: number;
  @Input() displayFields: any[] = [];
  @Input() customerPipelines: Pipelines[] = [];
  @Input() actCustAgeing: boolean = false; // check for is ageing is activated
  @Input() enableOutboundCallsViaCallBridging: boolean = false; //for checking autocall enabled or not
  @Input() disableSale = false; // disable sale create
  @Input() disableService = false; // disable service create
  @Input() disableFoll = false; // disable followup create
  @Input() disableCreateNote = false; // disable Note creation
  @Input() userName: string = ''
  @Input() smsEnabled = false; //SMS settings saved user
  @Input() waEnabled = false; //WhatsApp settings saved user
  @Input() whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  @Input() smsTemplates: messageTemplateModel[] = []; //to hold the fetrched sms message templates
  @Input() emailTemplates: emailTemplateModel[] = []; //to hold the fetrched email templates
  @Input() emailEnabled = false; //SMTP settings of email completed
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settigs configuration
  @Output() callEvent = new EventEmitter<Customer>();
  @Output() editCustomerEvent = new EventEmitter<{ index: number, customer: Customer }>();
  @Output() onAddSaleEvent = new EventEmitter<string>();
  @Output() onAddServiceEvent = new EventEmitter<string>();
  @Output() addTaskEvent = new EventEmitter<Customer>();
  @Output() onCreateFollowUpsEvent = new EventEmitter<Customer>();
  @Output() addNotesEvent = new EventEmitter<{index: number, custFiltered: Customer, GAevent: string }>();
  @Output() triggerSmsEvent = new EventEmitter<{ templates: messageTemplateModel, custFiltered: Customer }>();
  @Output() triggerEmailEvent = new EventEmitter<{ templates: emailTemplateModel, custFiltered: Customer }>();
  @Output() triggerWhatsappEvent = new EventEmitter<{ templates: any, custFiltered: Customer }>();
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @Input() reload: boolean;
  constructor(
    private firestoreService: CustomerListGridViewService, public commonService: CommonService, public dialog: MatDialog, private elementRef: ElementRef,
    public tableService: TableService, public networkCheck: NetworkCheckService, private snackBar: MatSnackBar,private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef, public commonListDataService: CommonListDataService, public customerlistService: CustomerlistService
  ) { }
  ngOnDestroy(): void {
    
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
 }
  ngOnInit() {
    this.initializeData();
  }

  onScroll() {
    if (!this.loading && this.hasMoreData) {
      if (this.virtualScroll.getRenderedRange().end === this.displayedData.value.length) {
        this.loadMoreData();
      }
    }
  }
  // Initialize function to load initial data
  async initializeData() {
    this.loading = true;
    let initialItems = await this.firestoreService
      .getDocuments(null, '', this.pageSize, this.stageId, this.superUserId, this.userId);
    if (initialItems.length > 0) {
      this.hasMoreData = true;
    } else {
      this.hasMoreData = false;
    }
    this.displayedData.next([]);
    this.displayedData.next(initialItems);

    this.loading = false;
    this.isLoaded = true;
  }

  // Function to load more data after a scroll event
  async loadMoreData() {
    this.loading = true;
    const lastRecord = this.displayedData.value[this.displayedData.value.length - 1];
    let id = lastRecord.id;
    let date 
    if (
      this.tableService.secondViewSelected == 'To be contacted today' ||
      this.tableService.secondViewSelected ==
      'To be contacted tomorrow' ||
      this.tableService.secondViewSelected == 'By next contact date'
    ) {
      date = lastRecord.nextFollowupDate;
    } else if (
      this.tableService.secondViewSelected == 'Last note added date'
    ) {
      date = lastRecord.lastNoteDate;
    } else if (this.tableService.secondViewSelected == 'Last edited date') {
      date = lastRecord.lastModifiedDate;
    } else if (
      this.tableService.secondViewSelected == 'Converted this month' ||
      this.tableService.secondViewSelected == 'Lost this month'
    ) {
      date = lastRecord.currentStatusDate;
    } else {
      date = lastRecord.dateCreated;
    }

    let newItems = await this.firestoreService
      .getDocuments(date, id, this.pageSize, this.stageId, this.superUserId, this.userId)
    if (newItems.length > 0) {
      this.hasMoreData = true;
    } else {
      this.hasMoreData = false;
    }

    if (newItems.length > 0) {
      const updatedData = [...this.displayedData.value, ...newItems];

      // Update the BehaviorSubject with the updated data
      this.displayedData.next(updatedData);
    }

    this.loading = false;
  }

  hideStage(i) {
    this.tableService.stageCollapseArray[i] = !this.tableService.stageCollapseArray[i];
  }

  stageInPipeline(i) {
    if (i <= this.tableService.statusArray.length - 3) {
      return {
        border: 'border-primary',
        text: 'text-primary',
        badge: 'bg-soft-primary',
        background: 'bg-soft-primary',
      };
    } else if (i == this.tableService.statusArray.length - 2) {
      return {
        border: 'border-success',
        text: 'text-success',
        badge: 'bg-soft-success',
        background: 'bg-soft-success',
      };
    } else {
      return {
        border: 'border-danger',
        text: 'text-danger',
        badge: 'bg-soft-danger',
        background: 'bg-soft-danger',
      };
    }
  }
  trackbyCustList(index: number, custFiltered: Customer): string {
    return custFiltered.id;
  }
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data,modules.customers);
  }
  getAgedStatus(element) {
    // if age activation is there
    if (this.actCustAgeing) {
      let today: Date = new Date();
      let input: Date;
      if (element.stageHistory.length > 0) {
        input = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );
      } else {
        input = new Date(element.dateCreated);
      }
      /*let input: Date = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );*/
      let daysinStage: number = Math.ceil(
        (today.getTime() - input.getTime()) / (1000 * 3600 * 24)
      ); //Calculate the number of days in current stage

      let maxDaysinStage = 0;
      let statusArray = [];
      let statusObj;

      const pipeLine = this.customerPipelines.filter((obj) => {
        return obj.pipelineId === element.selectedContactPipeline;
      });
      // pipeline deleted case
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        statusArray = pipeLine[0].pipelineStages;
        // if no status array found
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.status;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            maxDaysinStage = statusObj[0].age;

            if (
              element.status === statusArray[statusArray.length - 1].stageId ||
              element.status === statusArray[statusArray.length - 2].stageId
            ) {
              return false;
            } else {
              if (daysinStage >= maxDaysinStage) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }
  //call function
  onCall(custData) {
    this.callEvent.emit(custData);
  }
  // contact edit function
  editCustomer(row) {
    const data = { index: this.index, customer: row };
    this.editCustomerEvent.emit(data);
  }
  onAddSale(id) {
    this.onAddSaleEvent.emit(id);
  }
  onAddService(id) {
    this.onAddServiceEvent.emit(id);
  }
  addTask(custFiltered) {
    this.addTaskEvent.emit(custFiltered);
  }
  onCreateFollowUps(custFiltered) {
    this.onCreateFollowUpsEvent.emit(custFiltered);
  }
  addNotes(custFiltered, GAevent) {
    const data = {index:this.index, custFiltered: custFiltered, GAevent: GAevent };
    this.addNotesEvent.emit(data);;
  }
  triggerSms(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerSmsEvent.emit(data)
  }
  triggerEmail(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerEmailEvent.emit(data)
  }
  triggerWhatsapp(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerWhatsappEvent.emit(data)
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
}
