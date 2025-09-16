/********************************************************************************** 
Description:Component to delete uploaded document on confirmation
Input:
Output:
***********************************************************************************/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
// import { CommonService } from 'src/app/common.service';
import { CommonService } from '../../../../../../src/app/common.service';
import { DocumentService } from '../mydocument/document.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
})
export class DeleteConfirmComponent implements OnInit {
  custId: string | undefined;
  superUserId: any;

  constructor(
    private dialog: MatDialog,
    private mydoc: DocumentService,
    private _snackBar: MatSnackBar,
    private common: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.custId = this.data.custId;
    this.superUserId = this.data.superUserId;
  }

  ngOnInit(): void {}

  //delete document on dialog/confirmation

  //del doc on dialog
  deleteDocConfirmation() {
      this.mydoc.deleteDoc(this.superUserId, this.custId,this.data.certType).then(() => {
        // this.mydoc.delFromStorage(this.data.path).then(() => {
          this._snackBar.open('Document deleted successfully', '', {
            duration: 2000,
          });
        // });
      });
      const storageRef = firebase.default.storage().ref();
      // Create a reference to the file to delete
      var desertRef = storageRef.child(this.data.path);
       // Delete the file
       desertRef.delete();
       // [END storage_delete_file]
      
   
    
  }
}
