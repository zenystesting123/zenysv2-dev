import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';

const routes: Routes = [
  {
    path: 'orglist',
    component: OrganisationListComponent,
    data: {
      title: 'orglist',
      // animation: 'ContactList',
    },
  },
  {
    path: 'orgdetails/:orgId',
    component: OrganisationDetailsComponent,
    data: {
      title: 'orgdetails',
      // animation:'CustomerDetails'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
