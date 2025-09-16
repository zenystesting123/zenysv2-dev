import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export class DialogDataNumbering {
  docType: string;
  docPrefix: string;
  CurrentDocNumber: number;
  superUserId: string;
}
@Component({
  selector: 'app-documentnumbering-popup',
  templateUrl: './documentnumbering-popup.component.html',
  styleUrls: ['./documentnumbering-popup.component.scss'],
})
export class DocumentnumberingPopupComponent implements OnInit {
  @Output() submitClicked = new EventEmitter<DialogDataNumbering>();
  constructor(
    public dialogRef: MatDialogRef<DocumentnumberingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataNumbering,
    
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {}
  onUpdate() {
    if(!this.data.docPrefix){
      this.data.docPrefix=''
    }
    this.data.CurrentDocNumber=this.data.CurrentDocNumber-1
    this.submitClicked.emit(this.data);
  
    this.dialogRef.close()
  }
}
