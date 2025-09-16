/**************************************************************************
 * Description :Child of table/sale-list component,
 *  Sale lite mode component with inifite scroll grid view  each status is show as a component.while scrolling it loads more data
 * 
 * *************************************************************************/
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Sales, defaultSaleSettings, modules, saleSettings } from 'src/app/data-models';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { SaleTableService } from '../sale-list/sale-table.service';
import { SaleGridViewService } from './sale-grid-view.service';
@Component({
  selector: 'app-sale-grid-view',
  templateUrl: './sale-grid-view.component.html',
  styleUrls: ['./sale-grid-view.component.scss']
})
export class SaleGridViewComponent implements OnInit, OnDestroy, AfterViewChecked {
  isLoaded: boolean = false;
  displayedData = new BehaviorSubject<Sales[]>([]);;
  pageSize = 20;
  loading = false;
  hasMoreData = true; // Initialize to true since we assume there's more data initially
  networkConnection: boolean; //to check network connection

  @Input() userId: string = '';
  @Input() superUserId: string = '';
  @Input() stageId: string = '';
  @Input() disableDocCreateEst: boolean = false; //disable create estimate
  @Input() disableDocCreateQuot: boolean = false; //disable create quotation
  @Input() disableDocCreateInv: boolean = false; //disable create invoice
  @Input() disableSaleEdit: boolean = false;
  @Input() fieldNameContact: string = 'Contact';
  @Input() fieldNameOrganization: string = 'Organization';
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameSale: string = 'Sale';
  @Input() fieldNameEstimate: string = 'Estimate';
  @Input() fieldNameQuotation: string = 'Quotation';
  @Input() fieldNameInvoice: string = 'Invoice';
  @Input() index: number;
  @Input() displayFields: any[] = [];
  @Input() salePipelines: Pipelines[] = [];
  @Input() actSaleAgeing: boolean = false; // check for is ageing is activated
  @Input() disableSale = false; // disable sale create
  @Input() disableFoll = false; // disable followup create
  @Input() userName: string = ''
  @Input() saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; // custoer settigs configuration
  @Output() editSaleEvent = new EventEmitter<{ index: number, sale: Sales }>();
  @Output() addTaskEvent = new EventEmitter<Sales>();
  @Output() onCreateFollowUpsEvent = new EventEmitter<Sales>();
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @Input() reload: boolean;
  constructor(
    private firestoreService: SaleGridViewService, public commonService: CommonService, public dialog: MatDialog, private elementRef: ElementRef,
    public tableService: SaleTableService, public networkCheck: NetworkCheckService, private router: Router, private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef,
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
      this.tableService.secondViewSelected === 'start today' ||
      this.tableService.secondViewSelected === 'start this week' ||
      this.tableService.secondViewSelected === 'start this month'
    ) {
      date = lastRecord.startDate;
    } else if (
      this.tableService.secondViewSelected === 'closing today' ||
      this.tableService.secondViewSelected === 'closing this week' ||
      this.tableService.secondViewSelected === 'closing this month'
    ) {
      date = lastRecord.expCompletionDate;
    } else if (
      this.tableService.secondViewSelected === 'edited today' ||
      this.tableService.secondViewSelected === 'edited this week' ||
      this.tableService.secondViewSelected === 'edited this month'
    ) {
      date = lastRecord.lastModifiedDate;
    } else if (
      this.tableService.secondViewSelected === 'note today' ||
      this.tableService.secondViewSelected === 'note this week' ||
      this.tableService.secondViewSelected === 'note this month'
    ) {
      date = lastRecord.lastNoteDate;
    } else {
      date = lastRecord.createdDate;
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
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data,modules.sales);
  }
  // for getting the aged contact
  getAgedStatus(element) {
    // if age activation is there
    if (this.actSaleAgeing) {
      let today: Date = new Date();
      let input: Date;
      if (element.stageHistory.length > 0) {
        input = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );
      } else {
        input = new Date(element.createdDate);
      }

      let daysinStage: number = Math.ceil(
        (today.getTime() - input.getTime()) / (1000 * 3600 * 24)
      ); //Calculate the number of days in current stage
      //find the index of stage in stage array
      const pipeLine = this.salePipelines.filter((obj) => {
        return obj.pipelineId === element.selectedSalePipeline;
      });
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        let statusArray = pipeLine[0].pipelineStages;
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          let statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.salesStage;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            let maxDaysinStage = statusObj[0].age;

            if (
              element.salesStage ===
                statusArray[statusArray.length - 1].stageId ||
              element.salesStage === statusArray[statusArray.length - 2].stageId
            ) {
              // if statusis in last two status return false... ageging is not need for last two status
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
  // contact edit function
  editSale(row) {
    const data = { index: this.index, sale: row };
    this.editSaleEvent.emit(data);
  }
  // add task
  addTask(saleFiltered) {
    this.addTaskEvent.emit(saleFiltered);
  }
  // create followup
  onCreateFollowUps(sale) {
    this.onCreateFollowUpsEvent.emit(sale);
  }
  // create invoice-web
  createInvoice(saleId, customerId, orgId) {
    //create an invoice for a paritcular sale ID
    this.router.navigate([
      '/dash/document/documentinvoicemanagement/',
      saleId,
      'create',
      'Invoice',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  // create estimate-web
  createEstimate(saleId, customerId, orgId) {
    this.router.navigate([
      '/dash/document/documentmanagement/',
      saleId,
      'create',
      'Estimate',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  //create a quote for a paritcular sale ID
  createQuote(saleId, customerId, orgId) {
    this.router.navigate([
      '/dash/document/documentquotationmanagement/',
      saleId,
      'create',
      'Quotation',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }

  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  trackbySaleList(index: number, saleFiltered: Sales): string {
    return saleFiltered.id;
  }
}
