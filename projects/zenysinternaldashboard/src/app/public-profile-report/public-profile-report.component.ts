import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PublicProfileReportService } from './public-profile-report.service';
import { PublicProfileModel } from './public-profile.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-public-profile-report',
  templateUrl: './public-profile-report.component.html',
  styleUrls: ['./public-profile-report.component.scss']
})
export class PublicProfileReportComponent implements OnInit {
  displayedColumns: string[] = ['id','userId','profileFirstname','profilePhone','category','profileDistrict','profileCountry'];
  profiles:PublicProfileModel[]=[];
  profilesOne:PublicProfileModel[]=[];
  profilesTwo:PublicProfileModel[]=[];
  dataSource:any;
  selectedDate1: any = null;
  selectedDate2: any = null;
  filterArray1:PublicProfileModel[]=[];
  filterArray2:PublicProfileModel[]=[];
  csvData:PublicProfileModel[]=[];
  newArray:PublicProfileModel[]=[];
  filter:string;

  @ViewChild(MatSort) sort?:MatSort;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private dataService : PublicProfileReportService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.dataService.getPublicProfileDetails().subscribe(data => {
      this.profiles = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as PublicProfileModel;
      })
      this.profilesOne = this.profiles;
      this.profilesTwo = this.profiles;
      this.dataSource = new MatTableDataSource([])
      this.dataSource.data=this.profiles;        
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
  onDownloadAsCsv(){
    this.csvData= [];
    this.profilesTwo.forEach((data) => {
      let arrayofest: PublicProfileModel = new PublicProfileModel(
        data.id,
        data.category,
        data.categoryOthers,
        data.profileDistrict,
        data.profileCountry,
        data.profileFirstname,
        data.profileLastname,
        data.profilePhone,
        data.userId  
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
    saveAs(blob, 'public_profile_report.csv');
  }
  
  // onDate1() {
  //   this.filterArray1=[];
  //   for (let i = 0; i < this.usersOne.length; i++) {
  //     if((new Date(this.usersOne[i].createdDate).getTime()) >= (new Date(this.selectedDate1).getTime())){
  //       this.filterArray1.push(this.usersOne[i])
  //     }    
  //   }
  //   this.dataSource.data = this.filterArray1;
  // }
  // onDate2() {
  //   this.filterArray2=[];
  //   for (let i = 0; i < this.usersOne.length; i++) {
  //     if((new Date(this.usersOne[i].createdDate).getTime()) <= (new Date(this.selectedDate2).getTime())){
  //       this.filterArray2.push(this.usersOne[i])
  //     }    
  //   }
  //   const filteredArray = this.filterArray1.filter(value => this.filterArray2.includes(value));
  //   this.dataSource.data = filteredArray
  // }

  // callContactreport(id:string){
  //   this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
  //     this.router.navigate(['zenysinternaldashboard/myDashboard/contacts-report', id])
  //   })
  // }
    onReset(){
    this.dataSource.data = this.profiles;
    this.dataSource.filter = '';
    this.filter = '';
    // this.selectedDate1 = '';
    // this.selectedDate2 = '';
  }

}
