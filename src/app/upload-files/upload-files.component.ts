/**********************************************************************************
Description: Component is used to upload files under a superuser,
              Also used as a popup from email template settings and compose email to select files
             Only in web
Inputs: userId, userdata, superuser data from common service
Outputs:
**********************************************************************************/
import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import {
  Upload,
  uploadFileModel,
  freeAttSize,
  paidAttSize,
  PlanDocLimit,
} from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';
import { UploadFilesService } from './upload-files.service';
import { saveAs } from 'file-saver';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort?: MatSort; //sort for mat-table

  @ViewChild(MatPaginator) paginator?: MatPaginator; //paginator for mat-table

  @ViewChild('file') file;

  private basepath: string = '/uploads'; //uploads folder under files in Firebase Storage
  private uploadTask: firebase.default.storage.UploadTask; //for upload file method
  urlDownload = ''; //url using for download
  superUserId = '';
  plan; //plan is checking to check attachment size
  filesToDisplay: uploadFileModel[] = []; //the array holds the uploaded files
  displayedColumns: string[] = ['name', 'createdAt', 'actions']; //mat-table columns
  dataSource: any; //for mat-table data
  tolFileSize = 0; //totla size of attachments under this superuser
  newFileSize = 0; //totla file size plus newly added file size
  userDetailsSubscription: Subscription;
  fileSubscription: Subscription;
  progressBarStatus = false;
  openedAsDialog = false; //to check whether opened as dialog or as a normal component
  uploadProgress;
  uploadStatus = false;
  restFileArray: uploadFileModel[] = []; //the arraycopy holds the uploaded files
  shortURL = '';
  fileSizeLimit = 0;
  noOfSubUsers = 0;
  disableAtt: boolean = false; //add attachemnt disabling
  disableAttView: boolean = false;
  disableAttRemove: boolean = false;
  userId = ''; //logged in users id to save as created by id
  saveOnceBoolean = false;
  sizeUpdated = 0; //for file upload error handling: totalattachment size - files size

  constructor(
    @Optional() public dialogRef: MatDialogRef<UploadFilesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    @Inject(DOCUMENT) private document: Document,
    private serviceInstance: UploadFilesService,
    public commonService: CommonService,
    private _snack: MatSnackBar,
    private location: Location,
    private storageFire: AngularFireStorage,
    public networkCheck: NetworkCheckService,
    private dialog: MatDialog,
    private clipboard: Clipboard
  ) {
    if (data) {
      if (data == 'opened as dialog') {
        this.openedAsDialog = true;
      }
    }
  }

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.superUserId = allData.userDetails.superUserId;
        this.userId = allData.userId;
        this.plan = allData.superUserDetails.plan;
        this.noOfSubUsers = allData.superUserDetails.noSubusers;
        let uploadFileLimit = PlanDocLimit.sizeLimit;
        if (this.plan == 'free') {
          this.fileSizeLimit =
            (this.noOfSubUsers + 1) * uploadFileLimit.free * 1000000;
        } else if (this.plan == 'gold') {
          this.fileSizeLimit =
            (this.noOfSubUsers + 1) * uploadFileLimit.gold * 1000000;
        } else if (this.plan == 'diamond') {
          this.fileSizeLimit =
            (this.noOfSubUsers + 1) * uploadFileLimit.free * 1000000;
        } else if (this.plan == 'invoicing') {
          this.fileSizeLimit =
            (this.noOfSubUsers + 1) * uploadFileLimit.free * 1000000;
        }

        // totl file size under super user is saving
        if (allData.superUserDetails.totalAttachmentsSize > 0) {
          this.tolFileSize =
            allData.superUserDetails.totalAttachmentsSize * 1000000;
        }

        // disable attachments
        if (allData.usrProfileData.isCheckedAtt == false) {
          this.disableAtt = true;
          this.disableAttRemove = true;
          this.disableAttView = true;
        } else {
          if (allData.usrProfileData.attAdd == false) {
            this.disableAtt = true;
          }
          if (allData.usrProfileData.attRemove == false) {
            this.disableAttRemove = true;
          }
          if (allData.usrProfileData.attView == false) {
            this.disableAttView = true;
          }
        }

        // files fetch from DB
        this.fileSubscription = this.serviceInstance
          .getFiles(this.superUserId)
          .subscribe((data) => {
            this.filesToDisplay = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as uploadFileModel;
            });

            this.restFileArray = this.filesToDisplay;
            this.dataSource = new MatTableDataSource([]);
            this.dataSource.data = this.filesToDisplay;

            this.progressBarStatus = true;

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      }
    );
  }

  // function to copy URL
  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }

  // search for products function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterMod($event) {
    let value = $event.target.value;
    const val = value.replace(/\s/g, '');
    this.filesToDisplay = this.restFileArray.filter((item) => {
      return (
        item.name.replace(/\s/g, '').toLowerCase().indexOf(val.toLowerCase()) >
        -1
      );
    });
  }
  // file upload method
  upload($event) {
    // this.progressBarStatus = false;
    this.saveOnceBoolean = true;
    let file = $event.target.files[0];

    if (typeof file !== 'undefined') {
      this.newFileSize = this.tolFileSize + file.size;
      this.sizeUpdated = this.newFileSize - file.size;
      if (this.newFileSize > this.fileSizeLimit) {
        this.dialog.open(ConfirmationpopupComponent, {
          width: '300px',
          data: {
            smode: 'filelimitExceeded',
          },
        });
        this.progressBarStatus = true;
      } else {
        // update size before uploading to storage and collection, so that it will reflect to sum up if others are trying to upload
        this.serviceInstance.updateSize(
          this.superUserId,
          (this.newFileSize / 1000000)
        );
        let currentupload = new Upload(file);
        this.pushUpload(currentupload);
      }
    }
  }

  // selected file after limit check is uploading to firebase storage
  pushUpload(upload: Upload) {
    let storageRef = firebase.default.storage().ref();
    let fileName = `${Date.now()}_${upload.file.name}`;
    this.uploadTask = storageRef
      .child(`${this.basepath}/${fileName}`)
      .put(upload.file);

    this.uploadTask.on(
      firebase.default.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        this.uploadStatus = true;
        upload.progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.uploadProgress = upload.progress;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storageRef
          .child(`${this.basepath}/${fileName}`)
          .getDownloadURL()
          .then((ref) => {
            this.urlDownload = ref;
            if (this.urlDownload) {
              upload.url = this.urlDownload;
              upload.name = upload.file.name;
              upload.size = upload.file.size;
              if (upload.file.type.includes('image')) {
                upload.type = 'image';
              } else if (upload.file.type.includes('video')) {
                upload.type = 'video';
              } else if (upload.file.type.includes('audio')) {
                upload.type = 'audio';
              } else if (upload.file.type.includes('pdf')) {
                upload.type = 'pdf';
              } else if (upload.file.name.includes('.doc')) {
                upload.type = 'document';
              } else if (upload.file.name.includes('.docx')) {
                upload.type = 'document';
              } else if (upload.file.name.includes('.xls')) {
                upload.type = 'excel';
              } else if (upload.file.name.includes('xlsx')) {
                upload.type = 'excel';
              } else if (upload.file.name.includes('.csv')) {
                upload.type = 'excel';
              } else if (upload.file.name.includes('.txt')) {
                upload.type = 'text';
              } else if (upload.file.name.includes('.ppt')) {
                upload.type = 'ppt';
              } else if (upload.file.name.includes('.pptx')) {
                upload.type = 'ppt';
              } else {
                upload.type = upload.file.type;
              }
              this.uploadStatus = false;
              this.saveFileData(upload);
            } else {
              // revert the updated size if uploading failed
              this.serviceInstance.updateSize(
                this.superUserId,
                (this.sizeUpdated / 1000000)
              );
            }
          });
      }
    );
  }

  // save details of file uploaded file under uploadedFiles collection in superuser so that it can display easily
  saveFileData(upload) {
    // first save to urls and get short url and save it along witgh other data
    this.serviceInstance.createUrl(upload.url).then((res) => {
      this.serviceInstance.fetchShortUrl(res.id).subscribe((data) => {
        this.shortURL = data.shortUrl;
        if (this.shortURL && this.saveOnceBoolean) {
          this.saveOnceBoolean = false;
          this.serviceInstance
            .saveAttachments(
              this.superUserId,
              upload.createdAt,
              upload.name,
              upload.url,
              upload.type,
              upload.size,
              this.shortURL,
              this.userId
            )
            .then((res) => {
              this._snack.open('File added', '', {
                duration: 2000,
              });
              // this.progressBarStatus = true;
            })
            .catch((e) => {
              // revert the updated size if uploading failed
              this.serviceInstance.updateSize(
                this.superUserId,
                (this.sizeUpdated / 1000000)
              );
            });
        }
      });
    });
  }

  // back aerrow method
  onBack() {
    this.location.back();
  }

  // download file
  onDownloadFile(row) {
    // download codes
    this.document.location.href = row.url;
    // saveAs(row.url, row.name);
  }

  // delete file method
  onDelete(row) {
    const dialogRef = this.dialog.open(DeleteFile, {
      width: '400px',
      data: {
        fileName: row.name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result == 'delete') {
          // delete codes
          // step 1: delte from Angular storage
          return this.storageFire.storage
            .refFromURL(row.url)
            .delete()
            .then((res) => {
              // step1: dlete under users uploadedFiles collection
              this.serviceInstance
                .deleteFile(this.superUserId, row.id)
                .then((resp2) => {
                  // size update in superuser

                  let newFileSize;
                  if (row.size) {
                    newFileSize = this.tolFileSize - row.size;

                    this.serviceInstance.updateSize(
                      this.superUserId,
                      (newFileSize / 1000000)
                    );
                  }
                  this._snack.open('File deleted', '', {
                    duration: 2000,
                  });
                });
            });
        }
      }
    });
  }

  // view file
  onViewFile(url) {
    // view file
    window.open(url, '_blank');
  }

  // since we are using button for upload file and hiding input type="file" we need this code to do the actions in background
  addFile() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentFiles'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }

  // if using as dialog popup, if select a row ,data is passed and dialog is closed
  rowSelected(row) {
    this.dialogRef.close({ data: row.shortUrl, msgData: row });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // if file uploading is in progress, we have to revert the superusers totalAttachment size updated
    if (this.uploadStatus === true) {
      this.serviceInstance.updateSize(this.superUserId, (this.sizeUpdated / 1000000));
    }
    this.userDetailsSubscription?.unsubscribe();
    this.fileSubscription?.unsubscribe();
  }
}
// delete confirmation
@Component({
  selector: 'delete-file',
  templateUrl: 'delete-file.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class DeleteFile {
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<DeleteFile>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
