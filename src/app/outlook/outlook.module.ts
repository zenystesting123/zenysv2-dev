import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { MailListComponent } from './mail-list/mail-list.component';
import { ShowMailthreadComponent } from './show-mailthread/show-mailthread.component';
import { ComposeMailComponent } from './compose-mail/compose-mail.component';
import { EncryptDecryptComponent } from './encrypt-decrypt/encrypt-decrypt.component';
import { SharedModule } from '../shared/shared.module';
import { OutlookRoutingModule } from './outlook-routing.module';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
@NgModule({
  declarations: [
    MailListComponent,
    ShowMailthreadComponent,
    ComposeMailComponent,
    EncryptDecryptComponent
  ],
  imports: [
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.outlookClientId, // Application (client) ID from the app registration
        authority: 'https://login.microsoftonline.com/common/', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: '/auth' // This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'Mail.ReadWrite']
      }
  }, {
    interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    protectedResourceMap: new Map([ 
        ['https://graph.microsoft.com/beta/me', ['User.Read']],
        ['https://graph.microsoft.com/beta/me/messages', ['Mail.Read']],
        ['https://graph.microsoft.com/beta/me/sendMail', ['Mail.Send']]
        
    ])
  }),
    //CommonModule,
    OutlookRoutingModule,
    SharedModule],
  exports:[
    MailListComponent,
    ShowMailthreadComponent,
    ComposeMailComponent,
    EncryptDecryptComponent
  ],
  providers: [
    EncryptDecryptComponent,
    MsalGuard, // MsalGuard added as provider here
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
  ],
  bootstrap: [
    MsalRedirectComponent // MsalRedirectComponent bootstrapped here
  ],
})
export class OutlookModule {}
