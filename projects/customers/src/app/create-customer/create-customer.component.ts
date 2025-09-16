import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CreatecustomerService } from './createcustomer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  userDetails:any

  constructor(public _firebaseAuth: AngularFireAuth, public router: Router,public createService:CreatecustomerService)
   {
     this._firebaseAuth.authState.subscribe((user)=>{
       if(user){
        this.createService.getCustomer(user.uid).subscribe((data)=>{
          console.log(data)
          if(data){
         this.router.navigate(['/dash/sale'])
          }
          else
          {
            this.createService.createCustomer(user.uid,{customerEmail:user.email,checkedIndate:Date.now()})
         this.router.navigate(['/dash/sale'])            
          }
        })
       }
       else
       {
        //  this.createService.
        this.router.navigate(['/login'])
       }
     })
    }

  ngOnInit(): void {
  }

}
