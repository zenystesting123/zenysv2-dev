import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-template-confirmation',
  templateUrl: './message-template-confirmation.component.html',
  styleUrls: ['./message-template-confirmation.component.scss']
})
export class MessageTemplateConfirmationComponent implements OnInit {
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<MessageTemplateConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
