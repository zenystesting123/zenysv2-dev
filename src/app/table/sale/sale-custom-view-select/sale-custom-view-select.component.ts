/**********************************************************
Description : Filters selection popup for sale lite mode.
              Default, created by me and public views are displayed, and can add/select custom view.

 * **********************************************************************/

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { defaultSaleSettings, saleSettings } from 'src/app/data-models';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SaleTableService } from '../sale-list/sale-table.service';
import { SaleGridService } from '../sale-grid/sale-grid.service';
@Component({
  selector: 'app-sale-custom-view-select',
  templateUrl: './sale-custom-view-select.component.html',
  styleUrls: ['./sale-custom-view-select.component.scss']
})
export class SaleCustomViewSelectComponent implements OnInit, OnDestroy {
  @Output() viewSelectedStatusEvent = new EventEmitter<{ viewName: string, status: string }>();
  @Output() viewSelectedEvent = new EventEmitter<string>();
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; // sale settings configuration
  cardFields: any[]; // sale settings configuration
  superUserId: string; // super user id
  userId: string; // user id
  fieldNameSale: string = 'Sale'; // field name for sale
  fieldNameSaleNotes: string = 'Note'; // field name for note
  myViews: any = []; // list of my views
  publicViews: any = []; // list of public views
  private readonly _matDialogRef: MatDialogRef<SaleCustomViewSelectComponent>;
  private readonly triggerElementRef: ElementRef;

  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  constructor(public tableService: SaleTableService, public dialog: MatDialog,
    public saleGridService: SaleGridService, public changeDetect: ChangeDetectorRef,
    _matDialogRef: MatDialogRef<SaleCustomViewSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      trigger: ElementRef, saleSettings: saleSettings, cardFields: any[],
      fieldNameSaleNotes: string, fieldNameSale: string, superUserId: string, userId: string,
      publicViews: any, myViews: any
    },) {
    this._matDialogRef = _matDialogRef;
    this.triggerElementRef = data.trigger;
    this.saleSettings = data.saleSettings;
    this.cardFields = data.cardFields,
      this.fieldNameSaleNotes = data.fieldNameSaleNotes,
      this.fieldNameSale = data.fieldNameSale,
      this.superUserId = data.superUserId,
      this.userId = data.userId
    this.myViews = data.myViews,
      this.publicViews = data.publicViews
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left - 0.0}px`, top: `${120}px` };
    matDialogConfig.width = '300px';
    matDialogConfig.height = '400px';
    this._matDialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this._matDialogRef.updatePosition(matDialogConfig.position);
  }
  // view select for default views
  viewSelected(view) {
    if (!this.saleGridService.isOldModeVisible) {
      this.saleGridService.saleViewSelected = {};
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view; // asisgn second view name
      if (view == 'Last note added') {
        this.tableService.viewSelected =
          'Last ' +
          this.fieldNameSaleNotes +
          ' added'; // for displaying viewname in toolbar
      } else if (view == 'All Sales') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameSale +
          's'; // for displaying viewname in toolbar
      } else if (view == 'note today') {
        this.tableService.viewSelected =
          this.fieldNameSaleNotes +
          ' today'; // for displaying viewname in toolbar
      } else if (view == 'note this week') {
        this.tableService.viewSelected =
          this.fieldNameSaleNotes +
          ' this week'; // for displaying viewname in toolbar
      } else if (view == 'note this month') {
        this.tableService.viewSelected =
          this.fieldNameSaleNotes +
          ' this month'; // for displaying viewname in toolbar
      } else {
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      this.viewSelectedEvent.emit(view);
    } else {
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view; // asisgn second view name
      if (view == 'Last note added date') {
        this.tableService.viewSelected =
          'Last ' +
          this.fieldNameSaleNotes +
          ' added date'; // for displaying viewname in toolbar
      } else if (view == 'All contacts') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameSale +
          's'; // for displaying viewname in toolbar
      } else {
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      this.saleGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // view select foe default view status fields
  viewSelectedStatus(viewName, status) {
    if (!this.saleGridService.isOldModeVisible) {
      this.saleGridService.saleViewSelected = {};
      const data = { viewName: viewName, status: status };
      this.viewSelectedStatusEvent.emit(data);
    } else {
      this.tableService.selectedStatus = status.stageId;
      this.tableService.secondViewSelected = viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.saleSettings.salesStage.displayName +
        '/ ' +
        status.name; // for displaying viewname in toolbar
      this.saleGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // add new custom view
  addView(mode) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'sales',
        null,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.saleGridService.saleViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.saleGridService.saleViewSelected.filters = res.viewSettings.filters;
        this.saleGridService.saleViewSelected.viewName = res.viewSettings.viewName;
        this.saleGridService.saleViewSelected.sortField = res.viewSettings.sortField;
        this.saleGridService.saleViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.saleGridService.saleViewSelected.createdBy = res.viewSettings.createdBy ? res.viewSettings.createdBy : null;
        this.saleGridService.saleViewSelected.id = res.id;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        if (this.saleGridService.isOldModeVisible) {
          this.saleGridService.onFunctionCall('viewChanged'); // for reading data based on the view
        } else {
          this.saleGridService.isOldModeVisible = true;// for display old mode
        }
      }
      this._matDialogRef.close()
    });
  }
  // if filter view changed
  viewChanged(view) {
    if (!this.saleGridService.isOldModeVisible) {
      this.saleGridService.saleViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbarl̥
      this.saleGridService.isOldModeVisible = true; // for display old mode
      this.changeDetect.detectChanges();
    } else {
      this.saleGridService.saleViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar

      this.saleGridService.onFunctionCall('viewChanged'); // for reading data based on the view
      this.changeDetect.detectChanges();
    }
    this._matDialogRef.close()
  }
}
