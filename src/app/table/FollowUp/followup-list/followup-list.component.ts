/**********************************************************************************
Description: Component is used to dispaly followup grid view in lite mode under this user
             Only for Web
Inputs: userdatas from common service, followups fetch from DB
Outputs:
**********************************************************************************/
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { FollowUps, modules } from 'src/app/data-models';
import { FollowupListService } from './followup-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CallViewAudioPlayerComponent } from 'src/app/call-view-audio-player/call-view-audio-player.component';

@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  styleUrls: ['./followup-list.component.scss'],
})
export class FollowupListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() index: number; // index of the component
  @Input() reload: boolean; // used to reload page
  @Input() superUserId = ''; //logged in users superuserid
  @Input() userId = ''; //logged in users id
  // fieldnames
  @Input() fieldNameFollowup = '';
  @Input() fieldNameOrganization = '';
  @Input() fieldNameCustomer = '';
  @Input() fieldNameSale = '';
  @Input() fieldNameService = '';
  @Input() disableFollEdit = false; //disable followup edit boolean based on user profile
  @Input() displayFields: any; //card content disaplay fields
  @Input() userName = ''; //logged in users name
  @Input() userNumber; //logged in users number
  // variables for call
  @Input() enableOutboundCallsViaCallBridging = false;
  @Input() outboundCallBridgingType;
  @Input() DIDNumber;
  @Input() autoCallToken;
  @Input() callBridgingExtension;
  @Input() subUsers; // pass sub user list
  @Input() superUserFirstName; // pass super user first name
  @Input() superUserSecondName; // pass super user second name
  @Input() followupType = ''; //whether upcoming/overdue/completed

  @Output() markAsCompletedEvent = new EventEmitter<FollowUps>(); //mark as completed function event passing to parent
  @Output() editEvent = new EventEmitter<FollowUps>(); //edit event passing to parent

  displayedData = new BehaviorSubject<FollowUps[]>([]); // task list fetched
  pageSize = 20; // task limit fetched from db
  loading = false; // to show spinner
  hasMoreData = true; // Initialize to true since we assume there's more data initially
  networkConnection: boolean; //to check network connection
  disableMarkAsCompleted = false; //to disable mark as completed icon after clicked once

  constructor(
    public commonService: CommonService,
    private router: Router,
    private firestoreService: FollowupListService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initializeData();
  }
  //scrolling and read more data when scroll reaches at the end
  onScroll() {
    if (!this.loading && this.hasMoreData) {
      if (
        this.virtualScroll.getRenderedRange().end ===
        this.displayedData.value.length
      ) {
        this.loadMoreData();
      }
    }
  }
  // Initialize function to load initial data
  async initializeData() {
    this.loading = true;
    let initialItems = await this.firestoreService.getData(
      null,
      '',
      this.pageSize,
      this.followupType,
      this.superUserId,
      this.userId
    );
    if (initialItems.length > 0) {
      this.hasMoreData = true;
    } else {
      this.hasMoreData = false;
    }
    this.displayedData.next([]);
    this.displayedData.next(initialItems);

    this.loading = false;
    this.disableMarkAsCompleted = false;
  }

  // Function to load more data after a scroll event
  async loadMoreData() {
    this.loading = true;
    const lastRecord =
      this.displayedData.value[this.displayedData.value.length - 1];
    let id = lastRecord.id;
    let date = lastRecord.callStartDate;

    let newItems = await this.firestoreService.getData(
      date,
      id,
      this.pageSize,
      this.followupType,
      this.superUserId,
      this.userId
    );
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
    return this.commonService.getFieldValue(field, data,modules.FollowUps);
  }
  // go to org details page
  onViewOrg(orgId: string) {
    let link: string = 'dash/organisation/orgdetails/' + orgId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  // go to customer details page
  onViewCustomer(customerId: string) {
    let link: string = 'dash/contact/customerdetails/' + customerId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  // go to sale details page
  onViewSale(saleId: string) {
    let link: string = 'dash/sales/saleview/' + saleId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  // go to service details page
  onViewSupport(supportId: string) {
    let link: string = 'dash/service/service-details/' + supportId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  markasCompleted(followup) {
    this.disableMarkAsCompleted = true;
    this.markAsCompletedEvent.emit(followup);
  }

  onEditFollowUps(followup) {
    this.editEvent.emit(followup);
  }
  // to call the autocall api and pass all the details
  async onCallFollowUp(id, customerId, followupData) {
    if (this.enableOutboundCallsViaCallBridging && this.userNumber) {
      let data = await this.firestoreService.readCustRecord(
        this.superUserId,
        customerId
      );

      if (data.contactNo) {
        let minute = new Date().getMinutes();
        let hour = new Date().getHours();
        let startTime = hour + ':' + minute;
        this.commonService
          .onAutoCall(
            this.userNumber,
            data.contactNo,
            this.superUserId,
            this.userId,
            this.userName,
            followupData.companyName,
            customerId,
            followupData.customerName,
            startTime,
            id,
            this.autoCallToken,
            this.DIDNumber,
            followupData.orgId ? followupData.orgId : '',
            followupData.associatedBranch
              ? followupData.associatedBranch
              : 'none',
            this.callBridgingExtension,
            this.outboundCallBridgingType,
            followupData.saleTitle ? followupData.saleTitle : null,
            followupData.saleId ? followupData.saleId : null,
            followupData.serviceTitle ? followupData.serviceTitle : null,
            followupData.serviceId ? followupData.serviceId : null
          )
          .subscribe((data: any) => {});
        this._snackBar.open('Initiating Call', '', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Contact number does not exist', '', {
          duration: 2000,
        });
      }
    }
  }
  onPlayAudio(resourceURL) {
    const dialogRef = this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
    });
  }
}
