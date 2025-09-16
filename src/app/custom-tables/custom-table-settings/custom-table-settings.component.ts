/*-----------------------------------------------
  Description :For handle custom table settings
  input data:column , user id and table name
  ---------------------------------------------------------------- */
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/common.service';
import { DisplayColumn } from 'src/app/data-models';
import { CustomTableSettingsService } from './custom-table-settings.service';
@Component({
  selector: 'app-custom-table-settings',
  templateUrl: './custom-table-settings.component.html',
  styleUrls: ['./custom-table-settings.component.scss']
})
export class CustomTableSettingsComponent implements OnInit {
  columnsObj: DisplayColumn[] = [];
  userId: string;
  disableSaveButton:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  @Optional() public dialogRef: MatDialogRef<CustomTableSettingsComponent>,
  private customTableSettingsService: CustomTableSettingsService, private snackBar: MatSnackBar,
              private commonService: CommonService) { }
  ngOnInit(): void {
    this.columnsObj = this.data.columndata;
    this.userId = this.data.userId;
    if(!this.commonService.userPlan.branchEnabled){
      this.columnsObj = this.columnsObj.filter(val => val.columnDef !== 'associatedBranch');
    }
    //removing additional field if it is removed from settings
    this.data.customFields?.forEach((element,index) => {
      if(!element.isActive){
        for (var i = this.columnsObj?.length - 1; i >= 0; i--) {
          if (this.columnsObj[i]?.fieldType == 'Additional' &&
              this.columnsObj[i]?.columnDef == element.fieldName && this.columnsObj[i]?.ind == index) {
              this.columnsObj?.splice(i, 1)
          }
        }
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsObj, event.previousIndex, event.currentIndex);
  }
  savetoDB() {
    this.disableSaveButton = true;
    let keyValuePair
    if (this.data.displayName == 'displayEstimateColumns') {
      keyValuePair = {
        displayEstimateColumns: this.columnsObj
      }
    } else if (this.data.displayName == 'displayInvoiceColumns') {
      keyValuePair = {
        displayInvoiceColumns: this.columnsObj
      }
    } else if (this.data.displayName == 'displayQuotationColumns') {
      keyValuePair = {
        displayQuotationColumns: this.columnsObj
      }
    } else if (this.data.displayName == 'displayCollectionColumns') {
      keyValuePair = {
        displayCollectionColumns: this.columnsObj
      }
    } else if (this.data.displayName == 'displayExpenseColumns') {
      keyValuePair = {
        displayExpenseColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayFollowupColumns') {
      keyValuePair = {
        displayFollowupColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayTaskColumns') {
      keyValuePair = {
        displayTaskColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayCustomerColumns') {
      keyValuePair = {
        displayCustomerColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displaySaleColumns') {
      keyValuePair = {
        displaySaleColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayServiceColumns') {
      keyValuePair = {
        displayServiceColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayOrgColumns'){
      keyValuePair = {
        displayOrgColumns
          : this.columnsObj
      }
    } else if (this.data.displayName == 'displayProductColumns'){
      keyValuePair = {
        displayProductColumns
          : this.columnsObj
      }
    }
    this.customTableSettingsService.updateDisplayColumn(this.userId, keyValuePair) .then((resp) => {
      this.dialogRef.close(keyValuePair);
      this.disableSaveButton = true;
    })
    this.snackBar.open('Settings updated', '', { duration: 2500 });
  }
}
