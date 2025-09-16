/**********************************************************************************
Description: Component is used for a confirmation to delete / update status in tasks and attachments, also in publicprofile
             also used to display size exceeded limit messages
Inputs: taskId, attachmentId...id's of particular item on which action has to be taken from its parent componet
Outputs: Db operations
**********************************************************************************/
import {
  DialogDataOpinion,
  DialogDataOpinions,
} from './../profilemodule/profile-edit-component/profile-edit-component.component';
import { ConfirmationpopupService } from './confirmationpopup.service';
import { TaskboardComponent } from './../taskboard/taskboard.component';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Attachments, deleteLogModel, Profile } from '../data-models';
import { CommonService } from '../common.service';
import { Expenses1Service } from '../expenses1/expenses1.service';
import { AnyARecord } from 'dns';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { ReportServiceService } from '../customized-reports/report-view/report-service.service';
import { DashboardgridService } from '../customized-reports/dashboardgrid/dashboardgrid.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmationpopup',
  templateUrl: './confirmationpopup.component.html',
  styleUrls: ['./confirmationpopup.component.scss'],
})
export class ConfirmationpopupComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  btnClicked = false;
  userData: Profile = null; //holds userdata
  attachmentSize: any = null; //attachment size limit containing variable
  superUserDetails: any; //to store super user details
  fieldNameTask: any;
  userId: string;
  userName: string;
  dashboardReportListSubscription:Subscription;
  attachments: Attachments[];
  notes = new FormControl('', Validators.required);
  joinedDocSupport: any;
  taskDeleteDisable: boolean = false; //disable delete button after clicking
  constructor(
    @Inject(MAT_DIALOG_DATA) public value: DialogDataOpinion,
    private snack: MatSnackBar,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<TaskboardComponent>,
    public db: ConfirmationpopupService,
    public commonService: CommonService,
    private expServ: Expenses1Service,
    private router: Router,
    private afAuth: AngularFireAuth,
    private analytics: AngularFireAnalytics,
    private reportService: ReportServiceService,
    private dashboardgridService: DashboardgridService,

  ) {

    //getting the user details by subscribing userdatas
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData.authDetails) {
          if (allData.userDetails !== null) {
            // if user deatils is not null, no need of this dialog box
            if(value.smode == 'networkIssue'){
              this.dialogRef.close();
            }
            if(value.smode == 'doctypeNotSupported'){
              this.joinedDocSupport =  value.reportsArray.join(', ');
            }
          // all data fetched from common service and assign to local variables
          this.userData = allData.userDetails;
          this.userId = allData.userId;
          this.userName =
          this.userData.firstname +
          (this.userData.lastname ? ' '+this.userData.lastname : '');
            this.superUserDetails = allData.superUserDetails;
            this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
            this.attachmentSize = allData.superUserDetails.totalAttachmentsSize;
            if (!this.attachmentSize) {
              this.attachmentSize = 0;
            }
          }
        }else{
          //console.log('No auth details found!!')
        }
      });
  }

  ngOnInit(): void {}
  // no network case , if cancel is selected
  Logout(){
    this.dialogRef.close();
    this.afAuth.signOut().then(resp=>{
      window.location.reload();
      this.router.navigate(['']);
      })
  }
  // no network case, if proceed is opted
  proceedToReset(){
    this.dialogRef.close();
    this.router.navigate(['/create-profile']);
  }
  // delete task
  async deleted(id: string, superId) {
    this.taskDeleteDisable = true;
    let deleteLogTask: deleteLogModel = {
      delByemail: this.userData.email,
      delByuserId: this.userId,
      dateNtime: new Date(),
      tasksDeleted: 1,
      contDeleted: 0,
      follDeleted: 0,
    };
    //get Attachemnts in task
    await this.getAttachments(superId,id);
    // delete att
    if (!!this.attachments) {
      let newSize = this.attachmentSize;
      this.attachments.forEach(async (att) => {
        if (!!att) {
          newSize = newSize - att.size;
          //update total size
          this.db.updateSize(superId, newSize);
          //delete from storage
          const storageRef = firebase.default.storage().ref();
          var desertRef = storageRef.child(att.path);
          await desertRef.delete();
        }
      });
    }
    //delete task
    this.db.deleteT(id, superId).then(data=>{
      this.db.addToDeleteLog(superId, deleteLogTask);
      this.dialogRef.close('deleted');
      let message = this.fieldNameTask + ' Successfully deleted!';
      this.snack.open(message, '', {
        duration: 2000,
      });
    })
  }
  //get Attachemnts for task as a promise
  getAttachments(superId,id){
    return new Promise<void>((resolve) => {
      this.db
        .getAttachments(superId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          resolve();
        });
    });
  }
  // delete attachment for sale
  deletedAttachment(
    uid: string,
    sid: string,
    id: string,
    path: string,
    url: string,
    size: any,
    changeLog: AnyARecord
  ) {
    this.btnClicked = true;
    let newSize = this.attachmentSize - size;

    const storageRef = firebase.default.storage().ref();
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db
      .deleteAttachment(uid, sid, id, changeLog)
      .then((resp1) => {
        // Delete the file from storage
        desertRef.delete().then((resp2) => {
          this.db.updateSize(uid, newSize).then((resp3) => { //update size at superuser level
            this.dialogRef.close();
            this.snack.open('Attachment deleted', '', {
              duration: 2000,
            });
          });
        });
      })
  }
  deletedAttachmentServe(
    uid: string,
    sid: string,
    id: string,
    path: string,
    url: string,
    size: any,
    changeLog: any
  ) {
    this.btnClicked = true;
    let newSize = this.attachmentSize - size;
    const storageRef = firebase.default.storage().ref();

    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db.deleteServiceAttachment(uid, sid, id, changeLog).then((resp1) => {
      // Delete the file
      desertRef.delete().then((resp2) => {
        // [END storage_delete_file]
        this.db.updateSize(uid, newSize).then((resp3) => {
          this.dialogRef.close();
          this.snack.open('Attachment deleted', '', {
            duration: 2000,
          });
        });
      });
    });
  }
  // delete service under publicprofile
  deletedServiceProfile(uid, id, url) {
    this.db.deleteServicesPP(this.userData?.publicProfileID, id);
    if (url != 'default') {
      let docRef = this.storage.refFromURL(url);
      docRef.delete();
    }
    this.dialogRef.close();
    this.snack.open('Service deleted', '', {
      duration: 2000,
    });
  }

  // customer attachment delete
  deletedAttachmentCust(
    uid: string,
    cid: string,
    id: string,
    path: string,
    url: string,
    size: any,
    changeLog: any
  ) {
    this.btnClicked = true;
    let newSize = this.attachmentSize - size;

    const storageRef = firebase.default.storage().ref();
    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db.deleteAttachmentCust(uid, cid, id, changeLog).then((resp1) => {
      this.db.updateSize(uid, newSize).then((resp2) => {
        // Delete the file
        desertRef.delete().then((resp3) => {
          // [END storage_delete_file]
          this.dialogRef.close();
          this.snack.open('Attachment deleted', '', {
            duration: 2000,
          });
        });
      });
    });
  }
  // customer attachment delete
  deletedCustomDocuments(
    uid: string,
    cid: string,
    id: string,
    path: string,
    url: string,
    size: any,
    changeLog: any,
    mode
  ) {
    let collectionName;
    if(mode === "customContactDocDelete"){
      collectionName = "customers"
    }else if(mode === "customSaleDocDelete"){
      collectionName ="sales"
    }else if(mode === "customServiceDocDelete"){
      collectionName = "services"
    }
    this.btnClicked = true;
    let newSize = this.attachmentSize - size;

    const storageRef = firebase.default.storage().ref();
    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db.deleteCustomDocument(uid, cid, id, changeLog,collectionName).then((resp1) => {
      this.db.updateSize(uid, newSize).then((resp2) => {
        // Delete the file
        desertRef.delete().then((resp3) => {
          // [END storage_delete_file]
          this.dialogRef.close();
          this.snack.open('Document deleted', '', {
            duration: 2000,
          });
        });
      });
    });
  }

  // task attachment delete
  deleteAttachTask(value) {
    //decrease deleted file's size from total attachment size
    let newSize = this.attachmentSize - value.size;
    //if scenario is update, delete attachment from tasks collection and firebase storage
    if (value.scenario == 'update') {
      //delete from tasks attachments collection
      this.db
        .deleteDocTask(value.userId, value.taskId, value.itemId)
        .then(() => {
          //update changelog with deleted record
          this.db.updateChangeLog(
            value.userId,
            'tasks',
            value.taskId,
            value.changeLog
          );
          //update total size in db
          this.db.updateSize(value.userId, newSize);
          //close confirmation popup
          this.dialogRef.close();
          //show file deleted message
          this.snack.open('Document deleted successfully', '', {
            duration: 2000,
          });
        });
      //get firebase storage reference
      const storageRef = firebase.default.storage().ref();
      // [START storage_delete_file]
      // Create a reference to the file to delete
      var desertRef = storageRef.child(value.path);
      // Delete the file
      desertRef.delete();
      // [END storage_delete_file]
    }
    //if scenario is create, just delete attachment from firebase storage
    else {
      //get firebase storage reference
      const storageRef = firebase.default.storage().ref();
      // [START storage_delete_file]
      // Create a reference to the file to delete
      var desertRef = storageRef.child(value.path);
      // Delete the file
      desertRef.delete();
      // [END storage_delete_file]
      //update total size in db
      this.db.updateSize(value.userId, newSize);
      //close dialogue
      this.dialogRef.close();
      //show file deleted message
      this.snack.open('Document deleted successfully', '', {
        duration: 2000,
      });
      //});
    }
  }

  // expense attachment delete
  deleteAttachExp(value) {
    //decrease deleted file's size from total attachment size
    let newSize = this.attachmentSize - value.size;
    //if scenario is update, delete attachment from expense collection and firebase storage
    if (value.scenario == 'update') {
      //delete from expense attachments collection
      this.expServ
        .deleteDoc(value.userId, value.expId, value.itemId)
        .then(() => {
          let changeLog = ChangeLogComponent.saveLog(
            value.componentName,
            value.userId,
            value.userName,
            '',
            {
              deletedAttachments: value.deletedAttachments,
            },
            value.changeLog
          )
          //update changelog with deleted record
          this.db.updateChangeLog(
            value.userId,
            'Expenses',
            value.expId,
            changeLog
          );
          //update total size in db
          this.expServ.updateSize(value.userId, newSize);
          //close confirmation popup
          this.dialogRef.close();
          //show file deleted message
          this.snack.open('Document deleted successfully', '', {
            duration: 2000,
          });
        });
        //get firebase storage reference
      const storageRef = firebase.default.storage().ref();
      // [START storage_delete_file]
      // Create a reference to the file to delete
      var desertRef = storageRef.child(value.path);
      // Delete the file
      desertRef.delete();
      // [END storage_delete_file]
    } else {
      //this.expServ.delFromStorage(value.path).then(() => {
      const storageRef = firebase.default.storage().ref();
      // [START storage_delete_file]
      // Create a reference to the file to delete
      var desertRef = storageRef.child(value.path);
      // Delete the file
      desertRef.delete();
      // [END storage_delete_file]
      this.expServ.updateSize(value.userId, newSize);
      this.dialogRef.close();
      this.snack.open('Document deleted successfully', '', {
        duration: 2000,
      });
      //});
    }
  }
  // customer attachment delete
  deletedAttachmentOrg(
    uid: string,
    cid: string,
    id: string,
    path: string,
    url: string,
    size: any,
    changeLog: any
  ) {
    this.btnClicked = true;
    let newSize = this.attachmentSize - size;
    const storageRef = firebase.default.storage().ref();

    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db
      .deleteAttachmentOrg(uid, cid, id, changeLog)
      .then((resp1) => {
        // Delete the file
        desertRef.delete();

        // [END storage_delete_file]
      })
      .then((resp2) => {
        this.db.updateSize(uid, newSize).then((resp3) => {
          this.dialogRef.close();
          this.snack.open('Attachment deleted', '', {
            duration: 2000,
          });
        });
      });
  }
  // profile attachment delete
  deletedAttachmentProfile(uid: string, id: string, path: string, url: string) {
    this.db.deleteAttachmentProfile(this.userData?.publicProfileID, id);

    this.dialogRef.close();

    this.snack.open('Attachment deleted', '', {
      duration: 2000,
    });

    const storageRef = firebase.default.storage().ref();

    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    // Delete the file
    desertRef.delete();
    // [END storage_delete_file]

    // --------------------------------------------------------------------------
  }
  // image delete under user thumbnails
  deletedImg(id: string, path: string, pathT) {
    this.db.deleteImgOrginal(this.userData?.publicProfileID, id);
    const storageRef1 = firebase.default.storage().ref();
    var desertRef = storageRef1.child(pathT);

    desertRef.delete();

    const storageRef = firebase.default.storage().ref();
    var desertRef = storageRef.child(path);

    desertRef.delete();
    this.dialogRef.close();

    this.snack.open('Image deleted', '', {
      duration: 2000,
    });
  }
  // task update as completed
  completed(id: string, superId, changeLog, constructorName, currentStatus, lastStatus) {
    changeLog = ChangeLogComponent.saveLog(
      constructorName,
      this.userId,
      this.userName,
      { status: currentStatus },
      { status: lastStatus },
      changeLog
    ),
    this.db.updateTaskStatus(id, superId, changeLog);
    this.dialogRef.close('completed');
    this.snack.open('Task completed', '', {
      duration: 2000,
    });
  }
  //Delete lead capture form
  deleteForm() {
    this.dialogRef.close('delete');
  }
  // cancel button action
  close() {
    this.dialogRef.close('cancel');
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  addNotes(note){
    this.btnClicked = true;
    let noteAdded={notes:note}
    this.analytics.logEvent(this.value.GAevent);
    let createdDate = new Date().getTime();
    this.db.writeNote(
      noteAdded,
      this.value.superUserId,
      createdDate,
      this.value.customerId,
      this.value.userName,
      this.value.userId,
      ChangeLogComponent.saveLog(
        this.constructor.name,
        this.value.userId,
        this.value.userName,
        {},
        { addedNotes: noteAdded },
        this.value.changeLog
      )
    ).then((res) => {
      this.snack.open(this.value.fieldNameContactNotes+' added', '', {
        duration: 2000,
      });
      this.dialogRef.close(true);
    });
  }
  deleteView() {
    this.btnClicked = true;
    //delete view
    this.dialogRef.close('deleted');
  }
  // delete report
  async deleteReport() {
    this.btnClicked = true;
    const allDashboards = await this.dashboardgridService.getDashboardReportsOneTime(this.value.userId);// get all dashboard reports
    for (var i = allDashboards?.length - 1; i >= 0; i--) {
      for (var j = allDashboards[i].reportsArray.length - 1; j >= 0; j--) {
        if (allDashboards[i].reportsArray[j].reportId == this.value.reportId) {
          allDashboards[i].reportsArray.splice(j, 1);
          await this.reportService.deleteDashboardReport(this.value.userId, allDashboards[i].id, allDashboards[i].reportsArray);// delete report from dashboard
        }
      }
    }
    // delete reportd
    this.reportService.deleteReports(this.value.userId, this.value.reportId).then(resp => {
      this.dialogRef.close('reportdeleted');
    })
  }
  deleteReportDashboard(){
     // delete reportd from dashboard
     this.value.reportsArray.splice(this.value.reportId, 1);
     this.reportService.deleteDashBoardReports(this.value.userId, this.value.currentDashboardId,this.value.reportsArray).then(resp => {
      this.dialogRef.close('reportindashboarddeleted');
    })
  }
  deleteDashboardReport() {
    this.btnClicked = true;
    this.dashboardgridService.currentDashboardId='';
    //delete dashboard report
    this.reportService.deleteDashboardReports(this.value.userId, this.value.reportId).then(resp => {
      this.dialogRef.close('dashboardreportdeleted');
    })
  }
}
