import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserModel } from './user.model';
import { UserinfoService } from './userinfo.service';
import { saveAs } from 'file-saver';

export class ArrayCsv {
  constructor(
    public id: string,
    public email : string,
    public firstname : string,
    public lastname : string,
    public countryCode:string,
    public phone : number,
    public category : string,
    public categoryOthers : string,
    public createdDate : string,
    public profileCompletionStatus : boolean,
    public plan : string
  ) {}
}

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
  providers: [DatePipe]
})
export class UserinfoComponent implements OnInit {
  displayedColumns: string[] = ['id','email','firstname', 'phone','category','createdDate','profileCompletionStatus','plan','actions'];
  users:UserModel[]=[];
  usersOne:UserModel[]=[];
  usersTwo:UserModel[]=[];
  dataSource:any;
  selectedDate1: any = null;
  selectedDate2: any = null;
  filterArray1:UserModel[]=[];
  filterArray2:UserModel[]=[];
  csvData:ArrayCsv[]=[];
  filter:string;

  @ViewChild(MatSort) sort?:MatSort;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private dataService:UserinfoService,
    private router:Router,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as UserModel;
      })
      this.usersOne = this.users;
      this.usersTwo = this.users;
      this.dataSource = new MatTableDataSource([])
      this.dataSource.data=this.users;        
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onDate1() {
    this.filterArray1=[];
    for (let i = 0; i < this.usersOne.length; i++) {
      if((new Date(this.usersOne[i].createdDate).getTime()) >= (new Date(this.selectedDate1).getTime())){
        this.filterArray1.push(this.usersOne[i])
      }    
    }
    this.dataSource.data = this.filterArray1;
  }
  onDate2() {
    this.filterArray2=[];
    for (let i = 0; i < this.usersOne.length; i++) {
      if((new Date(this.usersOne[i].createdDate).getTime()) <= (new Date(this.selectedDate2).getTime())){
        this.filterArray2.push(this.usersOne[i])
      }    
    }
    const filteredArray = this.filterArray1.filter(value => this.filterArray2.includes(value));
    this.dataSource.data = filteredArray
  }
  onReset(){
    this.dataSource.data = this.users;
    this.selectedDate1 = '';
    this.selectedDate2 = '';
    this.dataSource.filter = '';
    this.filter = '';
  }
  callContactreport(id:string){
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['zenysinternaldashboard/myDashboard/contacts-report', id])
    })
  }
  onDownloadAsCsv(){
    this.csvData= [];
    this.usersTwo.forEach((data) => {
      let arrayofest: ArrayCsv = new ArrayCsv(
        data.id,
        data.email,
        data.firstname,
        data.lastname,
        data.countryCode,
        data.phone,
        data.category,
        data.categoryOthers,
        this.datePipe.transform(data.createdDate, 'yyyy-MM-dd'),
        data.profileCompletionStatus,
        data.plan,  
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
    saveAs(blob, 'users_report.csv');
  }
}
