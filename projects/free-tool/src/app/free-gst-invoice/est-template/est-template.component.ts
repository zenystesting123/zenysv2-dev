import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
@Component({
  selector: 'app-est-template',
  templateUrl: './est-template.component.html',
  styleUrls: ['./est-template.component.scss']
})
export class EstTemplateComponent implements OnInit {
  isMessageOpen:boolean=true;  

  constructor(@Inject(DOCUMENT) private document: Document, private titleService: Title, private meta: Meta, private analytics: AngularFireAnalytics,private router: Router) {
            // meta tag updation
            this.titleService.setTitle(" Download Estimate template in Excel");
            this.meta.updateTag({ name: 'description', content: "Free download - Download Estimate format in excel" })
            this.meta.updateTag({ name: 'og:title', content: "Download Estimate template in Excel" })
            this.meta.updateTag({ name: 'og:description', content: "Free download - Download Estimate format in excel" })
            this.meta.updateTag({ name: 'og:url', content:"https://crm.zenys.org/free-tool/create/Free-Estimate-Template-Download"}) 
            this.meta.updateTag({ name: "og:type", content:"website"})
    

  }

  ngOnInit(): void {
  }
  downloadTemplate() {
    this.document.location.href = 'https://firebasestorage.googleapis.com/v0/b/gstinvoice-cee4c.appspot.com/o/Estimate%20Template.xlsx?alt=media&token=ddc027c2-d1af-4dec-ab3a-f8e6d0385871'
  }
  onLogIn(){
    this.analytics.logEvent('btn_signup_freetool');
    this.router.navigate(['/login'])
  }
  onCloseCard(){
    this.isMessageOpen=false
  }
  
}
