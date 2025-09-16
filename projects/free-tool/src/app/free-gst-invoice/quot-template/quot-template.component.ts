import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
@Component({
  selector: 'app-quot-template',
  templateUrl: './quot-template.component.html',
  styleUrls: ['./quot-template.component.scss']
})
export class QuotTemplateComponent implements OnInit {

  isMessageOpen:boolean=true;  

  constructor(@Inject(DOCUMENT) private document: Document, private titleService: Title, private meta: Meta,  private analytics: AngularFireAnalytics,private router: Router) {

                // meta tag updation
                this.titleService.setTitle(" Download Quotation template in Excel");
                this.meta.updateTag({ name: 'description', content: "Free download - Download Quotation format in excel  - suitable for GST/ VAT quotations" })
                this.meta.updateTag({ name: 'og:title', content: "Download Quotation template in Excel" })
                this.meta.updateTag({ name: 'og:description', content: "Free download - Download quotation format in excel  - suitable for GST/ VAT quotations" })
                this.meta.updateTag({ name: 'og:url', content:"https://crm.zenys.org/free-tool/create/Free-Quotation-Template-Download"}) 
                this.meta.updateTag({ name: "og:type", content:"website"})

  }

  ngOnInit(): void {
  }
  downloadTemplate() {
    this.document.location.href = 'https://firebasestorage.googleapis.com/v0/b/gstinvoice-cee4c.appspot.com/o/Quotation%20Template.xlsx?alt=media&token=2bf16e4b-d8c5-454b-b20f-e67d31eba589'
  }
  onLogIn(){
    this.analytics.logEvent('btn_signup_freetool');
    this.router.navigate(['/login'])
  }
  onCloseCard(){
    this.isMessageOpen=false
  }
  
}
