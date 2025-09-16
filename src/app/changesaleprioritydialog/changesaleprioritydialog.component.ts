/**********************************************************************************
Description:A Confirmation popup Component for updating the customer priority
              in web and mobile
Inputs: data from sale-details - loggedinusers id, particular sale id, priority to be updated,
        customisable field names 
Outputs: 
**********************************************************************************/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { ChangesalepriorityService } from './changesalepriority.service';

@Component({
  selector: 'app-changesaleprioritydialog',
  templateUrl: './changesaleprioritydialog.component.html',
  styleUrls: ['./changesaleprioritydialog.component.scss'],
})
export class ChangesaleprioritydialogComponent implements OnInit {
  // popup com[ponent to confoirm salew priority updation
  // both in web and mobile

  userId: string = ''; //logged in users id
  saleId: string = ''; //particular sale id
  priority: string = ''; //to be updated priority
  fieldNameSale: string = 'Sale'; //customisable field name
  changeLogParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ChangesaleprioritydialogComponent>,
    private service: ChangesalepriorityService,
    private _snackBar: MatSnackBar
  ) {
    // assigning injecting data to local variables
    this.userId = data.userId;
    this.saleId = data.saleId;
    this.priority = data.priority;
    this.fieldNameSale = data.fieldNameSale;
    this.changeLogParams = data.changeLogParams;
  }

  ngOnInit(): void {}

  // on submitting update selected priority to DB
  onSubmit() {
    this.dialogRef.close(); // close the dialogue
    // write to DB
    this.service.updateSalePriority(this.userId, this.saleId, {
      priority: this.priority,
      lastModifiedDate: new Date().getTime(),
      changeLog: ChangeLogComponent.saveLog(
        this.changeLogParams.constructorName,
        this.changeLogParams.userId,
        this.changeLogParams.userName,
        { priority: this.changeLogParams.prevPriority },
        { priority: this.changeLogParams.curPriority },
        this.changeLogParams.changeLog
      ),
    });
    this._snackBar.open(this.fieldNameSale + ' ' + 'priority updated!', '', {
      duration: 500,
    });
  }
  onCancel() {
    this.dialogRef.close(); // close the dialogue
  }
}
