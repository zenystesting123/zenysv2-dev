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
  selector: 'app-template-prev4',
  templateUrl: './template-prev4.component.html',
  styleUrls: ['./template-prev4.component.scss']
})
export class TemplatePrev4Component implements OnInit {
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
  templateUpdate4(){
    this.db.updatePreview(this.id,"template4");
    localStorage.setItem("preview", "template4");
    this.dialogRef.close();
    // this.activeModal.close();
    // this.toastr.info('Template 4 ',"selected");
  }
    close(){
    this.dialogRef.close();
  }
}
