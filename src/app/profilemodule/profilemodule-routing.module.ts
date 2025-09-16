import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileEditComponentComponent } from './profile-edit-component/profile-edit-component.component';

const routes: Routes = [

  {
    // path: 'profileedit/:mode',
    path: 'profileedit/:mode/:id',
    component: ProfileEditComponentComponent,
    data: {
      title: 'Profile edit'
    },
  },
  {
    path: 'profileedit',
    component: ProfileEditComponentComponent,
    data: {
      title: 'Profile edit'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilemoduleRoutingModule { }
