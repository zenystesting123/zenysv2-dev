
 export class AdminProfile {
    public static data2 = {
        profileName  : 'Admin',
        profileDescription  :  "Admin Account",
        dialogdataAccessRule : "All",
        isCheckedCont : true,
        isCheckedSale : true,
        isCheckedSalesEst : true,
        isCheckedSalesQuot : true,
        isCheckedSalesInv : true,
        isCheckedDashB : true,
        isCheckedNotes : true,
        isCheckedFoll : true,
        isCheckedAtt : true,
        isCheckedSett :true,
        contactsView : true,
        contactsCreate : true,
        contactsEdit : true,
        contactsDelete : true,
        salesView : true,
        salesCreate : true,
        salesEdit : true,
        salesDelete : true,
        salesDViewEst : true,
        salesDCreateEst : true,
        salesDEditEst : true,
        salesDViewQuot : true,
        salesDCreateQuot : true,
        salesDEditQuot : true,
        salesDViewInv : true,
        salesDCreateInv : true,
        salesDEditInv : true,
        DBView : true,
        DBDownloadReports : true,
        notesView : true,
        notesCreate : true,
        notesEdit : true,
        notesDelete : true,
        follView : true,
        follCreate : true,
        follEdit : true,
        follDelete : true,
        attView : true,
        attAdd : true,
        attRemove : true,
        settView : true,
        settEdit :true,
        DBReportsView:true,
        collectionsView:true,
        collectionCreate:true,
        collectionEdit:true,
        collectionDelete:true,
        expView:true,
        expCreate:true,
        expEdit:true,
        expDelete:true,
        isCheckedColl:true,
        isCheckedExp:true,
        isCheckedItems:true,
        itemsView:true,
        itemsCreate:true,
        itemsEdit:true,
        itemsDelete:true
      }
 }
//Default  SubUser Profile Details
 export class SubUserProfile {
    public static data3 = {
        profileName  : 'SubUser',
        profileDescription  :  "SubUser Account",
        dialogdataAccessRule : "Own",
        isCheckedCont : true,
        isCheckedSale : true,
        isCheckedSalesEst : true,
        isCheckedSalesQuot : true,
        isCheckedSalesInv : true,
        isCheckedDashB : true,
        isCheckedNotes : true,
        isCheckedFoll : true,
        isCheckedAtt : true,
        isCheckedSett :false,
        contactsView : true,
        contactsCreate : true,
        contactsEdit : true,
        contactsDelete : true,
        salesView : true,
        salesCreate : true,
        salesEdit : true,
        salesDelete : true,
        salesDViewEst : true,
        salesDCreateEst : true,
        salesDEditEst : true,
        salesDViewQuot : true,
        salesDCreateQuot : true,
        salesDEditQuot : true,
        salesDViewInv : true,
        salesDCreateInv : true,
        salesDEditInv : true,
        DBView : true,
        DBDownloadReports : true,
        notesView : true,
        notesCreate : true,
        notesEdit : true,
        notesDelete : true,
        follView : true,
        follCreate : true,
        follEdit : true,
        follDelete : true,
        attView : true,
        attAdd : true,
        attRemove : true,
        settView : false,
        settEdit : false,
        DBReportsView:true,
        collectionsView:true,
        collectionCreate:true,
        collectionEdit:true,
        collectionDelete:true,
        expView:true,
        expCreate:true,
        expEdit:true,
        expDelete:true,
        isCheckedColl:true,
        isCheckedExp:true,
        isCheckedItems:true,
        itemsView:true,
        itemsCreate:true,
        itemsEdit:true,
        itemsDelete:true
      }
 }
 export class customFieldNamesData{
    public static data :Object = {
        fieldNameContact : 'Contact',
        fieldNameSale : 'Sale',
        fieldNameFollowup : 'FollowUp',
        fieldNameTask : 'Task',
        fieldNameMeeting : 'Meeting',
        fieldNameEstimate : 'Estimate',
        fieldNameQuotation : 'Quotation',
        fieldNameInvoice : 'Invoice',
        fieldNameCollection : 'Collection',
        fieldNameExpense : 'Expense',
        fieldNameItems : 'Products and Service',
        fieldNameContactNotes : 'Note',
        fieldNameSaleNotes : 'Note'}
}
export class SearchTerm {
    public firstName: string='';
    public secondName: string='';
    public companyName:string='';
    public surname:string='';
  }
  export class SearchTermSale{
    public firstName: string='';
    public secondName: string='';
    public companyName:string='';
}
export class SuperUserProfile {
    public static data = {
       profileName  : 'SuperUser',
       profileDescription  :  "SuperUser Account",
       dialogdataAccessRule : "All",
       isCheckedCont : true,
       isCheckedSale : true,
       isCheckedSalesEst : true,
       isCheckedSalesQuot : true,
       isCheckedSalesInv : true,
       isCheckedDashB : true,
       isCheckedNotes : true,
       isCheckedFoll : true,
       isCheckedAtt : true,
       isCheckedSett : true,
       contactsView : true,
       contactsCreate : true,
       contactsEdit : true,
       contactsDelete : true,
       salesView : true,
       salesCreate : true,
       salesEdit : true,
       salesDelete : true,
       salesDViewEst : true,
       salesDCreateEst : true,
       salesDEditEst : true,
       salesDViewQuot : true,
       salesDCreateQuot : true,
       salesDEditQuot : true,
       salesDViewInv : true,
       salesDCreateInv : true,
       salesDEditInv : true,
       DBView : true,
       DBDownloadReports : true,
       notesView : true,
       notesCreate : true,
       notesEdit : true,
       notesDelete : true,
       follView : true,
       follCreate : true,
       follEdit : true,
       follDelete : true,
       attView : true,
       attAdd : true,
       attRemove : true,
       settView : true,
       settEdit : true,
       DBReportsView:true,
       collectionsView:true,
       collectionCreate:true,
       collectionEdit:true,
       collectionDelete:true,
       expView:true,
       expCreate:true,
       expEdit:true,
       expDelete:true,
       isCheckedColl:true,
       isCheckedExp:true,
       isCheckedItems:true,
       itemsView:true,
       itemsCreate:true,
       itemsEdit:true,
       itemsDelete:true
     }
}
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
    city: string


}
export interface CustomerData {
    pinCode: number,
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
export interface DocData {
    docDate: string,
    dueDate: string,
    sgstValue: number,
    cgstValue: number,
    igstValue: number,
    cessValue: number,
    vatValue: number,
    discountValue:number,
    discountedAmount:number,
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
    includeDiscount:boolean,
    docTitle: string,
    docValidity: string,
    saleID: string,
    saleTitle: string,
    amountCollected: number;
    createdDate: any;
    taxType: string;
    docPrefix:string;
    prefixAndDocNumber:string
    cancel:boolean
    saleAssignedToOwner:string,
    statusApproved: boolean;
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
    discountRate:number,
    discountAmount:number,
    discountedAmount:number,
    amount: number,
    amountInclTax: number,
    description: string,
    vatRate: number,
    vatAmount: number,
    hsnCode:string
}
export class CustomerDetails {

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
    customerDate: Date;
    dateCreated: number;
    days: number;
    daysRange: string;
    district: string;
    email: string;
    firstName: string;

    followUpFlag: number;
    taxId: string;
    leadStageDate: Date;
    month: number;
    oppStageDate: Date;
    prospStageDate: Date;
    saleOngoingValue: number;
    salePipelineValue: number;
    createdYear: number;
    pan: string;
    priority: string;
    rejectionDate: string;
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
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    custLead:any;
    custField1: string;
    custField2: string;
    custField3: string;
    custField4: string;
    custCategory1: string;
    custCategory2: string;
    custCategory1Name: string;
    custCategory2Name: string;
    custField1Name: string;
    custField2Name: string;
    custField3Name: string;
    custField4Name: string;
    prospectDate: string;
    leadDate: string;
    stageHistory: StageHistory[];
    currentStatusDate: number;
    custLeadValue:string;
    createdBy:string;
    searchTerm:SearchTerm
    additionalFieldsArr:any[];
    additionalField:string
}

export class StageHistory{
         date:number;
         stageName:string;
         stageNo:number
}
export class SalesDetails{
    firstName: string;
    secondName: string;
    companyName: string;
    saleTitle: string;
    description: string;
    estimatedValue: number;
    expCompletionDate: Date;
    expenseAmount: number;
    startDate: Date;
    salesStage: string;
    salesType: string;
    priority: string;
    assignedTo: string;
    assignedToName: string
    collectionMode: string;
    saleField1: string;
    saleField2: string;
    saleField3: string;
    saleField4: string;
    saleCategory1: string;
    saleCategory2: string;
    saleField1Name: string;
    saleField2Name: string;
    saleField3Name: string;
    saleField4Name: string;
    collectedAmount: number;
    customerId: string;
    EstimatedValue: number;
    invoicedAmount: number;
    saleCategory1Name: string;
    saleCategory2Name: string;
    createdDate: number;
    days: number;
    daysRange: string;
    completedSaleDate: Date;
    confirmedSaleDate: Date;
    opportunityDate: Date;
    inquiryDate: Date;
    stageHistory: StageHistory[];
    currentStatusDate:number;
    searchTerm:SearchTermSale;
    additionalFieldsArr:any[];
    additionalField:string
}
export interface Profile {
    publicProfileID: string;
    id: string;
    displayName: string;
    firstname: string;
    customFieldsContact:any[],
    expenseCategory:any[],
    lastname: string;
    custLead:any[];
    email: string;
    company: string;
    phone: string;
    altphone: number;
    street1: string;
    street2: string;
    state: string;
    country: string;
    countryCode: string;
    pincode: string;
    path: string;
    currency: string;
    gstnumber: string;
    paymentHistory: any;
    printTemplate: string;
    category: string;
    quotationNote: string;
    invoiceNote: string;
    invoiceNoInit: number;
    invoiceNoLast: number;
    quoteNoInit: number;
    profImage3:string;
    profImage2:string;
    profImage1:string;
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
    custCategory1Name: string;
    custCategory2Name: string;
    saleCategory1Name: string;
    saleCategory2Name: string;
    custField4Check: boolean;
    custField3Check: boolean;
    custField2Check: boolean;
    custField1Check: boolean;
    custCategory1: any[];
    custCategory2: any[];
    custCategory2Check: boolean;
    custCategory1Check: boolean;
    custLeadCheck: boolean;
    custCategory1Opn: any;
    custCategory2Opn: any;
    custLeadOpn: any;
    leadPoints: any;
    dataAccessRule: string;
    createdDate: any;
    accountType: any;
    leadSharedRating: any;
    noOfRatingReceived: number;
    masterId: string;
    customFields:any[];
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
    custStatus: any;
    saleStatus: any;
    custStatusOpn: any;
    saleStatusOpn: any;
    taxType: string;
    isFirstTimeUser: boolean;
    firstSettingsCard: boolean,
    totalAttachmentsSize: number;
    logo: any;
    sign: any;
    documentColor:string;
    customFieldsSale:any[];
    city: string,
    zenysCustId:string
    estimateNumberPrefix:string;
    quotationNumberPrefix:string;
    invoiceNumberPrefix:string;
    // newly adding customisable field
    fieldNames:any;
    noSubusers:number;
    rzrAccountId:string;
}
export class ExpenseCategories {
    categories: string[] = [];
    constructor(
    ) {
        this.categories.push(

            "Equipment rental",
            "Vendor payment",
            "Commission",
            "Material purchase",
            "Travel expense"
        )
    }
}
