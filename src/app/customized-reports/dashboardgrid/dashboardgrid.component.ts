import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
import {
  CompactType,
  DisplayGrid,
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from 'angular-gridster2';
import { CommonService } from 'src/app/common.service';
import { Profile, ReportSettings } from 'src/app/data-models';
import { DashboardgridService } from './dashboardgrid.service';
import { saveAs } from "file-saver";
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ReportServiceService } from '../report-view/report-service.service';

@Component({
  selector: 'app-dashboardgrid',
  templateUrl: './dashboardgrid.component.html',
  styleUrls: ['./dashboardgrid.component.scss']
})

export class DashboardgridComponent implements OnInit, OnDestroy {
  @Input() homeScreenMode: boolean = false;
  options: GridsterConfig;
  dashboard: any;
  remove: boolean;
  superUserDetails: Profile;
  allDashboards: any[] = [];

  allReports: ReportSettings[];
  userId: any;
  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {

  }

  static itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
  }

  static itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
  }

  static itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
  }

  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  static gridInit(grid: GridsterComponentInterface): void {
  }

  static gridDestroy(grid: GridsterComponentInterface): void {
  }

  static gridSizeChanged(grid: GridsterComponentInterface): void {
  }
  networkConnection: boolean; // checks network connection
  userSubscription: Subscription;
  reportListSubscription: Subscription;
  dashboardReportListSubscription: Subscription;
  moduleSelected = "customers";//default module selected
  moduleList = []; // module list for select report by filter
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
  constructor(public common: CommonService, public db: DashboardgridService, public dialog: MatDialog,
    private location: Location, public networkCheck: NetworkCheckService,
    private snackBar: MatSnackBar, private reportService: ReportServiceService) {

  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fixed,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: true,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      initCallback: DashboardgridComponent.gridInit,
      destroyCallback: DashboardgridComponent.gridDestroy,
      gridSizeChangedCallback: DashboardgridComponent.gridSizeChanged,
      itemChangeCallback: DashboardgridComponent.itemChange,
      itemResizeCallback: DashboardgridComponent.itemResize,
      itemInitCallback: DashboardgridComponent.itemInit,
      itemRemovedCallback: DashboardgridComponent.itemRemoved,
      itemValidateCallback: DashboardgridComponent.itemValidate,

    };
    this.common.userDatas.subscribe((data) => {
      this.superUserDetails = data.superUserDetails
      this.userId = data.authDetails.uid;
      // get list of dashboard
      this.dashboardReportListSubscription = this.db
        .getDashboardReports(this.userId)
        .subscribe((data) => {
          this.allDashboards = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });
          if (this.allDashboards.length > 0) {
            if (this.db.currentDashboardId == '') {
              this.db.currentDashboardId = this.allDashboards[0].id;
              this.dashboard = this.allDashboards[0] ? this.allDashboards[0] : []
              this.options.fixedColWidth = this.allDashboards[0].colWidth
              this.options.fixedRowHeight = this.allDashboards[0].rowHeight
            }
            else {
              this.allDashboards.forEach(element => {
                if (element.id === this.db.currentDashboardId) {
                  this.dashboard = element;
                  return;
                }
              });

              this.options.fixedColWidth = this.dashboard.colWidth
              this.options.fixedRowHeight = this.dashboard.rowHeight
            }
          }
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
        })
      this.getReportList()
    })
  }
  // get report lists
  getReportList() {
    this.reportListSubscription = this.reportService
      .getReports(this.userId)
      .subscribe((data) => {
        this.allReports = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as ReportSettings;
        });

      });
  }
  // back button in toolbar
  onBack() {
    this.location.back();
  }
  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.reportsArray.splice(this.dashboard.reportsArray.indexOf(item), 1);
  }

  addItem(reportId): void {
    this.dashboard.reportsArray.push({ x: 0, y: 0, cols: 1, rows: 1, reportId: reportId });
  }
  removeReport(id) {
    //open confirmation popup for deletion
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_report_in_dashboard',
        reportId: id,
        userId:this.userId,
        currentDashboardId: this.db.currentDashboardId,
        reportsArray :this.dashboard.reportsArray
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'reportindashboarddeleted') {
        this.snackBar.open('Report has been deleted', '', { duration: 2000 });
      }
    });
    
  }
  destroy(): void {
    this.remove = !this.remove;
  }
  saveReport() {
    let dashBoard = JSON.parse(JSON.stringify(this.dashboard)) 
    dashBoard.colWidth = this.options.fixedColWidth
    dashBoard.rowHeight = this.options.fixedRowHeight
    delete dashBoard.id;
    this.db.saveDashboard(this.userId, this.db.currentDashboardId, dashBoard)
  }
  dashboardChange() {
    this.allDashboards.forEach(element => {
      if (element.id === this.db.currentDashboardId) {
        this.dashboard = element;
        return;
      }
    });
  }

  openDialog(type, data): void {
    let dialogRef = this.dialog.open(DashboardDialog, {
      width: '500px',
      data: { dialogType: type, dialogData: data,moduleSelected:this.moduleSelected, moduleList :this.moduleList },
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response == 'Add') {
        if (type == "addReport") {
          this.addItem(result.reportId)
        }
        else if (type == "addDashboard") {
          let dashBoard = { dashboardName: result.dashboardName, colWidth: 105, rowHeight: 105, reportsArray: [{ cols: 8, rows: 3, x: 0, y: 0, reportId: result.reportId }] }
          this.db.createDashboardReport(this.userId, dashBoard).then(res => {
            this.db.currentDashboardId = res.id;
            this.dashboard = this.allDashboards.filter(
              (it) => it.id === this.db.currentDashboardId
            );
            this.dashboardChange()
          })
        }
      } else {
        // if popup is cancelled view will change to first view
        if (type == "addDashboard") {
          if (this.db.currentDashboardId == '') {
            this.db.currentDashboardId = this.allDashboards[0].id;
            this.dashboard = this.allDashboards[0] ? this.allDashboards[0] : []
            this.options.fixedColWidth = this.allDashboards[0].colWidth
            this.options.fixedRowHeight = this.allDashboards[0].rowHeight
          }
        }
      }
    });
  }
  exportTojson() {
    // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
    let exportData = this.allDashboards;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }), 'sample.json'
    );
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // delete report
  deleteReport() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_dashboardreport',
        viewName: this.dashboard.dashboardName,
        reportId: this.db.currentDashboardId,
        userId: this.userId,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'dashboardreportdeleted') {
        this.snackBar.open('Dashboard report has been deleted', '', { duration: 2000 });
      }
    });
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.reportListSubscription?.unsubscribe();
  }
}
@Component({
  selector: 'dashboard-dialog',
  templateUrl: 'dashboard-dialog.html',
})
export class DashboardDialog implements OnInit{
  selectedReport: any = {
    reportId: null,
    response: false
  }
  newDashData: any = {
    reportId: null,
    dashboardName: "",
    response: false
  }
  updateDashboard: boolean;
  networkConnection: boolean; // checks network connection
  reportList:ReportSettings[]=[];// report list show in ui after filter by module
  constructor(
    public dialogRef: MatDialogRef<DashboardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public networkCheck: NetworkCheckService,) {
  }
  ngOnInit(): void {
    this.reportList =[];
    // filter report by module
    this.data.dialogData.forEach(element => {
        if(element.module == this.data.moduleSelected){
          this.reportList.push(element)
        }
    });
  }
  confirm(value) {
    value.response = 'Add';
    this.dialogRef.close(value);
  }
  // close popup
  onclose(value) {
    value.response = 'Cancel';
    this.dialogRef.close(value);
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // on select module name
  filterReport(){
    this.reportList =[];
    this.newDashData.reportId =''; // reset repot id for add dashboard and report
    this.selectedReport.reportId ='';// reset repot id for add report
    // filter report by module
    this.data.dialogData.forEach(element => {
        if(element.module == this.data.moduleSelected){
          this.reportList.push(element)
        }
    });
  }
}
