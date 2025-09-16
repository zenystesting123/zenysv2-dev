/**********************************************************
Description : Filters selection popup for customer lite mode.
              Default, created by me and public views are displayed, and can add/select custom view.

 * **********************************************************************/

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { TableService } from '../customer-list/table.service';
import { contactSettings, defaultContactSettings } from 'src/app/data-models';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CustomerGridService } from '../customer-grid/customer-grid.service';
@Component({
  selector: 'app-custom-view-select',
  templateUrl: './custom-view-select.component.html',
  styleUrls: ['./custom-view-select.component.scss']
})
export class CustomViewSelectComponent implements OnInit, OnDestroy {
  @Output() viewSelectedStatusEvent = new EventEmitter<{ viewName: string, status: string }>();
  @Output() viewSelectedEvent = new EventEmitter<string>();
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settings configuration
  cardFields: any[]; // customer settings configuration
  superUserId: string; // super user id
  userId: string; // user id
  fieldNameContact: string = 'Contact'; // field name for contacte
  fieldNameContactNotes: string = 'Note'; // field name for note
  myViews: any = []; // list of my views
  publicViews: any = []; // list of public views
  private readonly _matDialogRef: MatDialogRef<CustomViewSelectComponent>;
  private readonly triggerElementRef: ElementRef;

  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  constructor(public tableService: TableService, public dialog: MatDialog,
    public customerGridService: CustomerGridService, public changeDetect: ChangeDetectorRef,
    _matDialogRef: MatDialogRef<CustomViewSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      trigger: ElementRef, contactSettings: contactSettings, cardFields: any[],
      fieldNameContactNotes: string, fieldNameContact: string, superUserId: string, userId: string,
      publicViews: any, myViews: any
    },) {
    this._matDialogRef = _matDialogRef;
    this.triggerElementRef = data.trigger;
    this.contactSettings = data.contactSettings;
    this.cardFields = data.cardFields,
      this.fieldNameContactNotes = data.fieldNameContactNotes,
      this.fieldNameContact = data.fieldNameContact,
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
    if (!this.customerGridService.isOldModeVisible) {
      this.customerGridService.customerViewSelected = {};
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view; // asisgn second view name
      if (view == 'Last note added date') {
        this.tableService.viewSelected =
          'Last ' +
          this.fieldNameContactNotes +
          ' added date'; // for displaying viewname in toolbar
      } else if (view == 'All contacts') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameContact +
          's'; // for displaying viewname in toolbar
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
          this.fieldNameContactNotes +
          ' added date'; // for displaying viewname in toolbar
      } else if (view == 'All contacts') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameContact +
          's'; // for displaying viewname in toolbar
      } else {
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      this.customerGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // view select foe default view status fields
  viewSelectedStatus(viewName, status) {
    if (!this.customerGridService.isOldModeVisible) {
      this.customerGridService.customerViewSelected = {};
      const data = { viewName: viewName, status: status };
      this.viewSelectedStatusEvent.emit(data);
    } else {
      this.tableService.selectedStatus = status.stageId;
      this.tableService.secondViewSelected = viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.contactSettings.status.displayName +
        '/ ' +
        status.name; // for displaying viewname in toolbar
      this.customerGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // add new custom view
  addView(mode) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'customers',
        null,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.customerGridService.customerViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.customerGridService.customerViewSelected.filters = res.viewSettings.filters;
        this.customerGridService.customerViewSelected.viewName = res.viewSettings.viewName;
        this.customerGridService.customerViewSelected.sortField = res.viewSettings.sortField;
        this.customerGridService.customerViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.customerGridService.customerViewSelected.createdBy = res.viewSettings.createdBy ? res.viewSettings.createdBy : null;
        this.customerGridService.customerViewSelected.id = res.id;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        if (this.customerGridService.isOldModeVisible) {
          this.customerGridService.onFunctionCall('viewChanged'); // for reading data based on the view
        } else {
          this.customerGridService.isOldModeVisible = true;// for display old mode
        }
      }
      this._matDialogRef.close()
    });
  }
  // if filter view changed
  viewChanged(view) {
    if (!this.customerGridService.isOldModeVisible) {
      this.customerGridService.customerViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbarl̥
      this.customerGridService.isOldModeVisible = true; // for display old mode
      this.changeDetect.detectChanges();
    } else {
      this.customerGridService.customerViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar

      this.customerGridService.onFunctionCall('viewChanged'); // for reading data based on the view
      this.changeDetect.detectChanges();
    }
    this._matDialogRef.close()
  }
}
