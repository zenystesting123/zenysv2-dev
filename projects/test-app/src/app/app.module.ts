import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
// import { TestComponentComponent } from './test-component/test-component.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';

// import { AddExperiencePopupComponent } from './english-channel-contact-tab2/add-experience-popup/add-experience-popup.component';
// import { PopupdialogComponent } from './english-channel-sale-tab1/popupdialog/popupdialog.component';
// import { EnglishChannelSaleTab1Component } from './english-channel-sale-tab1/english-channel-sale-tab1.component';
// import { EnglishChannelContactTab1Component } from './english-channel-contact-tab1/english-channel-contact-tab1.component';
// import { EnglishChannelContactTab2Component } from './english-channel-contact-tab2/english-channel-contact-tab2.component';
// import { InjectorComponent } from './injector/injector.component';
// import { DynamicDirective } from './dynamic.directive';

@NgModule({
  declarations: [
    // TestComponentComponent,
    AppComponent,
    // AddExperiencePopupComponent,
    // PopupdialogComponent,
    // EnglishChannelSaleTab1Component,
    // EnglishChannelContactTab1Component,
    // EnglishChannelContactTab2Component,
    // InjectorComponent,
    // DynamicDirective,
    // MatFormFieldModule
  ],
  imports: [
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    // MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
