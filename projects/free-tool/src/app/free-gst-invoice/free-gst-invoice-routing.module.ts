import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { CreateComponent } from './create/create.component';
import { EstTemplateComponent } from './est-template/est-template.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { InvTemplateComponent } from './inv-template/inv-template.component';
import { MatHomeComponent } from './mat-home/mat-home.component';
import { MobilepreviewComponent } from './mobilepreview/mobilepreview.component';
import { ProformaTemplateComponent } from './proforma-template/proforma-template.component';
import { PurchaseorderTemplateComponent } from './purchaseorder-template/purchaseorder-template.component';
import { QuotTemplateComponent } from './quot-template/quot-template.component';

const routes: Routes = [
  {
    path: '',
    component: MatHomeComponent,
    data: {
      title: 'login',
    },

    children: [
      {
        path: '',
        component: HomeContentComponent,
        data: {
          title: 'HomeContent',
        },
      },
      {
        path: 'create/:docType',
        component: CreateComponent,
        data: {
          title: '',
        },
      },

      {
        path: 'Free-Invoice-Template-Download',
        component: InvTemplateComponent,
        data: {
          title: 'InvoiceDownload',
        },
      },
      {
        path: 'Free-Quotation-Template-Download',
        component: QuotTemplateComponent,
        data: {
          title: 'QuotationDownload',
        },
      },
      {
        path: 'Free-Estimate-Template-Download',
        component: EstTemplateComponent,
        data: {
          title: 'EstimateDownload',
        },
      },
      {
        path: 'Free-Proforma-Invoice-Template-Download',
        component: ProformaTemplateComponent,
        data: {
          title: 'ProformaDownload',
        },
      },
      {
        path: 'Free-Purchase-Order-Template-Download',
        component: PurchaseorderTemplateComponent,
        data: {
          title: 'PurchaseorderDownload',
        },
      },
      
    ],
  },
  {
    path: 'cropper',
    component: ImageCropperComponent,
    data: {
      title: 'ImageCropper'
    },

  },
  {
    path: 'mobilepreview',
    component: MobilepreviewComponent,
    data: {
      title: 'print',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreeGstInvoiceRoutingModule {}
