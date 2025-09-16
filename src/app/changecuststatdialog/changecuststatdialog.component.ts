/**********************************************************************************
Description: Component-confirmation popup- for updating the customer status, both in web and mobile
Inputs: Data from customer details - userid, users customer status array, particular customers id,
        customers current status, new to be updated status, current status history
Outputs:
**********************************************************************************/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangecuststatService } from './changecuststat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StageHistoryModel } from '../data-models';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { NetworkCheckService } from '../networkcheck.service';

@Component({
  selector: 'app-changecuststatdialog',
  templateUrl: './changecuststatdialog.component.html',
  styleUrls: ['./changecuststatdialog.component.scss'],
})
export class ChangecuststatdialogComponent implements OnInit {
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  }; //status model
  userId: string; //logged in users id
  custId: string; //particular customers id
  status: string; //newly updating status
  date: any; //saving for stage history
  stageHistories: Array<StageHistoryModel> = [];
  userStatusArray = []; //a customer status array is present under user
  customerStatus: string = null; //previous status of the particular customer
  customerStageHistory: Array<StageHistoryModel> = []; //satus history array
  fieldNameContact: string = 'Contact'; //custom field name
  inPipeline = false;
  won = false;
  lost = false;
  changeLogParams: any;
  rejectionReasonArr: string[] = []; //reason for rejection options stored as an array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
  rejectionReasonValue = ''; //variable to hold selected reason for rejection
  disableReAssign = false; //Update button disabled if reassigning/edit is disabled for logged in user
  rejectionReasonMandatory = false; //if reason for rejection is mandatory in settings
  rejectionReasonDisplay = false; //whether display or not reason for rejection field
  statusName = ''; //name of the status corresponding to this stageId
  pipelineId = 0; //corresponding pipeline
  from = '';
  statusFieldName = 'Status';

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ChangecuststatdialogComponent>,
    private service: ChangecuststatService,
    private _snackBar: MatSnackBar,
    public networkCheck: NetworkCheckService
  ) {
    let datePlaced = new Date().getTime();
    this.date = datePlaced; //current time is storing with new status
    // assigning the data sent to the component to the corresponding variable
    this.userId = data.userId; // super user id
    this.custId = data.custId; // customer id for which update has to be done
    this.status = data.status; // new status applied
    this.statusName = data.statusName; //assigning to local variable
    this.pipelineId = data.pipelineId;
    this.userStatusArray = data.custStatus; //Customer status array defined in the super user profile
    this.customerStatus = data.custDataStatus; //Current customer status prior to update
    this.customerStageHistory = data.custDataStageHistory; //Customer stage history
    this.fieldNameContact = data.fieldNameContact; //Contact name
    this.from = data.from;
    this.statusFieldName = data.statusFieldName;

    // assigning to local variables
    this.changeLogParams = data.changeLogParams;
    const rejArr = data.rejectionReasonArr?.filter((n) => n);

    if (!!rejArr && rejArr.length > 0) {
      this.rejectionReasonArr = rejArr;
      this.rejectionReasonArrPresent = true;
    } else {
      this.rejectionReasonArr[0] = 'No options are available';
      this.rejectionReasonArrPresent = false;
    }

    this.disableReAssign = data.disableReAssign;
    this.rejectionReasonMandatory = data.rejectionReasonMandatory;
    this.rejectionReasonDisplay = data.rejectionReasonDisplay;
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.status != this.customerStatus) {
      //If the customer status is changed, then update the customer status and stage history in database
      let datePlaced = new Date().getTime(); //Get TimeStamp
      let statusArray = this.userStatusArray;
      let currentHistory = this.customerStageHistory;

      this.stageValues.date = datePlaced;
      this.stageValues.stageId = this.status;
      this.stageValues.pipelineId = this.pipelineId;
      currentHistory.push(this.stageValues);
      this.stageHistories = currentHistory;

      let prevObj;
      let currObj;
      if (this.status === statusArray[statusArray.length - 1].stageId) {
        this.lost = true;
        this.won = false;
        this.inPipeline = false;
        prevObj = {
          status: this.changeLogParams.prevStatus,
          rejectionReasonVal: '',
        };
        currObj = {
          status: this.changeLogParams.curStatus,
          rejectionReasonVal: this.rejectionReasonValue,
        };
      } else if (this.status === statusArray[statusArray.length - 2].stageId) {
        this.lost = false;
        this.won = true;
        this.inPipeline = false;
        prevObj = { status: this.changeLogParams.prevStatus };
        currObj = { status: this.changeLogParams.curStatus };
      } else {
        this.lost = false;
        this.won = false;
        this.inPipeline = true;
        prevObj = { status: this.changeLogParams.prevStatus };
        currObj = { status: this.changeLogParams.curStatus };
      }
      this.service.updateContactStatus(
        this.userId,
        this.custId,
        this.status,
        this.stageHistories,
        datePlaced,
        this.inPipeline,
        this.won,
        this.lost,
        this.status === statusArray[statusArray.length - 1].stageId
          ? this.rejectionReasonValue
          : '',
        ChangeLogComponent.saveLog(
          this.changeLogParams.constructorName,
          this.changeLogParams.userId,
          this.changeLogParams.userName,
          prevObj,
          currObj,
          this.changeLogParams.changeLog
        )
      ); // call to update the details in db
    }
    this.dialogRef.close(true); // close the dialogue
    this._snackBar.open(this.fieldNameContact + ' ' + 'status updated!', '', {
      duration: 500,
    });
  }
  onCancel() {
    this.dialogRef.close(false); // close the dialogue
  }
}
