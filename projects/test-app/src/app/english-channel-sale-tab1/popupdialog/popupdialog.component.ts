import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Currencies } from 'src/app/currencies';
@Component({
  selector: 'app-popupdialog',
  templateUrl: './popupdialog.component.html',
  styleUrls: ['./popupdialog.component.scss'],
})
export class PopupdialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    if (this.data.scenario == 'create' || this.data.scenario == 'edit') {
      this.form = new FormGroup({
        installmentName: new FormControl(
          this.data.data == {} ? '' : this.data.data.installmentName,
          Validators.required
        ),
        amount: new FormControl(
          this.data.data == {} ? '' : this.data.data.amount,
          Validators.required
        ),
        paymentDate: new FormControl(
          this.data.scenario == 'create'
            ? ''
            : this.data.data.paymentDate.toDate(),
          Validators.required
        ),
        comments: new FormControl(
          this.data.data == {} ? '' : this.data.data.comments
        ),
      });
    }
  }
}
