/*********************************************************************************
Description: component used for error message while uploading customers in csv if not a paid user after customer limit
Inputs: 
Outputs: 
***********************************************************************************/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { loadStripe } from '@stripe/stripe-js';
export interface customerUpload {
  uploadNo: number;
  currentNo: number;
  pendingNo: number;
} //used in upload-customer-list-popup-component
@Component({
  selector: 'app-upload-customer-limit-popup',
  templateUrl: './upload-customer-limit-popup.component.html',
  styleUrls: ['./upload-customer-limit-popup.component.scss']
})
export class UploadCustomerLimitPopupComponent implements OnInit {
  user: firebase.default.UserInfo;//for getting user info
  constructor(@Inject(MAT_DIALOG_DATA) public value: customerUpload,
  private db:AngularFirestore, public dialogRef: MatDialogRef<UploadCustomerLimitPopupComponent> ) { }

  ngOnInit(): void {
    // console.log(this.value.currentNo,this.value.pendingNo,this.value.uploadNo)
  }
  //closing pop up
  close() {
    this.dialogRef.close();
  }
  //redirecting  user to payment page with other details
  async pay(){
    const docRef=await this.db.collection('users').doc(this.user.uid).collection('checkout_sessions').add({
      price: 'price_1IvQcHSCUjCHJT5Xx7Dhz7a8',
      success_url: window.location.origin+'/dash/home',
      cancel_url: window.location.origin+'/dash/home',
    });
    docRef.onSnapshot(async (snap)=>{
      const {error,sessionId} = snap.data();
      if(error){
        alert(error.message);
      }
      if(sessionId){
        const stripe= await loadStripe(
          'pk_live_51IhrAaSCUjCHJT5XNEg7uLZ9ulxitFkdV9rhoDRdjIkzA9jAIu8iCXzIGgi63cpxNEYuN7T5P5lN4gpO3b8L3jqZ00rprpBxyy'
        );
       await stripe.redirectToCheckout({sessionId});
      }
  
    });
  }
}
