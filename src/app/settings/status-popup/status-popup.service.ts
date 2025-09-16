import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from 'projects/customers/src/app/data-models';
import { map, take } from 'rxjs/operators';
import {
  FollowUps,
  OrganisationModel,
  organisationSettings,
  paymentDetails,
  ProductInSaleModel,
  ProductModel,
  Profile,
  Service,
  serviceStage,
} from 'src/app/data-models';
import { Customer, Expenses, Sales } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class StatusPopupService {
  constructor(private db: AngularFirestore) {}
  //for update updated customer status in user level

  updateCustStatus(id: any, status: any, statusAge: any) {
    return this.db
      .doc('users/' + id)
      .update({ custStatus: status, custStatusAge: statusAge });
  }

  //for update updated sale status in user level
  updateSaleStatus(id: any, status: any, statusAge: any) {
    return this.db
      .doc('users/' + id)
      .update({ saleStatus: status, saleStatusAge: statusAge });
  }
  updateServiceStatus(id: any, status: any, ageStatus: any) {

    let serviceStage = [];
    for (let i = 0; i < status.length; i++) {
      serviceStage[i] = {
        name: status[i],
        age: ageStatus[i],
      };
    }

    return this.db.doc('users/' + id).update({ serviceStages: serviceStage });
  }
  updateServiceStatusPipeline(
    id: any,
    status: any,
    ageStatus: any,
    selectedServPipeline
  ) {

    let serviceStage = [];
    for (let i = 0; i < status.length; i++) {
      serviceStage[i] = {
        name: status[i],
        age: ageStatus[i],
      };
    }
    if (selectedServPipeline === 0) {
      return this.db.doc('users/' + id).update({ serviceStages: serviceStage });
    } else if (selectedServPipeline === 1) {
      return this.db
        .doc('users/' + id)
        .update({ serviceStagesAddOne: serviceStage });
    } else if (selectedServPipeline === 2) {
      return this.db
        .doc('users/' + id)
        .update({ serviceStagesAddTwo: serviceStage });
    } else if (selectedServPipeline === 3) {
      return this.db
        .doc('users/' + id)
        .update({ serviceStagesAddThree: serviceStage });
    } else if (selectedServPipeline === 4) {
      return this.db
        .doc('users/' + id)
        .update({ serviceStagesAddFour: serviceStage });
    }
  }
  updateSaleStatusPipeline(
    id: any,
    status: any,
    ageStatus: any,
    selectedSalePipeline
  ) {

    let saleStage = [];
    for (let i = 0; i < status.length; i++) {
      saleStage[i] = {
        name: status[i],
        age: ageStatus[i],
      };
    }
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
  updateContactStatusPipeline(
    id: any,
    status: any,
    ageStatus: any,
    selectedContactPipeline
  ) {

    let contactStatus = [];
    for (let i = 0; i < status.length; i++) {
      contactStatus[i] = {
        name: status[i],
        age: ageStatus[i],
      };
    }


    if (selectedContactPipeline === 0) {
      return this.db
        .doc('users/' + id)
        .update({ contactStatus: contactStatus });
    } else if (selectedContactPipeline === 1) {
      return this.db
        .doc('users/' + id)
        .update({ contactStatusAddOne: contactStatus });
    } else if (selectedContactPipeline === 2) {
      return this.db
        .doc('users/' + id)
        .update({ contactStatusAddTwo: contactStatus });
    } else if (selectedContactPipeline === 3) {
      return this.db
        .doc('users/' + id)
        .update({ contactStatusAddThree: contactStatus });
    } else if (selectedContactPipeline === 4) {
      return this.db
        .doc('users/' + id)
        .update({ contactStatusAddFour: contactStatus });
    }
  }
  //for update updated expense category in user level
  updateExpenseStatus(id: any, status: any) {
    return this.db.doc('users/' + id).update({ expenseCategory: status });
  }

  //getting all customers having status as previous status
  getCustWithPrevStatus(id: String, status) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.where('status', '==', status)
      )
      .snapshotChanges();
  }

  //getting all customers having status as previous status
  getServWithPrevStages(id: String, status) {
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref.where('servicesStage', '==', status)
      )
      .snapshotChanges();
  }
  //getting all customers having status as previous status
  getServWithPrevStagesPipeline(id: String, status, selectedPipeline) {

    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('servicesStage', '==', status)
          .where('selectedServPipeline', '==', selectedPipeline)
      )
      .snapshotChanges();
  }
  //getting all customers having status as previous status
  getSalesWithPrevStagesPipeline(id: String, status, selectedPipeline) {

    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('salesStage', '==', status)
          .where('selectedSalePipeline', '==', selectedPipeline)
      )
      .snapshotChanges();
  }
  getContactWithPrevStatusPipeline(id: String, status, selectedPipeline) {

    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('status', '==', status)
          .where('selectedContactPipeline', '==', selectedPipeline)
      )
      .snapshotChanges();
  }
  //getting all customers with additional fields
  getCustWithAddFields(id: String): Promise<Customer[]> {
    return this.db
      .collection('users/' + id + '/customers')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  //getting all expense with additional fields
  getExpenseWithAddFields(id: String): Promise<Expenses[]> {
    return this.db
      .collection('users/' + id + '/Expenses')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Expenses)
          )
        )
      )
      .toPromise();
  }
  //getting all estimate with additional fields
  getEstimateWithAddFields(id: String): Promise<any[]> {
    return this.db
      .collection('users/' + id + '/Estimates')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as any)
          )
        )
      )
      .toPromise();
  }
  //getting all invoice with additional fields
  getInvoiceWithAddFields(id: String): Promise<any[]> {
    return this.db
      .collection('users/' + id + '/Invoices')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as any)
          )
        )
      )
      .toPromise();
  }
  //getting all Quotations with additional fields
  getQuotationWithAddFields(id: String): Promise<any[]> {
    return this.db
      .collection('users/' + id + '/Quotations')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as any)
          )
        )
      )
      .toPromise();
  }
  // //getting all org with additional fields
  // getOrganisationWithAddFields(id: String): Promise<organisationSettings[]> {
  //   return this.db
  //     .collection('users/' + id + '/Quotations')
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //           ({
  //             id: a.payload.doc.id,
  //             ...(a.payload.doc.data() as {}),
  //           } as OrganisationModel)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  //getting all org with additional fields
  getOrganisationWithAddFields(id: String): Promise<any[]> {
    return this.db
      .collection('users/' + id + '/Organisations')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as any)
          )
        )
      )
      .toPromise();
  }
  //getting all sales with additional fields
  getPaymentWithAddFields(id: String): Promise<paymentDetails[]> {
    return this.db
      .collection('users/' + id + '/payments')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as paymentDetails)
          )
        )
      )
      .toPromise();
  }
  //getting all sales with additional fields
  getSalesWithAddFields(id: String): Promise<Sales[]> {
    return this.db
      .collection('users/' + id + '/sales')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  //getting all sales having sale stage as previous stage
  getSaleWithPrevStatus(id: String, status) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('salesStage', '==', status)
      )
      .snapshotChanges();
  }
  //getting all expenses corresponding to the user
  async getExpense(id: String, category): Promise<Expenses[]> {
    return await this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('category', '==', category)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Expenses)
          )
        )
      )
      .toPromise();
  }

  //for updating new status history and  customer status
  async onUpdateCustStatus(userId, id, newStatus, newHistory) {
    return await this.db
      .doc('users/' + userId + '/customers/' + id)
      .update({ status: newStatus, stageHistory: newHistory });
  }
  //for updating new status history and sale status
  async onUpdateSaleStatus(userId, id, newStatus, newHistory) {
    return await this.db
      .doc('users/' + userId + '/sales/' + id)
      .update({ salesStage: newStatus, stageHistory: newHistory });
  }
  async onUpdateServiceStages(userId, id, newStatus, newHistory) {

    return await this.db
      .doc('users/' + userId + '/services/' + id)
      .update({ servicesStage: newStatus, stageHistory: newHistory });
  }
  //for updating expense categories
  onUpdateExpenseCategory(userId, id, newStatus) {
    this.db
      .doc('users/' + userId + '/Expenses/' + id)
      .update({ category: newStatus });
  }
  //for getting user data
  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }

  //for updating cutsom fields in customer in userlevel
  updateCustomField(id, arrayName:string, array) {
    return this.db.doc('users/' + id).update({ [arrayName]: array });
  }

  //for updating cutsom fields in customer in userlevel
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsContact: fields });
  }
  //for updating cutsom fields in sale in userlevel
  updateCustomFieldsSale(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsSale: fields });
  }
  //for updating cutsom fields in sale in userlevel
  updateCustomFieldsExpense(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsExpense: fields });
  }
  //for updating cutsom fields in payment in userlevel
  updateCustomFieldsPayment(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsPayment: fields });
  }
  //for updating cutsom fields in sale in userlevel
  updateCustomFieldsEstimate(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsEstimate: fields });
  }
  //for updating cutsom fields in invoice in userlevel
  updateCustomFieldsInvoice(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsInvoices: fields });
  }
  //for updating cutsom fields in quotation in userlevel
  updateCustomFieldsQuotation(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsQuotation: fields });
  }
  //for updating cutsom fields in organisation in userlevel
  updateCustomFieldsOrganisation(id, fields) {
    return this.db
      .doc('users/' + id)
      .update({ customFieldsOrganisation: fields });
  }

  //for updating cutsom fields in service in userlevel
  updateCustomFieldsService(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsService: fields });
  }
  //for updating cutsom fields in tasks in userlevel
  updateCustomFieldsTask(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsTask: fields });
  }
  //for updating cutsom fields in product in userlevel
  updateCustomFieldsProduct(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsProduct: fields });
  }
  updateCustomFieldsFollowUp(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsFollowUp: fields });
  }
  //Update additionalFieldsArray in services collection
  updateAdditionalFieldsServices(id, serviceId, fields) {
    return this.db
      .doc('users/' + id + '/services/' + serviceId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArray in task collection
  updateAdditionalFieldsTask(id, taskId, fields) {
    return this.db
      .doc('users/' + id + '/tasks/' + taskId)
      .update({ additionalFieldsArr: fields });
  }
  // return this.db.collection(path1).doc<Profile>(itemId).valueChanges();

  //Update additionalFieldsArray in products collection
  updateAdditionalFieldsProducts(id, productId, fields) {
    return this.db
      .doc('users/' + id + '/products/' + productId)
      .update({ additionalFieldsArr: fields });
  }

  //Update additionalFieldsArray in sales collection
  updateAdditionalFieldsFollowUp(id, docId, fields) {
    return this.db
      .doc('users/' + id + '/Follow Ups/' + docId)
      .update({ additionalFieldsArr: fields });
  }
  //getting all sales with additional fields
  getServicesWithAddFields(id: string): Promise<Service[]> {
    return this.db
      .collection('users/' + id + '/services')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }
  //getting all task with additional fields
  getTaskWithAddFields(id: string): Promise<Task[]> {
    return this.db
      .collection('users/' + id + '/tasks')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Task)
          )
        )
      )
      .toPromise();
  }
  //getting all products with additional fields
  getProductsWithAddFields(id: string): Promise<ProductModel[]> {
    return this.db
      .collection('users/' + id + '/products')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as ProductModel)
          )
        )
      )
      .toPromise();
  }

  //getting all sales with items collection with additional fields
  getItemsWithAddFields(productId) {
    return this.db
      .collectionGroup('items', (ref) =>
        ref.where('productId', '==', productId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
                ref: a.payload.doc.ref,
                refId: a.payload.doc.ref.path,
              } as any)
          )
        )
      )
      .toPromise();
  }
  //getting all followup with additional fields
  getFollowUpsWithAddFields(id: string): Promise<FollowUps[]> {
    return this.db
      .collection('users/' + id + '/Follow Ups')
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as FollowUps)
          )
        )
      )
      .toPromise();
  }
  //Update additionalFieldsArray in customers collection
  updateAdditionalFieldsContact(id, custId, fields) {
    return this.db
      .doc('users/' + id + '/customers/' + custId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArray in sales collection
  updateAdditionalFieldsSales(id, salesId, fields) {
    return this.db
      .doc('users/' + id + '/sales/' + salesId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArray in sales collection
  updateAdditionalFieldsItems(id, salesId, itemId, fields) {
    return this.db
      .doc('users/' + id + '/sales/' + salesId + '/items/' + itemId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArray in sales collection
  updateAdditionalFieldsExpense(id, expenseId, fields) {
    return this.db
      .doc('users/' + id + '/Expenses/' + expenseId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArray in payments collection
  updateAdditionalFieldsPayment(id, expenseId, fields) {
    return this.db
      .doc('users/' + id + '/payments/' + expenseId)
      .update({ additionalFieldsArr: fields });
  }
  updateAdditionalFieldsEstimate(id, estimateId, fields) {
    return this.db
      .doc('users/' + id + '/Estimates/' + estimateId)
      .update({ additionalFieldsArr: fields });
  }
  updateAdditionalFieldsInvoices(id, invoiceId, fields) {
    return this.db
      .doc('users/' + id + '/Invoices/' + invoiceId)
      .update({ additionalFieldsArr: fields });
  }
  updateAdditionalFieldsquotation(id, quotationId, fields) {
    return this.db
      .doc('users/' + id + '/Quotations/' + quotationId)
      .update({ additionalFieldsArr: fields });
  }
  updateDisplayField(id, keyValuePair) {
    return this.db.doc('users/' + id).update(keyValuePair);
  }
  updateReportSettings(id, ReportSettings) {
    return this.db
      .doc('users/' + id)
      .update({ ReportSettings: ReportSettings });
  }
  async getUser(userId: string): Promise<Profile> {
    return await this.db
      .doc<Profile>('users/' + userId)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }
  updateAdditionalFieldsOrganisation(id, organisationId, fields) {
    return this.db
      .doc('users/' + id + '/Organisations/' + organisationId)
      .update({ additionalFieldsArr: fields });
  }
  getSaleItems(sId, index, prodIdArray) {
    let queryItem = `itemsArray.${index}.productId`;
    return this.db
      .collection('users/' + sId + '/sales', (ref) =>
        ref.where(queryItem, 'in', prodIdArray)
      )
      .snapshotChanges();
  }
  async updateCatNameInItem(sid, saleid, itemsArray) {

    return await this.db
      .doc('users/' + sid + '/sales/' + saleid)
      .update({ itemsArray });
  }
  updateContacDocs(id, fields,fieldName) {
    return this.db.doc('users/' + id).update({ [fieldName]
      : fields });
  }
}
