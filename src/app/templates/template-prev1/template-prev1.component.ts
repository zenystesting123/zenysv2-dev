import { DocumentsettingsComponent } from './../../settings/documentsettings/documentsettings.component';
import { TemplatePrevService } from './../template-prev.service';
import { Component, Inject, Input, OnInit } from '@angular/core';

// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as firebase from 'firebase';
export interface DialogData {
  id: '1' | '2' | '3'| '4' | '5';
}


@Component({
  selector: 'app-template-prev1',
  templateUrl: './template-prev1.component.html',
  styleUrls: ['./template-prev1.component.scss']
})
export class TemplatePrev1Component implements OnInit {
id:any;
accountType:string;
  constructor(public dialogRef: MatDialogRef<DocumentsettingsComponent>, private db:TemplatePrevService,@Inject(MAT_DIALOG_DATA) public data: DialogData ) { 

    this.id= firebase.default.auth().currentUser.uid
    if (this.id) this.db.getNew('/users', this.id).subscribe(p => {
    
      this.accountType = p.accountType;

      if (p.accountType == "SuperUser") {
        // this.notEdit = false;
       
      }else if(p.accountType=="Admin"){
    
        this.id=p.superUserId;
        // this.db1.getNew('/users', this.id).subscribe(p => {this.form = p
      
        // });

      }else{
       
       
      }
   

   
  
    });

  }


  ngOnInit(): void {
  }
  templateUpdate1(){
    this.db.updatePreview(this.id,"template1");
    localStorage.setItem("preview", "template1");
      this.dialogRef.close();
    // this.activeModal.close();
    // this.toastr.info('Template 1 ',"selected");  

  }
  close(){
    this.dialogRef.close();
  }

}
