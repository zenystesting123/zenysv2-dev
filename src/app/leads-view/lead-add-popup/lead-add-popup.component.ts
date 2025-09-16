import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { LeadAddPopupService } from './lead-add-popup.service';
@Component({
  selector: 'app-lead-add-popup',
  templateUrl: './lead-add-popup.component.html',
  styleUrls: ['./lead-add-popup.component.scss'],
})
export class LeadAddPopupComponent implements OnInit {
  [signpath: string]: any;
  checked: boolean=false;
  submitted: boolean;
  location: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private db: LeadAddPopupService,
    public dialogRef: MatDialogRef<LeadAddPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  locat(e) {
    if (this.located == true) {
      this.location = true;
    }
  }
  check(e) {
    if (this.checked == true) {
      this.id = firebase.default.auth().currentUser.uid;
      if (this.id)
        this.db
          .getNew('/users', this.id)
          .pipe(take(1))
          .subscribe((p) => (this.form = p));
    } else {
      this.form.phone = '';
      this.form.email = '';
      this.form.company = '';
      this.form.firstname = '';
      this.form.lastname = '';
    }
  }
  onCreate(form) {
    if(this.checked == false){
      form.value.ownReq=false
    }
    if(this.checked == true){
      form.value.ownReq=true
    }
    let datePlaced = new Date().getTime();
  //  console.log("oewn"+this.checked)
    this.db.createLead(form.value, datePlaced, this.data.leadSharedRating);
    this.dialogRef.close();
    this._snackBar.open('Successfully created', 'Lead', {
      duration: 2000,
    });
  }
  TypeError() {
    this.submitted = true;
    this._snackBar.open('Fill All The Mandatory', 'Fields', {
      duration: 2000,
    });
  }
}
