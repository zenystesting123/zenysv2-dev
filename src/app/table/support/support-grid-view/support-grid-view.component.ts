/**************************************************************************
 * Description :Child of table/service-list component,
 *  Service lite mode component with inifite scroll grid view  each status is show as a component.while scrolling it loads more data
 * 
 * *************************************************************************/
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Service, defaultServiceSettings, modules, serviceSettings } from 'src/app/data-models';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { SupportListService } from '../support-list/support-list.service';
import { SupportGridViewService } from './support-grid-view.service';
@Component({
  selector: 'app-support-grid-view',
  templateUrl: './support-grid-view.component.html',
  styleUrls: ['./support-grid-view.component.scss']
})
export class SupportGridViewComponent implements OnInit, OnDestroy, AfterViewChecked {
  isLoaded: boolean = false; // loader
  displayedData = new BehaviorSubject<Service[]>([]); // service list
  pageSize = 20; // loading data size
  loading = false; // loader
  hasMoreData = true; // Initialize to true since we assume there's more data initially
  networkConnection: boolean; //to check network connection

  @Input() userId: string = ''; // user id
  @Input() superUserId: string = ''; // super user id
  @Input() stageId: string = ''; // stage id for showing data to each column
  @Input() disableEditService: boolean = false; // service edit disable
  @Input() fieldNameContact: string = 'Contact'; // field name contact
  @Input() fieldNameOrganization: string = 'Organization'; // field name contact
  @Input() fieldNameFollowup: string = 'FollowUp'; // field name followup
  @Input() fieldNameTask: string = 'Task'; // field name task
  @Input() fieldNameService: string = 'Support'; // field name support
  @Input() index: number; // index of component
  @Input() displayFields: any[] = []; // display card fields
  @Input() servicePipelines: Pipelines[] = []; // service pipeline
  @Input() actServiceAgeing: boolean = false; // check for is ageing is activated
  @Input() disableFoll = false; // disable followup create
  @Input() serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; // customer settigs configuration
  @Output() editServiceEvent = new EventEmitter<{ index: number, service: Service }>(); // edit service event passed to parent 
  @Output() addTaskEvent = new EventEmitter<Service>(); // add task event passed to parent 
  @Output() onCreateFollowUpsEvent = new EventEmitter<Service>(); // add followup event passed to parent 
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @Input() reload: boolean;
  constructor(
    private firestoreService: SupportGridViewService, public commonService: CommonService, public dialog: MatDialog,
    public tableService: SupportListService, public networkCheck: NetworkCheckService, private router: Router,
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
  // load data while scrolling
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
      .getData(null, '', this.pageSize, this.stageId, this.superUserId, this.userId);
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
      .getData(date, id, this.pageSize, this.stageId, this.superUserId, this.userId)
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
  // get field vanue
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data, modules.services);
  }
  // for getting the aged service
  getAgedStatus(element) {
    // if age activation is there
    if (this.actServiceAgeing) {
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
      const pipeLine = this.servicePipelines.filter((obj) => {
        return obj.pipelineId === element.selectedServPipeline;
      });
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        let statusArray = pipeLine[0].pipelineStages;
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          let statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.servicesStage;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            let maxDaysinStage = statusObj[0].age;

            if (
              element.servicesStage ===
              statusArray[statusArray.length - 1].stageId ||
              element.servicesStage === statusArray[statusArray.length - 2].stageId
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
  editService(row) {
    const data = { index: this.index, service: row };
    this.editServiceEvent.emit(data);
  }
  // add task
  addTask(serviceFiltered) {
    this.addTaskEvent.emit(serviceFiltered);
  }
  // create followup
  onCreateFollowUps(support) {
    this.onCreateFollowUpsEvent.emit(support);
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  trackbyServiceList(index: number, serviceFiltered: Service): string {
    return serviceFiltered.id;
  }
}
