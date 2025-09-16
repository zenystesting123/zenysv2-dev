
// import { DashboardService } from './../dashboard.service';
// import { CrudopService } from 'app/crudop.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { TemplatePrevService } from '../templates/template-prev.service';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as firebase from 'firebase';
export interface DialogData {
  id: '1' | '2' | '3'| '4' | '5';
}

@Component({
  selector: 'app-template-prev',
  templateUrl: './template-prev.component.html',
  styleUrls: ['./template-prev.component.scss']
})
export class TemplatePrevComponent implements OnInit {
  // @Input() id: number;
  preview:any;
  id:any=2;
  accountType:any;
  constructor( private db:TemplatePrevService,@Inject(MAT_DIALOG_DATA) public data: DialogData ) { 

    
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
    console.log(this.id)
    this.db.updatePreview( this.id,"template1");
    localStorage.setItem("preview", "template1");
    // this.activeModal.close();
    // this.toastr.info('Template 1 ',"selected");  

  }
  templateUpdate2(){
    console.log(this.id)
    this.db.updatePreview( this.id,"template2");
    localStorage.setItem("preview", "template2");
    // this.activeModal.close();
    // this.toastr.info('Template 2 ',"selected");
  }
  templateUpdate3(){
    console.log(this.id)
    this.db.updatePreview( this.id,"template3");
    localStorage.setItem("preview", "template3");
    // this.activeModal.close();
    // this.toastr.info('Template 3 ',"selected");
  }
  templateUpdate4(){
    console.log(this.id)
    this.db.updatePreview( this.id,"template4");
    localStorage.setItem("preview", "template4");
    // this.activeModal.close();
    // this.toastr.info('Template 4 ',"selected");
  }
  templateUpdate5(){
    console.log(this.id)
    this.db.updatePreview( this.id,"template5");
    localStorage.setItem("preview", "template5");
    // this.activeModal.close();
    // this.toastr.info('Template 5 ',"selected");
  }


}
