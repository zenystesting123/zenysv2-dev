import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { taskSettings, defaultTaskSettings, contactSettings, defaultContactSettings, SettingsItem, defaultSaleSettings, defaultServiceSettings, Task, modules } from 'src/app/data-models';
import { TaskGridViewService } from './task-grid-view.service';
@Component({
  selector: 'app-task-grid-view',
  templateUrl: './task-grid-view.component.html',
  styleUrls: ['./task-grid-view.component.scss']
})
export class TaskGridViewComponent implements OnInit {
  @Input() taskType: string; // current followup view name
  @Input() userId: string; // current user id
  @Input() superUserId: string;// super user id
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameOrganization: string = 'Organization';
  @Input() fieldNameContact: string = 'Contact';//setting default value for customer
  @Input() fieldNameSale: string = 'Sale';//setting default value for sale
  @Input() fieldNameService: string = 'Support';//def value for support name
  @Input() customFieldTask: any[]; // contact additional fields
  @Input() columnsDispaly = []; // table columns configuration
  @Input() taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;// custoer settigs configuration
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;// custoer settigs configuration
  @Input() saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  @Input() serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  @Input() statusOption: any[] = []; // tsak status options
  @Input() lastTaskStatusOpn: string; // task last status
  @Input() userIdsArray: any[] = []; // users id
  @Input() userNamesArray: any[] = []; // users names
  @Input() index: number; // index of the component
  @Input() reload: boolean; // used to reload page
  @Input() displayFields: any[] = [];// display fields for card
  @Output() editTaskEvent = new EventEmitter<Task>(); // edit task event passed to parent
  @Output() deleteTaskEvent = new EventEmitter<{ index: number, id: string }>();// delete task event passed to parent
  @Output() updateTaskStatusEvent = new EventEmitter<Task>();// mark task as completed event passed to parent
  
  isLoaded:boolean = false;
  displayedData = new BehaviorSubject<Task[]>([]); // task list fetched
  pageSize = 20; // task limit fetched from db
  loading = false;// to show spinner
  hasMoreData = true; // Initialize to true since we assume there's more data initially
  networkConnection: boolean; //to check network connection
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  constructor(public commonService: CommonService, private router: Router,
    private firestoreService: TaskGridViewService,) { }

  ngOnInit() {
    this.initializeData();
  }
  //scrolling and read more data when scroll reaches at the end
  onScroll() {
    if (!this.loading && this.hasMoreData) {
      if (this.virtualScroll.getRenderedRange().end === this.displayedData.value.length) {
        this.loadMoreData();
      }
    }
  }
  // Initialize function to load initial data
  async initializeData() {
    this.isLoaded = false;
    this.loading = true;
    let initialItems = await this.firestoreService
      .getData(null, '', this.pageSize, this.taskType, this.superUserId, this.userId, this.statusOption, this.lastTaskStatusOpn);
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
    let date = lastRecord.dueDate;


    let newItems = await this.firestoreService
      .getData(date, id, this.pageSize, this.taskType, this.superUserId, this.userId, this.statusOption, this.lastTaskStatusOpn)
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
  // get value for displaying fields
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data,modules.tasks);

  }
  // mark task as completed
  updatestatus(data) {
    this.updateTaskStatusEvent.emit(data);
  }
  // edit task
  onEditTask(row) {
    this.editTaskEvent.emit(row);
  }
  // delete task
  deleteTask(taskId) {
    const data = { index: this.index, id: taskId };
    this.deleteTaskEvent.emit(data);
  }
  // go to org details page
  onViewOrg(orgId: string) {
    let link: string = 'dash/organisation/orgdetails/' + orgId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // go to customer details page
  onViewCustomer(customerId: string) {
    let link: string = 'dash/contact/customerdetails/' + customerId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // go to sale details page
  onViewSale(saleId: string) {
    let link: string = 'dash/sales/saleview/' + saleId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // go to service details page
  onViewSupport(supportId: string) {
    let link: string = 'dash/service/service-details/' + supportId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
}
