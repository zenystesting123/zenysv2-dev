import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { InquiriesModel } from './inquiries.model';
import { InquiriesService } from './inquiries.service';
import { saveAs } from 'file-saver';

export class ArrayCsv {
  constructor(
    public phone:string,
    public email:string,
    public message:string,
    public date:string,
    public status:string,
    public profileFname:string,
    public profileSname:string,
    public profileCompany:string,
    public profileDistrict:string,
    public profileState:string,
    public profileEmail:string,
    public profilePhone:string
  ) {}
}

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.scss'],
  providers: [DatePipe]
})
export class InquiriesComponent implements OnInit {
  displayedColumns: string[] = [ 'phone', 'email', 'message', 'date', 'status', 'profileFname', 'profileEmail', 'profilePhone', 'profileDistrict', 'profileState'];
  inquiries:InquiriesModel[]=[];
  inquiriesOne:InquiriesModel[]=[];
  inquiriesTwo:InquiriesModel[]=[];
  dataSource:any;
  selectedDate1: any = null;
  selectedDate2: any = null;
  filterArray1:InquiriesModel[]=[];
  filterArray2:InquiriesModel[]=[];
  userId:any;
  user:any;
  csvData:ArrayCsv[]=[];
  filter:string;

  @ViewChild(MatSort) sort?:MatSort;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private afAuth:AngularFireAuth, 
    private serviceInst:InquiriesService,
    private location:Location,
    private datePipe:DatePipe
    ) {
    this.user = this.afAuth.authState;
    this.user.subscribe(user=>{
      this.userId = user.uid;
      if(this.userId){
        this.serviceInst.getInquires()
        .subscribe(data => {
          this.inquiries= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as InquiriesModel;  
          })
          this.inquiriesOne = this.inquiries;
          this.inquiriesTwo = this.inquiries;
          this.dataSource = new MatTableDataSource([])
          this.dataSource.data=this.inquiries;        
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    })
   }

  ngOnInit(): void {
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
    for (let i = 0; i < this.inquiriesOne.length; i++) {
      if((new Date(this.inquiriesOne[i].date).getTime()) >= (new Date(this.selectedDate1).getTime())){
        this.filterArray1.push(this.inquiriesOne[i])
      }    
    }
    this.dataSource.data = this.filterArray1;
  }
  onDate2() {
    this.filterArray2=[];
    for (let i = 0; i < this.inquiriesOne.length; i++) {
      if((new Date(this.inquiriesOne[i].date).getTime()) <= (new Date(this.selectedDate2).getTime())){
        this.filterArray2.push(this.inquiriesOne[i])
      }    
    }
    const filteredArray = this.filterArray1.filter(value => this.filterArray2.includes(value));
    this.dataSource.data = filteredArray
  }
  onReset(){
    this.dataSource.data = this.inquiries;
    this.selectedDate1 = '';
    this.selectedDate2 = '';
    this.dataSource.filter = '';
    this.filter = '';
  }
  onDownloadAsCsv(){
    this.csvData= [];
    this.inquiriesTwo.forEach((data) => {
      let arrayofest: ArrayCsv = new ArrayCsv(
        data.phone,
        data.email,
        data.message, 
        new Date(data.date).toLocaleString(),
        data.status, 
        data.profileFname,
        data.profileSname,
        data.profileEmail,
        data.profilePhone,
        data.profileCompany,
        data.profileDistrict,
        data.profileState,
        
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
    saveAs(blob, 'inquiries_report.csv');
  }
}
