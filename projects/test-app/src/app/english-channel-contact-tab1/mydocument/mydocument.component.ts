/**********************************************************************************
Description:Component to upload/download document
Input:
Output:
***********************************************************************************/
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, takeUntil } from 'rxjs/operators';
import { DocumentService } from './document.service';
// import { environment } from 'src/environments/environment';
import { CommonService } from '../../../../../../src/app/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
export class DocDetails{
  constructor(
    public certType:string,
    public date:number,
    public downloadURL:string,
    public fileName:string,
    public path:string,
    public size:number,
    public uploaded:string,
    public verification:string,
  ){}
}
@Component({
  selector: 'app-mydocument',
  templateUrl: './mydocument.component.html',
  styleUrls: ['./mydocument.component.scss'],
})

export class MydocumentComponent implements OnInit,OnDestroy {
  selectedFile: any;
  currentFile: any;
  custId: string;
  task: any;
  selectedCertType: any;
  downloadURL: any;
  docDegree: DocDetails;
  docDegreeMarklist: DocDetails;
  docDegreeConsolidated: DocDetails;
  docDegreeProvisional: DocDetails;
  docIeltsCertificate: DocDetails;
  docPassport: DocDetails;
  docStatementOfPurpose: DocDetails;
  docResume: DocDetails;
  docLOR1: DocDetails;
  docLOR2: DocDetails;
  docMediumOfInstruction: DocDetails;
  storageFileUrl: any;
  documentX: DocDetails;
  documentXII: DocDetails;
  duplicateUrl!: any;
  cas: DocDetails;
  medicalCert: DocDetails
  financialProof: DocDetails
  bankCoverLetter: DocDetails
  offerLetter: DocDetails
  feeReciept: DocDetails
  birthCert: DocDetails
  brpCard: DocDetails

  private onDestroy$: Subject<void> = new Subject<void>();

  others1: DocDetails;
  others2: DocDetails;
  others3: DocDetails;
  others4: DocDetails;
  others5: DocDetails;
  uploadProgress$!: Observable<number>;
  currentDocument: any;
  superUserId: string;
  fileUploadDisable:boolean =false;
  @ViewChild('file') file;
  constructor(
    private storage: AngularFireStorage,
    private documentService: DocumentService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.superUserId = this.commonService.superUserData.superUserId;
    route.params.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      // console.log(val);
      //Section 1: Get the information passed on to the module using router link
      this.custId = this.route.snapshot.paramMap.get('custId');
    });
    // console.log(this.superUserId);
  }

  ngOnInit(): void {
    this.docDownload();
    this.ref.detectChanges();
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  selectFile(event: any) {
    
    this.selectedFile = event.target.files;
    // console.log( this.file.nativeElement.value);
    
    
    if(event.target.files[0]){
      this.uploadFile();
    }
  }
  inputAttachment(selectedCertType: string, currentDocument: any) {
    // console.log("ss", this.file.nativeElement.value);
    this.file.nativeElement.value = '';
    this.selectedCertType = selectedCertType;
    this.currentDocument = currentDocument;
    let element: HTMLElement = document.getElementsByClassName(
      'attachment-selector1'
    )[0] as HTMLElement;
    element.click();
  }
  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  uploadFile() {
    // console.log("here");
    
    // this.fileUploadDisable = true;
    this.currentFile = this.selectedFile[0];

    const filePath =
      `attachment/` +
      this.superUserId +
      `/customer/` +
      Date.now() +
      `-` +
      this.selectedFile[0].name;
    this.storageFileUrl = filePath;

    this.task = this.storage.upload(filePath, this.currentFile);
    this.fileUploadDisable = true;
    // console.log("Task",this.task);
    // console.log("Task",this.fileUploadDisable);
    
    const ref = this.storage.ref(filePath);
    this.uploadProgress$ = this.task.percentageChanges();
    this.uploadPopUp(this.uploadProgress$);

    this.task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadURL = await ref.getDownloadURL().toPromise();

          this.documentService
            .attachmentsToCollection(
              this.superUserId,
              this.custId,
              this.selectedFile[0].name,
              downloadURL,
              filePath,
              Date.now(),
              'customer',
              this.selectedFile[0].size / 1024 / 1024,
              this.selectedCertType
            )
            .then(() => {
              this.selectedCertType = '';
              if (!!this.currentDocument) {
                const storageRef = firebase.default.storage().ref();
                // [START storage_delete_file]
                // Create a reference to the file to delete
                var desertRef = storageRef.child(this.currentDocument.path);
                // Delete the file
                desertRef.delete().then(()=>{
                  this.currentDocument = null
                });
                // [END storage_delete_file]
                

                // this.documentService.delFromStorage(this.currentDocument.path).then(() => {
                //   this.currentDocument = null
                // });
              }
              this.fileUploadDisable = false;
              // this.selectedFile = null;
              this.ref.detectChanges();
              this._snackbar.open('Document uploaded successfully', '', {
                duration: 2000,
              });
            });
         
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();

  }

  // function to download respective documents
  docDownload() {
    this.documentService
      .getDocsX(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.documentX = data;
      });
    this.documentService
      .getDocsXII(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.documentXII = data;
      });
    this.documentService
      .getDocsDegree(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docDegree = data;
      });
    this.documentService
      .getDegreeMarklist(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docDegreeMarklist = data;
      });
    this.documentService
      .getDegreeConsolidated(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docDegreeConsolidated = data;
      });
    this.documentService
      .getDegreeProvisional(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docDegreeProvisional = data;
      });
    this.documentService
      .getIeltsCertificate(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docIeltsCertificate = data;
      });
    this.documentService
      .getDocsPassport(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docPassport = data;
      });
    this.documentService
      .getDocSOP(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docStatementOfPurpose = data;
      });
    this.documentService
      .getDocResume(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docResume = data;
      });
    this.documentService
      .getDocLOR1(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docLOR1 = data;
      });
    this.documentService
      .getDocLOR2(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docLOR2 = data;
      });
    this.documentService
      .getDocMOI(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.docMediumOfInstruction = data;
      });
    this.documentService
      .getOthers1(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.others1 = data;
      });
    this.documentService
      .getOthers2(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.others2 = data;
      });
    this.documentService
      .getOthers3(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.others3 = data;
      });
    this.documentService
      .getOthers4(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.others4 = data;
      });
    this.documentService
      .getOthers5(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.others5 = data;
      });
    this.documentService
      .getCas(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.cas = data;
      });
    this.documentService
      .getMedCert(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.medicalCert = data;
      });
    this.documentService
      .getFinProof(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.financialProof = data;
      });
    this.documentService
      .getbankCoverLetter(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.bankCoverLetter = data;
      });
    this.documentService
      .getOfferLetter(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.offerLetter = data;
      });
    this.documentService
      .getfeeReciept(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.feeReciept = data;
      });
    this.documentService
      .getbirthCert(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.birthCert = data;
      });
    this.documentService
      .getBrpCard(this.superUserId, this.custId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.brpCard = data;
      });
  }

  //open dialog for deleting a document
  openDialog(doc: any) {
    this.dialog.open(DeleteConfirmComponent, {
      data: { ...doc, superUserId: this.superUserId, custId: this.custId },
    });
  }
  //open dialog for upload progress

  uploadPopUp(progress: any) {
    this.dialog.open(UploadPopupComponent, {
      data: progress,
      width: '400px',
      disableClose: true,
    });
  }
  verificationChange(value, docName) {
    // console.log(value);
    // console.log(docName);
    this.documentService.changeDocVerification(
      this.superUserId,
      this.custId,
      docName,
      value
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
