/*********************************************************************************
Description: component used for adding/editing/deleteing status and pipelines of customer
Inputs: datas from customer settings
Outputs:
***********************************************************************************/
import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { PipelineAndStagesService } from './pipeline-and-stages.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Customer,
  Sales,
  Service,
  modules,
  pipelineNameLength,
} from 'src/app/data-models';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PipelineStages, Pipelines } from 'src/app/model/pipeline.modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from 'src/app/common.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-pipeline-and-stages',
  templateUrl: './pipeline-and-stages.component.html',
  styleUrls: ['./pipeline-and-stages.component.scss'],
})
export class PipelineAndStagesComponent implements OnInit {
  @Input() module: string; // module customers/sale/support
  @Input() superUserId: string; // super user id
  @Input() superUserDetails; // super user details
  @Input() pipelines; // pipelines
  mergedPipelineArray = []; //newly created array with pipelines details
  maxLength = pipelineNameLength.PIPELINE_NAME_LENGTH; //maximum character length for pipeline names
  @Input() ageChecked: boolean = false; //whether age check enabled/disabled
  @Input() fieldName; //fieldname for contact
  @Input() statusFieldName; //field name for status
  @Input() pipelineFieldName; //fieldname for piepline
  @Input() multiPipelineAccess; //if multipieline accsess is there/not
  disableAddPipelineBtn = false; // to disable add pipeline button
  @Input() userId = ''; //userId of current logged in user
  @Input() userName = ''; //userName of current logged in user
  @Input() rejectionReasonArr: Array<string> = []; //rejection reason array saved under superuser details;
  @Input() mandatoryBoolean = false; //if reason for rejection is configured as mandatory under settings
  @Input() displayBoolean = false; //whether to display reason for rejection as configured under settings

  constructor(
    public networkCheck: NetworkCheckService,
    private db: PipelineAndStagesService,
    private snack: MatSnackBar,
    public dialog: MatDialog,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.mergedPipelineArray = this.pipelines.map((v) => ({
      ...v,
      editPipelineName: false,
      display: this.multiPipelineAccess
    }));
    if(!this.multiPipelineAccess){
      this.mergedPipelineArray[0].display = true;
    }
    // if pipeline array limit exceeds max plan limitr, disable add button
    if (
      this.mergedPipelineArray.length >=
      this.commonService.userPlan.maxPipelineLimit
    ) {
      this.disableAddPipelineBtn = true;
    }
  }

  // number id for pipeline generate fn
  returnUuidFn() {
    return Math.floor(Date.now() * Math.random());
  }

  // mat-checkbox function to enable/disable ageing
  ageValueChange(event) {
    if (this.module === 'Customer') {
      this.db.updateCustomerAgeActive(this.superUserId, event.checked);
    } else if (this.module === modules.sales) {
      this.db.updateSaleAgeActive(this.superUserId, event.checked);
    } else if (this.module === 'Service') {
      this.db.updateServiceAgeActive(this.superUserId, event.checked);
    }
  }

  // add new pipeline
  addNewPipeline() {
    this.disableAddPipelineBtn = true;
    let newPipeline: Pipelines;
    if (this.module === 'Customer') {
      newPipeline = {
        pipelineName: 'PipeLine Name',
        pipelineId: this.returnUuidFn(),
        pipelineStages: [
          {
            name: 'Lead',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Prospect',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Opportunity',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Customer-Won',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Lost/Rejected',
            age: 5,
            stageId: uuidv4(),
          },
        ],
      };
    } else if (this.module === modules.sales) {
      newPipeline = {
        pipelineName: 'PipeLine Name',
        pipelineId: this.returnUuidFn(),
        pipelineStages: [
          {
            name: 'Inquiry',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Opportunity',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Confirmed',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Sale-Completed',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Lost/Dropped',
            age: 5,
            stageId: uuidv4(),
          },
        ],
      };
    } else if (this.module === 'Service') {
      newPipeline = {
        pipelineName: 'PipeLine Name',
        pipelineId: this.returnUuidFn(),
        pipelineStages: [
          {
            name: 'New',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Waiting on Contact',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Waiting on us',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Completed',
            age: 5,
            stageId: uuidv4(),
          },
          {
            name: 'Lost/Dropped',
            age: 5,
            stageId: uuidv4(),
          },
        ],
      };
    }
    const dialogRef = this.dialog.open(ChildPipelineAndStages, {
      disableClose: true,
      width: '400px',
      data: {
        type: 'addNewPipeline',
        pipelineName: newPipeline.pipelineName,
        pipelineFieldName: this.pipelineFieldName,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        newPipeline.pipelineName = response;
        this.pipelines.splice(this.pipelines.length, 0, newPipeline);
        this.db
          .updatePipeLinenames(this.superUserId, this.module, this.pipelines)
          .then((resp) => {
            this.snack.open('Successfully updated', '', {
              duration: 2000,
            });
            // if pipeline array limit exceeds max plan limitr, disable add button
            if (
              this.mergedPipelineArray.length >=
              this.commonService.userPlan.maxPipelineLimit
            ) {
              this.disableAddPipelineBtn = true;
            } else {
              this.disableAddPipelineBtn = false;
            }
          });
      } else {
        this.disableAddPipelineBtn = false;
      }
    });
  }

  // pipeline delete function
  async deletePipeLine(pipeline, i) {
    if (this.module === 'Customer') {
      let customers = await this.db.getContactsWithPipeline(
        this.superUserId,
        pipeline.pipelineId
      );
      if (customers?.length > 0) {
        this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'deletePipeline',
            mode: this.module,
            dataLength: customers.length,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
      } else {
        const dialogRef = this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'delete_Pipeline',
            mode: this.module,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.pipelines.splice(i, 1);
            this.db
              .updatePipeLinenames(
                this.superUserId,
                this.module,
                this.pipelines
              )
              .then((resp) => {
                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
                // if pipeline array limit exceeds max plan limitr, disable add button
                if (
                  this.mergedPipelineArray.length >=
                  this.commonService.userPlan.maxPipelineLimit
                ) {
                  this.disableAddPipelineBtn = true;
                } else {
                  this.disableAddPipelineBtn = false;
                }
              });
          }
        });
      }
    } else if (this.module === modules.sales) {
      let sales = await this.db.getSalesWithPipeline(
        this.superUserId,
        pipeline.pipelineId
      );
      if (sales?.length > 0) {
        this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'deletePipeline',
            mode: this.module,
            dataLength: sales.length,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
      } else {
        const dialogRef = this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'delete_Pipeline',
            mode: this.module,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.pipelines.splice(i, 1);
            this.db
              .updatePipeLinenames(
                this.superUserId,
                this.module,
                this.pipelines
              )
              .then((resp) => {
                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
                 // if pipeline array limit exceeds max plan limitr, disable add button
                 if (
                  this.mergedPipelineArray.length >=
                  this.commonService.userPlan.maxPipelineLimit
                ) {
                  this.disableAddPipelineBtn = true;
                } else {
                  this.disableAddPipelineBtn = false;
                }
              });
          }
        });
      }
    } else if (this.module === 'Service') {
      let services = await this.db.getServicesWithPipeline(
        this.superUserId,
        pipeline.pipelineId
      );
      if (services?.length > 0) {
        this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'deletePipeline',
            mode: this.module,
            dataLength: services.length,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
      } else {
        const dialogRef = this.dialog.open(ChildPipelineAndStages, {
          disableClose: true,
          width: '400px',
          data: {
            type: 'delete_Pipeline',
            mode: this.module,
            pipelineName: pipeline.pipelineName,
            pipelineFieldName: this.pipelineFieldName,
            fieldName: this.fieldName,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.pipelines.splice(i, 1);
            this.db
              .updatePipeLinenames(
                this.superUserId,
                this.module,
                this.pipelines
              )
              .then((resp) => {
                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
                 // if pipeline array limit exceeds max plan limitr, disable add button
                 if (
                  this.mergedPipelineArray.length >=
                  this.commonService.userPlan.maxPipelineLimit
                ) {
                  this.disableAddPipelineBtn = true;
                } else {
                  this.disableAddPipelineBtn = false;
                }
              });
          }
        });
      }
    }
  }

  //pipeline name edit enabling function
  editpipelinename(pipeline) {
    pipeline.editPipelineName = true;
  }

  //clear button function in pipeline name
  clearpipelinename(pipeline, i) {
    pipeline.pipelineName = this.pipelines[i].pipelineName;
    pipeline.editPipelineName = false;
  }

  // save edited pipeline name to DB
  savepipelinename(i, name) {
    this.pipelines[i].pipelineName = name;
    this.db
      .updatePipeLinenames(this.superUserId, this.module, this.pipelines)
      .then((resp) => {
        // if (this.dataAccessRule != 'All') {
        //   pipeline.editPipelineName = false;
        // }
        this.snack.open('Successfully updated', '', {
          duration: 2000,
        });
      });
  }

  //triggered while dragging and dropping /rearranging the current status
  drop(event: CdkDragDrop<any[]>, index) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const statusArray = event.container.data;
      let pipelines = this.pipelines;
      pipelines[index].pipelineStages = statusArray;

      this.db
        .updatePipeLinenames(this.superUserId, this.module, this.pipelines)
        .then((resp) => {
          this.snack.open('Successfully updated', '', {
            duration: 2000,
          });
        });
    }
  }

  // add new pipeline status
  addPipelineStatus(pipeline, i) {
    //pass value to StatusPopup component having text field to add new status
    this.dialog.open(ChildPipelineAndStages, {
      disableClose: true,
      width: '400px',
      data: {
        type: 'add',
        superUserId: this.superUserId,
        statusArray: pipeline.pipelineStages,
        mode: this.module,
        pipelineIndex: i,
        fieldName: this.fieldName,
        statusFieldName: this.statusFieldName,
        allPipelines: this.pipelines,
        ageChecked: this.ageChecked,
      },
    });
  }

  // edit already saved pipeline status
  edit_pipeline_status(pipeline, item, showAge, i, k) {
    //passing status values into StatusPopup component having text field to edit
    this.dialog.open(ChildPipelineAndStages, {
      disableClose: true,
      width: '400px',
      data: {
        type: 'edit',
        superUserId: this.superUserId,
        statusArray: pipeline.pipelineStages,
        statusIndex: k,
        statusName: item.name,
        statusAge: item.age,
        ageChecked: showAge ? this.ageChecked : false,
        mode: this.module,
        pipelineIndex: i,
        fieldName: this.fieldName,
        statusFieldName: this.statusFieldName,
        allPipelines: this.pipelines,
      },
    });
  }

  // delete pipeline status
  deletePipelineStatus(pipeline, item, i, k) {
    //passing status values into StatusPopup component to confirmation
    this.dialog.open(ChildPipelineAndStages, {
      disableClose: true,
      width: '400px',
      data: {
        type: 'delete',
        superUserId: this.superUserId,
        statusArray: pipeline.pipelineStages,
        statusIndex: k,
        statusName: item.name,
        statusAge: item.age,
        mode: this.module,
        pipelineIndex: i,
        fieldName: this.fieldName,
        statusFieldName: this.statusFieldName,
        allPipelines: this.pipelines,
        pipelineId: pipeline.pipelineId,
        statusId: item.stageId,
        userId: this.userId,
        userName: this.userName,
        rejectionReasonArr: this.rejectionReasonArr,
        mandatoryBoolean: this.mandatoryBoolean,
        displayBoolean: this.displayBoolean,
      },
    });
  }
}
// Child component
@Component({
  selector: 'child-pipeline-and-stages',
  templateUrl: 'child-pipeline-and-stages.html',
  styleUrls: ['./pipeline-and-stages.component.scss'],
})
export class ChildPipelineAndStages {
  inputData: any; //data from parent component
  editedStatus: string = ''; //to store latest edited status value
  editedStatusAge: number = 5; //to store latest edited status value
  addedStatus: string = ''; //to store latest edited status value
  addedStatusAge: number = 5; //to store latest edited status value
  updatingDb = false; //loader while DB updation
  statusArray: PipelineStages[] = []; //status arrya of selected pipeline
  pipelines: Pipelines[] = []; //pipelines stored under usert
  customers: Customer[] = []; //customers with this pipeline/status
  services: Service[] = []; //services with this pipeline/status
  sales: Sales[] = []; //sales with this pipeline/status
  disableButton = false; //disable Delete button of Delete Status confirmation popup
  disableCancelBtn = false; //while updating in DB after delte stgaes, cancel button to disable
  selectedStatus = ''; //newly selected status while deleting status
  statusArrayToDisplay: PipelineStages[] = []; //while deleting status, create an array without the status
  uploadProgress = 0; //while status deleting to show progress
  rejectionReasonValue = ''; //if lost/rejected status is selected while deleting status

  constructor(
    public dialogRef: MatDialogRef<ChildPipelineAndStages>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snack: MatSnackBar,
    private db: PipelineAndStagesService,
    public commonService: CommonService
  ) {
    // data to local variable assigning
    this.inputData = data;
    this.editedStatus = data.statusName;
    this.editedStatusAge = data.statusAge;
    this.statusArray = this.inputData.statusArray;
    this.pipelines = this.inputData.allPipelines;

    if (this.inputData.type == 'delete') {
      this.disableButton = true;
      this.statusArrayToDisplay = JSON.parse(
        JSON.stringify(this.inputData.statusArray)
      );
      this.statusArrayToDisplay.splice(this.inputData.statusIndex, 1);
      if (this.inputData.mode == 'Customer') {
        this.checkCustomers();
      } else if (this.inputData.mode == modules.sales) {
        this.checkSales();
      } else if (this.inputData.mode == 'Service') {
        this.checkServices();
      }
    }
  }
  // function to check if customers are present in the current status
  async checkCustomers() {
    this.customers = await this.db.getContactsWithStatus(
      this.data.superUserId,
      this.inputData.pipelineId,
      this.inputData.statusId
    );

    if (!!this.customers) {
      if (this.customers.length > 0) {
        this.disableButton = true;
      } else {
        this.disableButton = false;
      }
    }
  }

  // function to check if customers are present in the current status
  async checkSales() {
    this.sales = await this.db.getSalesWithStatus(
      this.data.superUserId,
      this.inputData.pipelineId,
      this.inputData.statusId
    );

    if (!!this.sales) {
      if (this.sales.length > 0) {
        this.disableButton = true;
      } else {
        this.disableButton = false;
      }
    }
  }

  // function to check if services are present in the current status
  async checkServices() {
    this.services = await this.db.getServicesWithStatus(
      this.data.superUserId,
      this.inputData.pipelineId,
      this.inputData.statusId
    );

    if (!!this.services) {
      if (this.services.length > 0) {
        this.disableButton = true;
      } else {
        this.disableButton = false;
      }
    }
  }

  // to enable delete button of delete status popup only if a new status is selected
  eventSelection() {
    if (!!this.selectedStatus) {
      if (
        this.selectedStatus !==
        this.statusArray[this.statusArray.length - 1].stageId
      ) {
        this.disableButton = false;
      } else {
        if (this.inputData.mandatoryBoolean === true) {
          this.disableButton = true;
        } else {
          this.disableButton = false;
        }
      }
    }
  }

  // if lost/rejected status is selected, and if it is mandatory
  reasonSelection() {
    if (
      this.selectedStatus ===
        this.statusArray[this.statusArray.length - 1].stageId &&
      this.inputData.mandatoryBoolean === true &&
      !!this.rejectionReasonValue
    ) {
      this.disableButton = false;
    }
  }

  // Cancel button function
  onNoClick(): void {
    this.dialogRef.close();
  }

  // add new pipeline stage
  addPipelineStage() {
    this.disableButton = true;
    this.updatingDb = true;
    let length = this.statusArray.length - 2;
    let addStatus = {
      name: this.addedStatus,
      age: this.addedStatusAge,
      stageId: uuidv4(),
    };
    //inserting new status into status array
    this.statusArray.splice(length, 0, addStatus);
    this.pipelines[this.inputData.pipelineIndex].pipelineStages =
      this.statusArray;
    this.db
      .updatePipeLinenames(
        this.inputData.superUserId,
        this.inputData.mode,
        this.pipelines
      )
      .then((resp) => {
        this.snack.open('Successfully updated', '', {
          duration: 2000,
        });
        this.dialogRef.close();
        this.updatingDb = false;
      });
  }

  // update a pipeline stage
  updatePipelineStage() {
    this.disableButton = true;
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.statusIndex].name = this.editedStatus;
    this.statusArray[this.inputData.statusIndex].age = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.statusName ||
      this.editedStatusAge != this.inputData.statusAge
    ) {
      this.pipelines[this.inputData.pipelineIndex].pipelineStages =
        this.statusArray;
      if (this.inputData.type == 'edit') {
        this.db
          .updatePipeLinenames(
            this.inputData.superUserId,
            this.inputData.mode,
            this.pipelines
          )
          .then((resp) => {
            this.snack.open('Successfully updated', '', {
              duration: 2000,
            });
            this.dialogRef.close();
            this.updatingDb = false;
          });
      }
    } else {
      this.updatingDb = false;
      this.disableButton = false;
      this.dialogRef.close();
    }
  }

  // delete a pipeline stage
  async deletePipelineStage() {
    this.disableCancelBtn = true;
    this.disableButton = true;
    this.updatingDb = true;
    let inPipeline: boolean;
    let lost: boolean;
    let won: boolean;
    let prevObj;
    let currObj;

    // changing status at custo,mers
    if (this.inputData.mode == 'Customer' && this.customers.length > 0) {
      for (let i = 0; i < this.customers.length; i++) {
        // stageHistory to update
        let currentHistory = this.customers[i].stageHistory;
        let newHistory = {
          date: new Date().getTime(),
          stageId: this.selectedStatus,
          pipelineId: this.inputData.pipelineId,
        };
        currentHistory.push(newHistory);
        let stageHistory = currentHistory;

        // inPipeline, won, lost and changelog to update
        let changeLogParams = {
          constructorName: this.constructor.name,
          userId: this.inputData.userId,
          userName: this.inputData.userName,
          prevStatus: this.inputData.statusName,
          curStatus: this.commonService.getStatusName(
            modules.customers,
            this.inputData.pipelineId,
            this.selectedStatus
          ),
          changeLog: this.customers[i].changeLog,
        };

        if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          lost = true;
          won = false;
          inPipeline = false;
          prevObj = {
            status: changeLogParams.prevStatus,
            rejectionReasonVal: '',
          };
          currObj = {
            status: changeLogParams.curStatus,
            rejectionReasonVal: this.rejectionReasonValue,
          };
        } else if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          lost = false;
          won = true;
          inPipeline = false;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        } else {
          lost = false;
          won = false;
          inPipeline = true;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        }

        await this.db
          .updateStatusInContacts(
            this.inputData.superUserId,
            this.customers[i].id,
            this.selectedStatus,
            stageHistory,
            inPipeline,
            won,
            lost,
            this.selectedStatus ===
              this.statusArray[this.statusArray.length - 1].stageId
              ? this.rejectionReasonValue
              : '',
            ChangeLogComponent.saveLog(
              changeLogParams.constructorName,
              changeLogParams.userId,
              changeLogParams.userName,
              prevObj,
              currObj,
              changeLogParams.changeLog
            )
          )
          .then((resp) => {
            this.uploadProgress = (i / this.customers.length) * 100;
            if (i === this.customers.length - 1) {
              // save delted status to DB
              this.statusArray.splice(this.inputData.statusIndex, 1);
              this.pipelines[this.inputData.pipelineIndex].pipelineStages =
                this.statusArray;
              this.db
                .updatePipeLinenames(
                  this.inputData.superUserId,
                  this.inputData.mode,
                  this.pipelines
                )
                .then((resp) => {
                  this.snack.open('Successfully updated', '', {
                    duration: 2000,
                  });
                  this.dialogRef.close();
                  this.updatingDb = false;
                });
              this.snack.open(
                `Successfully updated ${this.inputData.statusFieldName}`,
                '',
                {
                  duration: 2000,
                }
              );
            }
          });
      }
    } else if (this.inputData.mode == modules.sales && this.sales.length > 0) {
      for (let i = 0; i < this.sales.length; i++) {
        let currentHistory = this.sales[i].stageHistory;
        let newHistory = {
          date: new Date().getTime(),
          stageId: this.selectedStatus,
          pipelineId: this.inputData.pipelineId,
        };
        currentHistory.push(newHistory);
        let stageHistory = currentHistory;

        // inPipeline, won, lost and changelog to update
        let changeLogParams = {
          constructorName: this.constructor.name,
          userId: this.inputData.userId,
          userName: this.inputData.userName,
          prevStatus: this.inputData.statusName,
          curStatus: this.commonService.getStatusName(
            modules.sales,
            this.inputData.pipelineId,
            this.selectedStatus
          ),
          changeLog: this.sales[i].changeLog,
        };
        if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          lost = true;
          won = false;
          inPipeline = false;
          prevObj = {
            status: changeLogParams.prevStatus,
            rejectionReasonVal: '',
          };
          currObj = {
            status: changeLogParams.curStatus,
            rejectionReasonVal: this.rejectionReasonValue,
          };
        } else if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          lost = false;
          won = true;
          inPipeline = false;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        } else {
          lost = false;
          won = false;
          inPipeline = true;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        }

        await this.db
          .updateStatusInSales(
            this.inputData.superUserId,
            this.sales[i].id,
            this.selectedStatus,
            stageHistory,
            inPipeline,
            won,
            lost,
            this.selectedStatus ===
              this.statusArray[this.statusArray.length - 1].stageId
              ? this.rejectionReasonValue
              : '',
            ChangeLogComponent.saveLog(
              changeLogParams.constructorName,
              changeLogParams.userId,
              changeLogParams.userName,
              prevObj,
              currObj,
              changeLogParams.changeLog
            )
          )
          .then((resp) => {
            this.uploadProgress = (i / this.sales.length) * 100;
            if (i === this.sales.length - 1) {
              // save delted status to DB
              this.statusArray.splice(this.inputData.statusIndex, 1);
              this.pipelines[this.inputData.pipelineIndex].pipelineStages =
                this.statusArray;
              this.db
                .updatePipeLinenames(
                  this.inputData.superUserId,
                  this.inputData.mode,
                  this.pipelines
                )
                .then((resp) => {
                  this.snack.open('Successfully updated', '', {
                    duration: 2000,
                  });
                  this.dialogRef.close();
                  this.updatingDb = false;
                });
              this.snack.open(
                `Successfully updated ${this.inputData.statusFieldName}`,
                '',
                {
                  duration: 2000,
                }
              );
            }
          });
      }
    } else if (this.inputData.mode == 'Service' && this.services.length > 0) {
      for (let i = 0; i < this.services.length; i++) {
        let currentHistory = this.services[i].stageHistory;
        let newHistory = {
          date: new Date().getTime(),
          stageId: this.selectedStatus,
          pipelineId: this.inputData.pipelineId,
        };
        currentHistory.push(newHistory);
        let stageHistory = currentHistory;

        // inPipeline, won, lost and changelog to update
        let changeLogParams = {
          constructorName: this.constructor.name,
          userId: this.inputData.userId,
          userName: this.inputData.userName,
          prevStatus: this.inputData.statusName,
          curStatus: this.commonService.getStatusName(
            modules.services,
            this.inputData.pipelineId,
            this.selectedStatus
          ),
          changeLog: this.services[i].changeLog,
        };
        if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          lost = true;
          won = false;
          inPipeline = false;
          prevObj = {
            status: changeLogParams.prevStatus,
            rejectionReasonVal: '',
          };
          currObj = {
            status: changeLogParams.curStatus,
            rejectionReasonVal: this.rejectionReasonValue,
          };
        } else if (
          this.selectedStatus ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          lost = false;
          won = true;
          inPipeline = false;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        } else {
          lost = false;
          won = false;
          inPipeline = true;
          prevObj = { status: changeLogParams.prevStatus };
          currObj = { status: changeLogParams.curStatus };
        }

        await this.db
          .updateStatusInServices(
            this.inputData.superUserId,
            this.services[i].id,
            this.selectedStatus,
            stageHistory,
            inPipeline,
            won,
            lost,
            this.selectedStatus ===
              this.statusArray[this.statusArray.length - 1].stageId
              ? this.rejectionReasonValue
              : '',
            ChangeLogComponent.saveLog(
              changeLogParams.constructorName,
              changeLogParams.userId,
              changeLogParams.userName,
              prevObj,
              currObj,
              changeLogParams.changeLog
            )
          )
          .then((resp) => {
            this.uploadProgress = (i / this.services.length) * 100;
            if (i === this.services.length - 1) {
              // save delted status to DB
              this.statusArray.splice(this.inputData.statusIndex, 1);
              this.pipelines[this.inputData.pipelineIndex].pipelineStages =
                this.statusArray;
              this.db
                .updatePipeLinenames(
                  this.inputData.superUserId,
                  this.inputData.mode,
                  this.pipelines
                )
                .then((resp) => {
                  this.snack.open('Successfully updated', '', {
                    duration: 2000,
                  });
                  this.dialogRef.close();
                  this.updatingDb = false;
                });
              this.snack.open(
                `Successfully updated ${this.inputData.statusFieldName}`,
                '',
                {
                  duration: 2000,
                }
              );
            }
          });
      }
    } else {
      // save delted status to DB
      this.statusArray.splice(this.inputData.statusIndex, 1);
      this.pipelines[this.inputData.pipelineIndex].pipelineStages =
        this.statusArray;
      this.db
        .updatePipeLinenames(
          this.inputData.superUserId,
          this.inputData.mode,
          this.pipelines
        )
        .then((resp) => {
          this.snack.open('Successfully updated', '', {
            duration: 2000,
          });
          this.dialogRef.close();
          this.updatingDb = false;
        });
    }
  }
}
