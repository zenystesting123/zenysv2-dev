import { Profile } from './../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SalesettingsService {
  constructor(private db: AngularFirestore) {}
  itemQtyDisplayFn(superUserId: string, itemQtyDisplay) {
    return this.db.doc('users/' + superUserId).update({
      itemQtyDisplay,
    });
  }
  itemMaxAllowedFn(superUserId: string, itemMaxAllowed) {
    return this.db.doc('users/' + superUserId).update({
      itemMaxAllowed,
    });
  }
  //for updating latest status to db in user level
  updateSaleStatus(id: any, status: any, ageStatus: any) {
    return this.db
      .doc('users/' + id)
      .update({ saleStatus: status, saleStatusAge: ageStatus });
  }
  //for getting profile defaults to enable and disable edit
  readProfileDefinition(superUserId: string, profilename: string) {
    return this.db
      .collection<any>('users/' + superUserId + '/profilesDefault', (ref) =>
        ref.where('profileName', '==', profilename)
      )
      .valueChanges();
  }
  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsSale: fields });
  }
  updateSaleAgeActive(id, saleAgeactive) {
    return this.db.doc('users/' + id).update({ actSaleAgeing: saleAgeactive });
  }
  updatePipeLinenames(id, pNames) {
    return this.db.doc('users/' + id).update({ pipelineNamesSales: pNames });
  }
  //customisable fields update in db
  updateFieldCustomization(superUserId, saleSettings) {
    return this.db.doc('users/' + superUserId).update({
      saleSettings,
    });
  }
  // Sale
  updateSalefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameSale';
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
  updateSaleStatusPipeline(
    id: any,
    saleStage: any,
    selectedSalePipeline
  ) {
    // console.log(ageStatus);
    // let saleStage = [];
    // for (let i = 0; i < status.length; i++) {
    //   saleStage[i] = {
    //     name: status[i],
    //     age: ageStatus[i],
    //   };
    // }
    if (selectedSalePipeline === 0) {
      return this.db.doc('users/' + id).update({ saleStages: saleStage });
    } else if (selectedSalePipeline === 1) {
      return this.db.doc('users/' + id).update({ saleStagesAddOne: saleStage });
    } else if (selectedSalePipeline === 2) {
      return this.db.doc('users/' + id).update({ saleStagesAddTwo: saleStage });
    } else if (selectedSalePipeline === 3) {
      return this.db
        .doc('users/' + id)
        .update({ saleStagesAddThree: saleStage });
    } else if (selectedSalePipeline === 4) {
      return this.db
        .doc('users/' + id)
        .update({ saleStagesAddFour: saleStage });
    }
  }
  //sale customdDocument_Upload
  docUpload(id,fields) {
    return this.db.doc('users/' + id).update({saleCustomDoc:fields});
  }
}
