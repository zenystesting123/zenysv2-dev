import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { TestComponentService } from './test-component.service';
// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, switchMap } from 'rxjs/operators';
// import { takeUntil } from 'rxjs/operators';
// import { DocumentService } from './document.service';
import { environment } from 'src/environments/environment';
// import { CommonService } from 'src/app/common.service';
// import { doc, getDoc } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { FirebaseApp } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
// import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
// import { DocumentService } from './document.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss'],
})
export class TestComponentComponent implements OnInit {
  @Input() data: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  superUserId: any;
  custId: any;
  email: any;
  name: any;
  allDocs: any[];
  selectedFile: any;
  selectedCertType: string;
  currentFile: any;
  task: any;
  doc10: any;
  doc12: any;
  docDegree: any;
  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private serv: TestComponentService,
    private dialog: MatDialog
  ) {
    console.log('hello');
    console.log(this.common.superUserData.superUserId);
    this.superUserId = this.common.superUserData.superUserId;
    route.params.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      console.log(val);
      //Section 1: Get the information passed on to the module using router link
      this.custId = this.route.snapshot.paramMap.get('custId');
      this.docDownload();
    });
  }

  ngOnInit(): void {}

  addDoc(name, email) {
    console.log(name);
    this.serv.addDoc(this.superUserId, this.custId, {
      name: name,
      email: email,
    });
  }
  selectFile(event: any) {
    this.selectedFile = event.target.files;
    this.uploadFile();
  }
  inputAttachment(selectedCertType: string) {
    console.log(selectedCertType);
    this.selectedCertType = selectedCertType;
    let element: HTMLElement = document.getElementsByClassName(
      'attachment-selector-2'
    )[0] as HTMLElement;
    element.click();
  }
  verificationChange(value, docName) {
    console.log(value);
    console.log(docName);
    this.serv.changeDocVerification(
      this.superUserId,
      this.custId,
      docName,
      value
    );
  }
  uploadFile() {
    console.log('Uploaded.....');

    this.currentFile = this.selectedFile[0];

    const filePath =
      `attachment/` +
      this.superUserId +
      `/customer/` +
      Date.now() +
      `-` +
      this.selectedFile[0].name;

    // console.log("*********",filePath);
    // const customMetaData = { };
    this.task = this.storage.upload(filePath, this.currentFile);
    const ref = this.storage.ref(filePath);
    // console.log("*********", this.currentFile)

    // this.uploadProgress$ = this.task.percentageChanges();
    this.task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadURL = await ref.getDownloadURL().toPromise();
          // this.fileDownload = downloadURL;
          // console.log(downloadURL);

          this.serv
            .attachmentsToCollection(
              this.superUserId,
              this.custId,
              this.selectedFile[0].name,
              downloadURL,
              filePath,
              Date.now(),
              ' name',
              this.selectedFile[0].size / 1024 / 1024,
              this.selectedCertType
            )
            .then(() => {
              this.selectedCertType = '';
            });
          // this.fileBeingUploaded = false;
          // this.ref.detectChanges();
          // this._snackBar.open('Attachment added successfully', '', {
          //   duration: 2000,
        })
        // })
      )
      // .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  docDownload() {
    this.serv.getDocsX(this.superUserId, this.custId).subscribe((data: any) => {
      this.doc10 = data;
      // console.log( this.doc10);
    });
    this.serv
      .getDocsXII(this.superUserId, this.custId)
      .subscribe((data: any) => {
        this.doc12 = data;
        // console.log(this.doc12);
      });
    this.serv
      .getDocsDegree(this.superUserId, this.custId)
      .subscribe((data: any) => {
        this.docDegree = data;
        // console.log(this.docDegree);
      });
  }

  openDialogX() {
    // this.dialog.open(DeleteConfirmComponent, {
    //   data: { name: 'tenth' },
    // });
  }

  openDialogXII() {
    // this.dialog.open(DeleteConfirmComponent, {
    //   data: { name: 'plustwo' },
    // });
  }

  openDialogDegree() {
    // this.dialog.open(DeleteConfirmComponent, {
    //   data: { name: 'degree' },
    // });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
