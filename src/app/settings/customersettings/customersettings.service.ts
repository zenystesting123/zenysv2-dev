import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Customer } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class CustomersettingsService {
  constructor(private db: AngularFirestore) {}

  //for storing leadsource related data into user level
  updateCust(path1, itemId: string, item: any, leadOpns) {
    return this.db
      .collection(path1)
      .doc(itemId)
      .update({ ...item, custLead: leadOpns });
  }



  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsContact: fields });
  }

  //for updating latest additional field update to db in user level
  updateFollowUpFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsFollowUp: fields });
  }
  //for getting profile defaults to enable and disable edit
  readProfileDefinition(superUserId: string, profilename: string) {
    return this.db
      .collection<any>('users/' + superUserId + '/profilesDefault', (ref) =>
        ref.where('profileName', '==', profilename)
      )
      .valueChanges();
  }
  updateCustomerAgeActive(id, custAgeactive) {
    return this.db.doc('users/' + id).update({ actCustAgeing: custAgeactive });
  }
  updatePipeLinenames(id, pNames) {
    return this.db.doc('users/' + id).update({ pipelineNamesCustomer: pNames });
  }
  //customisable field
  updateFieldCustomization(superUserId, contactSettings) {
    return this.db.doc('users/' + superUserId).update({
      contactSettings,
    });
  }
  // update Single field name functions
  // contact
  updateContactfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameContact';
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
  //Followup
  updateFollowupfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameFollowup';
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
  //Task
  updateTaskfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameTask';
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

    //contact customdDocument_Upload
  docUpload(id,fields) {
    return this.db.doc('users/' + id).update({contactCustomDoc:fields});
  }
  
}
