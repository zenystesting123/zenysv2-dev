import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsreportService } from './contactsreport.service';
import { CustomerModel } from './customers.model';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { saveAs } from 'file-saver';

export class ArrayCsv {
  constructor(
    public id: string,
    public status: string,
    public firstName: string,
    public secondName:string,
    public companyName: string,
    public dateCreated: any,
    public priority: string,
    public assignedToName: string,
    public custField1: string,
    public custField2 : string,
    public custField3:string,
    public custField4:string,
    public custCategory1:string,
    public custCategory2:string,
  ) {}
}

@Component({
  selector: 'app-contactsreport',
  templateUrl: './contactsreport.component.html',
  styleUrls: ['./contactsreport.component.scss'],
  providers: [DatePipe]
})
export class ContactsreportComponent implements OnInit {
  displayedColumns: string[] = ['status','firstName','companyName','dateCreated','priority','assignedToName','custField1Name','custField2Name','custField3Name','custField4Name','custCategory1Name','custCategory2Name'];
  customers:CustomerModel[]=[];
  customersOne:CustomerModel[]=[];
  customersTwo:CustomerModel[]=[];
  dataSource:any;
  selectedDate1: any = null;
  selectedDate2: any = null;
  filterArray1:CustomerModel[]=[];
  filterArray2:CustomerModel[]=[];
  userId:any;
  user:any;
  custCategory1Name:string;
  custCategory2Name:string;
  custField1Name:string;
  custField2Name:string;
  custField3Name:string;
  custField4Name:string;
  csvData:ArrayCsv[]=[];
  filter:string;

  @ViewChild(MatSort) sort?:MatSort;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private analytics: AngularFireAnalytics,
    private custReportService :ContactsreportService,
    private router:Router,
    private route:ActivatedRoute,
    private location:Location,
    private afAuth:AngularFireAuth,
    private datePipe: DatePipe
  ) { 
    this.user = this.afAuth.authState;
    this.user.subscribe(user=>{
      this.userId = user.uid;
      if(this.userId){
        this.custReportService.getNew('/users', this.userId).subscribe(p=>{
        this.custCategory1Name = p.custCategory1Name;
        this.custCategory2Name = p.custCategory2Name;
        this.custField1Name = p.custField1Name;
        this.custField2Name = p.custField2Name;
        this.custField3Name = p.custField3Name;
        this.custField4Name = p.custField4Name;
        })
      }
    })
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.custReportService.getCustomers(this.userId).subscribe(data=>{
      this.customers = data.map(e=>{
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as CustomerModel;
      })
      this.customersOne = this.customers;
      this.customersTwo = this.customers;
      this.dataSource = new MatTableDataSource([])
      this.dataSource.data=this.customers;        
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onBack(){
    this.location.back();
  }
  onDate1() {
    this.filterArray1=[];
    for (let i = 0; i < this.customersOne.length; i++) {
      if((new Date(this.customersOne[i].dateCreated).getTime()) >= (new Date(this.selectedDate1).getTime())){
        this.filterArray1.push(this.customersOne[i])
      }    
    }
    this.dataSource.data = this.filterArray1;
  }
  onDate2() {
    this.filterArray2=[];
    for (let i = 0; i < this.customersOne.length; i++) {
      if((new Date(this.customersOne[i].dateCreated).getTime()) <= (new Date(this.selectedDate2).getTime())){
        this.filterArray2.push(this.customersOne[i])
      }    
    }
    const filteredArray = this.filterArray1.filter(value => this.filterArray2.includes(value));
    this.dataSource.data = filteredArray
  }
  onReset(){
    this.dataSource.data = this.customers;
    this.selectedDate1 = '';
    this.selectedDate2 = '';
    this.dataSource.filter = '';
    this.filter = '';
  }

   logevent(){
    this.analytics.logEvent('Dahboard_Event');
  }
  onDownloadAsCsv(){
    this.csvData= [];
    this.customersTwo.forEach((data) => {
      let arrayofest: ArrayCsv = new ArrayCsv(
        data.id,
        data.status,
        data.firstName,
        data.secondName,
        data.companyName,
        this.datePipe.transform(data.dateCreated, 'yyyy-MM-dd'),
        data.priority,
        data.assignedToName,
        data.custField1Name,
        data.custField2,
        data.custField3,
        data.custField4,
        data.custCategory1,
        data.custCategory2,  
      );
      this.csvData.push(arrayofest);
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

    var blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'contacts_report.csv');
  }

  
}
