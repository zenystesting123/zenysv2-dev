

import { CustomTablesRoutingModule } from './custom-tables-routing.module';
import { CustomReportTableComponent } from './custom-report-table/custom-report-table.component';
import { CustomTableSettingsComponent } from './custom-table-settings/custom-table-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GridsterModule } from 'angular-gridster2';
import { ChildCustomReportTableComponent } from './child-custom-report-table/child-custom-report-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonSearchModule } from '../common-search/common-search.module';

@NgModule({
  declarations: [CustomReportTableComponent, CustomTableSettingsComponent, ChildCustomReportTableComponent],
  imports: [
    CommonModule,
    CustomTablesRoutingModule,
    SharedModule,
    GridsterModule,
    ReactiveFormsModule,
    CommonSearchModule
  ],
  exports: [
    CustomReportTableComponent
  ]
})
export class CustomTablesModule { }
