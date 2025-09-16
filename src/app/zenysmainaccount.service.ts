import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { changeLogModel, Profile } from './data-models';
import { Pipelines } from './model/pipeline.modal';

@Injectable({
  providedIn: 'root',
})
export class ZenysmainaccountService {
  custStatus: string='';
  pipelineId:number;
  zenysMainAccountID = environment.ZenysMainAccount;
  assignedToName = environment.ZenysAssignedToName;
  contactSequentialNumber:number
  customerPipelines:Pipelines[]=[];
  constructor(private db: AngularFirestore) {
    this.getsaleStatus().subscribe((data: any) => {
      if(data){
        if(data.contactSequentialNumber){
          this.contactSequentialNumber=data.contactSequentialNumber+1
        }
        else{
         this.contactSequentialNumber=1
        }
      }
    });
    this.getcustomerStatus().subscribe((customerPipeline: any) => {
      if(!!customerPipeline.customerPipelines){
        this.customerPipelines = customerPipeline.customerPipelines;
        this.custStatus = customerPipeline.customerPipelines[0].pipelineStages[0].stageId;
        this.pipelineId = customerPipeline.customerPipelines[0].pipelineId;
      }
    });

  }

  createCustomer(customerId, form, email, addressDetails) {
    //console.log(customerId)
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: this.zenysMainAccountID,
      changedByName: this.assignedToName,
      changesFrom: 'newSignupData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let lost =false;
    let won =false;
    let inPipeline =false;
    if (
      this.custStatus ===
      this.customerPipelines[0].pipelineStages[this.customerPipelines[0].pipelineStages.length - 1].stageId
    ) {
      lost = true;
      won = false;
      inPipeline = false;
    } else if (
      this.custStatus ===
      this.customerPipelines[0].pipelineStages[this.customerPipelines[0].pipelineStages.length - 2].stageId
    ) {
      lost = false;
      won = true;
      inPipeline = false;
    } else {
      lost = false;
      won = false;
      inPipeline = true;
    }
    const data = {
      // zenysCustId:customerId,
      assignedTo: this.zenysMainAccountID,
      assignedToName: this.assignedToName,
      billingaddress1: addressDetails !== null?addressDetails.street1: null,
      billingaddress2: addressDetails !== null?addressDetails.street2: null,
      bpin: addressDetails !== null?addressDetails.pincode: null,
      code: form.countryCode,
      collectedAmount: 0,
      companyName: form.company ? form.company : 'Individual',
      contactNo: form.phone,
      country: addressDetails !== null?addressDetails.country: null,
      createdBy: this.zenysMainAccountID,
      createdYear: new Date().getFullYear(),
      currentStatusDate: Date.now(),
      customerDate: null,
      dateCreated: Date.now(),
      district: addressDetails !== null?addressDetails.city: null,
      email: email,
      firstName: form.firstname,
      followUpFlag: 0,
      invoicedAmount: 0,
      isCompany: Boolean(form.company),
      leadStageDate: null,
      month: new Date().getMonth(),
      ongoingSales: 0,
      oppStageDate: null,
      priority: 'Medium',
      prospStageDate: null,
      rejectionDate: null,
      saleOngoingValue: 0,
      salePipelineValue: 0,
      secondName: form.lastname ? form.lastname : '',
      stageHistory: [
        { date: Date.now(), stageId: this.custStatus,  pipelineId:this.pipelineId },
      ],
      searchTerm: {
        companyName: form.company ? form.company.toLowerCase() : 'individual',
        firstName: form.firstname.toLowerCase(),
        secondName: form.lastname ? form.lastname.toLowerCase() : null,
      },
      state: addressDetails !== null?addressDetails.state: null,
      status: this.custStatus,
      taxId: addressDetails !== null?addressDetails.gstnumber:'',
      totalAmountCollected: 0,
      selectedContactPipeline: this.pipelineId,
      inPipeline: inPipeline,
      won: won,
      lost: lost,
      changeLog: changeLog,
      sequenceNumber:this.contactSequentialNumber,
      orgId: '',
      additionalFieldsArr: null,
      associatedBranch: '',
      altContactCode:'',
      alternateContactNumber: '',
      salutation: '',
      surname: '',
      lastModifiedDate: new Date().getTime(),
      custLeadValue: 'Web Signup',
      lastAddedNote: '',
      lastNoteDate: null,
      lastNoteId: '',
      assignedToDate: new Date().getTime(),
    };
    // console.log(data)
    return this.db
      .doc('users/' + this.zenysMainAccountID + '/customers/' + customerId)
      .set(data);
  }
  getsaleStatus() {
    return this.db.doc('users/' + this.zenysMainAccountID).valueChanges();
  }
  getInvoicesFromZenys(id) {
    return this.db
      .collection('users/' + this.zenysMainAccountID + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', id)
      )
      .valueChanges({ idField: 'Id' });
  }
  // get particular document from zenys main account
  getDocumentDetails(userId, docId) {
    return this.db
      .doc<any>('users/' + userId + '/Invoices/' + docId)
      .valueChanges();
  }
  // get main account details
  getUser(userId: string) {
    return this.db.doc<Profile>('users/' + userId).valueChanges();
  }
  createCustomerFromFreeTool(
    customerId,
    email,
    countryCode,
    company,
    phone,
    firstname,
    street1,street2,
    pincode,country,state,gstnumber
  ) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: this.zenysMainAccountID,
      changedByName: this.assignedToName,
      changesFrom: 'newSignupData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let lost =false;
      let won =false;
      let inPipeline =false;
      if (
        this.custStatus ===
        this.customerPipelines[0].pipelineStages[this.customerPipelines[0].pipelineStages.length - 1].stageId
      ) {
        lost = true;
        won = false;
        inPipeline = false;
      } else if (
        this.custStatus ===
        this.customerPipelines[0].pipelineStages[this.customerPipelines[0].pipelineStages.length - 2].stageId
      ) {
        lost = false;
        won = true;
        inPipeline = false;
      } else {
        lost = false;
        won = false;
        inPipeline = true;
      }
    const data = {
      // zenysCustId:customerId,
      assignedTo: this.zenysMainAccountID,
      assignedToName: this.assignedToName,
      billingaddress1: street1,
      billingaddress2: street2,
      bpin: pincode,
      code: countryCode,
      collectedAmount: 0,
      companyName: company ? company : 'Individual',
      contactNo: phone,
      country: country,
      createdBy: this.zenysMainAccountID,
      createdYear: new Date().getFullYear(),
      currentStatusDate: Date.now(),
      customerDate: null,
      dateCreated: Date.now(),
      district: null,
      email: email,
      firstName: firstname,
      followUpFlag: 0,
      invoicedAmount: 0,
      isCompany: Boolean(company),
      leadStageDate: null,
      month: new Date().getMonth(),
      ongoingSales: 0,
      oppStageDate: null,
      priority: 'Medium',
      prospStageDate: null,
      rejectionDate: null,
      saleOngoingValue: 0,
      salePipelineValue: 0,
      secondName: '',
      stageHistory: [
        { date: Date.now(), stageId: this.custStatus, pipelineId: this.pipelineId },
      ],
      searchTerm: {
        companyName: company ? company.toLowerCase() : 'individual',
        firstName: firstname.toLowerCase(),
        secondName: '',
      },
      state: state,
      status: this.custStatus,
      taxId: gstnumber,
      totalAmountCollected: 0,
      selectedContactPipeline: this.pipelineId,
      inPipeline: inPipeline,
      won: won,
      lost: lost,
      changeLog: changeLog,
      sequenceNumber:this.contactSequentialNumber,
      orgId: '',
      lastModifiedDate: new Date().getTime(),
      lastAddedNote: '',
      lastNoteDate: null,
      lastNoteId: '',
      assignedToDate: new Date().getTime(),
      custLeadValue :"Free Tool"
    };
    // console.log(data)
    return this.db
      .doc('users/' + this.zenysMainAccountID + '/customers/' + customerId)
      .set(data);
  }
  //for updating contactsequencenumber
updateContactSequenceNumber() {
  return this.db
    .doc('users/' + this.zenysMainAccountID)
    .update({ contactSequentialNumber:this.contactSequentialNumber });
}
getcustomerStatus() {
  return this.db.doc('users/' + this.zenysMainAccountID+'/pipelines/customerPipelines').valueChanges();
}
}
