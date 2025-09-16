import { NgModule } from '@angular/core';
import { DocumentRoutingModule } from './document-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DocSettingsBottomSheetComponent } from './doc-settings-bottom-sheet/doc-settings-bottom-sheet.component';
import { CommonSearchComponent } from './common-search/common-search.component';

@NgModule({
  declarations: [
    DocSettingsBottomSheetComponent,
    CommonSearchComponent,
  ],
  imports: [SharedModule, DocumentRoutingModule],
})
export class DocumentModule {}
