import { GalleryImagesComponent } from './gallery-images/gallery-images.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ProfilemoduleRoutingModule } from './profilemodule-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileEditComponentComponent } from './profile-edit-component/profile-edit-component.component';
import { ProfileConfirmationComponent } from './profile-confirmation/profile-confirmation.component';
import { ProfileCheckComponent } from './profile-check/profile-check.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [

    ProfileCheckComponent,
    ProfileEditComponentComponent,
    ProfileConfirmationComponent,
    UploadTaskComponent,
    GalleryImagesComponent,
  ],
  imports: [
    CommonModule,
    ProfilemoduleRoutingModule,
    SharedModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw',
      apiKey: 'AIzaSyCapl26Q6eZWn7yRdyhfUFwPDS7zwVfQOQ',
      libraries: ["places"],
      apiVersion: 'quarterly'
    }),
  ]
})
export class ProfilemoduleModule { }
