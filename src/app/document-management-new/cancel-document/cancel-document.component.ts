/*--------------------------------------------------------------------------
Description : For cancelling a document
Input: document Id,document Type and super user id

-----------------------------------------------------------------------------*/
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewService } from '../preview/preview.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
//dialog data class
export class DialogData {
  docId: string;
  docType: string;
  superUserId: string;
  userId: string; //current user's id
  userName: string; //current user name
  changeLog: any; //changelog
}
@Component({
  selector: 'app-cancel-document',
  templateUrl: './cancel-document.component.html',
  styleUrls: ['./cancel-document.component.scss'],
})
export class CancelDocumentComponent implements OnInit {
  @Output() submitClicked = new EventEmitter<CancelDocumentComponent>();
  constructor(
    public dialogRef: MatDialogRef<CancelDocumentComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private previewService: PreviewService
  ) {}

  onNoClick(): void {
    // for closing the popup
    this.dialogRef.close();
  }
  ngOnInit() {}
  // for cancel the document
  OnCancel() {
    // update cancel as true and add changelog for cancel doc
    this.previewService.updateDocumentCancel(
      this.data.superUserId,
      this.data.docId,
      this.data.docType,
      ChangeLogComponent.saveLog(
        this.constructor.name,
        this.data.userId,
        this.data.userName,
        { cancelDocument: true },
        { cancelDocument: true },
        this.data.changeLog
      )
    );
    // success message
    this._snackBar.open('Succesfully Cancelled Document', '', {
      duration: 2000,
    });
    this.submitClicked.emit(); // emit submit clicked
    this.dialogRef.close(); // close the dialog
  }
}
