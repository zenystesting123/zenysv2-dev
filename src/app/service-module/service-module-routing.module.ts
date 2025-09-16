import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceListComponent } from './service-list/service-list.component';

const routes: Routes = [
  { path: 'service-list', component: ServiceListComponent },
  {
    path: 'service-details/:serviceId',
    component: ServiceDetailsComponent,
    data: {
      title: 'Service Details',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceModuleRoutingModule {}
