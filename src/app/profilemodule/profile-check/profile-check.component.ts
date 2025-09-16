import { ProfileEditComponentComponent } from './../profile-edit-component/profile-edit-component.component';

import { ProfileCheckService } from './profile-check.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';

import { Router } from '@angular/router';

export interface DataValue {

  mode: string;
}

@Component({
  selector: 'app-profile-check',
  templateUrl: './profile-check.component.html',
  styleUrls: ['./profile-check.component.scss']
})
export class ProfileCheckComponent implements OnInit {
  id: any;
  forms: any;
  newUser:boolean;
  loading:boolean=true;
  constructor(public dialog: MatDialog, public db: ProfileCheckService, public dialogRef: MatDialogRef<ProfileEditComponentComponent>, private router: Router,) {
    var myVar = setInterval(() => {
      this.id = firebase.default.auth().currentUser?.uid;
      if (this.id) this.db.getNews('/users', this.id).pipe(take(1)).subscribe(p => this.forms = p);
      if (this.forms) {
    
        if (this.forms?.publicProfCreated==true) {
          this.loading=false;
          // this.router.navigate(["/dash/profile/profile"])
          this.router.navigate(["/dash/profile/profileedit/edit/"+this.forms.publicProfileID])
          this.dialogRef.close();
          // this.router.navigate(["/dash/profile"])
          clearInterval(myVar);
        }
        else {
          this.newUser=true;
          this.loading=false;
          clearInterval(myVar);
        }
      }

    }, 50)
  }
  close(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
  editProfile() {
    this.dialogRef.close();
    // this.dialog.open(ProfileEditComponent, {
    //   data: {
    //     mode:"create"
      
    //   }
    // });
    this.router.navigate(["/dash/profile/profileedit/create/new"])
  }
}
