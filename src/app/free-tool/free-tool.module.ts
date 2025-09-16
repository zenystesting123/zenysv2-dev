import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeToolRoutingModule } from './free-tool-routing.module';
import { DocumentFormComponent } from './document-form/document-form.component';
import { SharedModule } from 'projects/customers/src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire';
import { MainToolBarComponent } from './main-tool-bar/main-tool-bar.component';
var firebaseConfig = environment.firebaseConfig;

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
    },
  },
  signInFlow: 'popup',
  // signInSuccessUrl: '/freetool/doc-create',s
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //clientId: '1059747170002-mb13fen3gnln217t3sfjuvsa80u7ildr.apps.googleusercontent.com',
      scopes: [],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account',
        auth_type: 'reauthenticate',
      },
    },
  
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};
@NgModule({
  declarations: [DocumentFormComponent, MainToolBarComponent],
  imports: [
    CommonModule,
    FreeToolRoutingModule,
    SharedModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFireModule.initializeApp(firebaseConfig),
  ],
})
export class FreeToolModule {}
