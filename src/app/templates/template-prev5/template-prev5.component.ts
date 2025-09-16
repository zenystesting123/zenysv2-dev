import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentsettingsComponent } from 'src/app/settings/documentsettings/documentsettings.component';
export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-template-prev5',
  templateUrl: './template-prev5.component.html',
  styleUrls: ['./template-prev5.component.scss'],
})
export class TemplatePrev5Component implements OnInit {
  id: number;
  constructor(
    public dialogRef: MatDialogRef<DocumentsettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.id=data.id
  }

  ngOnInit(): void {}
  close(){
    this.dialogRef.close();
  }
}
