import { TemplatePrevService } from '../template-prev.service';
// import { DashboardService } from './../dashboard.service';
// import { CrudopService } from 'app/crudop.service';
import { Component, Inject, Input, OnInit } from '@angular/core';

// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DocumentsettingsComponent } from 'src/app/settings/documentsettings/documentsettings.component';
import * as firebase from 'firebase';
export interface DialogData {
  id: '1' | '2' | '3'| '4' | '5';
}

@Component({
  selector: 'app-template-prev2',
  templateUrl: './template-prev2.component.html',
  styleUrls: ['./template-prev2.component.scss']
})
export class TemplatePrev2Component implements OnInit {
id:any;
accountType:any;
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
  templateUpdate2(){
    this.db.updatePreview(this.id,"template2");
    localStorage.setItem("preview", "template2");
    // this.activeModal.close();
    this.dialogRef.close();
    // this.toastr.info('Template 2 ',"selected");
  }
  close(){
    this.dialogRef.close();
  }
}
