import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { AccountRequestService } from './account-request.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountrequestpopupComponent } from './accountrequestpopup/accountrequestpopup.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-account-request',
  templateUrl: './account-request.component.html',
  styleUrls: ['./account-request.component.scss']
})
export class AccountRequestComponent implements OnInit {
  filter:string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource:any
  displayedColumns: string[] = ['Name', 'id', 'dateRequested', 'dateApproved','requestStatus','rzrAccountId'];
  constructor(public serv:AccountRequestService,public dialog: MatDialog) { 
    this.serv.getAlltransferAccountrequests().subscribe((data)=>{
      console.log(data)
      this.dataSource=new MatTableDataSource<any>(data)
      this.dataSource.paginator = this.paginator;  
      this.dataSource.sort = this.sort;
    })
  }

  ngOnInit(): void {
  }
  open(data){
    console.log(data)
    const dialogRef = this.dialog.open(AccountrequestpopupComponent, {
      width: '500px',
      data: data
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onReset(){
    // this.dataSource.data = this.profiles;
    this.dataSource.filter = '';
    this.filter = '';
    // this.selectedDate1 = '';
    // this.selectedDate2 = '';
  } 
  

}
