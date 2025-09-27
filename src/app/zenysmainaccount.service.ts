import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { changeLogModel, Profile } from './data-models';
import { Pipelines } from './model/pipeline.modal';
import { MainAccountInitService } from './main-account-init.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ZenysmainaccountService {
  custStatus: string='';
  pipelineId:number;
  zenysMainAccountID: string | null = null;
  assignedToName: string = '';
  contactSequentialNumber:number
  customerPipelines:Pipelines[]=[];
  private isInitialized = false;

  constructor(
    private db: AngularFirestore,
    private mainAccountInit: MainAccountInitService
  ) {
    this.initializeMainAccount();
  }

  /**
   * Initialize the main account and load related data
   */
  private initializeMainAccount(): void {
    this.mainAccountInit.initializeMainAccount().subscribe({
      next: ({accountId, assignedToName}) => {
        if (accountId) {
          this.zenysMainAccountID = accountId;
          this.assignedToName = assignedToName;
          this.isInitialized = true;

          // Load data after initialization
          this.loadMainAccountData();
        } else {
          console.warn('No main account available - skipping customer addition');
          this.zenysMainAccountID = null;
          this.assignedToName = 'SuperUser';
          this.isInitialized = true;
          // Skip loading data when no main account exists
        }
      },
      error: (error) => {
        console.error('Failed to initialize main account:', error);
        console.warn('No main account available - skipping customer addition');
        this.zenysMainAccountID = null;
        this.assignedToName = 'SuperUser';
        this.isInitialized = true;
        // Skip loading data when no main account exists
      }
    });
  }

  /**
   * Load main account data after initialization
   */
  private loadMainAccountData(): void {
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
      if(customerPipeline && customerPipeline.customerPipelines && customerPipeline.customerPipelines.length > 0){
        this.customerPipelines = customerPipeline.customerPipelines;
        this.custStatus = customerPipeline.customerPipelines[0].pipelineStages[0].stageId;
        this.pipelineId = customerPipeline.customerPipelines[0].pipelineId;
      } else {
        // Set default values if no pipeline data is available
        this.customerPipelines = [];
        this.custStatus = 'lead';
        this.pipelineId = 1;
      }
    });
  }

  /**
   * Ensure the service is initialized before use
   */
  private ensureInitialized(): Observable<boolean> {
    if (this.isInitialized) {
      return of(true);
    }

    return new Observable(observer => {
      const checkInitialized = () => {
        if (this.isInitialized) {
          observer.next(true);
          observer.complete();
        } else {
          setTimeout(checkInitialized, 100);
        }
      };
      checkInitialized();
    });
  }

  /**
   * Ensure pipeline data is loaded before creating customers
   */
  private ensurePipelineDataLoaded(): Observable<boolean> {
    return new Observable(observer => {
      const checkPipelineData = () => {
        if (this.customerPipelines && this.customerPipelines.length > 0) {
          observer.next(true);
          observer.complete();
        } else if (this.isInitialized) {
          // If initialized but no pipeline data, use defaults
          this.custStatus = 'lead';
          this.pipelineId = 1;
          observer.next(true);
          observer.complete();
        } else {
          setTimeout(checkPipelineData, 100);
        }
      };
      checkPipelineData();
    });
  }

  createCustomer(customerId, form, email, addressDetails) {
    return this.ensureInitialized().pipe(
      switchMap(() => this.ensurePipelineDataLoaded()),
      switchMap(() => {

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
    let lost = false;
    let won = false;
    let inPipeline = false;

    // Check if customerPipelines exists and has data
    if (this.customerPipelines && this.customerPipelines.length > 0 &&
        this.customerPipelines[0].pipelineStages && this.customerPipelines[0].pipelineStages.length > 0) {

      const pipelineStages = this.customerPipelines[0].pipelineStages;
      const lastStageIndex = pipelineStages.length - 1;
      const secondLastStageIndex = pipelineStages.length - 2;

      if (this.custStatus === pipelineStages[lastStageIndex].stageId) {
        lost = true;
        won = false;
        inPipeline = false;
      } else if (this.custStatus === pipelineStages[secondLastStageIndex].stageId) {
        lost = false;
        won = true;
        inPipeline = false;
      } else {
        lost = false;
        won = false;
        inPipeline = true;
      }
    } else {
      // Default values when pipeline data is not available
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
      }),
      catchError(error => {
        console.error('Error creating customer:', error);
        throw error;
      })
    );
  }
  getsaleStatus() {
    return this.ensureInitialized().pipe(
      switchMap(() => this.db.doc('users/' + this.zenysMainAccountID).valueChanges())
    );
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
  return this.ensureInitialized().pipe(
    switchMap(() => this.db.doc('users/' + this.zenysMainAccountID+'/pipelines/customerPipelines').valueChanges())
  );
}
}
