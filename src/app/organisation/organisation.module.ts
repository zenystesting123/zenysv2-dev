import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { SharedModule } from '../shared/shared.module';
import { CommonSearchModule } from '../common-search/common-search.module';
import { ChildOrgList, OrganisationListComponent } from './organisation-list/organisation-list.component';
import { ChildOrgDetails, OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { CustomTablesModule } from '../custom-tables/custom-tables.module';


@NgModule({
  declarations: [CrudFormComponent, OrganisationListComponent, OrganisationDetailsComponent, ChildOrgList, ChildOrgDetails],
  imports: [
    CommonModule,
    OrganisationRoutingModule,
    SharedModule,
    CommonSearchModule,
    CustomTablesModule
  ]
})
export class OrganisationModule { }
