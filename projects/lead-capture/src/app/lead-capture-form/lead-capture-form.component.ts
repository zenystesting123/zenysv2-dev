
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadCaptureFormService } from './lead-capture-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lead-capture-form',
  templateUrl: './lead-capture-form.component.html',
  styleUrls: ['./lead-capture-form.component.scss'],
})
export class LeadCaptureFormComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>(); //Subject that emits when the component has been destroyed.
  superUserId: any; //to store superuser id
  columns = []; //store form fields
  selectedFormId: string; //store form's id
  leadCapFields: any[]; //store total forms obj
  forms: any[]; //store form names
  formTitles: any[];  //store form title
  sharedDocId: string;  //store document id
  loader: boolean = true; //to show updating data
  formTitle: string = ""; //store form title
  logoStatus: boolean[] = []; //store status of logo
  logoUrl: string = ""; //store url of logo
  logoStatusVal: boolean = false; //to enable logo in form
  noOfFields: number = 0;
  activeStatus: boolean[] = []; //store status of the form whether it is active or not
  constructor(
    private LeadCaptureFormService: LeadCaptureFormService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    route.params.pipe(takeUntil(this._onDestroy)).subscribe((val) => {
      //Section 1: Get the information passed on to the module using router link
      this.sharedDocId = this.route.snapshot.paramMap.get('docId'); // get document id
      this.selectedFormId = this.route.snapshot.paramMap.get('formId'); // get form id
      //get form details from db using id obtained through link
      this.LeadCaptureFormService.getDocument(this.sharedDocId)
        .pipe(takeUntil(this._onDestroy))
        .subscribe((sharedFormData) => {
          if(sharedFormData){
            //fetch superuser id
            this.superUserId = sharedFormData.superUserId;
            //fetch fields object
            if (sharedFormData.leadCaptureFields) {
              this.leadCapFields = sharedFormData.leadCaptureFields;
            }
            //get form names
            if (sharedFormData.leadCaptureFormNames) {
              this.forms = sharedFormData.leadCaptureFormNames;
            }
            //get form title
            if (sharedFormData.leadCaptureFormTitles) {
              this.formTitles = sharedFormData.leadCaptureFormTitles;
            }
            //get logo status for each field
            if (sharedFormData.logoStatus) {
              this.logoStatus = sharedFormData.logoStatus;
            }
            //get active status for each form
            if (sharedFormData.activeStatus) {
              this.activeStatus = sharedFormData.activeStatus;
            } else {
              //if active status not available in old forms, manually add active status as true
              if(this.leadCapFields.length > 0){
                
                this.activeStatus = [];
                this.leadCapFields.forEach(field => {
                  this.activeStatus.push(true);
                })
              }
            }
            //get logo url
            if (sharedFormData.logoUrl) {
              this.logoUrl = sharedFormData.logoUrl;
            }
            //if form titles not available in old forms, manually add it as 'contact us'
            if(!this.formTitles && this.leadCapFields.length > 0){
              this.formTitles = [];
              this.leadCapFields.forEach(field => {
                this.formTitles.push('Contact Us');
              })
            }
            //if logo status not available in old forms, manually add logo status as false
            if(!this.logoStatus && this.leadCapFields.length > 0){
              this.logoStatus = [];
              this.leadCapFields.forEach(field => {
                this.logoStatus.push(false);
              })
            }
            
            this.columns = [];
            //get form details if main object is available in db
            if (this.leadCapFields !== undefined) {
              if (this.leadCapFields[this.selectedFormId]) {
                this.formTitle = this.formTitles[this.selectedFormId] ? this.formTitles[this.selectedFormId] : '';
                this.logoStatusVal = this.logoStatus[this.selectedFormId] ? this.logoStatus[this.selectedFormId] : false;
                const fieldObj = this.leadCapFields[this.selectedFormId];
                //now this.columns has the selected form fields
                this.columns = Object.values(fieldObj);
                //convert date and time values
                this.columns.forEach((field) => {
                  
                  if(field.inputType == 'date_time'){  
                    field.defaultValue = field.defaultValue ? field.defaultValue.toDate() : '';
                    field.defaultValue2 = field.defaultValue2 ? field.defaultValue2 : '00:00'
                  }
                  if(field.inputType == 'date'){
                    field.defaultValue = field.defaultValue ? field.defaultValue.toDate() : ''; 
                  }
                })
              }
            }
            this.columns.forEach((field) => { 
              if(field.fieldType == 'input_field'){
                this.noOfFields++; 
              }
            })
          }
          //set loader false when data is loaded
          this.loader = false;
        });
    });
  }

  ngOnInit(): void {}
  //calls cloud function to create the form
  onSubmit(form: NgForm) {
    //added console on purpose to view form values submitted
    let formVal = form.value;
    console.log(form.value)

    for (let i = 0; i < this.columns.length; i++) {
      //convert date time values to store in db
      if (this.columns[i].inputType == 'date_time') {
        //get field name of the date field 
        let fieldName = this.columns[i].customField ? this.columns[i].custIndex : this.columns[i].columnDef;
        //get field name of the time field 
        let fieldName2 = fieldName + '_time';
        Object.keys(formVal).forEach(key => {
          //if form value is the field name,
          if(key == fieldName){
            //if time value not selected in form, set it as 00
            if(formVal[fieldName2] == '' || formVal[fieldName2] == undefined){
              formVal[fieldName2] = '00:00'
            }
            //if time value available, convert it and add it with date value to store it as a single value
            if (formVal[fieldName] && formVal[fieldName2]) {
              var time_splitEdit = formVal[fieldName2].split(':');
              const date_timEditVal = new Date(
                new Date(formVal[fieldName]).getFullYear(),
                new Date(formVal[fieldName]).getMonth(),
                new Date(formVal[fieldName]).getDate(),
                Number(time_splitEdit ? time_splitEdit[0] : null),
                Number(time_splitEdit ? time_splitEdit[1] : null)
              )
              formVal[fieldName] = date_timEditVal ? date_timEditVal : null
            }
            //delete time field which is not required not from form value object
            delete formVal[fieldName2]
          }
        })
      } 
    }
    
    //send form data, form id, and doc id through request to cloud function
    this.LeadCaptureFormService.sendHttpRequest(this.sharedDocId, this.selectedFormId, formVal)
    .pipe(takeUntil(this._onDestroy))
    .subscribe((data) => {
      //console.log(data);
    })
    
    this._snackBar.open('Thank you for submitting your details!', '', {
      duration: 500,
    });
    //reset the input form values to allow user to submit form again
    this.columns.forEach(col => {
      if(col.fieldType == 'input_field'){
        col.defaultValue = ''
        form.value[col.columnDef]
      }
    });
    //clear validation messages if any
    Object.keys(form.controls).forEach((key) => {
      const control = form.controls[key];
      control.markAsPristine();
      control.markAsUntouched();
  });
   }

  //display validation message
  TypeError(form) {
    this._snackBar.open('Please fill all the mandatory fields', '', {
      duration: 2000,
    });
  }

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
