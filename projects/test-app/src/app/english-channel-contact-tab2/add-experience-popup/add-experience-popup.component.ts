import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-experience-popup',
  templateUrl: './add-experience-popup.component.html',
  styleUrls: ['./add-experience-popup.component.scss'],
})
export class AddExperiencePopupComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(this.data);
  }

  ngOnInit(): void {
    if (this.data.scenario == 'create' || this.data.scenario == 'edit') {
      if (this.data.type == 'academics') {
        this.form = new FormGroup({
          className: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.className,
            Validators.required
          ),
          boardName: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.boardName,
            Validators.required
          ),
          comments: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.comments
          ),
          percentage: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.percentage,
            Validators.required
          ),
          year: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.year,
            Validators.required
          ),
        });
      } else if (this.data.type == 'workExp') {
        this.form = new FormGroup({
          organizationName: new FormControl(
            (Object.keys(this.data.data).length === 0) ? '' : this.data.data.organizationName,
            Validators.required
          ),
          startDate: new FormControl(
            this.data.scenario == 'create'
              ? ''
              : this.data.data.startDate.toDate(),
            Validators.required
          ),
          endDate: new FormControl(
            this.data.scenario == 'create'
              ? ''
              : this.data.data?.endDate != ''?this.data.data?.endDate?.toDate():''
          ),
          position: new FormControl(
            (Object.keys(this.data.data).length === 0 )? '' : this.data.data.position,
            Validators.required
          ),
          comments: new FormControl(
            (Object.keys(this.data.data).length === 0)? '' : this.data.data.comments
          ),
        });
      }
    }
  }
  onSave() {
    this.dialogRef.close(this.form);
  }
}
