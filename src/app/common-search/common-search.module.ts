import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonSearchRoutingModule } from './common-search-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommonUserSearchComponent } from './common-user-search/common-user-search.component';
import { CommonCountryCodeComponent } from '../common-country-code/common-country-code.component';
import { CommonBranchComponent } from '../common-branch/common-branch.component';
import { SelectSearchComponent } from './select-search/select-search.component';
import { CommonCurrencyComponent } from '../common-currency/common-currency.component';


@NgModule({
  declarations: [ CommonUserSearchComponent, CommonCountryCodeComponent, CommonBranchComponent,SelectSearchComponent, CommonCurrencyComponent],
  imports: [
    CommonModule,
    CommonSearchRoutingModule,
    SharedModule
  ],
  exports: [
    CommonUserSearchComponent, CommonCountryCodeComponent, CommonBranchComponent,SelectSearchComponent, CommonCurrencyComponent
  ]
})
export class CommonSearchModule { }
