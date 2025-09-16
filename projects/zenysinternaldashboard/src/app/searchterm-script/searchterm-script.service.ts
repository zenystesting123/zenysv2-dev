import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  contactStatus,
  contactStatusAddFour,
  contactStatusAddOne,
  contactStatusAddThree,
  contactStatusAddTwo,
  Customer,
  dashboardSettingsData,
  fbLeadsIntegrationModel,
  FollowUps,
  leadCaptureModel,
  pipelineNamesCustomer,
  pipelineNamesSales,
  pipelineNamesService,
  Profile,
  ReportSettingsData,
  Sales,
  saleStage,
  saleStageAddFour,
  saleStageAddOne,
  saleStageAddThree,
  saleStageAddTwo,
  Service,
  serviceStage,
  serviceStageAddFour,
  serviceStageAddOne,
  serviceStageAddThree,
  serviceStageAddTwo,
  SharedLeadCaptureModel,
  Task,
} from 'src/app/data-models';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomerSearchPopUpComponent } from 'src/app/customer-search-pop-up/customer-search-pop-up.component';
import { customerPipelines } from 'src/app/model/pipeline.modal';
@Injectable({
  providedIn: 'root',
})
export class SearchtermScriptService {
  constructor(private db: AngularFirestore) {}

  //for getting all the contacts
  getAllCustomers() {
    return this.db.collectionGroup('customers', (ref) => ref).snapshotChanges();
  }
  //for getting all the estimates
  getAllEstimates() {
    return this.db.collectionGroup('Estimates', (ref) => ref).snapshotChanges();
  }
  //for getting all the quotations
  getAllQuotations() {
    return this.db
      .collectionGroup('Quotations', (ref) => ref)
      .snapshotChanges();
  }
  //for getting all the invoices
  getAllInvoices() {
    return this.db.collectionGroup('Invoices', (ref) => ref).snapshotChanges();
  }
  //for getting all the sales
  getAllSale() {
    return this.db.collectionGroup('sales', (ref) => ref).snapshotChanges();
  }
  //Update all document using the db path
  onUpdate(dbPath, firstName, secondName, companyName) {
    return this.db.doc(dbPath).update({
      'searchTerm.firstName': firstName,
      'searchTerm.secondName': secondName,
      'searchTerm.companyName': companyName,
    });
  }
  onUpdatePrefix(dbPath, prefixAndDocNumber, docPrefix) {
    return this.db.doc(dbPath).update({
      'docData.prefixAndDocNumber': prefixAndDocNumber,
      'docData.docPrefix': docPrefix,
    });
  }
  async getAllInvoiePromise() {
    return await this.db
      .collectionGroup('Invoices', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();
  }
  async readSaleRecordPromise(userId: string, saleId: string) {
    return await this.db
      .doc<Sales>('users/' + userId + '/sales/' + saleId)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }
  async onUpdateDoc(dbPath, id) {
    return await this.db.doc(dbPath).update({
      'docData.saleAssignedToOwner': id,
    });
  }
  async getAllQuotationPromise() {
    return await this.db
      .collectionGroup('Quotations', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();
  }
  async getAllEstimatePromise() {
    return await this.db
      .collectionGroup('Estimates', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();
  }
  async getAllUsers(): Promise<Profile[]> {
    return await this.db
      .collection('users', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Profile)
          )
        )
      )
      .toPromise();
  }

  async getSingleUser(userId) {
    return await this.db
      .doc<any>('users/' + userId)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }

  async getCustomerData(userId, custId) {
    return await this.db
      .doc<any>('users/' + userId + '/customers/' + custId)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }

  async getAllCustomerPromise(userId: string): Promise<Customer[]> {
    return await this.db
      .collection('users/' + userId + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'asc')
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
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getAllSalePromise(userId: string): Promise<Sales[]> {
    return await this.db
      .collection('users/' + userId + '/sales', (ref) =>
        ref.orderBy('createdDate', 'asc')
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
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async updateUserCount(userId: string, length: number) {
    return await this.db.doc('users/' + userId).update({
      contactSequentialNumber: length,
    });
  }
  async updateCustomerCount(userId: string, customerId: string, count: number) {
    return await this.db
      .doc('users/' + userId + '/customers/' + customerId)
      .update({
        sequenceNumber: count,
      });
  }
  async updateUserSaleCount(userId: string, length: number) {
    return await this.db.doc('users/' + userId).update({
      saleSequentialNumber: length,
    });
  }
  async updateSaleCount(userId: string, saleId: string, count: number) {
    return await this.db.doc('users/' + userId + '/sales/' + saleId).update({
      sequenceNumber: count,
    });
  }
  copyCustomerfromDB() {
    let sourceId = 'yKQgLQv52WUiTRFTrqt3kFQhogy1';
    let targetId = 'oFSCatFWu5ej2vswvvaWVXey2MJ3';
    let custId = '00rSikUM92fZXQA803qxEdpaESg2';
    let customer: any;
    //read the customer
    //customer = await this.db.doc<Customer>('users/yKQgLQv52WUiTRFTrqt3kFQhogy/customers/00rSikUM92fZXQA803qxEdpaESg2').valueChanges().pipe(take(1));
    //console.log(customer)
  }

  //Function to read all customers from a particular user
  async getAllCustomerUserPromise(sourceUser): Promise<Customer[]> {
    return await this.db
      .collection('users/' + sourceUser + '/customers')
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

  //Function to add a customer to a user
  async createCustomer(targetUser, customerId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/customers/' + customerId)
      .set(data);
  }

  //Function to read all sales from a particular user
  async getAllSalesUserPromise(sourceUser): Promise<Sales[]> {
    return await this.db
      .collection('users/' + sourceUser + '/sales')
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

  //Function to add a customer to a user
  async createSales(targetUser, saleId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/sales/' + saleId)
      .set(data);
  }

  async getAllItemsFromSalePromise() {
    return await this.db
      .collectionGroup('items', (ref) => ref)
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

  async addItemtoSale(targetUser, saleId, itemId, data) {
    return await this.db
      .doc('users/' + targetUser + '/sales/' + saleId + '/items/' + itemId)
      .set(data);
  }

  //Function to read all quotes from a particular user
  async getAllEstimatesUserPromise(sourceUser): Promise<Sales[]> {
    return await this.db
      .collection('users/' + sourceUser + '/Estimates')
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

  //Function to add a quote to a user
  async createQuote(targetUser, quoteId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/Estimates/' + quoteId)
      .set(data);
  }

  //Function to read all tasks from a particular user
  async getAllTasksUserPromise(sourceUser): Promise<Task[]> {
    return await this.db
      .collection('users/' + sourceUser + '/tasks')
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

  async getAllSubUserPromise(sourceUser): Promise<any[]> {
    return await this.db
      .collection('users/' + sourceUser + '/subUsers')
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

  //Function to add a task to a user
  async createTask(targetUser, quoteId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/tasks/' + quoteId)
      .set(data);
  }

  async createSubUser(targetUser, userId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/subUsers/' + userId)
      .set(data);
  }

  async getAllProductsPromise(sourceUser): Promise<any[]> {
    return await this.db
      .collection('users/' + sourceUser + '/products')
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
  async createProduct(targetUser, prodId: string, data) {
    return await this.db
      .doc('users/' + targetUser + '/products/' + prodId)
      .set(data);
  }
  async updateUserProfile(userId: string, custStatusAge, saleStatusAge) {
    return await this.db.doc('users/' + userId).update({
      custStatusAge: custStatusAge,
      saleStatusAge: saleStatusAge,
    });
  }

  //for getting all the followup
  async getAllFollowup() {
    return await this.db
      .collectionGroup('Follow Ups', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();
  }
  async updateFollowUpField(dbPath, followupDate, time, created) {
    return await this.db.doc(dbPath).update({
      callStartDate: followupDate,
      callStartTime: time,
      dateCreated: created,
    });
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
  //getting all sales 
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
  //getting all services
  getService(id: String): Promise<Service[]> {
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
  //Update additionalFieldsArray in customers collection
  updateAdditionalFieldsContact(id, custId, fields) {
    return this.db
      .doc('users/' + id + '/customers/' + custId)
      .update({ additionalFieldsArray: fields });
  }
  //Update additionalFieldsArray in sales collection
  updateAdditionalFieldsSale(id, salesId, fields) {
    return this.db
      .doc('users/' + id + '/sales/' + salesId)
      .update({ additionalFieldsArray: fields });
  }
  //Update additionalFieldsArr in customers collection
  updateAdditionalFieldsArrContact(id, custId, fields) {
    return this.db
      .doc('users/' + id + '/customers/' + custId)
      .update({ additionalFieldsArr: fields });
  }
  //Update additionalFieldsArr in sales collection
  updateAdditionalFieldsArrSale(id, salesId, fields) {
    return this.db
      .doc('users/' + id + '/sales/' + salesId)
      .update({ additionalFieldsArr: fields });
  }
  //for updating cutsom fields in customer in userlevel
  updateCustomFieldsContact(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsContact: fields });
  }
  //for updating cutsom fields in sale in userlevel
  updateCustomFieldsSale(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsSale: fields });
  }
  async updateServiceFieldUserProfile(userId: string) {
    return await this.db.doc('users/' + userId).update({
      serviceStages: serviceStage.data,
      serviceStagesAddOne: serviceStageAddOne.data,
      serviceStagesAddTwo: serviceStageAddTwo.data,
      serviceStagesAddThree: serviceStageAddThree.data,
      serviceStagesAddFour: serviceStageAddFour.data,
      pipelineNamesService: pipelineNamesService.data,
      saleStages: saleStage.data,
      saleStagesAddOne: saleStageAddOne.data,
      saleStagesAddTwo: saleStageAddTwo.data,
      saleStagesAddThree: saleStageAddThree.data,
      saleStagesAddFour: saleStageAddFour.data,
      pipelineNamesSales: pipelineNamesSales.data,
      contactStatus: contactStatus.data,
      contactStatusAddOne: contactStatusAddOne.data,
      contactStatusAddTwo: contactStatusAddTwo.data,
      contactStatusAddThree: contactStatusAddThree.data,
      contactStatusAddFour: contactStatusAddFour.data,
      pipelineNamesCustomer: pipelineNamesCustomer.data,
    });
  }
  //for updating sale contactOwner
  async updateSaleContactOwner(userId, saleId, contactOwner) {
    return await this.db.doc('users/' + userId + '/sales/' + saleId).update({ contactOwner: contactOwner });
  }
  //for updating service contactOwner
  async updateServiceContactOwner(userId, serviceId, contactOwner) {
    return await this.db.doc('users/' + userId + '/services/' + serviceId).update({ contactOwner: contactOwner });
  }
  //getting all followup under a user
  getFollowup(id: String): Promise<FollowUps[]> {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
      ref
        .where('callStartTime', '!=', null)
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
            } as FollowUps)
          )
        )
      )
      .toPromise();
  }
    //for updating followup date
    async updateFollowupdate(userId, followupId, date) {
      return await this.db.doc('users/' + userId + '/Follow Ups/' + followupId).update({ callStartDate: date });
    }
    addSampleReport(userId:string,reportSettings){
      reportSettings?.forEach(async (element,index) => {
        return await this.db
        .collection('users/' + userId + '/reports')
        .doc(index.toLocaleString())
        .set({ ...element, createdDate : new Date().getTime() });
      });   
    }
    addSampleDashBoardReport(userId:string,dashboardSettings){
      dashboardSettings?.forEach(async (element,index) => {
         await this.db
        .collection('users')
        .doc(userId)
        .collection('dashBoardReports')
        .add({ ...element ,createdDate : new Date().getTime()});
      });
      
    }
    //for updating task status
  async updateTaskStatus(userId, taskId, statusValue) {
    // console.log("UserID",userId)
    // console.log("taskId",taskId)
    // console.log("statusValue",statusValue)
    return await this.db.doc('users/' + userId + '/tasks/' + taskId).update({ status: statusValue });
  }
  
  //for adding taskStatus array
  async taskStatusarray(userId) {
    console.log("Status array created")
    // console.log({taskStatusOpn: ["Open","Completed"],})
    return await this.db.doc('users/' + userId).update({
    //   taskStatusOpn: [
    //     { name: "Open" },
    //     { name: "Completed" },
    // ],
    taskStatusOpn: ["Open", "Completed"],
    });
  }
  getAllSaleForPipeline(superUserId) {
    const collectionRef = this.db.collection(
      'users/' + superUserId + '/sales',
      (ref) => ref
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        return documents;
      });
  }

  //get all services 
  getAllServiceForPipeline(superUserId) {
    const collectionRef = this.db.collection(
      'users/' + superUserId + '/services',
      (ref) => ref
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        return documents;
      });
  }

  async updateContactNumber(userId, saleId,countryCode,contactNumber,altCountryCode,altContactNumber) {
    return await this.db.doc('users/' + userId + '/sales/' + saleId).update({ 
      countryCode: countryCode, 
      contactNumber: contactNumber, 
      altCountryCode: altCountryCode, 
      altContactNumber: altContactNumber, 
    });
  }
  //update contact number in support
  async updateContactNumberService(userId, serviceId, countryCode, contactNumber, altCountryCode, altContactNumber) {
    return await this.db.doc('users/' + userId + '/services/' + serviceId).update({ 
      countryCode: countryCode, 
      contactNumber: contactNumber, 
      altCountryCode: altCountryCode, 
      altContactNumber: altContactNumber, 
    });
  }
  //get pipelines from db
  getCustomerPipeline(userId: string){
    // for getting customer Pipeline
    return this.db
    .doc<customerPipelines>('users/' + userId + '/pipelines/customerPipelines')
    .valueChanges();
  }

  //get form details of leadcapture from db using superuser id
  async getFormField(userId: string): Promise<SharedLeadCaptureModel[]> {
    return await this.db
      .collection('sharedLeadCaptureForms/', (ref) =>
        ref.where('superUserId', '==' , userId)
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
              } as SharedLeadCaptureModel)
          )
        )
      )
      .toPromise();
  }

  //update  formFields leadcapture form
  async updateFormFields(leadcaptureId, formField){
    return await this.db.doc('sharedLeadCaptureForms/'+leadcaptureId).update({ ...formField });
  }

  //get form details of fb forms from db using superuser id
  async getFbFormField(userId: string): Promise<fbLeadsIntegrationModel[]> {
    return await this.db
      .collection('FBForms/', (ref) =>
        ref.where('superUserID', '==' , userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                
                ...(a.payload.doc.data() as {}),
              } as fbLeadsIntegrationModel)
          )
        )
      )
      .toPromise();
  }

  //update fb formFields
  async updateFbFormFields(formId, formField){
    return await this.db.doc('FBForms/'+formId).update({ Fields: formField });
  }
   //get all customer 
   getAllCustomersForNumberUpdation(superUserId) {
    const collectionRef = this.db.collection(
      'users/' + superUserId + '/customers',
      (ref) => ref
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        return documents;
      });
  }

  async updateContactNumberType(userId, customerId, contactNo, alternateContactNumber) {
    return await this.db.doc('users/' + userId + '/customers/' + customerId).update({ 
      contactNo: contactNo, 
      alternateContactNumber: alternateContactNumber, 
    });
  }
}
