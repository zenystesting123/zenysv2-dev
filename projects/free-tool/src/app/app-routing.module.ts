import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'toolsfree',
    loadChildren: () => import('./free-tool/free-tool.module').then(m => m.FreeToolModule)
  },
  {
    path: 'free-toolfree',
    loadChildren: () => import('./free-gst-invoice/free-gst-invoice.module').then(m => m.FreeGstInvoiceModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
