import { TemplatePrevService } from '../template-prev.service';
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
  selector: 'app-template-prev3',
  templateUrl: './template-prev3.component.html',
  styleUrls: ['./template-prev3.component.scss']
})
export class TemplatePrev3Component implements OnInit {
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
  templateUpdate3(){
    this.db.updatePreview(this.id,"template3");
    localStorage.setItem("preview", "template3");
    this.dialogRef.close();
    // this.activeModal.close();
    // this.toastr.info('Template 3 ',"selected");
  }
  close(){
    this.dialogRef.close();
  }
}
