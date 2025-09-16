import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { contactSettings, defaultContactSettings, defaultSaleSettings, defaultServiceSettings, Profile, saleSettings, serviceSettings, SubUsers } from '../data-models';
import { customerCardFields, salesTableColumns, serviceTableColumns } from 'src/app/data-models';

@Component({
  selector: 'app-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss']
})
export class CardSettingsComponent implements OnInit {
  module:string='';
  private onDestroy$: Subject<void> = new Subject<void>();

  superUserDetails: Profile;
  contactFieldSettings: contactSettings;//Field customization settings for customer
  saleFieldSettings: saleSettings;// Field customization settings for sale
  serviceFieldSettings: serviceSettings;// Field customizations settings for service
  fieldCustomSettings: any;
  cardFields:any;
  customerColumns = customerCardFields;
  salesColumns = salesTableColumns;
  servicesColumns = serviceTableColumns;
  displayFieldsSaved: [];
  userDetails: Profile;
  userId: string;
  customFields: any[];
  disableSaveButton:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private db: AngularFirestore, private snackBar: MatSnackBar, public commonService: CommonService,private dialogRef: MatDialogRef<CardSettingsComponent>, ) {
    dialogRef.disableClose = true;
    this.commonService.userDatas
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((allData) => {
      this.userId = allData.authDetails.uid;
      this.userDetails = allData.userDetails
      this.superUserDetails = allData.superUserDetails;
      /*MK -1st Spe 2022 commenting our since we are getting the card settings as an input from the calling module
      if (allData.superUserDetails.contactSettings) {
        this.contactFieldSettings = allData.superUserDetails.contactSettings;
      } else {
        this.contactFieldSettings = defaultContactSettings.CONST_VALUE;
      }
      if (allData.superUserDetails.saleSettings) {
        this.saleFieldSettings = allData.superUserDetails.saleSettings;
      } else {
        this.saleFieldSettings = defaultSaleSettings.CONST_VALUE;
      }
      if (allData.superUserDetails.serviceSettings) {
        this.serviceFieldSettings = allData.superUserDetails.serviceSettings;
      } else {
        this.serviceFieldSettings = defaultServiceSettings.CONST_VALUE;
      }
*/
    })
  }

  ngOnInit(): void {

    this.module = this.data[0];
    this.cardFields = this.data[1]
     //removing additional field if it is removed from settings 
     this.data[2]?.forEach((element,index) => {
      if(!element.isActive){
        for (var i = this.cardFields?.length - 1; i >= 0; i--) {
          if (this.cardFields[i]?.fieldType == 'Additional' && 
              this.cardFields[i]?.columnDef == 'additionalFieldsArr[' + index + ']fieldValue' && this.cardFields[i]?.ind == index) {
              this.cardFields?.splice(i, 1)
          }
        }
      }
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cardFields, event.previousIndex, event.currentIndex);
    //console.log(this.columnsObj)
  }

  savetoDB(){
    
    //console.log("module", this.module)
    if(this.module == 'customer'){
      this.disableSaveButton = true;
      this.db.doc('users/'+this.userId).update({'customerCardFields':this.cardFields}).then((res)=>{
        this.dialogRef.close(this.cardFields);
        this.disableSaveButton = false;
      })
    }
    else if(this.module == 'sale'){
      this.disableSaveButton = true;
      this.db.doc('users/'+this.userId).update({'saleCardFields':this.cardFields})
      this.dialogRef.close(this.cardFields);
      this.disableSaveButton = false;
    }
    else if(this.module == 'service'){
      this.disableSaveButton = true;
      this.db.doc('users/'+this.userId).update({'serviceCardFields':this.cardFields})
      this.dialogRef.close(this.cardFields);
      this.disableSaveButton = false;
    }     else if(this.module == 'task'){
      this.disableSaveButton = true;
      this.db.doc('users/'+this.userId).update({'taskCardFields':this.cardFields})
      this.dialogRef.close(this.cardFields);
      this.disableSaveButton = false;
    }
    else if(this.module == 'followup'){
      this.disableSaveButton = true;
      this.db.doc('users/'+this.userId).update({'followupCardFields':this.cardFields})
      this.dialogRef.close(this.cardFields);
      this.disableSaveButton = false;
    }
     else{
      //do nothing
    }
    
  }
}
