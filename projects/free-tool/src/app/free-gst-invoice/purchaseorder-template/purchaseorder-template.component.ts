import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
@Component({
  selector: 'app-purchaseorder-template',
  templateUrl: './purchaseorder-template.component.html',
  styleUrls: ['./purchaseorder-template.component.scss']
})
export class PurchaseorderTemplateComponent implements OnInit {
  isMessageOpen:boolean=true;  
  constructor(@Inject(DOCUMENT) private document: Document, private titleService: Title, private meta: Meta,  private analytics: AngularFireAnalytics,private router: Router) {

            // meta tag updation
            this.titleService.setTitle(" Download Purchase order template in Excel");
            this.meta.updateTag({ name: 'description', content: "Free download - Download Purchase order format in excel" })
            this.meta.updateTag({ name: 'og:title', content: "Download Purchase order template in Excel" })
            this.meta.updateTag({ name: 'og:description', content: "Free download - Download Purchase order format in excel" })
            this.meta.updateTag({ name: 'og:url', content:"https://crm.zenys.org/free-tool/create/Free-Purchase-Order-Template-Download"}) 
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
