import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ExpenseSettingsService {

  constructor(private db: AngularFirestore) { }
  //for updating expense category in user level
  updateExpenseCat(id:any,status:any){
    return this.db.doc('users/' + id ).update({expenseCategory:status});
  }
   //for updating latest additional field update to db in user level
   updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsExpense: fields });
  }
  updateFieldCustomization(superUserId, expenseSettings) {
    return this.db.doc('users/' + superUserId).update({
      expenseSettings
     });
  }
   // Expense
   updateExpensefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameExpense';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
}
