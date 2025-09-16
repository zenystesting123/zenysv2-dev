/********************************************************************************** 
Description:Component to dispaly file upload status
Input:
Output:
***********************************************************************************/

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-popup',
  templateUrl: './upload-popup.component.html',
  styleUrls: ['./upload-popup.component.scss']
})
export class UploadPopupComponent implements OnInit {
  value!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Observable<number>,
   private ref: ChangeDetectorRef, 
   public dialogRef: MatDialogRef<UploadPopupComponent>) { }

  ngOnInit(): void {
    this.ref.detectChanges()
    this.data.subscribe((resp: any) => {
      this.value = resp;
      // console.log(this.value);
      this.ref.detectChanges();
    })

  }
  ngAfterContentChecked() {
    this.ref.detectChanges()
  }

  closeDialog() {
    this.dialogRef.close();
  }



}
