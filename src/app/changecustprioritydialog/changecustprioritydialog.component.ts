/**********************************************************************************
Description:A Confirmation popup Component for updating the customer priority
              in web and mobile
Inputs: data from customer-details - loggedinusers id, particular customer id, priority to be updated,
        customisable field names 
Outputs: 
**********************************************************************************/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { CommonService } from '../common.service';
import { ChangecustpriorityService } from './changecustpriority.service';

@Component({
  selector: 'app-changecustprioritydialog',
  templateUrl: './changecustprioritydialog.component.html',
  styleUrls: ['./changecustprioritydialog.component.scss'],
})
export class ChangecustprioritydialogComponent implements OnInit {
  // this component is used as a confirmation popup to update contact priority
  userId: string; //loggedin users id
  custId: string; //contact id
  priority: string; //priority
  fieldNameContact: string = 'Contact'; //custom field name
  changeLogParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ChangecustprioritydialogComponent>,
    private service: ChangecustpriorityService,
    private _snackBar: MatSnackBar,
    public commonService: CommonService
  ) {
    // data is assigning to local variables
    this.userId = data.userId;
    this.custId = data.custId;
    this.priority = data.priority;
    this.fieldNameContact = data.fieldNameContact;
    this.changeLogParams = data.changeLogParams;
  }

  ngOnInit(): void {}
  // updating priority function
  onSubmit() {
    this.dialogRef.close(); // close the dialogue
    //write to DB
    this.service.updateContactPriority(this.userId, this.custId, {
      priority: this.priority,
      lastModifiedDate: new Date().getTime(),
      changeLog: ChangeLogComponent.saveLog(
        this.changeLogParams.constructorName,
        this.changeLogParams.userId,
        this.changeLogParams.userName,
        { priority: this.changeLogParams.prevPriority },
        { priority: this.changeLogParams.curPriority },
        this.changeLogParams.changeLog
      )
    });
    this._snackBar.open(this.fieldNameContact + ' ' + 'priority updated!', '', {
      duration: 500,
    });
  }
  // click cancel to close dialog
  onCancel() {
    this.dialogRef.close(); // close the dialogue
  }
}
