import { SearchTerm } from "src/app/data-models";

export class Inquiries {
    id: string;
    date: Date;
    email: string;
    message: string;
    phone: number;
    status: string;
    name: string;
}
export class Gallery {
    id: any;
    downloadURL: string;
    thumbnailURL: string;
    date: any;
    path: any;
}
export class Attachments {
    id: any;
    customerName: string;
    date: any;
    fileName: any;
    path: string;
    shareStatus: boolean
}
export class ProfileServices {
    id: string;
    title: string;
    description: string;
    price: number;
    imageURL: string;
    imagePath: string;
    date: any;
    rateFixed: boolean;
    pricing: boolean;
    currency: string;
    unit: any;
}
export class Location {
    districts: string[];
    state: string;
}
export class paymentDetails {
    id: string;
    saleId: string;
    mode: string;
    custId: string;
    userId: string;
    custFname: string;
    custSname: string;
    saleTitle: string;
    custComp: string;
    smode: string;
}
export interface Profile {
    noSubusers: number;
    taskStatusOpn: any;
    paymentHistory: any;
    publicProfileID: string;
    id: string;
    displayName: string;
    firstname: string;
    lastname: string;
    email: string;
    company: string;
    phone: string;
    altphone: number;
    street1: string;
    street2: string;
    state: string;
    country: string;
    pincode: string;
    path: string;
    currency: string;
    gstnumber: string;
    printTemplate: string;
    category: string;
    quotationNote: string;
    invoiceNote: string;
    invoiceNoInit: number;
    invoiceNoLast: number;
    quoteNoInit: number;
    quoteNoLast: number;
    estimateNoInit: number;
    estimateNoLast: number;
    bankDetails: string;
    about: any;
    estimateNote: any;
    logoStatus: boolean;
    signStatus: boolean;
    existingUser: boolean;
    saleField4Name: string;
    saleField3Name: string;
    saleField2Name: string;
    saleField1Name: string;
    saleField4Check: boolean;
    saleField3Check: boolean;
    saleField2Check: boolean;
    saleField1Check: boolean;
    saleCategory1: any[];
    saleCategory2: any[];
    saleCategory2Check: boolean;
    saleCategory1Check: boolean;
    saleCategory1Opn: any;
    saleCategory2Opn: any;
    custField4Name: string;
    custField3Name: string;
    custField2Name: string;
    custField1Name: string;
    custField4Check: boolean;
    custField3Check: boolean;
    custField2Check: boolean;
    custField1Check: boolean;
    custCategory1: any[];
    custCategory2: any[];
    custCategory2Check: boolean;
    custCategory1Check: boolean;
    custCategory1Opn: any;
    custCategory2Opn: any;
    leadPoints: any;
    dataAccessRule: string;
    createdDate: any;
    accountType: any;
    leadSharedRating: any;
    noOfRatingReceived: number;
    masterId: string;
    photoURL: any;
    plan: any;
    planCurrency: any;
    planPricing: any;
    providerId: any;
    uid: any;
    userRole: any;
    usertype: any;
    validityEnd: any;
    validityStart: any;
    superUserId: any;
    profileFirstname: any;
    profileLastname: any;
    profileCompany: any;
    profilePhone: any;
    profileEmail: any;
    taxType: string;
    isFirstTimeUser: boolean;
    totalAttachmentsSize: number;
    logo: any;
    sign: any;
}
export class publicProfile {
    id: any;
    category: any;
    facebook: any;
    instagram: any;
    linkedin: any;
    profileCompany: any;
    profileCountry: any;
    profileDistrict: any;
    profileEmail: any;
    profileFirstname: any;
    profileLastname: any;
    profilePhone: any;
    profileState: any;
    userId: any;
    website: any;
    about: any;
    dpImage: boolean;
    fullAddress: string;
    profileLocality: string;
    profileStreet: string;
}

export class PaymentReceipt {
    public id: string;
    amountCollected: number;
    customerCompany: string;
    customerId: string;
    customerName: string;
    invoiceno: string;
    invoiceDate: any;
    invoiceAmount: number;
    paymentDate: any;
    paymentType: string;
    paymentMode: string;
    pendingAmount: number;
    prevCustomerAmount: number;
    prevInvoiceAmount: number;
    prevSaleAmount: number;
    saletitle: string;
    saleId: string;
    createdById: string;
    custSecondName: string;
    chequeNo: string;
    chequeBank: string;
    saleTitle: string;
}

export class FollowUps {
    id: string;
    customerName: string;
    companyName: string;
    dateCreated: string;
    date: any;
    time: string;
    completed: string;
    assignedTo: string;
    customerId: string;
    notes: string;
    updated: boolean;
    callStartDate: any;
    callStartTime: any;
    completedStatus: any;
}
export class Meeting {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    name: string;
    company: string;
    description: string;
    assignedCustomer: string;
    dateCreated: string;
    customerId: string;
}
export class Sales {
    id: string;
    firstName: string;
    secondName: string;
    companyName: string;
    saleTitle: string;
    expenseAmount: number;
    description: string;
    estimatedValue: number;
    expCompletionDate: any;
    startDate: any;
    searchOrg:any;
    sequenceNumber:number;
    salesStage: string;
    salesType: string;
    priority: string;
    assignedTo: string;
    assignedToName: string
    collectionMode: string;
    additionalFieldsArray: any[];
    collectedAmount: number;
    customerId: any;
    EstimatedValue: number;
    invoicedAmount: number;
    saleCategory1Name: any;
    saleCategory2Name: any;
    createdDate: any;
    days: number;
    daysRange: string;
    completedSaleDate: any;
    confirmedSaleDate: any;
    opportunityDate: any;
    inquiryDate: any;
    stageHistory: any[];

}
export interface Customer {

    id: any;
    assignedTo: string;
    assignedToName: string;
    billingaddress1: string;
    billingaddress2: string;
    bpin: number;
    code: string;
    companyName: string;
    collectedAmount: number;
    contactNo: string;
    country: string;
    createdDate: number;
    leadSource: any;
    dateCreated: any;
    days: number;
    daysRange: string;
    district: string;
    email: string;
    firstName: string;
    followUpFlag: number;
    taxId: string;
    additionalFieldsArray: any[];
    month: number;
    saleOngoingValue: number;
    salePipelineValue: number;
    createdYear: number;
    pan: string;
    priority: string;
    secondName: string;
    state: string;
    status: string;
    unConfirmedSales: number;
    ongoingSales: number;
    amountToBeCollected: number;
    taskOpen: number;
    lifeTimeValue: number;
    totalAmountCollected: number;
    invoicedAmount: number;
    isCompany: boolean;
    custLead: any;
    stageHistory: any[];
    currentStatusDate: any;
    custLeadValue: any;
    searchTerm: SearchTerm;
}
export interface CustomersImport {
    orgId: string;
    custLeadValue: string;
    assignedTo: string;
    assignedToName: string;
    billingaddress1: string;
    billingaddress2: string;
    bpin: string;
    code: string;
    sequenceNumber: number
    companyName: string;
    collectedAmount: number;
    contactNo: string;
    country: string;
    dateCreated: number;
    district: string;
    email: string;
    firstName: string;
    followUpFlag: number;
    taxId: string;
    pan: string;
    priority: string;
    salutation: string;
    secondName: string;
    state: string;
    status: string;
    unConfirmedSales: number;
    amountToBeCollected: number;
    taskOpen: number;
    lifeTimeValue: number;
    totalAmountCollected: number;
    invoicedAmount: number;
    isCompany: boolean;
    additionalFieldsArr: any;
    searchTerm: {
        companyName: string;
        firstName: string;
        secondName: string;
        surname: string;
    },
    selectedContactPipeline: number,
    altContactCode: string,
    alternateContactNumber: string,
    department: string,
    createdBy: string,
    inPipeline: boolean,
    won: boolean,
    lost: boolean,
    surname: string,
    associatedBranch: string,
}
export interface DashboardCustomerImport {
    firstName: string,
    secondName: string,
    companyName: string,
    status: string,
    custStatusChangeDate: any,
    priority: string,
    billingaddress1: string,
    billingaddress2: string,
    district: string,
    state: string,
    country: string,
    bpin: number,
    taxId: string,
    code: string,
    dateCreated:string,
    contactNo: string,
    email: string,
    collectedAmount: number,
    totalAmountCollected: number,
    followupFlag: number,
    saleOngoingValue: number,
    salePipelineValue: number,
    onGoingSales: number,
    sequenceNumber: number,
    custLeadValue: string,
    invoiceAmount: number,
    createdBy: string,
    assignedTo: string,
    assignedToName: string,
    isCompany:boolean,
    additionalFieldsArray:any[],
    searchTerm: {
        companyName: string,
        firstName: string,
        secondName: string
      },
}
export interface DashboardSaleImport {
    saleTitle: string,
    saleId:string,
    customerId: string,
    firstName: string,
    secondName: string,
    companyName: string,
    searchOrg: string,
    salesStage: string,
    priority: string,
    description: any,
    sequenceNumber: number,
    estimatedValue: number,
    expenseAmount: number,
    collectedAmount: number,
    collectionMode: string,
    createdDate: number,
    startDate: any,
    expCompletionDate: any,
    invoicedAmount: string,
    assignedTo: string,
    assignedToName: string,
    additionalFieldsArray:any[],
    searchTerm: {
        companyName: string,
        firstName: string,
        secondName: string
      },
}
export interface DashboardProductImport {
     prodName: string,
     prodDes: string,
     hsnCode:string,
     availabilty: boolean,
     unit: string,
     unitPrice:number,
     currency: string,
     discount:number,
     taxType:string,
     vatRate: number,
     sgst: number,
     igst: number,
     cgst: number,
     dateCreated:number
}
export interface DashboardTaskImport {
    title:string
    customerId: string,
    name: string,
    lastName: string,
    company: string,
    saleId:string,
    saleTitle:string,
    priority: string,
    status: string,
    description: string,
    dueDate:any,
    createdBy: string,
    date:number,
    assignedTo: string,
    assignedToName: string,
}
export class Task {


    public title: string;
    public description: string;
    public assignedTo: string;
    public dueDate: any;
    public startDate: Date;
    public priority: string;
    public status: string;
    public id: string;
    public company: string;
    public name: string;
    public customerId: string;
    public dateCreated: any;
    public lastName: any;
    public date: any;
    public saleId:string;
    public saleTitle:string;
    public createdBy:string;
    public assignedToName:string;
  additionalFieldsArr: any;

}
export class statusHistory {
    stageNo: number;
    stageDetails: {
        stageName: string;
        date: any;
    }
}
export class Invoice {

    id: string;
    idstate: string;
    collectedAmount: any;
    customerData: {
        addressline1: string;
        addressline2: string;
        companyName: string;
        country: string;
        custID: string;
        district: string;
        gst: string;
        pinCode: number;
        state: string;
        fname1: string;
        sname: string;

    }
    docData: {
        bankDetails: string;
        cessValue: number;
        cgstValue: number;
        vatValue: number;
        currency: string;
        docDate: any;
        docNumber: string;
        docTitle: string;
        docType: string;
        docValidity: string;
        dueDate: Date;
        igstValue: number;
        includeCess: boolean;
        includeTax: boolean;
        interState: boolean;
        notes: string;
        paymentTerm: string;
        poRef: string;
        quoteRef: string;
        saleID: string;
        saleTitle: string,
        sgstValue: number;
        total: number;
        totalInclTax: number;
        amountCollected: number;
        id: any;
        createdDate: any;
        taxType: string;
    }
    itemList: [
        {
            amount: number;
            amountInclTax: number;
            cessAmount: number;
            cessRate: number;
            cgstAmount: number;
            cgstRate: number;
            vatRate: number;
            vatAmount: number;
            description: string;
            igstAmount: number;
            igstRate: number;
            item: string;
            qty: number;
            unit: string;
            rate: number;
            sgstAmount: number;
            sgstRate: number;
            slno: number;
        }
    ]
    userData: {
        addressline1: string;
        adrressline2: string;
        companyName: string;
        country: string;
        designation: string;
        district: string;
        contactname: string,
        secondName: string,
        gst: string;
        logo: string;
        pinCode: string;
        signatoryName: string;
        signature: string;
        state: string;
    }
    shareStatus: boolean
}
export interface CustomerNotes {
    createdById: string;//user ID of the user who has created the note
    cratedByName: string;// name of the user wo has created the note
    createdDate: Date;//Date and time at which the note was created;
    note: string;//Note submitted
    id: string;

}
export interface SalesNotes {
    createdById: string;//user ID of the user who has created the note
    cratedByName: string;// name of the user wo has created the note
    createdDate: Date;//Date and time at which the note was created;
    note: string;//Note submitted
    id: string;

}
//Used in saledashboard for calculating invoice and payment receipt amounts
export class Month {
    constructor(
        public jan: number = 0,
        public feb: number = 0,
        public mar: number = 0,
        public apr: number = 0,
        public may: number = 0,
        public jun: number = 0,
        public jul: number = 0,
        public aug: number = 0,
        public sep: number = 0,
        public oct: number = 0,
        public nov: number = 0,
        public dec: number = 0
    ) { }
}
export interface Leads {
    customerId: string;
    category: string;
    id: string;
    createDate: string;
    submittedBy: string;
    noPurchases: number;
    pointsEarned: number;
    rating: number;
    usrProfileScore: number;
    invContactCount: number;
    invReqCount: number;
    reqMetCount: number;
    reqStatus: boolean;
    title: string;
    description: string;
    name: string;
    countryCode: number;
    leadContactNo: number;
    leadEmail: string;
    leadSharedRating: number;
    ownReq: boolean;
    companyName: string;
    noOfRatingReceived: number
}
export class PurchasedLeads {
    id: any;
    leadId: string;
    purchasedDate: Date;
    purchaseValue: number;
    leadSharedRating: number;
    invalidContactFlag: boolean;
    invalidReqFlag: boolean;
    reqMetFlag: boolean;
    saleId: string;
    contactId: string;
    title: string;
    description: string;
    leadName: string;
    leadContactNo: string;
    leadEmail: string;

}
export class FileUpload {

    key: string;
    name: string;
    url: string;
    file: File;

    constructor(file: File) {
        this.file = file;
    }
}

//document managment
export interface UserData {
    logo: File,
    signature: File,
    signatoryName: string,
    designation: string,
    state: string,
    addressline1: string,
    addressline2: string,
    gst: string,
    companyName: string,
    pinCode: string,
    country: string,
    contactname: string,
    secondName: string,
    contactno: string,
    email: string,


}
export interface CustomerData {
    pinCode: string,
    district: string,
    state: string,
    country: string,
    gst: string,
    fname1: string,
    sname: string,
    companyName: string,
    addressline1: string,
    addressline2: string,
    custID: string,

}
export interface StageValues {

    date: any;
    stageName: string;
    stageNo: number;
}
export interface DocData {
    docDate: string,
    dueDate: string,
    sgstValue: number,
    cgstValue: number,
    igstValue: number,
    cessValue: number,
    vatValue: number,
    total: number,
    docNumber: string,
    quoteRef: string,
    estRef: string,
    totalInclTax: number,
    poRef: string,
    paymentTerm: string,
    docType: string,
    bankDetails: string,
    notes: string,
    currency: string,
    includeTax: boolean,
    includeCess: boolean,
    includeUnit: boolean,
    interState: boolean,
    docTitle: string,
    docValidity: string,
    saleID: string,
    saleTitle: string,
    amountCollected: number;
    createdDate: any;
    taxType: string;

}
export interface Services {
    imageURL: string,
    title: any,
    description: any,
    currency: string,
    price: number,
    unit: any,
    rateFixed: boolean,
}
export interface LineItemData {
    slno: number,
    item: string,
    qty: number,
    unit: string;
    rate: number,
    sgstRate: number,
    sgstAmount: number,
    cgstRate: number,
    cgstAmount: number,
    igstRate: number,
    igstAmount: number,
    cessRate: number,
    cessAmount: number,
    amount: number,
    amountInclTax: number,
    description: string,
    vatRate: number,
    vatAmount: number,
}

export class CheckStatus {
    constructor(
        public name: string,
        public isChecked: boolean
    ) {

    }

}
export class Category {
    categories: string[] = [];
    constructor(
    ) {
        this.categories.push("Interior Designer", "Architect", "Photography", "Accounting", "Legal", "Others")
    }
}
export class GoogleCalendar {
    summary: string;
    location: string;
    description: string;
    start: {
        dateTime: Date;
        timeZone: string;
    }
    end: {
        dateTime: Date;
        timeZone: string;
    }
    recurrence: string[];
    attendees: string[];
    reminders: {
        useDefault: boolean;
        overrides: string[];
    }

}
