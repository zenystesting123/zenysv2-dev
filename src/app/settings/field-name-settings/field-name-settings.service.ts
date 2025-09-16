import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FieldNameSettingsService {
  constructor(private db: AngularFirestore) {}

  // update Single field name functions
  // contact
  updateContactfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameContact';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Sale
  updateSalefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameSale';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Sale
  updateServicefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameService';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  //Followup
  updateFollowupfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameFollowup';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  //Task
  updateTaskfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameTask';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Meeting
  updateMeetingfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameMeeting';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Estimate
  updateEstimatefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameEstimate';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Quotation
  updateQuotationfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameQuotation';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Invoice
  updateInvoicefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameInvoice';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Collection
  updateCollectionfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameCollection';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Expense
  updateExpensefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameExpense';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Items
  updateItemsfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameItems';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // Items
  updateItemscategoryfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameItemsCategory';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // ContactNotes
  updateContactNotesfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameContactNotes';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // SaleNotes
  updateSaleNotesfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameSaleNotes';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
}
