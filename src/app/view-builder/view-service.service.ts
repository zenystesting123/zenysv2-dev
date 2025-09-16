import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ViewServiceService {

  constructor(private db: AngularFirestore) { }

  onSaveView(userId, viewSettings, module){
    if(module == 'customers'){
     return this.db.doc('users/' + userId).update({
        customerViewSettings: viewSettings
      });
    } else if(module == 'sales'){

      return this.db.doc('users/' + userId).update({
        saleViewSettings: viewSettings
      });
    }else if (module =='tasks'){
      return  this.db.doc('users/' + userId).update({
        taskViewSettings: viewSettings
      });
    }
    else if(module == 'paymentsreceived'){

      return this.db.doc('users/' + userId).update({
        paymentViewSettings: viewSettings
      });
    }
    else if(module == 'Estimates'){
      return this.db.doc('users/' + userId).update({
        estimateViewSettings: viewSettings
      });
    }
    else if(module == 'Invoices'){
      return this.db.doc('users/' + userId).update({
        invoiceViewSettings: viewSettings
      });
    }
    else if(module == 'Quotations'){
      return this.db.doc('users/' + userId).update({
        quotationViewSettings: viewSettings
      });
    }
    else if(module == 'Follow Ups'){
      return this.db.doc('users/' + userId).update({
        followUpViewSettings: viewSettings
      });
    }
    else if(module == 'services'){
      return this.db.doc('users/' + userId).update({
        serviceViewSettings: viewSettings
      });
    }else if(module == 'Organisation'){
      return this.db.doc('users/' + userId).update({
        orgViewSettings: viewSettings
      });
    }
    else if(module == 'Expenses'){
      return this.db.doc('users/' + userId).update({
        expenseViewSettings: viewSettings
      });
    }
  }

}

