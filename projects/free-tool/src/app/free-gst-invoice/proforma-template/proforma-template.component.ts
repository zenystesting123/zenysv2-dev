import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
@Component({
  selector: 'app-proforma-template',
  templateUrl: './proforma-template.component.html',
  styleUrls: ['./proforma-template.component.scss']
})
export class ProformaTemplateComponent implements OnInit {
  isMessageOpen:boolean=true; 

  constructor(@Inject(DOCUMENT) private document: Document, private titleService: Title, private meta: Meta, private analytics: AngularFireAnalytics,private router: Router) {

        // meta tag updation
        this.titleService.setTitle(" Download Proforma Invoice template in Excel");
        this.meta.updateTag({ name: 'description', content: "Free download - Download Proforma Invoice format in excel  - suitable for GST/ VAT invoices" })
        this.meta.updateTag({ name: 'og:title', content: "Download Proforma Invoice template in Excel" })
        this.meta.updateTag({ name: 'og:description', content: "Free download - Download Proforma Invoice format in excel  - suitable for GST/ VAT invoices" })
        this.meta.updateTag({ name: 'og:url', content:"https://crm.zenys.org/free-tool/create/Free-Proforma-Invoice-Template-Download"}) 
        this.meta.updateTag({ name: "og:type", content:"website"})

  }

  ngOnInit(): void {
  }
  downloadTemplate() {
    this.document.location.href = 'https://firebasestorage.googleapis.com/v0/b/gstinvoice-cee4c.appspot.com/o/Invoice%20Template.xlsx?alt=media&token=188ad2b1-3195-4aca-a344-3ac9bc5ef0c4'
  }

  onLogIn(){
    this.analytics.logEvent('btn_signup_freetool');
    this.router.navigate(['/login'])
  }

  onCloseCard(){
    this.isMessageOpen=false
  }
}
