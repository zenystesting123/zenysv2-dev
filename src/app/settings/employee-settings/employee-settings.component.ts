import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { EmployeeSettingsService } from './employee-settings.service';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss'],
})
export class EmployeeSettingsComponent implements OnInit {
  progressBarStatus = false;
  disableSett = false;
  userDetailsSubscription: Subscription;
  superUserId = '';
  employeePrefix = '';
  employeeNoInit: number = null;
  prevEmployeePrefix = '';
  prevEmployeeNoInit: number = null;
  isEditMode = false;
  temp1Click = false; //checkbox on template 1
  temp2Click = false; //checkbox on template 2
  superuserDetails = null;

  constructor(
    private location: Location,
    public commonService: CommonService,
    private serviceInstance: EmployeeSettingsService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData.usrProfileData.isCheckedSett == false) {
          this.disableSett = true;
          this.progressBarStatus = true;
        } else {
          if (allData.usrProfileData.settView == false) {
            this.disableSett = true;
            this.progressBarStatus = true;
          } else {
            this.disableSett = false;
          }
        }
        if (this.disableSett == false) {
          this.superUserId = allData.userDetails.superUserId;
          this.superuserDetails = allData.superUserDetails;
          if (this.superuserDetails.employeePrefix) {
            this.employeePrefix = this.superuserDetails.employeePrefix;
            this.prevEmployeePrefix = this.superuserDetails.employeePrefix;
          }
          if (this.superuserDetails.employeeNoInit) {
            this.employeeNoInit = this.superuserDetails.employeeNoInit;
            this.prevEmployeeNoInit = this.superuserDetails.employeeNoInit;
          }
          if (this.superuserDetails.employeeIDTemp) {
            if (this.superuserDetails.employeeIDTemp == 'template1') {
              this.temp1Click = true;
              this.temp2Click = false;
            } else if (this.superuserDetails.employeeIDTemp == 'template2') {
              this.temp1Click = false;
              this.temp2Click = true;
            }
          }
          this.progressBarStatus = true;
        }
      }
    );
  }

  empSettChanged() {
    this.serviceInstance
      .updateEmpSett(this.superUserId, this.employeePrefix, this.employeeNoInit)
      .then((res) => {
        this.snack.open('Settings updated!', '', {
          duration: 2000,
        });
        this.isEditMode = false;
      });
  }
  onBack() {
    this.location.back();
  }
  onEdit() {
    this.isEditMode = true;
  }
  onCancel() {
    this.employeeNoInit = this.prevEmployeeNoInit;
    this.employeePrefix = this.prevEmployeePrefix;
    this.isEditMode = false;
  }
  mouseEnter1(div) {
    this.temp1();
  }
  mouseEnter2(div) {
    this.temp2();
  }
  temp1() {
    const dialogRef = this.dialog.open(TempSelected, {

      data: {
        template: 'template1',
      },
    });
    dialogRef
      .afterClosed()
      // .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if(typeof result === 'undefined'){

          if (this.superuserDetails.employeeIDTemp == 'template1') {
            this.temp1Click = true;
            this.temp2Click = false;
          } else if (this.superuserDetails.employeeIDTemp == 'template2') {
            this.temp1Click = false;
            this.temp2Click = true;
          }
        }else if (result) {
          if (result == 'template1') {
            this.temp1Click = true;
            this.temp2Click = false;
            // update to DB under superUser
            this.serviceInstance.updateEmpIDTemp(this.superUserId, result);
            this.snack.open('Vertical Template selected!', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  temp2() {
    const dialogRef = this.dialog.open(TempSelected, {
      data: {
        template: 'template2',
      },
    });
    dialogRef
      .afterClosed()
      // .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if(typeof result === 'undefined'){

          if (this.superuserDetails.employeeIDTemp == 'template1') {
            this.temp1Click = true;
            this.temp2Click = false;
          } else if (this.superuserDetails.employeeIDTemp == 'template2') {
            this.temp1Click = false;
            this.temp2Click = true;
          }
        }else if (result) {
          if (result == 'template2') {
            this.temp1Click = false;
            this.temp2Click = true;
            // update to DB under superUser
            this.serviceInstance.updateEmpIDTemp(this.superUserId, result);
            this.snack.open('Horizontal Template selected!', '', {
              duration: 2000,
            });
          }
        }
      });
  }
}
@Component({
  selector: 'temp-selected',
  templateUrl: 'temp-selected.html',
  styleUrls: ['./employee-settings.component.scss'],
})
export class TempSelected {
  template1 = 'template1';
  template2 = 'template2';

  constructor(
    public dialogRef: MatDialogRef<TempSelected>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    // console.log(this.data.template);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
