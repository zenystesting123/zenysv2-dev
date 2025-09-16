/**********************************************************
Description : Filters selection popup for service lite mode.
              Default, created by me and public views are displayed, and can add/select custom view.

 * **********************************************************************/

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { defaultServiceSettings, serviceSettings } from 'src/app/data-models';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SupportListService } from '../support-list/support-list.service';
import { SupportGridService } from '../support-grid/support-grid.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-support-custom-view-select',
  templateUrl: './support-custom-view-select.component.html',
  styleUrls: ['./support-custom-view-select.component.scss']
})
export class SupportCustomViewSelectComponent implements OnInit, OnDestroy {
  @Output() viewSelectedStatusEvent = new EventEmitter<{ viewName: string, status: string }>();
  @Output() viewSelectedEvent = new EventEmitter<string>();
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; // service settings configuration
  cardFields: any[]; // service settings configuration
  superUserId: string; // super user id
  userId: string; // user id
  fieldNameService: string = 'Support'; // field name for service
  fieldNameServiceNote: string = 'Note'; // field name for note
  myViews: any = []; // list of my views
  publicViews: any = []; // list of public views
  private readonly _matDialogRef: MatDialogRef<SupportCustomViewSelectComponent>;
  private readonly triggerElementRef: ElementRef;

  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  constructor(public tableService: SupportListService, public dialog: MatDialog,
    public serviceGridService: SupportGridService, public changeDetect: ChangeDetectorRef,
    _matDialogRef: MatDialogRef<SupportCustomViewSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      trigger: ElementRef, serviceSettings: serviceSettings, cardFields: any[],
      fieldNameServiceNote: string, fieldNameService: string, superUserId: string, userId: string,
      publicViews: any, myViews: any
    },) {
    this._matDialogRef = _matDialogRef;
    this.triggerElementRef = data.trigger;
    this.serviceSettings = data.serviceSettings;
    this.cardFields = data.cardFields,
      this.fieldNameServiceNote = data.fieldNameServiceNote,
      this.fieldNameService = data.fieldNameService,
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
    if (!this.serviceGridService.isOldModeVisible) {
      this.serviceGridService.serviceViewSelected = {};
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view; // asisgn second view name
      if (view == 'Last note added') {
        this.tableService.viewSelected =
          'Last ' +
          this.fieldNameServiceNote +
          ' added'; // for displaying viewname in toolbar
      } else if (view == 'All Support') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameService; // for displaying viewname in toolbar
      } else {
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      this.viewSelectedEvent.emit(view);
    } else {
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view; // asisgn second view name
      if (view == 'Last note added') {
        this.tableService.viewSelected =
          'Last ' +
          this.fieldNameServiceNote +
          ' added'; // for displaying viewname in toolbar
      } else if (view == 'All Support') {
        this.tableService.viewSelected =
          'All ' +
          this.fieldNameService; // for displaying viewname in toolbar
      } else {
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      this.serviceGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // view select foe default view status fields
  viewSelectedStatus(viewName, status) {
    if (!this.serviceGridService.isOldModeVisible) {
      this.serviceGridService.serviceViewSelected = {};
      const data = { viewName: viewName, status: status };
      this.viewSelectedStatusEvent.emit(data);
    } else {
      this.tableService.selectedStatus = status.stageId;
      this.tableService.secondViewSelected = viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.serviceSettings.servicesStage.displayName +
        '/ ' +
        status.name; // for displaying viewname in toolbar
      this.serviceGridService.isOldModeVisible = false;
    }
    this._matDialogRef.close()
    this.changeDetect.detectChanges();
  }
  // add new custom view
  addView(mode) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'services',
        null,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((res) => {
      if (res) {
        this.serviceGridService.serviceViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.serviceGridService.serviceViewSelected.filters = res.viewSettings.filters;
        this.serviceGridService.serviceViewSelected.viewName = res.viewSettings.viewName;
        this.serviceGridService.serviceViewSelected.sortField = res.viewSettings.sortField;
        this.serviceGridService.serviceViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.serviceGridService.serviceViewSelected.createdBy = res.viewSettings.createdBy ? res.viewSettings.createdBy : null;
        this.serviceGridService.serviceViewSelected.id = res.id;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        if (this.serviceGridService.isOldModeVisible) {
          this.serviceGridService.onFunctionCall('viewChanged'); // for reading data based on the view
        } else {
          this.serviceGridService.isOldModeVisible = true;// for display old mode
        }
      }
      this._matDialogRef.close()
    });
  }
  // if filter view changed
  viewChanged(view) {
    if (!this.serviceGridService.isOldModeVisible) {
      this.serviceGridService.serviceViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbarl̥
      this.serviceGridService.isOldModeVisible = true; // for display old mode
      this.changeDetect.detectChanges();
    } else {
      this.serviceGridService.serviceViewSelected = view;
      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = view.viewName; // asisgn second view name

      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar

      this.serviceGridService.onFunctionCall('viewChanged'); // for reading data based on the view
      this.changeDetect.detectChanges();
    }
    this._matDialogRef.close()
  }

}
