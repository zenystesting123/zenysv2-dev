import { AfterViewInit, HostListener, OnDestroy } from '@angular/core';
/*********************************************************************************
Description: component used for sales by channel partner set in additional field
Inputs: table for showing sale with channel partner
Outputs:
***********************************************************************************/

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { CommonService } from '../common.service';
import { Sales } from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';
import { Location } from '@angular/common';
import { ChannelpartnerService } from './channelpartner.service';
export class reccuringSaleCSV {
  constructor(
    public Sale_Title: string,
    public Company_Name: string,
    public Customer_Name: any,
    public ChannelPartner: string,
    public Assigned_To: string,
  ) {

  }//for download as csv table
}
@Component({
  selector: 'app-custom-reports-channelpartner',
  templateUrl: './custom-reports-channelpartner.component.html',
  styleUrls: ['./custom-reports-channelpartner.component.scss']
})
export class CustomReportsChannelpartnerComponent implements OnInit,OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['saleTitle', 'companyName', 'firstName', 'additionalFieldDate','startDate','expCompletionDate','assignedTo']//header for mat table
  @ViewChild(MatPaginator) paginator: MatPaginator;//for mat table paginator
  @ViewChild(MatSort) sort: MatSort;//for mat table sort
  fieldNameContact: string = 'Contact';//field name for contact
  fieldNameSale: string = 'Sale';//field name for sales
  progressBarStatus: boolean = false; //progress bar status
  saleArray: Sales[]; //used in filter by priority function to hold sale data
  channelPartnerSales: Sales[];//to store sales having channel partner
  defaultSales:Sales[];//to store sale for current month with channel partner
  searchTerm: any;//search variable 
  viewSelected: any = ""//default value
  selectedDate2: any;//date 2 for applying filter
  datefilter:boolean=false;//check whether date toggle is applied
  indexOfChannelPartner: number;//to store index of index of channel partner
  csvData: any;//storing csv data 
  salesSubscription:Subscription//sales subscription
  selectedDate1: any;//date 1 for applying filter
  displayChannelPartnerSales: Sales[];//for storing current sales displaying
  documentsArray: MatTableDataSource<Sales>;//storing sales array for mat table
  userId: string = ''; //Logged in user's id
  superUserId: string = ''; //org level data is stored in the super user id (super user Id will be same as user Id for single user scenario)
  dataAccessRule: string = ''; //data accsess riule of logged in user
  private userDetailsSubscription: Subscription; //user data subscription from common service
  constructor(
    public networkCheck: NetworkCheckService,private db:ChannelpartnerService,
    public commonService: CommonService,
    private location: Location, private _snackBar: MatSnackBar
  ) { 
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          // fetched data assigning to local variables
          let data = allData.userDetails;
          this.userId = allData.userId;
          // disable Sale create and view
          this.userId = allData.userId;
          this.superUserId = allData.superUserDetails.superUserId;
          //get sales (saleslist will be according to the access rule)

          // this.progressBarStatus = true;

          //get super User data
          let superUserData = allData.superUserDetails;
          if (superUserData.fieldNames) {
            this.fieldNameContact = superUserData.fieldNames.fieldNameContact;
            this.fieldNameSale = superUserData.fieldNames.fieldNameSale;
          }
          let additionalSaleFields = allData.superUserDetails.customFieldsSale;
          //getting index of channel partner from additional field array
          additionalSaleFields?.forEach((val, index) => {
            // if (val.isActive) {
              if (val.fieldName == "Channel Partner" && val.fieldType == "category") {
                this.indexOfChannelPartner = index;
              }
            // }
          })
          this.channelPartnerSales = []

        
        }
      }
    );
      //defining mat table source
    this.documentsArray = new MatTableDataSource([]);

  }

  ngOnInit(): void {
  
    this.displayChannelPartnerSales = [];
    //getting all sales from super user id
    this.salesSubscription=this.db.getSales(this.superUserId)
    .subscribe((data) => {
      this.saleArray = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as Sales;
      });
   
      this.channelPartnerSales = []
      this.saleArray.forEach((sales) => {
        //getting sales with channel partner with index of channel partner
        if (sales.additionalFieldsArr[this.indexOfChannelPartner]?.fieldValue) {
          this.channelPartnerSales.push(sales)
        }
      })
      let displayArray=this.channelPartnerSales
      this.channelPartnerSales.forEach((val,i)=>{
        //adding channel partner to a new field for applying mat sort of mat table
        if(val.additionalFieldsArr[this.indexOfChannelPartner]?.fieldValue){
        displayArray[i].additionalFieldDate=val.additionalFieldsArr[this.indexOfChannelPartner]?.fieldValue;
      }
      })
      this.channelPartnerSales=displayArray;
      this.displayChannelPartnerSales=this.channelPartnerSales
      this.defaultSales=this.channelPartnerSales
      this.documentsArray.data = this.displayChannelPartnerSales
      this.progressBarStatus = true;
    })
    //setting default value to show data while clearing filter
    this.defaultSales=this.displayChannelPartnerSales
    this.documentsArray.data = this.displayChannelPartnerSales
  }
    //back button trigger
  onBack() {
    this.location.back();
  }
    //on defining paginator and sort
  ngAfterViewInit() {
    this.documentsArray.paginator = this.paginator;
    this.documentsArray.sort = this.sort;
  }
  @HostListener('window:beforeunload')
    //closing subscription on leaving
  ngOnDestroy() {
    this.userDetailsSubscription?.unsubscribe();
    this.salesSubscription?.unsubscribe();
  }
    //for applying date filter according to date
  onDate2(event){
    let firstDay: Date = new Date(this.selectedDate1)
    firstDay?.setHours(0, 0, 0, 0)
    let lastDay:Date= new Date(this.selectedDate2)
    lastDay?.setHours(23, 59, 59, 999);
     //checking by first and last date
    this.documentsArray.data = this.channelPartnerSales.filter(
      (ins) =>
        new Date(ins.createdDate) >= firstDay &&
        new Date(ins.createdDate) <= lastDay
    );
    this.displayChannelPartnerSales=this.documentsArray.data;
    this.datefilter = true;
  }
    //for download sales csv according to filter
  onDownloadAsCsv() {
    this.csvData = [];
    if (this.documentsArray.data.length) {
      this.documentsArray.data.forEach((data) => {
              //defining data in new array array of task for displaying in csv
        let secondName = data.secondName
        if (data.secondName == null) {
          secondName = " "
        }
        let arrayofTasks: reccuringSaleCSV = new reccuringSaleCSV(
          data.saleTitle,
          data.companyName,
          data.firstName + " " + secondName,
          data.additionalFieldsArr[this.indexOfChannelPartner]?.fieldValue,
          data.assignedToName,
        );
        this.csvData.push(arrayofTasks);
      });

      const replacer = (key, value) => (value === null ? '' : value);
      const header = Object.keys(this.csvData[0]);
      let csv = this.csvData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
            //setting data for csv
      var blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'channelPartnerSales.csv');
    }
    else {
      this._snackBar.open('No data to download', '', {
        duration: 2000,
      });
    }
  }
    //filter data according to text field 
  filter(query: string) {
    this.documentsArray.data = query
      ? this.channelPartnerSales.filter(
        (p) =>
          p.companyName.toLowerCase().includes(query.toLowerCase()) ||
          p.saleTitle.toLowerCase().includes(query.toLowerCase()) ||
          p.additionalFieldsArr[this.indexOfChannelPartner]?.fieldValue.toLowerCase().includes(query.toLowerCase())||
          (p.firstName + p.secondName).toLowerCase().includes(query.toLowerCase()))
      : this.channelPartnerSales;
  }
    //reset filters
  resetDate() {
    this.selectedDate1 = null;
    this.selectedDate2 = null;
    this.searchTerm = null;
      //setting default view by month
    this.documentsArray.data = this.defaultSales;
    this.viewSelected = "This Month";
    this.datefilter = false;

  }

}
