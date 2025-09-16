import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ComposemailComponent } from './composemail/composemail.component';
import { ShowemailthreadComponent } from './showemailthread/showemailthread.component';

import { GmailRoutingModule } from './gmail-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ComposemobileComponent } from './composemobile/composemobile.component';
import { GmaillistComponent } from './gmaillist/gmaillist.component';
import { EncryptDecryptComponent } from './encrypt-decrypt/encrypt-decrypt.component';

@NgModule({
  declarations: [
    ComposemailComponent,
    ShowemailthreadComponent,
    ComposemobileComponent,
    GmaillistComponent,
    EncryptDecryptComponent,

  ],
  imports: [
    // CommonModule,
    GmailRoutingModule,
    SharedModule,
  ],
  exports:[
    ComposemailComponent,
    ShowemailthreadComponent,
    ComposemobileComponent,
    GmaillistComponent,
  ],
  providers: [EncryptDecryptComponent]
})
export class GmailModule { }
