import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizedReportsRoutingModule } from './customized-reports-routing.module';
import { ReportTableComponent } from './report-table/report-table.component';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { TableSettingsComponent } from './table-settings/table-settings.component';
import { SharedModule } from '../shared/shared.module';
import { ReportListviewComponent } from './report-listview/report-listview.component';
import { DashboardDialog, DashboardgridComponent } from './dashboardgrid/dashboardgrid.component';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [DashboardgridComponent,DashboardDialog,ReportTableComponent, ReportFilterComponent, ReportViewComponent, CreateNewComponent, TableSettingsComponent, ReportListviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomizedReportsRoutingModule,
    GridsterModule,

  ],
  exports: [ReportFilterComponent, DashboardgridComponent, ReportViewComponent]
})
export class CustomizedReportsModule { }
