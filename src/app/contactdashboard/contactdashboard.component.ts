import { ContactdashboardService } from './contactdashboard.service';
import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  colors: string[],
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[],
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels,
  stroke: ApexStroke,
  grid: ApexGrid,
  legend?: ApexLegend,
  tooltip?: ApexTooltip,
  plotOptions?: ApexPlotOptions,
  labels?: string[],
  fill: ApexFill,
  markers?: ApexMarkers,
  theme: ApexTheme,
  
  responsive: ApexResponsive[]
};

var $primary = "#283593",
  $success = "#40C057",
  $info = "#2F8BE6",
  $warning = "#F77E17",
  $danger = "#F55252",
  $label_color_light = "#E6EAEE";
var themeColors = [$primary, $warning, $success, $danger, $info];

@Component({
  selector: 'app-contactdashboard',
  templateUrl: './contactdashboard.component.html',
  styleUrls: ['./contactdashboard.component.scss']
})
export class ContactdashboardComponent implements OnInit {
  customerLoaded:boolean = false
  opportunityLoaded:boolean = false
  prospectLoaded:boolean = false
  leadLoaded:boolean = false
  subscribe1:Subscription;
  subscribe2:Subscription;
  subscribe3:Subscription;
  subscribe4:Subscription;
  subscribe5:Subscription;
  subscribe6:Subscription;
  subscribe7:Subscription;
  customerfunnelOptions: Partial<ChartOptions>;
  customerOptions : Partial<ChartOptions>;
  inquiryOptions : Partial<ChartOptions>;
  followupOptions : Partial<ChartOptions>;
  leadOptions: Partial<ChartOptions>;
  prospectOptions: Partial<ChartOptions>;
  opportunityOptions: Partial<ChartOptions>;
  
  leadAmt:number=0;
  prospectAmt:number=0;
  opportunityAmt:number=0; 
  customerAmt:number=0;
  leads:any[];
  customerFlag:boolean=false;
  leadl:number=0;
  prospectl:number=0;
  opporl:number=0;
  customerl:number=0;
  inquiryFlag:boolean=false;
  totalleads:number=0;
  totalprospect:number=0;
  totalopportunity:number=0;
  prospect:any[];
  opportunity:any[];
  customer:any[];
  customers:any[];
  inquiries:any[];
  leadFlag:boolean=false;
  prospectFlag:boolean=false;
  opportunityFlag:boolean=false;
  customerfunnelFlag:boolean= false;
  followupFlag:boolean=false;
  user:firebase.default.UserInfo ;
  datePlaced:any;
  lead02:number=0;
  lead37:number=0;
  lead81:number=0;
  lead1above:number=0;
  prospect02:number=0;
  prospect37:number=0;
  prospect81:number=0;
  prospect1above:number=0;
  opportunity02:number=0;
  opportunity37:number=0;
  opportunity81:number=0;
  opportunity1above:number=0;
  month:any;
  year:any;
  custjan:number=0;
  custfeb:number=0;
  custmar:number=0;
  custapr:number=0;
  custmay:number=0;
  custjun:number=0;
  custjul:number=0;
  custaug:number=0;
  custsep:number=0;
  custoct:number=0;
  custnov:number=0;
  custdec:number=0;
  inqjan:number=0;
  inqfeb:number=0;
  inqmar:number=0;
  inqapr:number=0;
  inqmay:number=0;
  inqjun:number=0;
  inqjul:number=0;
  inqaug:number=0;
  inqsep:number=0;
  inqoct:number=0;
  inqnov:number=0;
  inqdec:number=0;
  followupYes:number=0;
  followupNo:number=0;

  constructor(private router: Router,private afAuth : AngularFireAuth,private contactdashboardService:ContactdashboardService) {
    this.datePlaced= new Date().getTime();
    this.month=new Date().getMonth();
    this.year=new Date().getFullYear();
   // console.log(this.month);
   // console.log(this.year);
    this.inquiryOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      colors: themeColors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight'
      },
      series: [{
        name: "Inquiries",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0],
      }],
      title: {
        text: 'Inquiries by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#F5F5F5', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
      },
      yaxis: {
        tickAmount: 5,
      }
    }
    this.customerOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      colors: themeColors,
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      series: [{
        name: "Contacts",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0],
      }],

      grid: {
        row: {
          colors: ['#F5F5F5', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
      },
      yaxis: {
        tickAmount: 5,
      }
    }
    this.customerfunnelOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'bar',
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0,0]
      }],
      xaxis: {
        categories: ['Lead', 'Prospect', 'Opportunity', 'Customer'],
        tickAmount: 1
      }
    }
    this.followupOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'bar',
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0]
      }],
      xaxis: {
        categories: ['Total Leads', 'Leads with Tasks', 'Leads without Tasks'],
        tickAmount: 1
      }
    }
    this.leadOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'bar',
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0]
      }],
      xaxis: {
        categories: ['0-2 Days', '3-7 Days', '8 Dyas - 1 Month','1 Month and Above'],
        tickAmount: 1
      }
    }
    this.prospectOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'bar',
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0]
      }],
      xaxis: {
        categories: ['0-2 Days', '3-7 Days', '8 Days - 1 Month','1 Month and Above'],
        tickAmount: 1
      }
    }
    this.opportunityOptions = {
      chart: {
        toolbar: {
          show: false
        },
        height: 200,
        type: 'bar',
      },
      colors: themeColors,
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        data: [0, 0, 0]
      }],
      xaxis: {
        categories: ['0-2 Days', '3-7 Days', '8 Dyas - 1 Month','1 Month and Above'],
        tickAmount: 1
      }
    }
   
  }
  ngOnInit(){
    this.subscribe1= this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.contactdashboardService.getLeads(this.user.uid).subscribe(data => {
          this.leads = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};
          })
          this.leadAmt=this.leads.length;
          this.leadLoaded=true;
          this.setChart();
          this.leadAmount(this.leadAmt);
        });
        this.contactdashboardService.getProspect(this.user.uid).subscribe(data => {
          this.prospect = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};
          })
          this.prospectAmt=this.prospect.length;
          this.prospectLoaded=true;
          this.setChart();
        });

        this.contactdashboardService.getCustomer(this.user.uid).subscribe(data => {
          this.customer = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};

          })
          this.customerAmt=this.customer.length;
          this.customerLoaded=true;
     this.setChart();
     });

        
        
        this.contactdashboardService.getOpportunity(this.user.uid).subscribe(data => {
          this.opportunity = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};
          })
          this.opportunityAmt=this.opportunity.length;
          this.opportunityLoaded=true;
          this.setChart();
      
        });
        
        this.contactdashboardService.getCustomers(this.user.uid).subscribe(data => {
          this.customers = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};

          })
        });

        this.contactdashboardService.getInquiries(this.user.uid).subscribe(data => {
          this.inquiries = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as {};
          })
        });
        

      }
    })
  }

  leadAmount(lead){
    this.leadAmt=lead;

  }

  leadsvalue(leadDate){
    this.totalleads=this.datePlaced-leadDate;
    this.totalleads=this.totalleads/(1000 * 60 * 60);
    if(this.totalleads<=48){
      this.lead02=this.lead02+1;
    }
    else if(this.totalleads>48 && this.totalleads<=168){
      this.lead37=this.lead37+1;
    }
    else if(this.totalleads>168 && this.totalleads<=720){
      this.lead81=this.lead81+1;
    }
    else{
      this.lead1above=this.lead1above+1;
    }
  }
  followupValue(task){
    if(task){
    
    }
    if(task>0){
      this.followupYes=this.followupYes+1;
    }
    else this.followupNo=this.followupNo+1;
  }

  prospectvalue(prospectDate){
    this.totalprospect=this.datePlaced-prospectDate;
    this.totalprospect=this.totalprospect/(1000 * 60 * 60);
    if(this.totalprospect<=48){
      this.prospect02=this.prospect02+1;
    }
    else if(this.totalprospect>48 && this.totalprospect<=168){
      this.prospect37=this.prospect37+1;
    }
    else if(this.totalprospect>168 && this.totalprospect<=720){
      this.prospect81=this.prospect81+1;
    }
    else{
      this.prospect1above=this.prospect1above+1;
    }
  }

  opportunityvalue(opportunityDate){
    this.totalopportunity=this.datePlaced-opportunityDate;
    this.totalopportunity=this.totalopportunity/(1000 * 60 * 60);
    if(this.totalopportunity<=48){
      this.opportunity02=this.opportunity02+1;
    }
    else if(this.totalopportunity>48 && this.totalopportunity<=168){
      this.opportunity37=this.opportunity37+1;
    }
    else if(this.totalopportunity>168 && this.totalopportunity<=720){
      this.opportunity81=this.opportunity81+1;
    }
    else{
      this.opportunity1above=this.opportunity1above+1;
    }
  }

  customerValue(month,year){
    if(year==this.year){
      if(month==0){
        this.custjan=this.custjan+1;
      }
      else if(month==1){
        this.custfeb=this.custfeb+1;
      }
      else if(month==2){
        this.custmar=this.custmar+1;
      }
      else if(month==3){
        this.custapr=this.custapr+1;
      }
      else if(month==4){
        this.custmay=this.custmay+1;
      }
      else if(month==5){
        this.custjun=this.custjun+1;
      }
      else if(month==6){
        this.custjul=this.custjul+1;
      }
      else if(month==7){
        this.custaug=this.custaug+1;
      }
      else if(month==8){
        this.custsep=this.custsep+1;
      }
      else if(month==9){
        this.custoct=this.custoct+1;
      }
      else if(month==10){
        this.custnov=this.custnov+1;
      }
      else {
        this.custdec=this.custdec+1;
      }
      
    }
  }

  inquiryValue(month,year){
    if(year==this.year){
      if(month==0){
        this.inqjan=this.inqjan+1;
      }
      else if(month==1){
        this.inqfeb=this.inqfeb+1;
      }
      else if(month==2){
        this.inqmar=this.inqmar+1;
      }
      else if(month==3){
        this.inqapr=this.inqapr+1;
      }
      else if(month==4){
        this.inqmay=this.inqmay+1;
      }
      else if(month==5){
        this.inqjun=this.inqjun+1;
      }
      else if(month==6){
        this.inqjul=this.inqjul+1;
      }
      else if(month==7){
        this.inqaug=this.inqaug+1;
      }
      else if(month==8){
        this.inqsep=this.inqsep+1;
      }
      else if(month==9){
        this.inqoct=this.inqoct+1;
      }
      else if(month==10){
        this.inqnov=this.inqnov+1;
      }
      else {
        this.inqdec=this.inqdec+1;
      }
      
    }
  }
  followupChart(){
    if(this.followupNo>0 || this.followupYes>0 ){
      this.followupOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'bar',
        },
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [{
          data: [this.leadAmt, this.followupYes, this.followupNo]
        }],
        xaxis: {
          categories: ['Total Leads', 'Leads with Tasks', 'Leads without Tasks'],
          tickAmount: 1
        }
      }
      this.followupFlag=true;
    }
  }

  leadsChart(){
    if((this.lead1above>0) || (this.lead02>0) || (this.lead37>0) || (this.lead81>0) ){
      this.leadOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'bar',
        },
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [{
          data: [this.lead02, this.lead37, this.lead81,this.lead1above]
        }],
        xaxis: {
          categories: ['0-2 Days', '3-7 Days', '8 Days - 1 Month','1 Month and Above'],
          tickAmount: 1
        }
      }
      this.leadFlag=true;
    }
    
  }

  prospectChart(){
    if((this.prospect1above>0) || (this.prospect02>0) || (this.prospect37>0) || (this.prospect81>0) ){
      this.prospectOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'bar',
        },
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [{
          data: [this.prospect02, this.prospect37, this.prospect81,this.prospect1above]
        }],
        xaxis: {
          categories: ['0-2 Days', '3-7 Days', '8 Days - 1 Month','1 Month and Above'],
          tickAmount: 1
        }
      }
      this.prospectFlag=true;
    }
    
  }

  opportunityChart(){
    if((this.opportunity1above>0) || (this.opportunity02>0) || (this.opportunity37>0) || (this.opportunity81>0) ){
      this.opportunityOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'bar',
        },
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [{
          data: [this.opportunity02, this.opportunity37, this.opportunity81,this.opportunity1above]
        }],
        xaxis: {
          categories: ['0-2 Days', '3-7 Days', '8 Days - 1 Month','1 Month and Above'],
          tickAmount: 1
        }
      }
      this.opportunityFlag=true;
    }
    
  }


  statusChart(){
    if((this.leadAmt>0) || (this.prospectAmt>0) || (this.opportunityAmt>0) || (this.customerAmt>0)){
      this.customerfunnelOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'bar',
        },
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [{
          data: [this.leadAmt, this.prospectAmt, this.opportunityAmt,this.customerAmt]
        }],
        xaxis: {
          categories: ['Lead', 'Prospect', 'Opportunity', 'Customer'],
          tickAmount: 1
        }
      }
      this.customerfunnelFlag=true;
   
    }
   
    
  }

  customerChart(){
    if((this.custnov>0) || (this.custdec>0) || (this.custfeb)>0 || (this.custmar)>0 || (this.custmay>0) || (this.custoct>0) || (this.custjan>0) ||(this.custapr>0) ||(this.custjul>0) || (this.custjun>0) ||(this.custaug>0) || (this.custsep>0)){
      this.customerOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        colors: themeColors,
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        series: [{
          name: "Contacts",
          data: [this.custjan, this.custfeb, this.custmar, this.custapr, this.custmay, this.custjun, this.custjul, this.custaug, this.custsep,this.custoct,this.custnov,this.custdec],
        }],

        grid: {
          row: {
            colors: ['#F5F5F5', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
        },
        yaxis: {
          tickAmount: 5,
        }
      }
      this.customerFlag=true;
    }
    
  }

  inquiryChart(){
    if((this.inqjan>0) || (this.inqfeb>0) || (this.inqmar)>0 || (this.inqapr)>0 || (this.inqmay>0) || (this.inqjun>0) || (this.inqjul>0) ||(this.inqaug>0) ||(this.inqsep>0) || (this.inqoct>0) ||(this.inqnov>0) || (this.inqdec>0)){
      this.inquiryOptions = {
        chart: {
          toolbar: {
            show: false
          },
          height: 200,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        colors: themeColors,
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        series: [{
          name: "Inquiries",
          data: [this.inqjan, this.inqfeb, this.inqmar, this.inqapr, this.inqmay, this.inqjun, this.inqjul, this.inqaug, this.inqsep,this.inqoct,this.inqnov,this.inqdec],
        }],
        title: {
          text: 'Inquiries by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#F5F5F5', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
        },
        yaxis: {
          tickAmount: 5,
        }
      }
      this.inquiryFlag=true;
    }
    
  }

  setChart(){
    if(this.leadLoaded && this.prospectLoaded && this.customerLoaded && this.opportunityLoaded){
      this.statusChart();
    }
  }
  onContactFunnel(){
    this.router.navigate(['/dash/contactfunnel'])
  }
  onLeadReport(){
    this.router.navigate(['/dash/contactstageage','Lead'])
  }
  onProspectReport(){
    this.router.navigate(['/dash/contactstageage','Prospect'])
  }
  onOpportunityReport(){
    this.router.navigate(['/dash/contactstageage','Opportunity'])
  }
  onContactReportNoFolowUp(){
    this.router.navigate(['dash/contactreportnofllowup'])
  }
  onInquiry(){
    this.router.navigate(['dash/Inquireslist'])
  }
 
}
