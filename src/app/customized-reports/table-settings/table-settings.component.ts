import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayColumn, ReportSettings } from 'src/app/data-models';
import { ReportServiceService } from '../report-view/report-service.service';

@Component({
  selector: 'app-table-settings',
  templateUrl: './table-settings.component.html',
  styleUrls: ['./table-settings.component.scss']
})
export class TableSettingsComponent implements OnInit {

  reportNo: string;
  columnsObj: DisplayColumn[]=[];
  reportSetting:ReportSettings
  userId:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private snackBar: MatSnackBar,private reportService:ReportServiceService) { }

  ngOnInit(): void {

    this.reportNo = this.data[1];
    this.columnsObj = this.data[0];
    this.reportSetting = this.data[2];
    this.userId = this.data[3];
    //removing additional field if it is removed from settings
    this.data[4]?.forEach((element,index) => {
      if(!element.isActive){
        for (var i = this.columnsObj?.length - 1; i >= 0; i--) {
          if (this.columnsObj[i]?.fieldType == 'Additional' && 
              this.columnsObj[i]?.columnDef == 'additionalFieldsArr['+index+'].fieldValue' && this.columnsObj[i]?.ind == index) {
              this.columnsObj?.splice(i, 1)
          }
        }
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsObj, event.previousIndex, event.currentIndex);
    //console.log(this.columnsObj)
  }
  savetoDB(){
    this.reportSetting.displayColumns = this.columnsObj;
    this.reportService.onSaveFilter(this.userId,this.reportNo,this.reportSetting);
    this.snackBar.open('Report table settings updated','',{duration:2500});
  }
}
