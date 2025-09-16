import { NgModule } from "@angular/core";
import { FreeGstInvoiceRoutingModule } from "./free-gst-invoice-routing.module";
import { MatHomeComponent } from "./mat-home/mat-home.component";

import { CreateComponent } from "./create/create.component";
import { EstimateFormComponent } from "./estimate-form/estimate-form.component";
import { QuotationFormComponent } from "./quotation-form/quotation-form.component";
import { QuotationformfaqComponent } from "./quotationformfaq/quotationformfaq.component";
import { ProformaComponent } from "./proforma/proforma.component";
import { PurchaseorderformComponent } from "./purchaseorderform/purchaseorderform.component";
import { Preview2Component } from "./preview2/preview2.component";
import { Preview1Component } from "./preview1/preview1.component";
import { Preview3Component } from "./preview3/preview3.component";
import { Preview4Component } from "./preview4/preview4.component";
import { DocFormsComponent } from "./doc-form/doc-form.component";
import { CreateService } from "./create/create.service";
import { Title } from "@angular/platform-browser";
import { GoogleAnalyticsEventsService } from './google-analytics-events.service';
import { AngularFireAnalyticsModule, CONFIG, DEBUG_MODE, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { HomeContentComponent } from "./home-content/home-content.component";
import { InvTemplateComponent } from "./inv-template/inv-template.component";
import { ProformaTemplateComponent } from "./proforma-template/proforma-template.component";
import { EstTemplateComponent } from "./est-template/est-template.component";
import { PurchaseorderTemplateComponent } from "./purchaseorder-template/purchaseorder-template.component";
import { QuotTemplateComponent } from "./quot-template/quot-template.component";
import { MobilepreviewComponent } from "./mobilepreview/mobilepreview.component";
import { Mobilepreview1Component } from "./mobilepreview1/mobilepreview1.component";
import { Mobilepreview2Component } from "./mobilepreview2/mobilepreview2.component";
import { Mobilepreview3Component } from "./mobilepreview3/mobilepreview3.component";
import { ContactComponent } from "./contact/contact.component";
import { DownloadPopupComponent } from './download-popup/download-popup.component';
import { DocSettingsComponent } from './doc-settings/doc-settings.component';
import { InvoiceBlogComponent } from './invoice-blog/invoice-blog.component';
import { SharedModule } from "../shared/shared.module";
@NgModule({
    declarations: [
        MatHomeComponent,
        CreateComponent,
        DocFormsComponent,
        EstimateFormComponent,
        QuotationFormComponent,
        QuotationformfaqComponent,
        ProformaComponent,
        PurchaseorderformComponent,
        Preview2Component,
        Preview1Component,
        Preview3Component,
        Preview4Component,
        HomeContentComponent,
        InvTemplateComponent,
        QuotTemplateComponent,
        EstTemplateComponent,
        ProformaTemplateComponent,
        PurchaseorderTemplateComponent,
        MobilepreviewComponent,
        Mobilepreview1Component,
        Mobilepreview2Component,
        Mobilepreview3Component,
        ContactComponent,
        DownloadPopupComponent,
        DocSettingsComponent,
        InvoiceBlogComponent,
      ],
    imports:[
      FreeGstInvoiceRoutingModule,
     
    SharedModule,
    ],
    providers: [CreateService,
        Title,
        ScreenTrackingService,
        UserTrackingService,
        GoogleAnalyticsEventsService,
       {
        provide: CONFIG, useValue: {
         // send_page_view: false,
          allow_ad_personalization_signals: false,
          anonymize_ip: true,
          DEBUG_MODE:true
        }
       },
      ],
})
export class FreeGstInvoiceModule{}