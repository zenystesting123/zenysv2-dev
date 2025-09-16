import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardgridComponent } from './dashboardgrid/dashboardgrid.component';
import { ReportListviewComponent } from './report-listview/report-listview.component';
import { ReportViewComponent } from './report-view/report-view.component';

const routes: Routes = [
  {
    path:"grid",
    component:DashboardgridComponent
  },

  {
    path: 'list',
    component: ReportListviewComponent,
    data: {
      title: 'view',
    },
  },
    {
    path: 'report/:id',
    component: ReportViewComponent,
    data: {
      title: 'view',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomizedReportsRoutingModule { }
