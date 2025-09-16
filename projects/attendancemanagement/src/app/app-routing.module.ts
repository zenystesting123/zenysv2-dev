import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceLoginComponent } from './attendance-login/attendance-login.component';
import { AttendanceMarkingComponent } from './attendance-marking/attendance-marking.component';

const routes: Routes = [
  {path:'attendancemanagement', component:AttendanceLoginComponent},
  {path:'attendancemanagement/login', component:AttendanceLoginComponent},
  {path:'attendancemanagement/attendance-marking', component:AttendanceMarkingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
