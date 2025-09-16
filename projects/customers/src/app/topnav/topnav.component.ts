import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {

  constructor(public afauth:AngularFireAuth,public router:Router) {
    this.afauth.authState.subscribe((user)=>{

    })
   }

  ngOnInit(): void {
  }

  logout(){
    // console.log("hello")
    this.afauth.signOut()
    this.router.navigate(['/login'])
  }




}
