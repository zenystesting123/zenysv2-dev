import { AnyRecordWithTtl } from 'dns';
import { Url } from 'url';
import { ExpenseSettingsComponent } from './settings/expense-settings/expense-settings.component';
import { DefaultCustomerPipelines, DefaultSalePipelines, DefaultServicePipelines } from './model/pipeline.modal';

export class FollowupStatus {
  public static DATA = [
    'Scheduled',
    'Missed',
    'Wrong Number',
    'Not Connecting',
    'Connected',
  ];
}

export class FollowupOutcome {
  public static DATA = ['Positive', 'Negative'];
}
export class FollowupDirection {
  public static DATA = ['Outbound', 'Inbound'];
}
export class Inquiries {
  id: string;
  date: Date;
  email: string;
  message: string;
  phone: number;
  status: string;
  name: string;
  viewStatus: boolean;
}
export interface rejectedCont {
  reason: string;
  count: number;
}
export class Gallery {
  id: any;
  downloadURL: string;
  thumbnailURL: string;
  date: any;
  path: any;
}
export class Expenses {
  id: any;
  descriptions: string;
  category: string;
  expenseDate: any;
  amount: number;
  customerCompany: string;
  customerSecondName: string;
  customerFirstName: string;
  saleTitle: string;
  saleId: string;
  customerId: string;
  currency: string;
  additionalFieldsArr: any[];
  createdById: string;
  orgId: any;
  changeLog: any;
}
export class FbForm {
  id: string;
  questions: questionsModel[];
}
export class questionsModel {
  id: string;
  key: string;
  label: string;
  type: string;
  options: any[];
}
export class EMail {
  customerId: any;
  loggedInUser: string;
  messageHistory: {};
}
export class EMailMessageModel {
  threadId: string;
  from: string;
  to: string;
  cc: string;
  bcc: string;
  messageID: string;
  body: string;
  subject: string;
  date: string;
  attachments: any[];
}

export class Attachments {
  id: any;
  customerName: string;
  date: any;
  fileName: any;
  path: string;
  size: number;
  downloadUrl: string;
  uploaded: string;
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
export class NotificationCount {
  userId: string;
  tasksNo: number;
  followupsNo: number;
  meetingsNo: number;
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
  serviceId: string;
  serviceTitle: string;
  additionalFieldsArr: any[];
}
export interface Profile {
  outboundCallType: any;
  extensionNumber: string;
  // voxbayExtensionNumber: any;
  voxbayPin: any;
  voxbayUid: any;
  voxbayCallerid: any;
  taskStatusOpn: any[];
  serviceCustomDoc: any[];
  saleCustomDoc: any[];
  contactCustomDoc:any [];
  timeZone: string;
  tzOffset: any;
  smsApiUserName: string;
  smsApiPwd: string;
  smsApiSenderId: string;
  smsApiEntityId: string;
  waBusProvider: string;
  waBusAuthKey: string;
  waBusURL: string;
  waBusIntId: string;
  waBusAppId: string;
  waBusSourceNo: string;

  orgSequenceNumber: number;
  customFieldsOrganisation: customFieldsReport[];
  customFieldsInvoices: any;
  customFieldsQuotation: any;
  taskCardFields: any[];
  followupCardFields: any[];
  customerCardFields: any[];
  orgCardFields: any[];
  customFieldsEstimate: any;
  saleCardFields: any[];
  serviceCardFields: any[];

  isCustomerIndividual: boolean;
  sharedFormURLs: string[];
  sharedFormIds: string[];
  leadCaptureFormNames: any[];
  leadCaptureData: any[];
  leadCaptureFields: any[];
  isProdCheckMandatory: boolean;
  // expenseSettings: any;
  customFieldsExpense: any[];
  customFieldsPayment: any[];
  stripeConnect: string;
  razorpayPartner: string;
  publicProfileID: string;
  id: string;
  displayName: string;
  firstname: string;
  customFieldsContact: any[];
  expenseCategory: any[];
  lastname: string;
  custLead: any[];
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
  categoryOthers: string;
  quotationNote: string;
  invoiceNote: string;
  invoiceNoInit: number;
  invoiceNoLast: number;
  quoteNoInit: number;
  profImage3: string;
  profImage2: string;
  profImage1: string;
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
  customFields: any[];
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
  firstSettingsCard: boolean;
  totalAttachmentsSize: number;
  logo: any;
  sign: any;
  documentColor: string;
  customFieldsSale: any[];
  customFieldsTask: any[];
  city: string;
  zenysCustId: string;
  estimateNumberPrefix: string;
  quotationNumberPrefix: string;
  invoiceNumberPrefix: string;
  // newly adding customisable field
  fieldNames: any;
  noSubusers: number;
  rzrAccountId: string;
  stripeAccountId: string;
  payLinkMode: string;
  rzrPartnerAccountDetails: any;
  stripePartnerAccountDetails: any;
  employeePrefix: string;
  employeeNoInit: number;
  employeeIDTemp: string;
  notificationCount: number;
  attmgmtEnabled: boolean;
  CRMAccess: boolean;
  smsEnabled: boolean;
  smsActivated: boolean;
  emailActivated: boolean;
  selectedSmsTemplate: string;
  selectedEmailTemplate: string;
  contactSequentialNumber: number;
  saleSequentialNumber: number;
  orderWonCheck: boolean;
  estimateApproval: boolean;
  invoiceApproval: boolean;
  quotationApproval: boolean;
  invoiceAutoPayLinkEnable: boolean;
  estimateAutoPayLinkEnable: boolean;
  quotationAutoPayLinkEnable: boolean;
  productCategories: Array<string>;
  productCategoriesOpn: string;
  productUnits: Array<string>;
  productUnitsOpn: string;
  logOutTime: number;
  actCustAgeing: boolean;
  actSaleAgeing: boolean;
  followUpOutcome: string[];
  followUpOutcomeReqCheck: boolean;
  followUpOutcomeDisplayCheck: boolean;
  followUpStatus: string[];
  followUpStatusReqCheck: boolean;
  followUpStatusDisplayCheck: boolean;
  ivrIntegrationEnable: boolean;
  enableOutboundCallsViaCallBridging: boolean;
  ivrServiceProvider: string;
  callBridgingServiceProvider: string;
  ivrToken: string;
  autoCallToken: string;
  lockAccessAutoLogout: boolean;
  accessLockAutoLogoutThreshold: number;
  accessLockAutologout: boolean;
  autoLogoutActive: boolean;
  // new fields for service

  customFieldsService: any[];

  // serviceStages: Array<stagesModel>;
  // serviceStagesAddOne: Array<stagesModel>;
  // serviceStagesAddTwo: Array<stagesModel>;
  // serviceStagesAddThree: Array<stagesModel>;
  // serviceStagesAddFour: Array<stagesModel>;
  // pipelineNamesService: Array<string>;

  // saleStages: Array<stagesModel>;
  // saleStagesAddOne: Array<stagesModel>;
  // saleStagesAddTwo: Array<stagesModel>;
  // saleStagesAddThree: Array<stagesModel>;
  // saleStagesAddFour: Array<stagesModel>;
  // pipelineNamesSales: Array<string>;

  // contactStatus: Array<stagesModel>;
  // contactStatusAddOne: Array<stagesModel>;
  // contactStatusAddTwo: Array<stagesModel>;
  // contactStatusAddThree: Array<stagesModel>;
  // contactStatusAddFour: Array<stagesModel>;
  // pipelineNamesCustomer: Array<string>;

  // serviceStatus: any; //field used for stroing sales stages
  // serviceStatusAge: any; //array holding the maximum age in each sale stage
  // serviceStatusOpn: any;

  actserviceAgeing: boolean;
  serviceSequentialNumber: number;

  ReportSettings: ReportSettings[];
  customerViewSettings: viewSettings[];
  orgViewSettings: viewSettings[];
  saleViewSettings: viewSettings[];
  serviceViewSettings: viewSettings[];
  taskViewSettings: viewSettings[];
  followUpViewSettings: viewSettings[];
  paymentViewSettings: viewSettings[];
  estimateViewSettings: viewSettings[];
  invoiceViewSettings: viewSettings[];
  quotationViewSettings: viewSettings[];
  expenseViewSettings: viewSettings[];
  productViewSettings: viewSettings[];
  expenseSettings: expenseSettings;
  callerList: string[];
  callerLastAssign: number;
  duplicateEmailDisable: boolean;
  duplicateContactNumberDisable: boolean;
  duplicateAlternateContactNumberDisable: boolean;
  customFieldsFollowUp: customFields[];

  // dashboard setting
  dashboardSettings: any[];
  taskSettings: taskSettings;
  productSettings: ProductSettings;
  contactSettings: contactSettings;
  serviceSettings: serviceSettings;
  paymentSettings: paymentSettings;
  followUpSettings: followUpSettings;
  customFieldsProduct: customFields[];
  itemQtyDisplay: boolean;
  itemMaxAllowed: number;
  saleSettings: saleSettings;
  organisationSettings: organisationSettings;
  associatedBranch: string;

  displayEstimateColumns: DisplayColumn[];
  displayInvoiceColumns: DisplayColumn[];
  displayQuotationColumns: DisplayColumn[];
  displayCollectionColumns: DisplayColumn[];
  displayExpenseColumns: DisplayColumn[];
  displayFollowupColumns: DisplayColumn[];
  displayTaskColumns: DisplayColumn[];
  displayCustomerColumns: DisplayColumn[];
  displayOrgColumns: DisplayColumn[];
  displaySaleColumns: DisplayColumn[];
  displayServiceColumns: DisplayColumn[];
  displayProductColumns: DisplayColumn[];

  estimateOrgTag: boolean;
  estimateContactTag: boolean;
  estimateSaleTag: boolean;

  quotationOrgTag: boolean;
  quotationContactTag: boolean;
  quotationSaleTag: boolean;

  invoiceOrgTag: boolean;
  invoiceContactTag: boolean;
  invoiceSaleTag: boolean;
  DIDNumber: string;

  estimateContactDetails: DocContactDetails;
  invoiceContactDetails: DocContactDetails;
  quotationContactDetails: DocContactDetails;
  hsnCodeDisplay: any;
  followUpDefaultView: string;
  taskDefaultView: string;
  saleDefaultView: string;
  contactDefaultView: string;
  serviceDefaultView: string;
  followUpDirection: string[];
  autoCallURL:string;// autocall post url
  enableLiteMode:boolean;
  channelID:string;// autocall channelID
}
export class DocContactDetails {
  contactName: string;
  contactNumber: string;
  email: string;
  signatoryName: string;
  designation: string;
}
export interface SettingsItem {
  displayName: string;
  display: boolean;
  mandatory: boolean;
}
export interface expenseSettings {
  expenseDate: SettingsItem;
  description: SettingsItem;
  category: SettingsItem;
  currency: SettingsItem;
  amount: SettingsItem;
}
export class defaultExpenseSettings {
  public static CONST_VALUE = {
    expenseDate: {
      displayName: 'Expense Date',
      display: true,
      mandatory: true,
    },
    description: {
      displayName: 'Description ',
      display: true,
      mandatory: false,
    },
    category: {
      displayName: 'Category',
      display: true,
      mandatory: true,
    },
    currency: {
      displayName: 'Currency',
      display: true,
      mandatory: true,
    },
    amount: {
      displayName: 'Amount',
      display: true,
      mandatory: true,
    },
    companyName: {
      displayName: 'Company Name',
      display: true,
      mandatory: true,
    },
    saleTitle: {
      displayName: 'Sale Title',
      display: true,
      mandatory: false,
    },
    selectedCust: {
      displayName: 'Contact Name',
      display: true,
      mandatory: false,
    },
  };
}

//fieldNames of sales docs to be displayed in changeLog
export class salesDocsFieldNames {
  public static CONST_VALUE = {
    docTitle: {
      displayName: 'Document Title',
    },
    docDate: {
      displayName: 'Date',
    },
    docValidity: {
      displayName: 'Valid Till Date',
    },
    logo: {
      displayName: 'Logo',
    },
    dueDate: {
      displayName: 'Due Date',
    },
    paymentTerm: {
      displayName: 'Payment Term',
    },
    poRef: {
      displayName: 'P.O Ref',
    },
    //bill from
    billFromCompanyName: {
      displayName: 'Company Name in billing address',
    },
    billFromContactname: {
      displayName: 'Contact Name in billing address',
    },
    billFromAddressline1: {
      displayName: 'Address Line1 in billing address',
    },
    billFromAddressline2: {
      displayName: 'Address Line2 in billing address',
    },
    billFromCity: {
      displayName: 'City in billing address',
    },
    billFromPinCode: {
      displayName: 'PIN/ZIP in billing address',
    },
    billFromState: {
      displayName: 'State in billing address',
    },
    billFromCountry: {
      displayName: 'Country in billing address',
    },
    billFromGst: {
      displayName: 'Tax Identification/GST/VAT No in billing address',
    },

    //billTo
    billToCompanyName: {
      displayName: 'Company Name in billed to address',
    },
    billToFname1: {
      displayName: 'First Name in billed to address',
    },
    billToSname: {
      displayName: 'Second Name in billed to address',
    },
    billToSurname: {
      displayName: 'Surname in billed to address',
    },
    billToAddressline1: {
      displayName: 'Address Line1 in billed to address',
    },
    billToAddressline2: {
      displayName: 'Address Line2 in billed to address',
    },
    billToDistrict: {
      displayName: 'District in billed to address',
    },
    billToPinCode: {
      displayName: 'Pin code in billed to address',
    },
    billToState: {
      displayName: 'State in billed to address',
    },
    billToCountry: {
      displayName: 'Country in billed to address',
    },
    billToCountryCode: {
      displayName: 'Country code in billed to address',
    },
    billToContactNumber: {
      displayName: 'Contact No in billed to address',
    },
    billToEmail: {
      displayName: 'Email in billed to address',
    },
    billToGst: {
      displayName: 'Tax Identification/GST/VAT No in billed to address',
    },
    //delivery address
    deliveryCompanyName: {
      displayName: 'Company Name in delivery address',
    },
    deliveryContactName: {
      displayName: 'Contact Name in delivery address',
    },
    deliveryAddressline1: {
      displayName: 'Address Line1 in delivery address',
    },
    deliveryAddressline2: {
      displayName: 'Address Line2 in delivery address',
    },
    deliveryDistrict: {
      displayName: 'District in delivery address',
    },
    deliveryPinCode: {
      displayName: 'PIN/ZIP in delivery address',
    },
    deliveryState: {
      displayName: 'State in delivery address',
    },
    deliveryCountry: {
      displayName: 'Country in delivery address',
    },
    deliverycountryCode: {
      displayName: 'Country Code in delivery address',
    },
    deliveryContactNumber: {
      displayName: 'Contact Number in delivery address',
    },
    deliveryEmail: {
      displayName: 'Email in delivery address',
    },
    currency: {
      displayName: 'Currency',
    },
    includeUnit: {
      displayName: 'Include Unit',
    },
    includeTax: {
      displayName: 'Include Tax',
    },
    includeDiscount: {
      displayName: 'Include Discount',
    },
    taxType: {
      displayName: 'Tax Type',
    },
    interState: {
      displayName: 'Apply IGST(Interstate Sale)',
    },
    includeCess: {
      displayName: 'Include Cess',
    },
    item: {
      displayName: 'Item Name',
    },
    qty: {
      displayName: 'Qty',
    },
    unit: {
      displayName: 'Unit',
    },
    rate: {
      displayName: 'Rate',
    },
    discountPercentage: {
      displayName: 'Discount(%)',
    },
    cgstPercentage: {
      displayName: 'CGST(%)',
    },
    sgstPercentage: {
      displayName: 'SGST(%)',
    },
    vatPercentage: {
      displayName: 'VAT(%)',
    },
    igstPercentage: {
      displayName: 'IGST(%)',
    },
    cessPercentage: {
      displayName: 'CESS(%)',
    },
    description: {
      displayName: 'Description',
    },
    hsnCode: {
      displayName: 'HSN/SAC Code',
    },
    //signatory details
    notes: {
      displayName: 'Additional Notes',
    },
    bankDetails: {
      displayName: 'Bank Account Details',
    },
    signatoryName: {
      displayName: 'Signatory Name',
    },
    designation: {
      displayName: 'Designation',
    },
    signatoryContactname: {
      displayName: 'Contact Name',
    },
    signatoryContactno: {
      displayName: 'Contact No',
    },
    signatoryEmail: {
      displayName: 'Contact EMail',
    },
    signature: {
      displayName: 'Signature',
    },
    gstPlaceOfSupplyCode: {
      displayName: 'Place of supply code',
    },
    gstStateCode: {
      displayName: 'State Code',
    },

  };
}


export class dashboardSetting {}
export class stagesModel {
  public name: string;
  public age: number;
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
  invoiceprefixAndDocNumber: string;
  invoiceAmount: number;
  paymentDate: any;
  paymentMode: string;
  pendingAmount: number;
  prevCustomerAmount: number;
  prevInvoiceAmount: number;
  prevSaleAmount: number;
  saletitle: string;
  saleid: string;
  createdById: string;
  custSecondName: string;
  chequeNo: string;
  chequeBank: string;
  saleTitle: string;
  paymentType: string;
  customerSecondName: string;
  currency: string;
  additionalFieldsArr: any[];
  orgId: string;
  changeLog: any;
}

export class FollowUps {
  //adding new field must handle in sampleCall/automation/ionic also
  id: string;
  customerName: string;
  companyName: string;
  dateCreated: number;
  assignedTo: string;
  customerId: string;
  notes: string;
  callStartDate: any;
  callStartTime: any;
  completedStatus: any;
  assignedToName: string;
  outcome: string;
  status: string;
  direction: string;
  callDuration: string;
  callEndDate: any;
  callEndTime: any;
  destinationNumber: string;
  displayNumber: string;
  sourceNumber: string;
  saleId: string;
  saleTitle: string;
  serviceId: string;
  serviceTitle: string;
  additionalFieldsArr: any[];
  resourceURL: string;
  notified: boolean;
  callID: string;
  associatedBranch: string;
  orgId: string;
  assignedToDate:number;
  changeLog: any;
  contactNumber: string;//  customer number
  countryCode: string; //  customer country code
}
// export class Meeting {
//     id?: string | number;
//     start: Date;
//     end?: Date;
//     title: string;
//     name: string;
//     company: string;
//     description: string;
//     assignedCustomer: string;
//     dateCreated: string;
//     customerId: string;
// }
export class Sales {
  lastModifiedDate: any;
  rejectionReasonValue: string; //reason for rejection selected option
  taggedUsers: taggedUsers[]; //to save tagged users under a particular sale
  id: string;
  firstName: string;
  secondName: string;
  surname: string;
  companyName: string;
  saleTitle: string;
  description: string;
  estimatedValue: number;
  expCompletionDate: any;
  expenseAmount: number;
  startDate: any;
  salesStage: string;
  selectedSalePipeline: number;
  additionalFieldsArray: any[];
  additionalFieldsArr: any[];
  additionalFieldDate: any;
  salesType: string;
  priority: string;
  assignedTo: string;
  assignedToName: string;
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
  searchTerm: SearchTermSale;
  sequenceNumber: number;
  changeLog: any;
  inPipeline: boolean;
  won: boolean;
  lost: boolean;
  createdBy: string;
  associatedBranch: string;
  orgId: string;
  contactOwner: string;
  lastAddedNote: string;
  lastNoteDate: any;
  lastNoteId: string;
  assignedToDate: number;
  countryCode: string;
  contactNumber: string;
  altCountryCode: string;
  altContactNumber: string;

  // Product management fields
  itemsArray: ItemsArray | null;

}

export class Service {
  //adding new field must handle in sampleSupport also
  lastModifiedDate: any;
  rejectionReasonValue: string; //reason for rejection value selected option
  taggedUsers: taggedUsers[]; //to save tagged users under a particular service
  id: string;
  associatedBranch: string;
  firstName: string;
  secondName: string;
  companyName: string;
  surname: string;
  serviceTitle: string;
  description: string;
  estimatedValue: number;
  expCompletionDate: any;
  expenseAmount: number;
  startDate: any;
  servicesStage: string;
  additionalFieldsArray: any[];
  additionalFieldDate: any;
  servicesType: string;
  priority: string;
  assignedTo: string;
  assignedToName: string;
  collectionMode: string;
  collectedAmount: number;
  customerId: any;
  EstimatedValue: number;
  invoicedAmount: number;
  createdDate: any;
  days: number;
  daysRange: string;
  completedserviceDate: any;
  confirmedserviceDate: any;
  opportunityDate: any;
  inquiryDate: any;
  stageHistory: any[];
  searchTerm: SearchTermService;
  sequenceNumber: number;
  additionalFieldsArr: any;
  selectedServPipeline: number;
  inPipeline: boolean;
  won: boolean;
  lost: boolean;
  createdBy: string;
  changeLog: any;
  orgId: string;
  contactOwner: string;
  lastAddedNote: string;
  lastNoteDate: any;
  lastNoteId: string;
  assignedToDate: number;
  countryCode: string;
  contactNumber: string;
  altCountryCode: string;
  altContactNumber:string;
}
export interface datArr {
  stageId: string;
  customers: Customer[];
  lastDate: any;
  lastId: string;
}
export interface Customer {
  rejectionReasonValue: string; //reason for rejection selected option
  changeLog: any; //1
  id: string; //2
  orgId: string; //3
  assignedTo: string; //4
  assignedToDate:any;
  assignedToName: string; //5
  associatedBranch: string; //6
  billingaddress1: string; //7
  billingaddress2: string; //8
  bpin: number; //9
  code: string; //10
  altContactCode: string; //11
  companyName: string; //12
  collectedAmount: number; //13
  contactNo: string; //14
  country: string; //15
  createdDate: number; //16
  leadSource: any; //17
  dateCreated: any; //18
  days: number; //19
  daysRange: string; //20
  district: string;
  email: string;
  firstName: string;
  followUpFlag: number;
  taxId: string;
  additionalFieldsArray: any[];
  additionalFieldsArr: any[];
  month: number;
  saleOngoingValue: number;
  salePipelineValue: number;
  createdYear: number;
  pan: string;
  priority: string;
  secondName: string;
  state: string;
  status: any;
  unConfirmedSales: number;
  ongoingSales: number;
  amountToBeCollected: number;
  taskOpen: number;
  lifeTimeValue: number;
  totalAmountCollected: number;
  invoicedAmount: number;
  isCompany: boolean;
  custLead: any;
  createdBy: string;
  stageHistory: any[];
  currentStatusDate: any;
  custLeadValue: any;
  searchTerm: SearchTerm;
  sequenceNumber: number;
  salutation: string;
  surname: string;
  alternateContactNumber: string;
  department: string;
  selectedContactPipeline: number;
  inPipeline: boolean;
  won: boolean;
  lost: boolean;
  taggedUsers: taggedUsers[];
  lastAddedNote: string;
  lastNoteDate: any;
  lastNoteId: string;
  nextFollowupDate:any;
  lastModifiedDate:any
} //if adding new fields we have to handle in
// zenysmainaccount.service.ts
//  sampleContact adding,
// free tool,
// leadCapture form also
export interface taggedUsers {
  userId: string;
  userName: string;
  tagged: boolean;
}
export interface tagUsers {
  userId: string;
  tagged: boolean;
}
// export interface defaultUploadFields {

//     assignedTo: string;
//     billingaddress1: string;
//     billingaddress2: string;
//     bpin: number;
//     code: string;
//     companyName: string;
//     contactNo: string;
//     country: string;
//     district: string;
//     email: string;
//     firstName: string;
//     taxId: string;
//     additionalFieldsArray:any[];
//     additionalFieldsArr: any[];
//     pan: string;
//     priority: string;
//     secondName: string;
//     state: string;
//     status: string;
//     custLeadValue:any;

// }
export class SearchTerm {
  public firstName: string = '';
  public secondName: string = '';
  public companyName: string = '';
  public surname: string = '';
}
export interface CustomersImport {
  assignedTo: string;
  assignedToName: string;
  billingaddress1: string;
  billingaddress2: string;
  bpin: number;
  custLeadValue: any;
  code: string;
  companyName: string;
  collectedAmount: number;
  contactNo: string;
  country: string;
  createdDate: number;
  customerDate: Date;
  dateCreated: any;
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
  salutation: string;
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
  field1: any;
  field2: any;
  field3: any;
  field4: any;
  custField1: any;
  custField2: any;
  custField3: any;
  custField4: any;
  custCategory1: any;
  custCategory2: any;
  custCategory1Name: any;
  custCategory2Name: any;
  custField1Name: any;
  custField2Name: any;
  custField3Name: any;
  custField4Name: any;
  prospectDate: any;
  leadDate: any;
  sequenceNumber: number;
}
export interface statusChange {
  currentDataAge: any;
  type: string;
  uid: string;
  statusArray: [];
  statusAgeArray: [];
  currentIndex: any;
  currentData: string;
  mode: string;
  ageChecked: boolean;
}
export interface additionalField {
  fieldName: any;
  value: any;
}
export class Task {
  //// adding new field must be handled in automation/sample task/ionic
  public title: string;
  public description: string;
  public assignedTo: string;
  public assignedToName: string;
  public dueDate: any;
  public saleTitle: string;
  public saleId: string;
  public serviceTitle: string;
  public serviceId: string;
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
  public associatedBranch: string;
  saleOrServ: string;
  isCompany: string;
  additionalFieldsArr: any;
  changeLog: any;
  orgId: string;
  surname: any;
  assignedToDate: number;
  createdByName:string;
}
export class ContactForm {
  fieldName: string;
  fieldType: string;
  mandatory: boolean;
  categories: any;
  categoriesOpn: string;
  defaultValue: string;
}
export class ContactForms {
  fieldName: string;
  fieldType: string;
  mandatory: boolean;
  categories: any;
  description: string;
}

export class contactForm {
  fieldName;
}
export class superUserTask {
  isChecked: boolean;
  subUsers: {
    userId: string;
    lastname: any;
    firstname: any;
  };
}
export class Invoice {
  id: string;
  idstate: string;
  collectedAmount: any;
  sharedDocId: string;
  createdBy: string;
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
    countryCode: string;
    contactNumber: string;
    email: string;
    deliveryPinCode: number;
    deliveryDistrict: string;
    deliveryState: string;
    deliveryCountry: string;
    deliveryContactName: string;
    deliveryAddressline1: string;
    deliveryAddressline2: string;
    deliveryContactNumber: string;
    orgId: string;
  };
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
    saleTitle: string;
    sgstValue: number;
    total: number;
    totalInclTax: number;
    amountCollected: number;
    id: any;
    createdDate: any;
    taxType: string;
    docPrefix: string;
    prefixAndDocNumber: string;
    cancel: boolean;
    saleAssignedToOwner: string;
    statusApproved: boolean;
    gstStateCode: string;
    gstPlaceOfSupplyCode: string;
  };
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
  ];
  userData: {
    addressline1: string;
    adrressline2: string;
    companyName: string;
    country: string;
    designation: string;
    district: string;
    contactname: string;
    secondName: string;
    gst: string;
    logo: string;
    pinCode: string;
    signatoryName: string;
    signature: string;
    state: string;
  };
  additionalFieldsArr: any;
}
export interface CustomerNotes {
  createdById: string; //user ID of the user who has created the note
  cratedByName: string; // name of the user wo has created the note
  createdDate: Date; //Date and time at which the note was created;
  note: string; //Note submitted
  id: string;
  isEditable: boolean;
}
export interface SalesNotes {
  createdById: string; //user ID of the user who has created the note
  cratedByName: string; // name of the user wo has created the note
  createdDate: Date; //Date and time at which the note was created;
  note: string; //Note submitted
  id: string;
  isEditable: boolean;
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
  ) {}
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
  noOfRatingReceived: number;
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
  logo: File;
  signature: File;
  signatoryName: string;
  designation: string;
  state: string;
  addressline1: string;
  addressline2: string;
  gst: string;
  companyName: string;
  pinCode: string;
  country: string;
  contactname: string;
  secondName: string;
  contactno: string;
  email: string;
  city: string;
}
export interface CustomerData {
  pinCode: number;
  district: string;
  state: string;
  country: string;
  gst: string;
  fname1: string;
  sname: string;
  surname: string;
  companyName: string;
  addressline1: string;
  addressline2: string;
  custID: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  deliveryPinCode: number;
  deliveryDistrict: string;
  deliveryState: string;
  deliveryCountry: string;
  deliveryContactName: string;
  deliveryAddressline1: string;
  deliveryAddressline2: string;
  deliveryContactNumber: string;
  isDeliveryAddressPresent: boolean;
}
export interface StageValues {
  date: any;
  stageName: string;
  stageNo: number;
}
export interface StageHistoryModel {
  date: any;
  stageId: string;
  pipelineId: number;
}
export interface customFields {
  fieldName: string;
  fieldType: string;
  categories: string[];
  categoriesOpn: string;
  defaultValue: any;
  mandatory: boolean;
  value: any;
  isActive: boolean;
}
// export interface customDocs {
//     documentName:string;
//     docValidation:boolean;
//     doctypes:{
//       pdf:boolean;
//       word:boolean;
//       csv:boolean;
//       png:boolean;
//       jpeg:boolean;
//       jpg:boolean;
//     };
//     docIdentifier:string;
// }

export interface leadCaptureModel {
  columnDef: string;
  header: string;
  position: number;
  display: boolean;
  inputType: string;
  categories: string[];
  mandatory: boolean;
  fieldType: string;
  defaultValue: string;
  customField: boolean;
}
export interface mappedFieldsModel {
  columnDef: string;
  header: string;
  inputType: string,
}

export interface fbLeadsModel {
  columnDef: string;
  header: string;
  mappedField: boolean;
  mappedTo: string;
  position: number;
  display: boolean;
  inputType: string;
  categories: string[];
  mandatory: boolean;
  defaultValue: string;
  customField: boolean;
}

export interface addFieldsArr {
  fieldValue: string;
}
// used for report table
export class customFieldsReport {
  constructor(
    public fieldName: string,
    public fieldType: string,
    public categories: string[],
    public categoriesOpn: string,
    public defaultValue: string,
    public mandatory: boolean,
    public value: any,
    public isActive: boolean
  ) {}
}
export interface DocData {
  docDate: string;
  dueDate: string;
  sgstValue: number;
  cgstValue: number;
  igstValue: number;
  cessValue: number;
  vatValue: number;
  discountValue: number;
  discountedAmount: number;
  total: number;
  docNumber: string;
  quoteRef: string;
  estRef: string;
  totalInclTax: number;
  poRef: string;
  paymentTerm: string;
  docType: string;
  bankDetails: string;
  notes: string;
  currency: string;
  includeTax: boolean;
  includeCess: boolean;
  includeUnit: boolean;
  interState: boolean;
  includeDiscount: boolean;
  docTitle: string;
  docValidity: string;
  saleID: string;
  saleTitle: string;
  amountCollected: number;
  createdDate: any;
  taxType: string;
  docPrefix: string;
  prefixAndDocNumber: string;
  cancel: boolean;
  saleAssignedToOwner: string;
  statusApproved: boolean;
  gstStateCode: string;
  gstPlaceOfSupplyCode: string;
}
export interface Services {
  imageURL: string;
  title: any;
  description: any;
  currency: string;
  price: number;
  unit: any;
  rateFixed: boolean;
}
export interface LineItemData {
  slno: number;
  item: string;
  qty: number;
  unit: string;
  rate: number;
  sgstRate: number;
  sgstAmount: number;
  cgstRate: number;
  cgstAmount: number;
  igstRate: number;
  igstAmount: number;
  cessRate: number;
  cessAmount: number;
  discountRate: number;
  discountAmount: number;
  discountedAmount: number;
  amount: number;
  amountInclTax: number;
  description: string;
  vatRate: number;
  vatAmount: number;
  hsnCode: string;
}

export class CheckStatus {
  constructor(public name: string, public isChecked: boolean) {}
}
export class subUsers {
  constructor(
    public userId: string,
    public firstname: string,
    public lastname: string
  ) {}
}
export class Category {
  categories: string[] = [];
  constructor() {
    this.categories.push(
      'Overseas Education',
      'Real Estate',
      'Tele-Sales',
      'General Sales', //default configuration
      'Others'
    );
  }
}
export const Overseas_fields = {
  saleCustomPageActive: true,
  contactCustomPageActive: true,
  contactCustomTabName: [
    {
      componentName: 'EnglishChannelContactTab2Component',
      displayName: 'EXP AND ACADS',
      value: 'workExp',
    },
    {
      componentName: 'EnglishChannelContactTab1Component',
      displayName: 'DOCS',
    },
  ],
  saleCustomTabName: [
    {
      displayName: 'FEES',
      componentName: 'EnglishChannelSaleTab1Component',
    },
  ],
  customFieldsContact: [
    {
      categories: null,
      fieldType: 'date',
      defaultValue: null,
      value: null,
      mandatory: false,
      isActive: true,
      fieldName: 'D.o.B',
      categoriesOpn: null,
    },
    {
      isActive: true,
      fieldType: 'inputField',
      categoriesOpn: null,
      defaultValue: null,
      mandatory: false,
      value: null,
      categories: null,
      fieldName: 'Passport No',
    },
    {
      categories: ['B2B', 'Individual'],
      fieldType: 'category',
      isActive: true,
      fieldName: 'Referral Type',
      mandatory: false,
      categoriesOpn: 'Individual, B2B',
      defaultValue: null,
      value: null,
    },
    {
      defaultValue: null,
      mandatory: false,
      fieldType: 'inputField',
      value: null,
      categories: null,
      fieldName: 'Ind Referrer',
      categoriesOpn: null,
      isActive: true,
    },
    {
      defaultValue: null,
      categories: ['India Overseas', 'Global wings'],
      fieldType: 'category',
      mandatory: false,
      value: null,
      isActive: true,
      fieldName: 'B2B Referrer',
      categoriesOpn: 'Global wings, India Overseas',
    },
    {
      mandatory: false,
      value: null,
      categoriesOpn: 'Summer, Winter, Fall, Spring',
      categories: ['Spring', 'Fall', 'Winter', 'Summer'],
      isActive: true,
      defaultValue: null,
      fieldName: 'Intake Cycle',
      fieldType: 'category',
    },
    {
      fieldName: 'Intake Year',
      categoriesOpn: '2024, 2023, 2022',
      categories: ['2022', '2023', '2024'],
      mandatory: false,
      fieldType: 'category',
      defaultValue: null,
      value: null,
      isActive: true,
    },
  ],
  contactSettings: {
    assignedTo: {
      mandatory: true,
      display: true,
      displayName: 'Assigned To',
    },
    status: {
      mandatory: true,
      displayName: 'Status',
      display: true,
    },
    secondName: {
      displayName: 'Second Name ',
      display: true,
      mandatory: false,
    },
    salutation: {
      display: true,
      mandatory: false,
      displayName: 'Salutation',
    },
    surname: {
      display: false,
      displayName: 'Surname',
      mandatory: false,
    },
    alternateContactNumber: {
      displayName: 'Alt No',
      mandatory: false,
      display: true,
    },
    taxId: {
      display: false,
      mandatory: false,
      displayName: 'Tax Identification Number',
    },
    contactNo: {
      mandatory: false,
      display: true,
      displayName: 'Mob No',
    },
    priority: {
      display: true,
      mandatory: true,
      displayName: 'Priority',
    },
    custLeadValue: {
      displayName: 'Lead Source',
      display: true,
      mandatory: false,
    },
    billingaddress2: {
      mandatory: false,
      display: true,
      displayName: 'Address 2',
    },
    state: {
      mandatory: false,
      displayName: 'State',
      display: true,
    },
    billingaddress1: {
      displayName: 'Address 1',
      display: true,
      mandatory: false,
    },
    selectedContactPipeline: {
      display: false,
      mandatory: false,
      displayName: 'Pipeline',
    },
    firstName: {
      display: true,
      mandatory: true,
      displayName: 'First Name',
    },
    companyName: {
      mandatory: true,
      display: true,
      displayName: 'Partner',
    },
    district: {
      display: true,
      displayName: 'District',
      mandatory: false,
    },
    custLeadOpn: {
      custLeadOpn:
        'Online Marketing, Offline marketing, Walk in, Referral - Ind, Referral - B2B, Events ',
    },
    country: {
      display: true,
      mandatory: false,
      displayName: 'Country',
    },
    email: {
      display: true,
      displayName: 'Email',
      mandatory: false,
    },
    bpin: {
      display: true,
      displayName: 'Pin Or Zip',
      mandatory: false,
    },
    department: {
      display: false,
      displayName: 'Department',
      mandatory: false,
    },
  },
  fieldNames: {
    fieldNameContactNotes: 'Note',
    fieldNameItemsCategory: 'University',
    fieldNameContact: 'Applicant',
    fieldNameSale: 'Application',
    fieldNameInvoice: 'Invoice',
    fieldNameService: 'Support',
    fieldNameItems: 'Course',
    fieldNameQuotation: 'Quotation',
    fieldNameOrganization: 'Partner',
    fieldNameEstimate: 'Estimate',
    fieldNameSaleNotes: 'Note',
    fieldNameCollection: 'Collection',
    fieldNameTask: 'Task',
    fieldNameExpense: 'Expense',
    fieldNameFollowup: 'Call',
    fieldNameMeeting: 'Meeting',
  },
  custLead: [
    'Events',
    'Referral - B2B',
    'Referral - Ind',
    'Walk in',
    'Offline marketing',
    'Online Marketing',
  ],
  custLeadOpn:
    'Online Marketing, Offline marketing, Walk in, Referral - Ind, Referral - B2B, Events ',
  productUnits: ['Course'],
  productSettings: {
    discount: {
      display: false,
      mandatory: false,
      displayName: 'Discount',
    },
    productName: {
      displayName: 'Course',
      mandatory: true,
      display: true,
    },
    category: {
      display: true,
      mandatory: false,
      displayName: 'University',
    },
    igst: {
      display: false,
      mandatory: false,
      displayName: 'IGST',
    },
    currency: {
      displayName: 'Currency',
      mandatory: false,
      display: true,
    },
    hsnCode: {
      displayName: 'HSN Code',
      display: false,
      mandatory: false,
    },
    unitPrice: {
      displayName: 'Fee',
      mandatory: false,
      display: true,
    },
    availability: {
      display: true,
      mandatory: false,
      displayName: 'Availabilty',
    },
    sgst: {
      mandatory: false,
      display: false,
      displayName: 'SGST',
    },
    cgst: {
      display: false,
      displayName: 'CGST',
      mandatory: false,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },
    units: {
      display: false,
      mandatory: false,
      displayName: 'Unit',
    },
  },
  productCategories: ['ABC University', 'XYZ University'],
};
export const realEst_fields = {
  customFieldsContact: [
    {
      fieldType: 'category',
      mandatory: false,
      categories: ['Govt. Servant', 'Engineer', 'Doctor'],
      isActive: true,
      value: null,
      defaultValue: null,
      fieldName: 'Occupation',
      categoriesOpn: 'Doctor, Engineer, Govt. Servant',
    },
    {
      categories: ['Plot', 'Villa', 'Apartment'],
      value: null,
      categoriesOpn: 'Apartment, Villa, Plot',
      isActive: true,
      fieldType: 'category',
      mandatory: false,
      defaultValue: null,
      fieldName: 'Preference',
    },
    {
      mandatory: false,
      fieldName: 'Project',
      defaultValue: null,
      categoriesOpn: 'Project A, Project B',
      value: null,
      isActive: true,
      fieldType: 'category',
      categories: ['Project B', 'Project A'],
    },
  ],
  contactSettings: {
    selectedContactPipeline: {
      displayName: 'Category',
      display: true,
      mandatory: false,
    },
    state: {
      mandatory: false,
      display: true,
      displayName: 'State',
    },
    alternateContactNumber: {
      display: true,
      mandatory: true,
      displayName: 'Alt No',
    },
    bpin: {
      mandatory: false,
      displayName: 'Pin Or Zip',
      display: true,
    },
    district: {
      mandatory: false,
      display: true,
      displayName: 'District',
    },
    companyName: {
      mandatory: true,
      display: true,
      displayName: 'Org',
    },
    billingaddress2: {
      display: true,
      displayName: 'Billing Address Two',
      mandatory: false,
    },
    firstName: {
      displayName: 'First Name',
      display: true,
      mandatory: true,
    },
    contactNo: {
      mandatory: true,
      display: true,
      displayName: 'Mob',
    },
    isCompany: {
      mandatory: true,
      display: true,
      displayName: 'Contact type',
    },
    priority: {
      displayName: 'Priority',
      mandatory: true,
      display: true,
    },
    surname: {
      mandatory: false,
      display: false,
      displayName: 'Surname',
    },
    taxId: {
      mandatory: false,
      display: true,
      displayName: 'Tax Identification Number',
    },
    country: {
      mandatory: false,
      display: true,
      displayName: 'Country',
    },
    custLeadValue: {
      displayName: 'Lead Source',
      mandatory: false,
      display: true,
    },
    custLeadOpn: {
      custLeadOpn: 'Online,Offline, Website leads, Referral',
    },
    department: {
      display: true,
      mandatory: false,
      displayName: 'Department',
    },
    invoice: {
      display: true,
      mandatory: true,
      displayName: 'Invoiced',
    },
    email: {
      display: true,
      mandatory: false,
      displayName: 'Email',
    },
    secondName: {
      mandatory: false,
      display: true,
      displayName: 'Second Name ',
    },
    billingaddress1: {
      mandatory: false,
      displayName: 'Billing Address One',
      display: true,
    },
    collected: {
      mandatory: true,
      displayName: 'Collected',
      display: true,
    },
    assignedTo: {
      mandatory: true,
      displayName: 'Assigned To',
      display: true,
    },
    status: {
      displayName: 'Status',
      mandatory: true,
      display: true,
    },
    salutation: {
      mandatory: false,
      display: true,
      displayName: 'Salutation',
    },
  },
  fieldNames: {
    fieldNameSale: 'Sale',
    fieldNameQuotation: 'Quotation',
    fieldNameFollowup: 'FollowUp',
    fieldNameOrganization: 'Channel Partner',
    fieldNameMeeting: 'Meeting',
    fieldNameCollection: 'Collection',
    fieldNameContactNotes: 'Note',
    fieldNameTask: 'Task',
    fieldNameSaleNotes: 'Note',
    fieldNameExpense: 'Expense',
    fieldNameService: 'Support',
    fieldNameContact: 'Customer',
    fieldNameItems: 'Unit',
    fieldNameEstimate: 'Estimate',
    fieldNameItemsCategory: 'Project',
    fieldNameInvoice: 'Invoice',
  },
  custLeadOpn: 'Online,Offline, Website leads, Referral',
  custLead: ['Referral', 'Website leads', 'Offline', 'Online'],
  productUnits: ['NA'],
  productSettings: {
    hsnCode: {
      mandatory: false,
      display: true,
      displayName: 'HSN Code',
    },
    currency: {
      mandatory: false,
      displayName: 'Currency',
      display: true,
    },
    igst: {
      mandatory: false,
      display: true,
      displayName: 'IGST',
    },
    unitPrice: {
      displayName: 'Unit Price',
      display: true,
      mandatory: false,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },
    discount: {
      display: true,
      mandatory: false,
      displayName: 'Discount',
    },
    cgst: {
      mandatory: false,
      displayName: 'CGST',
      display: true,
    },
    productName: {
      display: true,
      mandatory: true,
      displayName: 'Product Name',
    },
    availability: {
      mandatory: false,
      display: true,
      displayName: 'Availabilty',
    },
    units: {
      displayName: 'Unit',
      mandatory: false,
      display: true,
    },
    category: {
      display: true,
      displayName: 'Project',
      mandatory: false,
    },
    sgst: {
      display: true,
      displayName: 'SGST',
      mandatory: false,
    },
  },
  productCategories: ['ABC Villas', 'XYZ Apartments'],
};
export const teleMaerketing_fields = {
  custLeadOpn: 'Online,Offline',
  custLead: ['Online', 'Offline'],
  fieldNames: {
    fieldNameInvoice: 'Invoice',
    fieldNameEstimate: 'Estimate',
    fieldNameSaleNotes: 'Note',
    fieldNameService: 'Support',
    fieldNameTask: 'Task',
    fieldNameContact: 'Contact',
    fieldNameSale: 'Sale',
    fieldNameItems: 'Products and Service',
    fieldNameMeeting: 'Meeting',
    fieldNameFollowup: 'Follow-Up',
    fieldNameContactNotes: 'Note',
    fieldNameQuotation: 'Quotation',
    fieldNameItemsCategory: 'Category',
    fieldNameCollection: 'Collection',
    fieldNameOrganization: 'Organization',
    fieldNameExpense: 'Expense',
  },
};
export class freeLimit {
  limitList: string[] = [];
  constructor(
    public contact: number = 5,
    public sale: number = 2,
    public invoice: number = 2,
    public estimate: number = 5,
    public quotation: number = 5
  ) {}
}
export class CalendarEventDetails {
  summary: string;
  location: string;
  description: string;
  recurrence: string[];
  attendees: AttendessEmail[];
  start: EventDate;
  end: EventDate;
  reminders: ReminderDetails;
}
export class OutlookCalendarEventDetails {
  id: string;
  summary: string;
  location: string;
  description: string;
  recurrence: string[];
  attendees: AttendessEmail[];
  start: EventDate;
  end: EventDate;
  reminders: ReminderDetails;
}
export class EventDate {
  constructor(public dateTime: Date, public timeZone: string) {}
}
export class AttendessEmail {
  constructor(public email: string) {}
}

export class OverRides {
  constructor(public method: string, public minutes: number) {}
}
export class ReminderDetails {
  constructor(public useDefault: boolean, public override: OverRides[]) {}
}
export class EditableNote {
  constructor(public isEditable: boolean) {}
}

export class ExpenseCategories {
  categories: string[] = [];
  constructor() {
    this.categories.push(
      'Equipment rental',
      'Vendor payment',
      'Commission',
      'Material purchase',
      'Travel expense'
    );
  }
}
export class PlanDocLimit {
  public static sizeLimit = {
    diamond: 2048,
    gold: 1024,
    free: 512,
  };
}
// Width of SideNavs
export class sideNavExpanded {
  public static CONTENT_MARGIN = 223;
}
export class sideNavShrinked {
  public static CONTENT_MARGIN = 72;
}
export class itemMax {
  public static MAX_ITEM = 10;
}
export class defaultProductSettings {
  public static CONST_VALUE = {
    productName: {
      displayName: 'Product Name',
      display: true,
      mandatory: true,
    },
    hsnCode: {
      displayName: 'HSN Code',
      display: true,
      mandatory: false,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },
    category: {
      displayName: 'Category',
      display: true,
      mandatory: false,
    },
    unitPrice: {
      displayName: 'Unit Price',
      display: true,
      mandatory: false,
    },
    units: {
      displayName: 'Unit',
      display: true,
      mandatory: false,
    },
    discount: {
      displayName: 'Discount',
      display: true,
      mandatory: false,
    },
    cgst: {
      displayName: 'CGST',
      display: true,
      mandatory: false,
    },
    sgst: {
      displayName: 'SGST',
      display: true,
      mandatory: false,
    },
    igst: {
      displayName: 'IGST',
      display: true,
      mandatory: false,
    },
    availability: {
      displayName: 'Availabilty',
      display: true,
      mandatory: false,
    },
    vat: {
      displayName: 'VAT Rate',
      display: true,
      mandatory: false,
    },
    currency: {
      displayName: 'Currency',
      display: true,
      mandatory: false,
    },
  };
}
export interface saleSettings {
  rejectionReason: any; //reason for rejection options
  rejectionReasonVal: SettingsItem; //reason for rejection settings
  selectedCust: SettingsItem;
  saleTitle: SettingsItem;
  estimatedValue: SettingsItem;
  collectionMode: SettingsItem;
  startDate: SettingsItem;
  expCompletionDate: SettingsItem;
  selectedSalePipeline: SettingsItem;
  salesStage: SettingsItem;
  priority: SettingsItem;
  description: SettingsItem;
  selectedProduct: SettingsItem;
  selProdCat: SettingsItem;
  assignedTo: SettingsItem;
  assignedToName: SettingsItem;
  value: SettingsItem;
  expense: SettingsItem;
  invoiced: SettingsItem;
  collected: SettingsItem;
}
//Default field names for Sales
export class defaultSaleSettings {
  public static CONST_VALUE = {
    rejectionReason: {
      rejectionReason: '',
    }, //reason for rejection options
    rejectionReasonVal: {
      displayName: 'Reason for Rejection',
      display: false,
      mandatory: false,
    }, //reason for rejection settings
    selectedCust: {
      displayName: 'Contact Name',
      display: true,
      mandatory: true,
    },
    saleTitle: {
      displayName: 'Title',
      display: true,
      mandatory: false,
    },
    estimatedValue: {
      displayName: 'Estimated Value',
      display: true,
      mandatory: false,
    },
    collectionMode: {
      displayName: 'Collection Mode',
      display: true,
      mandatory: false,
    },
    startDate: {
      displayName: 'Start Date',
      display: true,
      mandatory: false,
    },
    expCompletionDate: {
      displayName: 'Expected Completion Date',
      display: true,
      mandatory: false,
    },
    selectedSalePipeline: {
      displayName: 'Pipeline',
      display: true,
      mandatory: false,
    },
    salesStage: {
      displayName: 'Stage',
      display: true,
      mandatory: true,
    },
    priority: {
      displayName: 'Priority',
      display: true,
      mandatory: false,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },
    selectedProduct: {
      displayName: 'Product Name',
      display: true,
      mandatory: false,
    },
    selProdCat: {
      displayName: 'Product Category',
      display: true,
      mandatory: false,
    },
    assignedTo: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To Name',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
    value: {
      displayName: 'Value',
      display: true,
      mandatory: true,
    },
    expense: {
      displayName: 'Expense',
      display: true,
      mandatory: true,
    },
    invoiced: {
      displayName: 'Invoiced',
      display: true,
      mandatory: true,
    },
    collected: {
      displayName: 'Collected',
      display: true,
      mandatory: true,
    },
    companyName: {
      displayName: 'Company Name',
      display: true,
      mandatory: false,
    },
    orgId: {
      displayName: 'Org Id',
      display: true,
      mandatory: false,
    },
  };
}
export interface paymentSettings {
  saletitle: SettingsItem;
  paymentType: SettingsItem;
  invoiced: SettingsItem;
  currency: SettingsItem;
  amountCollected: SettingsItem;
  paymentDate: SettingsItem;
  paymentMode: SettingsItem;
  chequeNo: SettingsItem;
  chequeBank: SettingsItem;
  invoiceprefixAndDocNumber: SettingsItem;
}
export class defaultPaymentSettings {
  public static CONST_VALUE = {
    saletitle: {
      displayName: 'Sale Title',
      display: true,
      mandatory: true,
    },
    paymentType: {
      displayName: 'Payment Type',
      display: true,
      mandatory: true,
    },
    invoiced: {
      displayName: 'Invoice No',
      display: true,
      mandatory: true,
    },
    currency: {
      displayName: 'Currency',
      display: true,
      mandatory: true,
    },
    amountCollected: {
      displayName: 'Amount',
      display: true,
      mandatory: true,
    },
    paymentDate: {
      displayName: 'Payment Date',
      display: true,
      mandatory: true,
    },
    paymentMode: {
      displayName: 'Payment Mode',
      display: true,
      mandatory: true,
    },
    chequeNo: {
      displayName: 'Cheque Number ',
      display: true,
      mandatory: true,
    },
    chequeBank: {
      displayName: 'Bank Details',
      display: true,
      mandatory: true,
    },
    invoiceprefixAndDocNumber: {
      displayName: 'Invoice No',
      display: true,
      mandatory: true,
    },
    companyName: {
      displayName: 'Company Name',
      display: true,
      mandatory: true,
    },
    selectedCust: {
      displayName: 'Contact Name',
      display: true,
      mandatory: false,
    },
  };
}
// 3 default profiles to be added at the time of create Profile
//Default Super User Profile Details
export class SuperUserProfile {
  public static data = {
    profileName: 'SuperUser',
    profileDescription: 'SuperUser Account',
    isSuperUser: true,
    dialogdataAccessRule: 'All',
    isCheckedCont: true,
    isCheckedSale: true,
    isCheckedSalesEst: true,
    isCheckedSalesQuot: true,
    isCheckedSalesInv: true,
    isCheckedDashB: true,
    isCheckedNotes: true,
    isCheckedFoll: true,
    isCheckedAtt: true,
    isCheckedSett: true,
    contactsView: true,
    contactsCreate: true,
    contactsEdit: true,
    contactsDelete: true,
    salesView: true,
    salesCreate: true,
    salesEdit: true,
    salesDelete: true,
    salesDViewEst: true,
    salesDCreateEst: true,
    salesDEditEst: true,
    salesDViewQuot: true,
    salesDCreateQuot: true,
    salesDEditQuot: true,
    salesDViewInv: true,
    salesDCreateInv: true,
    salesDEditInv: true,
    DBView: true,
    DBDownloadReports: true,
    notesView: true,
    notesCreate: true,
    notesEdit: true,
    notesDelete: true,
    follView: true,
    follCreate: true,
    follEdit: true,
    follDelete: true,
    attView: true,
    attAdd: true,
    attRemove: true,
    settView: true,
    settEdit: true,
    DBReportsView: true,
    collectionsView: true,
    collectionCreate: true,
    collectionEdit: true,
    collectionDelete: true,
    expView: true,
    expCreate: true,
    expEdit: true,
    expDelete: true,
    isCheckedColl: true,
    isCheckedExp: true,
    isCheckedItems: true,
    itemsView: true,
    itemsCreate: true,
    itemsEdit: true,
    itemsDelete: true,
    contactsDownload: true,
    salesDownload: true,
    estDownload: true,
    quotDownload: true,
    invDownload: true,
    expDownload: true,
    collDownload: true,
    isCheckedContAtt: true,
    isCheckedSaleAtt: true,
    isCheckedServiceAtt: true,
    contattView: true,
    contattAdd: true,
    contattRemove: true,
    saleattView: true,
    saleattAdd: true,
    saleattRemove: true,
    serviceattView: true,
    serviceattAdd: true,
    serviceattRemove: true,
    contactReAssign: true,
    saleReAssign: true,
    followUpReAssign: true,
    servicesView: true,
    servicesEdit: true,
    servicesCreate: true,
    servicesDelete: true,
    serviceReAssign: true,
    taskReAssign: true,
    isCheckedService: true,
    isCheckedTask: true,
    servicesDownload: true,
    contactDataAccessRule: 'All',
    saleDataAccessRule: 'All',
    serviceDataAccessRule: 'All',
    taskDataAccessRule: 'All',
    followUpDataAccessRule: 'All',
    orgDataAccessRule: 'All',
    isCheckedOrg: true,
    orgsView: true,
    orgsCreate: true,
    orgsEdit: true,
    orgsDelete: true,
    orgsDownload: true,
    orgReAssign: true,
  };
}
//Default  Admin Profile Details
export class AdminProfile {
  public static data2 = {
    profileName: 'Admin',
    profileDescription: 'Admin Account',
    isSuperUser: false,
    dialogdataAccessRule: 'All',
    isCheckedCont: true,
    isCheckedSale: true,
    isCheckedSalesEst: true,
    isCheckedSalesQuot: true,
    isCheckedSalesInv: true,
    isCheckedDashB: true,
    isCheckedNotes: true,
    isCheckedFoll: true,
    isCheckedAtt: true,
    isCheckedSett: true,
    contactsView: true,
    contactsCreate: true,
    contactsEdit: true,
    contactsDelete: false,
    salesView: true,
    salesCreate: true,
    salesEdit: true,
    salesDelete: true,
    salesDViewEst: true,
    salesDCreateEst: true,
    salesDEditEst: true,
    salesDViewQuot: true,
    salesDCreateQuot: true,
    salesDEditQuot: true,
    salesDViewInv: true,
    salesDCreateInv: true,
    salesDEditInv: true,
    DBView: true,
    DBDownloadReports: true,
    notesView: true,
    notesCreate: true,
    notesEdit: true,
    notesDelete: true,
    follView: true,
    follCreate: true,
    follEdit: true,
    follDelete: true,
    attView: true,
    attAdd: true,
    attRemove: true,
    settView: true,
    settEdit: true,
    DBReportsView: true,
    collectionsView: true,
    collectionCreate: true,
    collectionEdit: true,
    collectionDelete: true,
    expView: true,
    expCreate: true,
    expEdit: true,
    expDelete: true,
    isCheckedColl: true,
    isCheckedExp: true,
    isCheckedItems: true,
    itemsView: true,
    itemsCreate: true,
    itemsEdit: true,
    itemsDelete: true,
    contactsDownload: true,
    salesDownload: true,
    estDownload: true,
    quotDownload: true,
    invDownload: true,
    expDownload: true,
    collDownload: true,
    isCheckedContAtt: true,
    isCheckedSaleAtt: true,
    isCheckedServiceAtt: true,
    contattView: true,
    contattAdd: true,
    contattRemove: true,
    saleattView: true,
    saleattAdd: true,
    saleattRemove: true,
    serviceattView: true,
    serviceattAdd: true,
    serviceattRemove: true,
    contactReAssign: true,
    saleReAssign: true,
    followUpReAssign: true,
    servicesView: true,
    servicesEdit: true,
    servicesCreate: true,
    servicesDelete: true,
    serviceReAssign: true,
    taskReAssign: true,
    isCheckedService: true,
    isCheckedTask: true,
    servicesDownload: true,
    contactDataAccessRule: 'All',
    saleDataAccessRule: 'All',
    serviceDataAccessRule: 'All',
    taskDataAccessRule: 'All',
    followUpDataAccessRule: 'All',
    orgDataAccessRule: 'All',
    isCheckedOrg: true,
    orgsView: true,
    orgsCreate: true,
    orgsEdit: true,
    orgsDelete: true,
    orgsDownload: true,
    orgReAssign: true,
  };
}
//Default  SubUser Profile Details
export class SubUserProfile {
  public static data3 = {
    profileName: 'SubUser',
    profileDescription: 'SubUser Account',
    isSuperUser: false,
    dialogdataAccessRule: 'Own',
    isCheckedCont: true,
    isCheckedSale: true,
    isCheckedSalesEst: true,
    isCheckedSalesQuot: true,
    isCheckedSalesInv: true,
    isCheckedDashB: true,
    isCheckedNotes: true,
    isCheckedFoll: true,
    isCheckedAtt: true,
    isCheckedSett: false,
    contactsView: true,
    contactsCreate: true,
    contactsEdit: true,
    contactsDelete: false,
    salesView: true,
    salesCreate: true,
    salesEdit: true,
    salesDelete: true,
    salesDViewEst: true,
    salesDCreateEst: true,
    salesDEditEst: true,
    salesDViewQuot: true,
    salesDCreateQuot: true,
    salesDEditQuot: true,
    salesDViewInv: true,
    salesDCreateInv: true,
    salesDEditInv: true,
    DBView: true,
    DBDownloadReports: true,
    notesView: true,
    notesCreate: true,
    notesEdit: true,
    notesDelete: true,
    follView: true,
    follCreate: true,
    follEdit: true,
    follDelete: true,
    attView: true,
    attAdd: true,
    attRemove: true,
    settView: false,
    settEdit: false,
    DBReportsView: true,
    collectionsView: true,
    collectionCreate: true,
    collectionEdit: true,
    collectionDelete: true,
    expView: true,
    expCreate: true,
    expEdit: true,
    expDelete: true,
    isCheckedColl: true,
    isCheckedExp: true,
    isCheckedItems: true,
    itemsView: true,
    itemsCreate: true,
    itemsEdit: true,
    itemsDelete: true,
    contactsDownload: true,
    salesDownload: true,
    estDownload: true,
    quotDownload: true,
    invDownload: true,
    expDownload: true,
    collDownload: true,
    isCheckedContAtt: true,
    isCheckedSaleAtt: true,
    isCheckedServiceAtt: true,
    contattView: true,
    contattAdd: true,
    contattRemove: true,
    saleattView: true,
    saleattAdd: true,
    saleattRemove: true,
    serviceattView: true,
    serviceattAdd: true,
    serviceattRemove: true,
    contactReAssign: true,
    saleReAssign: true,
    followUpReAssign: true,
    servicesView: true,
    servicesEdit: true,
    servicesCreate: true,
    servicesDelete: true,
    serviceReAssign: true,
    taskReAssign: true,
    isCheckedService: true,
    isCheckedTask: true,
    servicesDownload: true,
    contactDataAccessRule: 'Own',
    saleDataAccessRule: 'Own',
    serviceDataAccessRule: 'Own',
    taskDataAccessRule: 'Own',
    followUpDataAccessRule: 'Own',
    orgDataAccessRule: 'Own',
    isCheckedOrg: true,
    orgsView: true,
    orgsCreate: true,
    orgsEdit: true,
    orgsDelete: true,
    orgsDownload: true,
    orgReAssign: true,
  };
}
export class UserAccessDetails {
  id: string;
  profileName: string;
  profileDescription: string;
  isSuperUser: boolean;
  dialogdataAccessRule: string;
  isCheckedCont: boolean;
  isCheckedSale: boolean;
  isCheckedSalesDoc: boolean;
  isCheckedSalesEst: boolean;
  isCheckedSalesQuot: boolean;
  isCheckedSalesInv: boolean;
  isCheckedDashB: boolean;
  isCheckedNotes: boolean;
  isCheckedFoll: boolean;
  isCheckedAtt: boolean;
  isCheckedSett: boolean;
  contactsView: boolean;
  contactsCreate: boolean;
  contactsEdit: boolean;
  contactsDelete: boolean;
  salesView: boolean;
  salesCreate: boolean;
  salesEdit: boolean;
  salesDelete: boolean;
  salesDView: boolean;
  salesDCreate: boolean;
  salesDEdit: boolean;
  salesDViewEst: boolean;
  salesDCreateEst: boolean;
  salesDEditEst: boolean;
  salesDViewQuot: boolean;
  salesDCreateQuot: boolean;
  salesDEditQuot: boolean;
  salesDViewInv: boolean;
  salesDCreateInv: boolean;
  salesDEditInv: boolean;
  DBView: boolean;
  DBDownloadReports: boolean;
  notesView: boolean;
  notesCreate: boolean;
  notesEdit: boolean;
  notesDelete: boolean;
  follView: boolean;
  follCreate: boolean;
  follEdit: boolean;
  follDelete: boolean;
  attView: boolean;
  attAdd: boolean;
  attRemove: boolean;
  settView: boolean;
  settEdit: boolean;
  isCheckedColl: boolean;
  isCheckedExp: boolean;
  DBReportsView: boolean;
  collectionsView: boolean;
  collectionCreate: boolean;
  collectionEdit: boolean;
  collectionDelete: boolean;
  expView: boolean;
  expCreate: boolean;
  expEdit: boolean;
  expDelete: boolean;
  isCheckedItems: boolean;
  itemsView: boolean;
  itemsCreate: boolean;
  itemsEdit: boolean;
  itemsDelete: boolean;
  contactsDownload: boolean;
  salesDownload: boolean;
  estDownload: boolean;
  quotDownload: boolean;
  invDownload: boolean;
  expDownload: boolean;
  collDownload: boolean;
  isCheckedContAtt: boolean;
  isCheckedSaleAtt: boolean;
  isCheckedServiceAtt: boolean;
  contattView: boolean;
  contattAdd: boolean;
  contattRemove: boolean;
  saleattView: boolean;
  saleattAdd: boolean;
  saleattRemove: boolean;
  serviceattView: boolean;
  serviceattAdd: boolean;
  serviceattRemove: boolean;
  contactReAssign: boolean;
  saleReAssign: boolean;
  followUpReAssign: boolean;
  servicesView: boolean;
  servicesEdit: boolean;
  servicesCreate: boolean;
  servicesDelete: boolean;
  serviceReAssign: boolean;
  taskReAssign: boolean;
  isCheckedService: boolean;
  isCheckedTask: boolean;
  servicesDownload: boolean;
  contactDataAccessRule: string;
  saleDataAccessRule: string;
  serviceDataAccessRule: string;
  taskDataAccessRule: string;
  followUpDataAccessRule: string;
  orgDataAccessRule: string;
  isCheckedOrg: boolean;
  orgsView: boolean;
  orgsCreate: boolean;
  orgsEdit: boolean;
  orgsDelete: boolean;
  orgsDownload: boolean;
  orgReAssign: boolean;
}
//  comments in Task
export class commentsTasksModel {
  constructor(
    public id: string,
    public userId: string,
    public body: string,
    public userName: string,
    public postedTime: Date
  ) {}
}
// salesTask dialog
export interface DialogDataSalesTask {
  id: string;
  userId: string;
  superUserId: string;
  saleId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: any;
  priority: string;
  status: string;
  customerName: string;
  saleTitle: string;
  userName: string;
  superUserName: string;
  assignedToId: string;
}
//   Email Template Types
export class EmailTemplateTypes {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push(
      'Contact',
      'Sale',
      'Service',
      'Estimate',
      'Quotation',
      'Invoice',
      'Collection'
    );
  }
}
//based on user plan configuration, remove sale and service templates
export class EmailTemplateTypes_Invoicing {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push('Contact', 'Estimate', 'Quotation', 'Invoice');
  }
}
//for leadManagement plan
export class EmailTemplateTypes_leadManagement {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push('Contact');
  }
}

//   Email Template Types
export class SMSTemplateTypes {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push(
      'Contact',
      'Sale',
      'Service',
      'Estimate',
      'Quotation',
      'Invoice',
      'Collection'
    );
  }
}
//for leadManagement plan
export class SMSTemplateTypes_leadManagement {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push('Contact');
  }
}
//based on user plan configuration, remove sale and service templates
export class SMSTemplateTypes_Invoicing {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push('Contact', 'Estimate', 'Quotation', 'Invoice');
  }
}

// Products and Services data-model
export class ProductModel {
  constructor(
    public id: string,
    public prodName: string,
    public hsnCode: string,
    public prodDes: string,
    public currency: string,
    public unitPrice: number,
    public unit: string,
    public taxType: string,
    public discount: number,
    public cgst: number,
    public sgst: number,
    public igst: number,
    public availability: boolean,
    public vatRate: number,
    public dateCreated: number,
    public prodCategory: string,
    public additionalFieldsArr: any
  ) {}
}

// Products and Services data-model in Sales with quantity
export class ProductInSaleModel {
  constructor(
    public id: string,
    public prodName: string,
    public hsnCode: string,
    public prodDes: string,
    public currency: string,
    public unitPrice: number,
    public unit: string,
    public taxType: string,
    public discount: number,
    public cgst: number,
    public sgst: number,
    public igst: number,
    public availability: boolean,
    public vatRate: number,
    public quantity: number,
    public productId: string,
    public prodCategory: string,
    public additionalFieldsArr: any[]
  ) {}
}
//   Units of Products
export class ProductUnits {
  prodUnits: string[] = [];
  constructor() {
    this.prodUnits.push('Kilogram', 'Piece', 'Set', 'Item', 'Hour', 'Each', 'Square Meters', 'Square Feet');
  }
}
//   Units of Products
export class ProductCategories {
  prodCats: string[] = [];
  constructor() {
    this.prodCats.push('Product', 'Service');
  }
}

export interface Conditions {
  conditions: condition[];
}
export interface condition {
  field: string;
  condition: string;
  value: string;
}
// invitations model
export class InvitationModel {
  constructor(
    public id: string,
    public accountType: string,
    public email: string,
    public status: string,
    public superUserId: string,
    public superUserEmail: string,
    public employeeStatus: boolean,
    public employeeFName: string,
    public employeeLName: string,
    public crmAccess: boolean,
    public docId: string,
    public reportsToId: string,
    public reportsToName: string,
    public contactNo: number,
    public code: string,
    public accessLockAutologout: boolean,
    public branchName: string,
    public branchId: string,
    public extensionNumber:string,
    public callerId:string
  ) {}
}

export class SharedLeadCaptureModel {

  constructor(
    public id: string,
    public superUserId: string,
    public leadCaptureFields: leadCaptureModel[],
    public leadCaptureFormNames: string[],
    public leadCaptureFormTitles: string[],
    public sharedFormIds: string[],
    public sharedFormURLs: string[],
    public logoStatus: boolean[],
    public userLogo: string,
    public activeStatus: boolean[],
    public byProfileCallerIndex: number[],
    public byUserCallerIndex: number[],
    public assignedToRole: string[],
    public assignedToArray: [],
    public profileName: string[]
  ) {}
}

//model for fbLeadsIntegration
export class fbLeadsIntegrationModel {
  constructor(
    public id: string,
    public superUserID: string,
    public pageId: string,
    public pageName: string,
    public formId: string,
    public formName: string,
    public assignedToArray: string[],
    public assignedToRole: string,
    public byProfileCallerIndex: number,
    public byUserCallerIndex: number,
    public Fields: fbLeadsModel[],
    public profileName: string
  ) {}
}
export class CommonSearchArgsModel {
  constructor(
    public fieldNameSale: string,
    public fieldNameContact: string,
    public placeHolderText: string,
    public searchType: string,
    public label: string,
    public heading: string,
    public searchItemList: CommonSearch[],
    public enableAdd: boolean = false,
    public addText: String = ''
  ) {}
}
export class SearchContactSaleArgsModel {
  constructor(
    public customerItemList: Customer[],
    public superUserId: string,
    public fieldNameSale: string,
    public fieldNameContact: string
  ) {}
}
export class SearchContactSaleResponseModel {
  constructor(
    public saleId: string,
    public saleTitle: string,
    public customerId: string,
    public invoicedAmount: number,
    public isAddSale: boolean,
    public saleAssignedToOwner: string
  ) {}
}
export class CommonSearch {
  constructor(
    public id: string,
    public value: string,
    public seconName: string = '',
    public isAdd: boolean = false
  ) {}
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
  custLead: any;
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
  custLeadValue: string;
  createdBy: string;
  searchTerm: SearchTerm;
  additionalFieldsArr: any[];
  additionalField: string;
  sequenceNumber: number;
}

export class StageHistory {
  date: number;
  stageName: string;
  stageNo: number;
}
export class SalesDetails {
  firstName: string;
  secondName: string;
  surname: string;
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
  assignedToName: string;
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
  currentStatusDate: number;
  searchTerm: SearchTermSale;
  additionalFieldsArr: any[];
  additionalField: string;
  sequenceNumber: number;
}
export class SearchTermSale {
  public firstName: string = '';
  public secondName: string = '';
  public surname: string = '';
  public companyName: string = '';
}
export class SearchTermService {
  public firstName: string = '';
  public secondName: string = '';
  public companyName: string = '';
  public surname: string = '';
}
export interface ItemsImport {
  additionalFieldsArr: addFieldsArr;
  prodName: string;
  hsnCode: string;
  prodDes: string;
  prodCategory: string;
  unitPrice: number;
  unit: string;
  discount: number;
  cgst: number;
  sgst: number;
  igst: number;
  availability: any;
  vatRate: number;
}
export interface SettingsItem {
  displayName: string;
  display: boolean;
  mandatory: boolean;
}
export interface ProductSettings {
  productName: SettingsItem;
  hsnCode: SettingsItem;
  description: SettingsItem;
  category: SettingsItem;
  unitPrice: SettingsItem;
  units: SettingsItem;
  discount: SettingsItem;
  cgst: SettingsItem;
  sgst: SettingsItem;
  igst: SettingsItem;
  availability: SettingsItem;
  vat: SettingsItem;
  currency: SettingsItem;
}
export interface contactSettings {
  rejectionReason: any; //reason for rejection options
  rejectionReasonVal: SettingsItem; //reason for rejection settings
  isCompany: SettingsItem;
  companyName: SettingsItem;
  salutation: SettingsItem;
  firstName: SettingsItem;
  secondName: SettingsItem;
  surname: SettingsItem;
  countryCode: SettingsItem;
  contactNo: SettingsItem;
  altCountryCode: SettingsItem;
  alternateContactNumber: SettingsItem;
  email: SettingsItem;
  priority: SettingsItem;
  selectedContactPipeline: SettingsItem;
  status: SettingsItem;
  custLeadValue: SettingsItem;
  department: SettingsItem;
  assignedTo: SettingsItem;
  billingaddress1: SettingsItem;
  billingaddress2: SettingsItem;
  district: SettingsItem;
  state: SettingsItem;
  country: SettingsItem;
  bpin: SettingsItem;
  taxId: SettingsItem;
  collected: SettingsItem; //customer details page
  invoice: SettingsItem; //customer details page
}
export class defaultContactSettings {
  public static CONST_VALUE = {
    rejectionReason: {
      rejectionReason: '',
    }, //reason for rejection options
    rejectionReasonVal: {
      displayName: 'Reason for Rejection',
      display: false,
      mandatory: false,
    }, //reason for rejection settings
    isCompany: {
      displayName: 'Contact type',
      display: true,
      mandatory: true,
    },
    companyName: {
      displayName: 'Company Name',
      display: false,
      mandatory: false,
    },
    salutation: {
      displayName: 'Salutation',
      display: true,
      mandatory: false,
    },
    firstName: {
      displayName: 'First Name',
      display: true,
      mandatory: true,
    },
    secondName: {
      displayName: 'Second Name ',
      display: true,
      mandatory: false,
    },
    surname: {
      displayName: 'Surname',
      display: false,
      mandatory: false,
    },
    countryCode: {
      displayName: 'Country Code',
      display: true,
      mandatory: false,
    },
    contactNo: {
      displayName: 'Contact Number',
      display: true,
      mandatory: false,
    },
    altCountryCode: {
      displayName: 'Alternate Country Code',
      display: true,
      mandatory: false,
    },
    alternateContactNumber: {
      displayName: 'Alternate Contact Number',
      display: false,
      mandatory: false,
    },
    email: {
      displayName: 'Email',
      display: true,
      mandatory: false,
    },
    priority: {
      displayName: 'Priority',
      display: true,
      mandatory: false,
    },
    selectedContactPipeline: {
      displayName: 'Pipeline',
      display: true,
      mandatory: false,
    },
    status: {
      displayName: 'Status',
      display: true,
      mandatory: true,
    },
    custLeadValue: {
      displayName: 'Lead Source',
      display: true,
      mandatory: false,
    },
    department: {
      displayName: 'Department',
      display: true,
      mandatory: false,
    },
    assignedTo: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
    billingaddress1: {
      displayName: 'Billing Address One',
      display: true,
      mandatory: false,
    },
    billingaddress2: {
      displayName: 'Billing Address Two',
      display: true,
      mandatory: false,
    },
    district: {
      displayName: 'District',
      display: true,
      mandatory: false,
    },
    state: {
      displayName: 'State',
      display: true,
      mandatory: false,
    },
    country: {
      displayName: 'Country',
      display: true,
      mandatory: false,
    },
    bpin: {
      displayName: 'Pin Or Zip',
      display: true,
      mandatory: false,
    },
    taxId: {
      displayName: 'Tax Identification Number',
      display: true,
      mandatory: false,
    },
    collected: {
      displayName: 'Collected',
      display: true,
      mandatory: true,
    },
    invoice: {
      displayName: 'Invoiced',
      display: true,
      mandatory: true,
    },
    orgId: {
      displayName: 'Org Id',
      display: true,
      mandatory: false,
    },
  };
}
export interface organisationSettings {
  companyName: SettingsItem;
  code: SettingsItem;
  contactNo: SettingsItem;
  billingaddress1: SettingsItem;
  billingaddress2: SettingsItem;
  district: SettingsItem;
  state: SettingsItem;
  country: SettingsItem;
  bpin: SettingsItem;
  taxId: SettingsItem;
  invoiced: SettingsItem;
  collected: SettingsItem;
  details: SettingsItem;
  website: SettingsItem;
  email: SettingsItem;
}
export class defaultorganisationSettings {
  public static CONST_VALUE = {
    companyName: {
      displayName: 'Company Name',
      display: true,
      mandatory: true,
    },
    details: {
      displayName: 'Details',
      display: true,
      mandatory: false,
    },
    website: {
      displayName: 'Website',
      display: true,
      mandatory: false,
    },
    code: {
      displayName: 'Code',
      display: true,
      mandatory: false,
    },
    contactNo: {
      displayName: 'Contact No',
      display: true,
      mandatory: false,
    },
    billingaddress1: {
      displayName: 'Billing Address One',
      display: true,
      mandatory: false,
    },
    billingaddress2: {
      displayName: 'Billing Address Two',
      display: true,
      mandatory: false,
    },
    district: {
      displayName: 'District',
      display: true,
      mandatory: false,
    },
    state: {
      displayName: 'State',
      display: true,
      mandatory: false,
    },
    country: {
      displayName: 'Country',
      display: true,
      mandatory: false,
    },
    bpin: {
      displayName: 'Pin Or Zip',
      display: true,
      mandatory: false,
    },
    taxId: {
      displayName: 'Tax Identification Number',
      display: true,
      mandatory: false,
    },
    collected: {
      displayName: 'Collected',
      display: true,
      mandatory: false,
    },
    invoiced: {
      displayName: 'Invoiced',
      display: true,
      mandatory: false,
    },
    email: {
      displayName: 'Email',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
  };
}
export interface taskSettings {
  title: SettingsItem;
  description: SettingsItem;
  isCompany: SettingsItem;
  selectedCust: SettingsItem;
  priority: SettingsItem;
  saleTitle: SettingsItem;
  serviceTitle: SettingsItem;
  dueDate: SettingsItem;
  assignedTo: SettingsItem;
  assignedToName: SettingsItem;
  status: SettingsItem;
}
export class defaultTaskSettings {
  public static CONST_VALUE = {
    title: {
      displayName: 'Title',
      display: true,
      mandatory: true,
    },
    priority: {
      displayName: 'Priority',
      display: true,
      mandatory: true,
    },
    dueDate: {
      displayName: 'Due Date',
      display: true,
      mandatory: true,
    },
    selectedCust: {
      displayName: 'Contact Name',
      display: true,
      mandatory: false,
    },
    org: {
      displayName: 'Organisation',
      display: true,
      mandatory: false,
    },
    isCompany: {
      displayName: 'Contact',
      display: true,
      mandatory: false,
    },
    assignedTo: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },

    saleTitle: {
      displayName: 'Sale Title',
      display: true,
      mandatory: false,
    },
    serviceTitle: {
      displayName: 'Service Title',
      display: true,
      mandatory: false,
    },
    status: {
      displayName: 'Status',
      display: true,
      mandatory: false,
    },
  };
}

export interface serviceSettings {
  rejectionReason: any; //reason for rejection options
  rejectionReasonVal: SettingsItem; //reason for rejection settings
  selectedCust: SettingsItem;
  serviceTitle: SettingsItem;
  estimatedValue: SettingsItem;
  collectionMode: SettingsItem;
  startDate: SettingsItem;
  expCompletionDate: SettingsItem;
  selectedServPipeline: SettingsItem;
  servicesStage: SettingsItem;
  priority: SettingsItem;
  description: SettingsItem;
  assignedTo: SettingsItem;
  // selectedProduct:SettingsItem;
  // selProdCat:SettingsItem;
}
export class defaultServiceSettings {
  public static CONST_VALUE = {
    rejectionReason: {
      rejectionReason: '',
    }, //reason for rejection options
    rejectionReasonVal: {
      displayName: 'Reason for Rejection',
      display: false,
      mandatory: false,
    }, //reason for rejection settings
    selectedCust: {
      displayName: 'Contact Name',
      display: true,
      mandatory: true,
    },
    serviceTitle: {
      displayName: 'Support Title',
      display: true,
      mandatory: true,
    },
    startDate: {
      displayName: 'Start Date',
      display: true,
      mandatory: true,
    },
    expCompletionDate: {
      displayName: 'Exp Completion Date',
      display: true,
      mandatory: true,
    },
    selectedServPipeline: {
      displayName: 'Pipeline',
      display: true,
      mandatory: true,
    },
    servicesStage: {
      displayName: 'Stage',
      display: true,
      mandatory: true,
    },
    priority: {
      displayName: 'Priority',
      display: true,
      mandatory: true,
    },
    description: {
      displayName: 'Description',
      display: true,
      mandatory: false,
    },
    estimatedValue: {
      displayName: 'Estimated Value',
      display: true,
      mandatory: false,
    },
    collectionMode: {
      displayName: 'Collection Mode',
      display: true,
      mandatory: false,
    },
    assignedTo: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To Name',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
    companyName: {
      displayName: 'Company Name',
      display: true,
      mandatory: false,
    },
    orgId: {
      displayName: 'Org Id',
      display: true,
      mandatory: false,
    },
    // selectedProduct: {
    //   displayName: 'Product',
    //   display: true,
    //   mandatory: false,
    // },
    // selProdCat: {
    //   displayName: 'Product Category',
    //   display: true,
    //   mandatory: false,
    // },
  };
}
export interface followUpSettings {
  customerControl: SettingsItem;
  callStartDate: SettingsItem;
  callStartTime: SettingsItem;
  direction: SettingsItem;
  status: SettingsItem;
  outcome: SettingsItem;
  notes: SettingsItem;
  completedStatus: SettingsItem;
  nextFollowUpDate: SettingsItem;
  nextFollowUpTime: SettingsItem;
  nextFollowUpNotes: SettingsItem;
}
export class defaultfollowUpSettings {
  public static CONST_VALUE = {
    callStartDate: {
      displayName: 'Call Start Date',
      display: true,
      mandatory: true,
    },
    direction: {
      displayName: 'Direction',
      display: true,
      mandatory: true,
    },
    customerControl: {
      displayName: 'Contact Name',
      display: true,
      mandatory: true,
    },
    status: {
      displayName: 'Status',
      display: true,
      mandatory: false,
    },
    outcome: {
      displayName: 'Outcome',
      display: true,
      mandatory: false,
    },
    callStartTime: {
      displayName: 'Call Start Time',
      display: true,
      mandatory: false,
    },
    notes: {
      displayName: 'Notes',
      display: true,
      mandatory: false,
    },
    completedStatus: {
      displayName: 'Completed Status',
      display: true,
      mandatory: false,
    },
    nextFollowUpDate: {
      displayName: 'Next Follow Up Date',
      display: true,
      mandatory: false,
    },
    nextFollowUpTime: {
      displayName: 'Next Follow Up Time',
      display: true,
      mandatory: false,
    },
    nextFollowUpNotes: {
      displayName: 'Next Follow Up Notes',
      display: true,
      mandatory: false,
    },
    assignedTo: {
      displayName: 'Assigned To',
      display: true,
      mandatory: false,
    },
    assignedToName: {
      displayName: 'Assigned To Name',
      display: true,
      mandatory: false,
    },
    associatedBranch: {
      displayName: 'Branch',
      display: true,
      mandatory: false,
    },
  };
}
// help video model
export class HelpVideoModel {
  constructor(public id: string, public page: string, public link: string) {}
}
// help topics model
export class HelpTopicsModel {
  constructor(
    public id: string,
    public page: string,
    public helpTopic: Array<object>
  ) {}
}
export class SubUsers {
  constructor(
    public id: string,
    public userId: string,
    public firstname: string,
    public lastname: string,
    public accountType: string,
    public dataAccessRule: string,
    public email: string,
    public userRole: string,
    public reportsToId: string,
    public reportsToName: string,
    public accessLockAutologout: boolean,
    public branchId: string,
    public branchName: string,
    public status: string,
    public code: string,
    public contactNo: string,
    public  extensionNumber:string,
    public callerId:string
  ) {}
}

export class Branch {
  constructor(public id: string, public name: string) {}
}
//
interface customFieldNames{
    fieldNameContact: string,
    fieldNameSale: string,
    fieldNameService: string,
    fieldNameFollowup: string,
    fieldNameTask: string,
    fieldNameMeeting: string,
    fieldNameEstimate: string,
    fieldNameQuotation: string,
    fieldNameInvoice: string,
    fieldNameCollection: string,
    fieldNameExpense: string,
    fieldNameItems: string,
    fieldNameItemsCategory: string,
    fieldNameContactNotes: string,
    fieldNameSaleNotes: string,
    fieldNameOrganization: string
}
export class customFieldNamesData {
  public static data: customFieldNames = {
    fieldNameContact: 'Contact',
    fieldNameSale: 'Sale',
    fieldNameService: 'Support',
    fieldNameFollowup: 'Call',
    fieldNameTask: 'Task',
    fieldNameMeeting: 'Meeting',
    fieldNameEstimate: 'Estimate',
    fieldNameQuotation: 'Quotation',
    fieldNameInvoice: 'Invoice',
    fieldNameCollection: 'Collection',
    fieldNameExpense: 'Expense',
    fieldNameItems: 'Products and Service',
    fieldNameItemsCategory: 'Category',
    fieldNameContactNotes: 'Note',
    fieldNameSaleNotes: 'Note',
    fieldNameOrganization: 'Organization',
  };
}

export class leadCaptureFields {
  public static data: Array<leadCaptureModel> = [
    {
      columnDef: 'firstName',
      header: 'First Name',
      position: 0,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'secondName',
      header: 'Second Name',
      position: 1,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'companyName',
      header: 'Organization',
      position: 2,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'contactNo',
      header: 'Contact No',
      position: 3,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'email',
      header: 'Email',
      position: 4,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'pipeline',
      header: 'Pipeline',
      position: 5,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'status',
      header: 'Status',
      position: 6,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'custLeadValue',
      header: 'Lead Source',
      position: 7,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },

    // {
    //   columnDef: 'assignedTo',
    //   header: 'Assigned To',
    //   position: 8,
    //   display: false,
    //   inputType: 'category',
    //   categories: null,
    //   mandatory: false,
    //   fieldType: 'default_field',
    //   defaultValue: null,
    //   customField: false,
    // },
    // {
    //   columnDef: 'assignedToName',
    //   header: 'Assigned To',
    //   position: 9,
    //   display: false,
    //   inputType: 'category',
    //   categories: null,
    //   mandatory: false,
    //   fieldType: 'default_field',
    //   defaultValue: null,
    //   customField: false,
    // },
    {
      columnDef: 'department',
      header: 'Department',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'billingaddress1',
      header: 'Billing Address One',
      position: 11,
      display: false,
      inputType: 'textarea',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'billingaddress2',
      header: 'Billing Address Two',
      position: 12,
      display: false,
      inputType: 'textarea',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'district',
      header: 'District',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'state',
      header: 'State',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'country',
      header: 'Country',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'bpin',
      header: 'Pin Or Zip',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'taxId',
      header: 'Tax Identification Number',
      position: 10,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      fieldType: 'default_field',
      defaultValue: null,
      customField: false,
    },
  ];
}
//fbLeadsIntegration form fields
export class fbLeadsIntegrationFields {
  public static data: Array<fbLeadsModel> = [
    {
      columnDef: 'selectedContactPipeline',
      header: 'Pipeline',
      mappedField: false,
      mappedTo: null,
      position: 5,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'status',
      header: 'Status',
      mappedField: false,
      mappedTo: null,
      position: 6,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'custLeadValue',
      header: 'Lead Source',
      mappedField: false,
      mappedTo: null,
      position: 7,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      defaultValue: null,
      customField: false,
    },
    {
      columnDef: 'priority',
      header: 'Priority',
      mappedField: false,
      mappedTo: null,
      position: 8,
      display: false,
      inputType: 'category',
      categories: null,
      mandatory: false,
      defaultValue: null,
      customField: false,
    },
    // {
    //   columnDef: 'assignedTo',
    //   header: 'Assigned To ID',
    //   mappedField: false,
    //   mappedTo: null,
    //   position: 9,
    //   display: false,
    //   inputType: 'category',
    //   categories: null,
    //   mandatory: false,
    //   defaultValue: null,
    //   customField: false,
    // },
    // {
    //   columnDef: 'assignedToName',
    //   header: 'Assigned To',
    //   mappedField: false,
    //   mappedTo: null,
    //   position: 10,
    //   display: false,
    //   inputType: 'category',
    //   categories: null,
    //   mandatory: false,
    //   defaultValue: null,
    //   customField: false,
    // },
    {
      columnDef: 'department',
      header: 'Department',
      mappedField: false,
      mappedTo: null,
      position: 11,
      display: false,
      inputType: 'inputField',
      categories: null,
      mandatory: false,
      defaultValue: null,
      customField: false,
    },
  ];
}

export class mapToFields {
  public static data: Array<mappedFieldsModel> = [
    {
      columnDef: 'firstName',
      header: 'First Name',
      inputType: 'inputField'
    },
    {
      columnDef: 'secondName',
      header: 'Second Name',
      inputType: 'inputField'
    },
    {
      columnDef: 'companyName',
      header: 'Organization',
      inputType: 'inputField'
    },
    {
      columnDef: 'contactNo',
      header: 'Contact No',
      inputType: 'number'
    },
    {
      columnDef: 'email',
      header: 'Email',
      inputType: 'inputField'
    },
    {
      columnDef: 'custLeadValue',
      header: 'Lead Source',
      inputType: 'categories'
    },
    {
      columnDef: 'department',
      header: 'Department',
      inputType: 'inputField'
    },
    {
      columnDef: 'billingaddress1',
      header: 'Billing Address One',
      inputType: 'inputField'
    },
    {
      columnDef: 'billingaddress2',
      header: 'Billing Address Two',
      inputType: 'inputField'
    },
    {
      columnDef: 'district',
      header: 'District',
      inputType: 'inputField'
    },
    {
      columnDef: 'state',
      header: 'State',
      inputType: 'inputField'
    },
    {
      columnDef: 'country',
      header: 'Country',
      inputType: 'inputField'
    },
    {
      columnDef: 'bpin',
      header: 'Pin Or Zip',
      inputType: 'inputField'
    },
    {
      columnDef: 'taxId',
      header: 'Tax Identification Number',
      inputType: 'inputField'
    }
  ];
}

export class serviceStage {
  public static data: Array<stagesModel> = [
    {
      name: 'New',
      age: 5,
    },
    {
      name: 'Waiting on Contact',
      age: 5,
    },
    {
      name: 'Waiting on us',
      age: 5,
    },
    {
      name: 'Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class serviceStageAddOne {
  public static data: Array<stagesModel> = [
    {
      name: 'New',
      age: 5,
    },
    {
      name: 'Waiting on Contact',
      age: 5,
    },
    {
      name: 'Waiting on us',
      age: 5,
    },
    {
      name: 'Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class serviceStageAddTwo {
  public static data: Array<stagesModel> = [
    {
      name: 'New',
      age: 5,
    },
    {
      name: 'Waiting on Contact',
      age: 5,
    },
    {
      name: 'Waiting on us',
      age: 5,
    },
    {
      name: 'Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class serviceStageAddThree {
  public static data: Array<stagesModel> = [
    {
      name: 'New',
      age: 5,
    },
    {
      name: 'Waiting on Contact',
      age: 5,
    },
    {
      name: 'Waiting on us',
      age: 5,
    },
    {
      name: 'Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class serviceStageAddFour {
  public static data: Array<stagesModel> = [
    {
      name: 'New',
      age: 5,
    },
    {
      name: 'Waiting on Contact',
      age: 5,
    },
    {
      name: 'Waiting on us',
      age: 5,
    },
    {
      name: 'Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class pipelineNamesService {
  public static data: Array<string> = [
    'PipeLine 1',
    'PipeLine 2',
    'PipeLine 3',
    'PipeLine 4',
    'PipeLine 5',
  ];
}

export class saleStage {
  public static data: Array<stagesModel> = [
    {
      name: 'Inquiry',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Confirmed',
      age: 5,
    },
    {
      name: 'Sale-Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class saleStageAddOne {
  public static data: Array<stagesModel> = [
    {
      name: 'Inquiry',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Confirmed',
      age: 5,
    },
    {
      name: 'Sale-Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class saleStageAddTwo {
  public static data: Array<stagesModel> = [
    {
      name: 'Inquiry',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Confirmed',
      age: 5,
    },
    {
      name: 'Sale-Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class saleStageAddThree {
  public static data: Array<stagesModel> = [
    {
      name: 'Inquiry',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Confirmed',
      age: 5,
    },
    {
      name: 'Sale-Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class saleStageAddFour {
  public static data: Array<stagesModel> = [
    {
      name: 'Inquiry',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Confirmed',
      age: 5,
    },
    {
      name: 'Sale-Completed',
      age: 5,
    },
    {
      name: 'Lost/Dropped',
      age: 5,
    },
  ];
}
export class pipelineNamesSales {
  public static data: Array<string> = [
    'PipeLine 1',
    'PipeLine 2',
    'PipeLine 3',
    'PipeLine 4',
    'PipeLine 5',
  ];
}

export class contactStatus {
  public static data: Array<stagesModel> = [
    {
      name: 'Lead',
      age: 5,
    },
    {
      name: 'Prospect',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Customer-Won',
      age: 5,
    },
    {
      name: 'Lost/Rejected',
      age: 5,
    },
  ];
}
export class contactStatusAddOne {
  public static data: Array<stagesModel> = [
    {
      name: 'Lead',
      age: 5,
    },
    {
      name: 'Prospect',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Customer-Won',
      age: 5,
    },
    {
      name: 'Lost/Rejected',
      age: 5,
    },
  ];
}
export class contactStatusAddTwo {
  public static data: Array<stagesModel> = [
    {
      name: 'Lead',
      age: 5,
    },
    {
      name: 'Prospect',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Customer-Won',
      age: 5,
    },
    {
      name: 'Lost/Rejected',
      age: 5,
    },
  ];
}
export class contactStatusAddThree {
  public static data: Array<stagesModel> = [
    {
      name: 'Lead',
      age: 5,
    },
    {
      name: 'Prospect',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Customer-Won',
      age: 5,
    },
    {
      name: 'Lost/Rejected',
      age: 5,
    },
  ];
}
export class contactStatusAddFour {
  public static data: Array<stagesModel> = [
    {
      name: 'Lead',
      age: 5,
    },
    {
      name: 'Prospect',
      age: 5,
    },
    {
      name: 'Opportunity',
      age: 5,
    },
    {
      name: 'Customer-Won',
      age: 5,
    },
    {
      name: 'Lost/Rejected',
      age: 5,
    },
  ];
}
export class pipelineNamesCustomer {
  public static data: Array<string> = [
    'PipeLine 1',
    'PipeLine 2',
    'PipeLine 3',
    'PipeLine 4',
    'PipeLine 5',
  ];
}

export interface UrlData {
  url: string;
  shortUrl: string;
}
// max field name length
export class fieldNameLEngth {
  public static FIELD_NAME_LENGTH = 21;
}
// max field name length
export class pipelineNameLength {
  public static PIPELINE_NAME_LENGTH = 34;
}
export class SharedDocument {
  public userId: string;
  public docId: string;
  public docType: string;
}
export class sharedLeadCaptureForms {
  public superUserId: string;
  public formId: string;
}
export class Upload {
  $key: string;
  file: File;
  name: string;
  url: string;
  type: string;
  size: number;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
export class uploadFileModel {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  type: string;
  createdAt: Date = new Date();
}
// attachment size
export class paidAttSize {
  public static PAID_ATT_SIZE = 1024000000;
}
export class freeAttSize {
  public static FREE_ATT_SIZE = 512000000;
}

//   Employee Gender
export class EmployeeGender {
  employeeGender: string[] = [];
  constructor() {
    this.employeeGender.push('Male', 'Female');
  }
}

//   Employee Status
export class EmployeeStatus {
  employeeStatus: string[] = [];
  constructor() {
    this.employeeStatus.push('Active Employee', 'Left Organization');
  }
}

// Employee data-model
export class EmployeeModel {
  constructor(
    public id: string,
    public imageURL: string,
    public employeeFirstName: string,
    public employeeSecondName: string,
    public dateOfBirth: any,
    public gender: string,
    public contactNo: number,
    public personalEmail: string,
    public officialEmail: string,
    public emergencyContactPerson: string,
    public emergencyContactNo: number,
    public commAddLine1: string,
    public commAddLine2: string,
    public commAddDist: string,
    public commAddState: string,
    public commAddCountry: string,
    public commAddZip: string,
    public permAddLine1: string,
    public permAddLine2: string,
    public permAddDist: string,
    public permAddState: string,
    public permAddCountry: string,
    public permAddZip: string,
    public status: string,
    public dateOfJoining: any,
    public exitDate: any,
    public employeeID: string,
    public designation: string,
    public bloodGroup: string,
    public superUsrId: string,
    public docId: string,
    public employeeNo: string,
    public CRMAccess: boolean,
    public accType: string,
    public reportsToId: string,
    public reportsToName: string
  ) {}
}
export class employeeSite {
  public static SITE_LOGIN = 'http://localhost:4200/attendancemanagement/login';
}
// Attendance model
export class AttendanceModel {
  constructor(
    public id: string,
    public attStatus: string,
    public checkIn: string,
    public checkInUpdated: any,
    public checkOut: string,
    public checkOutUpdated: any,
    public employeeName: string,
    public superUserId: string,
    public date: string,
    public loginTime: string,
    public logoutTime: string,
    public activeTime: string,
    public activeTimeNo: number,
    public autoLogouts: number
  ) {}
}

export class AttendanceModelDB {
  constructor(public id: string, public docId: Object) {}
}

export class CSVMonthlyAttModel {
  constructor(
    public Date: string,
    public AttendanceStatus: string,
    public EnteredCheckIn: string,
    public RecordedCheckIn: any,
    public EnteredCheckOut: string,
    public RecordedCheckOut: any,
    public loginTime: string,
    public logoutTime: string,
    public activeTime: string,
    public autoLogouts: number
  ) {}
}
export class CSVDailyAttModel {
  constructor(
    public EmployeeName: string,
    public AttendanceStatus: string,
    public EnteredCheckIn: string,
    public RecordedCheckIn: any,
    public EnteredCheckOut: string,
    public RecordedCheckOut: any,
    public loginTime: string,
    public logoutTime: string,
    public activeTime: string,
    public autoLogouts: number
  ) {}
}
export class messageTemplateModel {
  constructor(
    public id: string,
    public templateName: string,
    public body: string,
    public templateType: string,
    public tempRecType: string,
    public smsApiTemplateId: string,
    public templateNameSpaceWa: string,
    public tLangCode: string,
    public image_link: string,
    public video_link: string,
    public document_link: string,
    public document_name: string
  ) {}
}
export class MessageTemplateTypes {
  templateTypes: string[] = [];
  constructor() {
    this.templateTypes.push('SMS', 'WhatsApp');
  }
}
export class SubUserAccTypes {
  accountTypes: string[] = [];
  constructor() {
    this.accountTypes.push('Admin', 'SubUser');
  }
}
export class Notification {
  id: string;
  createdDate: Date;
  assignedTo: string;
  assignedToName: string;
  message: string;
  viewStatus: boolean;
}
export class ShortURLModel {
  constructor(public id: string, public url: string, public shortUrl: string) {}
}
export class SalesWithItem extends Sales {
  items: SalesProduct[];
}
export class ProductListItem {
  constructor(
    public prodName: string,
    public productId: string,
    public prodCategory: string,
    public quantity: number,
    public rate: number,
    public discount: number,
    public amountAfterDiscount: number,
    public saleTitle: string,
    public salesStage: string,
    public selectedSalePipeline: number,
    public customer: string,
    public createdDate: any,
    public startDate: any,
    public expCompletionDate: any,
    public assignedToName: string,
    public additionalFieldsArr: [],
    public createdBy,
    public assignedTo,
    public inPipeline,
    public won,
    public lost
  ) {}
}

export class ProductListItemB2B {
  constructor(
    public prodName: string,
    public prodCategory: string,
    public customer: string,
    public contactNo: string,
    public email: string,
    public saleTitle: string,
    public salesStage: string,
    public selectedSalePipeline: number,
    public startDate: any,
    public b2bpartner: any
  ) {}
}
export class ProductListItemApplicationYear {
  constructor(
    public prodName: string,
    public prodCategory: string,
    public customer: string,
    public contactNo: string,
    public email: string,
    public saleTitle: string,
    public selectedSalePipeline: string,
    public salesStage: string,
    public startDate: any,
    public applicationYear: any,
    public applicationCycle: any
  ) {}
}
export class SalesProduct extends ProductModel {
  productId: string;
  quantity: number = 0;
  amountAfterDiscount: number = 0;
}

// Type safety interfaces for itemsArray
export interface ItemsArray {
  [index: number]: ProductInSaleModel;
}

export interface ProductInSaleModel {
  id: string;
  productId: string;
  prodName: string;
  hsnCode: string;
  prodDes: string;
  currency: string;
  unitPrice: number;
  unit: string;
  taxType: string;
  discount: number;
  cgst: number;
  sgst: number;
  igst: number;
  vatRate: number;
  quantity: number;
  amountAfterDiscount: number;
  prodCategory: string;
  additionalFieldsArr: any[];
}

// Analytics interfaces
export interface MonthlyProductSales {
  id: string;
  productId: string;
  productName: string;
  month: number;
  year: number;
  totalQuantity: number;
  totalRevenue: number;
  saleCount: number;
  lastUpdated: number;
}

export interface DailyProductSales {
  id: string; // format: YYYY-MM-DD_productId
  productId: string;
  productName: string;
  date: string; // YYYY-MM-DD
  totalQuantity: number;
  totalRevenue: number;
  saleCount: number;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topCustomers: string[];
  seasonalTrends: MonthlyData[];
}

export interface MonthlyData {
  month: number;
  year: number;
  quantity: number;
  revenue: number;
}

// Utility functions for itemsArray data conversion
export class ItemsArrayUtils {

  /**
   * Convert itemsArray object to array for display
   * @param itemsArray - The itemsArray object from Sales document
   * @returns Array of ProductInSaleModel objects
   */
  static toArray(itemsArray: ItemsArray | null): ProductInSaleModel[] {
    if (!itemsArray) return [];
    return Object.values(itemsArray);
  }

  /**
   * Convert product array to itemsArray object for storage
   * @param products - Array of ProductInSaleModel objects
   * @returns ItemsArray object for Firestore storage
   */
  static toObject(products: ProductInSaleModel[]): ItemsArray {
    const itemsArray: ItemsArray = {};
    products.forEach((product, index) => {
      itemsArray[index] = product;
    });
    return itemsArray;
  }

  /**
   * Get product IDs from itemsArray
   * @param itemsArray - The itemsArray object
   * @returns Array of product IDs
   */
  static getProductIds(itemsArray: ItemsArray | null): string[] {
    if (!itemsArray) return [];
    return Object.values(itemsArray).map(item => item.productId);
  }

  /**
   * Calculate total quantity from itemsArray
   * @param itemsArray - The itemsArray object
   * @returns Total quantity of all items
   */
  static getTotalQuantity(itemsArray: ItemsArray | null): number {
    if (!itemsArray) return 0;
    return Object.values(itemsArray).reduce((total, item) => total + (item.quantity || 0), 0);
  }

  /**
   * Calculate total value from itemsArray
   * @param itemsArray - The itemsArray object
   * @returns Total value of all items
   */
  static getTotalValue(itemsArray: ItemsArray | null): number {
    if (!itemsArray) return 0;
    return Object.values(itemsArray).reduce((total, item) => {
      const itemValue = (item.quantity || 0) * (item.unitPrice || 0);
      return total + itemValue;
    }, 0);
  }

  /**
   * Find product in itemsArray by productId
   * @param itemsArray - The itemsArray object
   * @param productId - Product ID to search for
   * @returns ProductInSaleModel or null if not found
   */
  static findProductById(itemsArray: ItemsArray | null, productId: string): ProductInSaleModel | null {
    if (!itemsArray) return null;
    const products = Object.values(itemsArray);
    return products.find(item => item.productId === productId) || null;
  }

  /**
   * Update product in itemsArray
   * @param itemsArray - The itemsArray object
   * @param productId - Product ID to update
   * @param updatedProduct - Updated product data
   * @returns Updated ItemsArray object
   */
  static updateProduct(itemsArray: ItemsArray | null, productId: string, updatedProduct: ProductInSaleModel): ItemsArray {
    if (!itemsArray) return {};

    const newItemsArray = { ...itemsArray };
    const index = Object.keys(newItemsArray).find(key =>
      newItemsArray[parseInt(key)].productId === productId
    );

    if (index !== undefined) {
      newItemsArray[parseInt(index)] = updatedProduct;
    }

    return newItemsArray;
  }

  /**
   * Remove product from itemsArray
   * @param itemsArray - The itemsArray object
   * @param productId - Product ID to remove
   * @returns Updated ItemsArray object
   */
  static removeProduct(itemsArray: ItemsArray | null, productId: string): ItemsArray {
    if (!itemsArray) return {};

    const newItemsArray: ItemsArray = {};
    let newIndex = 0;

    Object.values(itemsArray).forEach(item => {
      if (item.productId !== productId) {
        newItemsArray[newIndex] = item;
        newIndex++;
      }
    });

    return newItemsArray;
  }

  /**
   * Validate itemsArray structure
   * @param itemsArray - The itemsArray object to validate
   * @returns Validation result with errors array
   */
  static validateItemsArray(itemsArray: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!itemsArray) {
      return { isValid: true, errors: [] }; // null is valid
    }

    if (typeof itemsArray !== 'object') {
      errors.push('itemsArray must be an object');
      return { isValid: false, errors };
    }

    Object.values(itemsArray).forEach((item: any, index) => {
      if (!item.productId) {
        errors.push(`Item at index ${index} is missing productId`);
      }
      if (!item.prodName) {
        errors.push(`Item at index ${index} is missing prodName`);
      }
      if (typeof item.quantity !== 'number' || item.quantity < 0) {
        errors.push(`Item at index ${index} has invalid quantity`);
      }
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
        errors.push(`Item at index ${index} has invalid unitPrice`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}

export class ProductListReport {
  constructor(
    public productId: string,
    public prodName: string,
    public quantity: number,
    public rate: number,
    public discount: number,
    public amountAfterDiscount: number,
    public saleTitle: string,
    public salesStage: string,
    public customer: string,
    public createdDate: any,
    public startDate: any,
    public expCompletionDate: any,
    public inPipeline: boolean,
    public won: boolean
  ) {}
}
export class ProductListReportCsv {
  constructor(
    public prodName: string,
    public quantity: number,
    public rate: number,
    public discount: number,
    public amountAfterDiscount: number,
    public saleTitle: string,
    public salesStage: string,
    public customer: string,
    public createdDate: any,
    public startDate: any,
    public expCompletionDate: any
  ) {}
}
export class prodmodel {
  id: string;
  productId: string;
  prodName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  prodCategory: string;
}
export class ProductChart {
  constructor(
    public id: string,
    public productName: string,
    public total: number,
    public quantity: number
  ) {}
}
export class SaleProductListItem {
  constructor(
    public prodName: string,
    public prodCategory: string,
    public quantity: number,
    public rate: number,
    public discount: number,
    public amountAfterDiscount: number,
    public sequenceNumber: number,
    public saleTitle: string,
    public salesStage: string,
    public selectedSalePipeline: number,
    public customer: string,
    public companyName: string,
    public createdDate: any,
    public startDate: any,
    public expCompletionDate: any,
    public assignedToName: string,
    public additionalFieldsArr: customFieldsReport[]
  ) {}
}

export class ReportSettings {
  //Data model for report settings
  constructor(
    public id: string,
    public module: modules, // Contact/ Sale/ Task/ Invoice etc- the collection on which the query needs to be done
    public title: string, //Report title
    public queryType: string, //Whether the query is done on a date field or any other type of filed. Values - date, other
    public queryField: string, //field on which the query is to be performed
    public operator: string, //operator to be applied
    public comparisonValue: string, // value against which comparison is to be made
    public dateRefType: string, //whether the date range is fixed or
    public custDateRef1: string,
    public custDateRef2: string,
    public fixedDateRange: string,
    public reportSummaryType: reportSummaryType,
    public xAxis: string,
    public yAxis: string,
    public stackBy: string,
    public cardSummaryType: string,
    public primaryQuery: selectedFilterFields,
    public filters: selectedFilterFields[],
    public summaryType: string,
    public measureSelected: {},
    public groupingSelected: {},
    public pipelineSelected: number,
    public pipelineSelectedInSegment: number,
    public dateGrouping: string,
    public segmentSelected: {},
    public displayColumns?: any[]
  ) {}
}
export class viewSettings {
  //Data model for report settings
  constructor(
    public title: string, //Report title
    public queryType: string, //Whether the query is done on a date field or any other type of filed. Values - date, other
    public queryField: string, //field on which the query is to be performed
    public operator: string, //operator to be applied
    public comparisonValue: string, // value against which comparison is to be made
    public dateRefType: string, //whether the date range is fixed or
    public custDateRef1: string,
    public custDateRef2: string,
    public fixedDateRange: string,
    public reportSummaryType: reportSummaryType,

    public primaryQuery: selectedFilterFields,
    public filters: selectedFilterFields[],
    public summaryType: string,
    public measureSelected: {},
    public groupingSelected: {},
    public pipelineSelected: number,
    public dateGrouping: string,
    public segmentSelected: {},
    public displayColumns?: []
  ) {}
}

export enum modules {
  // Estimates = 'Estimates',
  expenses = 'Expenses',
  FollowUps = 'Follow Ups',
  //Invoices = 'Invoices',
  //Quotations = 'Quotations',
  customers = 'customers',
  //meeting = 'meeting',
  paymentsreceived = 'paymentsreceived',
  products = 'products',
  sales = 'sales',
  tasks = 'tasks',
  services = 'services',
  invoices = 'Invoices',
  quotations = 'Quotations',
  estimates = 'Estimates',
}

export enum dateRangeValues {
  Today = 'Today',
  This_Week = 'This Week',
  This_Month = 'This Month',
}

export enum reportSummaryType {
  Card = 'Card',
  Vertical_Bar = 'Vertical Bar',
  Vertical_Stacked_Bar = 'Vertical Stacked Bar',
  Horizonatal_Bar = 'Horizontal Bar',
  Horizontal_Stacked_Bar = 'Horizontal Stacked Bar',
  Pie = 'Pie',
}

export class subUsersCheck {
  constructor(
    public userId: string,
    public firstname: string,
    public lastname: string,
    public selected: boolean = false
  ) {}
}
export class selectedFilterFields {
  constructor(
    public queryName: string,
    public queryField: string,
    public queryType: string,
    public operator: any,
    public comparisonValue: any[] = [],
    public selectionArray: any[] = [],
    public fieldType: string,
    public ind: number
  ) {}
}

export const customerTableColumns = [
  {
    columnDef: 'salutation',
    header: 'Salutation',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'firstName',
    header: 'First Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'secondName',
    header: 'Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'companyName',
    header: 'Organization',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'taxId',
    header: 'Tax ID',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'code',
    header: 'Code',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'contactNo',
    header: 'Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'alternateContactNumber',
    header: 'Alt Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'email',
    header: 'Email',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'selectedContactPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'custLeadValue',
    header: 'Lead Source',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'invoicedAmount',
    header: 'Invoiced',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'totalAmountCollected',
    header: 'Collected',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'billingaddress1',
    header: 'Address Line 1',
    display: true,
    type: 'string',
  },
  {
    columnDef: 'billingaddress2',
    header: 'Address Line 2',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'bpin',
    header: 'PIN/ ZIP code',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'district',
    header: 'District',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'state',
    header: 'State',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'country',
    header: 'Country',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'department',
    header: 'Department',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Date created',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'won',
    header: 'Won',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lost',
    header: 'Lost',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'nextFollowupDate',
    header: 'Next Followup Date',
    display: false,
    type: 'date_time',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'previousFollowupDate',
    header: 'Previous Followup Date',
    display: false,
    type: 'date_time',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currentStatusDate',
    header: 'Current Stage Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
];
export const customerCardFields = [
  /*{
    columnDef: 'salutation',
    header: 'Salutation',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'firstName',
    header: 'First Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'secondName',
    header: 'Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
*/
  {
    columnDef: 'companyName',
    header: 'Organization',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'taxId',
    header: 'Tax ID',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'code',
    header: 'Code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'contactNo',
    header: 'Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'alternateContactNumber',
    header: 'Alt Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'email',
    header: 'Email',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'selectedContactPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'custLeadValue',
    header: 'Lead Source',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'invoicedAmount',
    header: 'Invoiced',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'totalAmountCollected',
    header: 'Collected',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'billingaddress1',
    header: 'Address Line 1',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'billingaddress2',
    header: 'Address Line 2',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'bpin',
    header: 'PIN/ ZIP code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'district',
    header: 'District',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'state',
    header: 'State',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'country',
    header: 'Country',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'createdBy',
    header: 'Created by',
    display: false,
    type: 'string',
  },*/
  {
    columnDef: 'department',
    header: 'Department',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Date created',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'won',
    header: 'Won',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'lost',
    header: 'Lost',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'nextFollowupDate',
    header: 'Next Followup Date',
    display: false,
    type: 'date_time',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'previousFollowupDate',
    header: 'Previous Followup Date',
    display: false,
    type: 'date_time',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currentStatusDate',
    header: 'Current Stage Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
];

//for invoicing plan
export const customerCardFieldsInvPlan = [
  /*{
    columnDef: 'salutation',
    header: 'Salutation',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'firstName',
    header: 'First Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'secondName',
    header: 'Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
*/
  {
    columnDef: 'companyName',
    header: 'Organization',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'taxId',
    header: 'Tax ID',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'code',
    header: 'Code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'contactNo',
    header: 'Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'alternateContactNumber',
    header: 'Alt Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'email',
    header: 'Email',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'selectedContactPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'custLeadValue',
    header: 'Lead Source',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'invoicedAmount',
    header: 'Invoiced',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  // {
  //   columnDef: 'totalAmountCollected',
  //   header: 'Collected',
  //   display: false,
  //   type: 'number',
  //   fieldType: 'def',
  //   ind: 0,
  // },
  {
    columnDef: 'billingaddress1',
    header: 'Address Line 1',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'billingaddress2',
    header: 'Address Line 2',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'bpin',
    header: 'PIN/ ZIP code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'district',
    header: 'District',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'state',
    header: 'State',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'country',
    header: 'Country',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'createdBy',
    header: 'Created by',
    display: false,
    type: 'string',
  },*/
  {
    columnDef: 'department',
    header: 'Department',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Date created',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  // {
  //   columnDef: 'associatedBranch',
  //   header: 'Branch',
  //   display: false,
  //   type: 'option',
  //   fieldType: 'def',
  //   ind: 0,
  // },
  /*{
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'won',
    header: 'Won',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'lost',
    header: 'Lost',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },*/
];

//for invoicing plan
export const customerCardFieldsLeadPlan = [
  /*{
    columnDef: 'salutation',
    header: 'Salutation',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'firstName',
    header: 'First Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'secondName',
    header: 'Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
*/
  // {
  //   columnDef: 'companyName',
  //   header: 'Organization',
  //   display: false,
  //   type: 'string',
  //   fieldType: 'def',
  //   ind: 0,
  // },
  {
    columnDef: 'taxId',
    header: 'Tax ID',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'code',
    header: 'Code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'contactNo',
    header: 'Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'alternateContactNumber',
    header: 'Alt Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'email',
    header: 'Email',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'selectedContactPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'custLeadValue',
    header: 'Lead Source',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  // {
  //   columnDef: 'invoicedAmount',
  //   header: 'Invoiced',
  //   display: false,
  //   type: 'number',
  //   fieldType: 'def',
  //   ind: 0,
  // },
  // {
  //   columnDef: 'totalAmountCollected',
  //   header: 'Collected',
  //   display: false,
  //   type: 'number',
  //   fieldType: 'def',
  //   ind: 0,
  // },
  {
    columnDef: 'billingaddress1',
    header: 'Address Line 1',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'billingaddress2',
    header: 'Address Line 2',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'bpin',
    header: 'PIN/ ZIP code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'district',
    header: 'District',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'state',
    header: 'State',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'country',
    header: 'Country',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'createdBy',
    header: 'Created by',
    display: false,
    type: 'string',
  },*/
  {
    columnDef: 'department',
    header: 'Department',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Date created',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'won',
    header: 'Won',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'lost',
    header: 'Lost',
    display: true,
    type: 'boolean',
    fieldType: 'def',
    ind:0
  },*/
];

export const orgCardFields = [
  {
    columnDef: 'companyName',
    header: 'Organization',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'taxId',
    header: 'Tax ID',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'code',
    header: 'Code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'contactNo',
    header: 'Contact No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'email',
    header: 'Email',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'invoiced',
    header: 'Invoiced',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'collected',
    header: 'Collected',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'billingaddress1',
    header: 'Address Line 1',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'billingaddress2',
    header: 'Address Line 2',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'bpin',
    header: 'PIN/ ZIP code',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'district',
    header: 'District',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'state',
    header: 'State',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'country',
    header: 'Country',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'createdDate',
    header: 'Date created',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
];
export const salesTableColumns = [
  {
    columnDef: 'saleTitle',
    header: 'Title',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'selectedSalePipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'salesStage',
    header: 'Stage',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'firstName',
    header: 'Customer Name',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'secondName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'estimatedValue',
    header: 'Value',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'startDate',
    header: 'Start date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expCompletionDate',
    header: 'Exp Completion Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdDate',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'collectionMode',
    header: 'Collection Mode',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'invoicedAmount',
    header: 'Invoiced amount',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'collectedAmount',
    header: 'Collected Amount',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'won',
    header: 'Sale won',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'lost',
    header: 'Sale lost',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currentStatusDate',
    header: 'Current stage date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
{
    columnDef: 'altContactNumber',
    header: 'Alternate Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
];

export const productTableColumns = [
  {
    columnDef: 'prodName',
    header: 'Item',
    display: true,
    type: 'string',
  },
  {
    columnDef: 'prodCategory',
    header: 'Category',
    display: true,
    type: 'string',
  },
  {
    columnDef: 'quantity',
    header: 'Qty',
    display: true,
    type: 'number',
  },
  {
    columnDef: 'rate',
    header: 'Unit price',
    display: true,
    type: 'number',
  },
  {
    columnDef: 'discount',
    header: 'Discount(%)',
    display: true,
    type: 'number',
  },
  {
    columnDef: 'amountAfterDiscount',
    header: 'Discounted price',
    display: true,
    type: 'number',
  },
  {
    columnDef: 'saleTitle',
    header: 'Title',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'selectedSalePipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'salesStage',
    header: 'Stage',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'customer',
    header: 'Customer Name',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'startDate',
    header: 'Start date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expCompletionDate',
    header: 'Exp Completion Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  /* {
    columnDef: 'createdDate',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'won',
    header: 'Sale won',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'lost',
    header: 'Sale lost',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currentStatusDate',
    header: 'Current stage date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },*/
];

export const salesCardFields = [
  /*{
    columnDef: 'saleTitle',
    header: 'Title',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'selectedSalePipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'salesStage',
    header: 'Stage',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'priority',
    header: 'Priority',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  /*{
    columnDef: 'firstName',
    header: 'Customer Name',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'secondName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'estimatedValue',
    header: 'Value',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'startDate',
    header: 'Start date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expCompletionDate',
    header: 'Exp Completion Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdDate',
    header: 'Created Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'collectionMode',
    header: 'Collection Mode',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'invoicedAmount',
    header: 'Invoiced amount',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'collectedAmount',
    header: 'Collected Amount',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  /*{
    columnDef: 'inPipeline',
    header: 'In Pipeline',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'won',
    header: 'Sale won',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'lost',
    header: 'Sale lost',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'currentStatusDate',
    header: 'Current stage date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
{
    columnDef: 'altContactNumber',
    header: 'Alternate Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
];
export const serviceTableColumns = [
  {
    columnDef: 'serviceTitle',
    header: 'Title',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'selectedServPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'servicesStage',
    header: 'Stage',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'firstName',
    header: 'Customer Name',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'secondName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0
  },
  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'startDate',
    header: 'Start date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expCompletionDate',
    header: 'Exp Completion Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdDate',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'inPipeline',
    header: 'In Progress',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'won',
    header: 'Closed',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'lost',
    header: 'Rejected',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currentStatusDate',
    header: 'Current stage date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
{
    columnDef: 'altContactNumber',
    header: 'Alternate Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
];
export const serviceCardFields = [
  /*{
    columnDef: 'serviceTitle',
    header: 'Title',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'selectedServPipeline',
    header: 'Pipeline',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'servicesStage',
    header: 'Stage',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'priority',
    header: 'Priority',
    display: false,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  /*{
    columnDef: 'firstName',
    header: 'Customer Name',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'secondName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/

  {
    columnDef: 'startDate',
    header: 'Start date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expCompletionDate',
    header: 'Exp Completion Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdDate',
    header: 'Created Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'inPipeline',
    header: 'In Progress',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'won',
    header: 'Closed',
    display: false,
    type: 'string',
  },
  {
    columnDef: 'lost',
    header: 'Rejected',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
  {
    columnDef: 'currentStatusDate',
    header: 'Current stage date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastNoteDate',
    header: 'Last Note Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastAddedNote',
    header: 'Last Note',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
{
    columnDef: 'altContactNumber',
    header: 'Alternate Contact No',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0
},
];

export const taskTableColumns = [
  {
    columnDef: 'title',
    header: 'Title',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'company',
    header: 'Company',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'date',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'dueDate',
    header: 'Due date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'name',
    header: 'Customer Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'surname',
    header: 'Surname',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'serviceTitle',
    header: 'Service tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'collectionMode',
    header: 'Collection Mode',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
];

export const taskCardFields = [
  /* {
    columnDef: 'title',
    header: 'Title',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
  },

  {
    columnDef: 'company',
    header: 'Company',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind:0
  },*/

  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'date',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  /*{
    columnDef: 'dueDate',
    header: 'Due date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind:0
  },
{
    columnDef: 'lastName',
    header: 'Customer Second Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'name',
    header: 'Customer Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'priority',
    header: 'Priority',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'serviceTitle',
    header: 'Service tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'status',
    header: 'Status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },
  {
    columnDef: 'collectionMode',
    header: 'Collection Mode',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind:0
  },*/
];
export const followupCardFields = [
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Created Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact Number',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
];

export const followUpTableColumns = [
  {
    columnDef: 'assignedToName',
    header: 'Assigned To',
    display: true,
    type: 'string',
    ind: 0,
  },

  {
    columnDef: 'callStartDate',
    header: 'Date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'callStartTime',
    header: 'Scheduled time',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'company Name',
    header: 'Company',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'completedStatus',
    header: 'Completed',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'customerName',
    header: 'Customer Name',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'dateCreated',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'direction',
    header: 'Direction',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'outcome',
    header: 'Outcome',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'callDuration',
    header: 'Duration',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'saleTitle',
    header: 'Sale tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'serviceTitle',
    header: 'Service tagged',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'status',
    header: 'Call status',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'associatedBranch',
    header: 'Branch',
    display: false,
    type: 'option',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'notes',
    header: 'Notes',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'contactNumber',
    header: 'Contact Number',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
];

export const invoiceTableColumns = [
  {
    columnDef: 'prefixAndDocNumber',
    header: 'Invoice No',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'createdDate',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'docDate',
    header: 'Invoice date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'dueDate',
    header: 'Due date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'currency',
    header: 'Currency',
    display: true,
    type: 'type',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'totalInclTax',
    header: 'Amount incl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'total',
    header: 'Amount excl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'discountValue',
    header: 'Discount',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'collectedAmount',
    header: 'Collected',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'fname1',
    header: 'Customer',
    display: true,
    type: 'string',
    fieldType: 'customerData',
    ind: 0,
  },
];

export const quotationTableColumns = [
  {
    columnDef: 'prefixAndDocNumber',
    header: 'Quotation No',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'createdDate',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'docDate',
    header: 'Quotation date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'docValidity',
    header: 'Valid till',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'currency',
    header: 'Currency',
    display: true,
    type: 'type',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'totalInclTax',
    header: 'Amount incl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'total',
    header: 'Amount excl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'discountValue',
    header: 'Discount',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'fname1',
    header: 'Customer',
    display: true,
    type: 'string',
    fieldType: 'customerData',
    ind: 0,
  },
];

export const estimateTableColumns = [
  {
    columnDef: 'prefixAndDocNumber',
    header: 'Estimate No',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'createdDate',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'createdBy',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'docDate',
    header: 'Estimate date',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },
  {
    columnDef: 'docValidity',
    header: 'Valid till',
    display: true,
    type: 'date',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'currency',
    header: 'Currency',
    display: true,
    type: 'type',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'totalInclTax',
    header: 'Amount incl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'total',
    header: 'Amount excl tax',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'discountValue',
    header: 'Discount',
    display: true,
    type: 'number',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale',
    display: true,
    type: 'string',
    fieldType: 'docData',
    ind: 0,
  },

  {
    columnDef: 'fname1',
    header: 'Customer',
    display: true,
    type: 'string',
    fieldType: 'customerData',
    ind: 0,
  },
];

export const expenseTableColumns = [
  {
    columnDef: 'category',
    header: 'Category',
    display: true,
    type: 'type',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'date',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdById',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'expenseDate',
    header: 'Expense date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'currency',
    header: 'Currency',
    display: true,
    type: 'type',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'amount',
    header: 'Amount',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'customerFirstName',
    header: 'Customer',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
];

export const paymentTableColumns = [
  {
    columnDef: 'paymentDate',
    header: 'Paid on',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'createdById',
    header: 'Created by',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'paymentMode',
    header: 'Payment Mode',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'paymentType',
    header: 'Payment type',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'amountCollected',
    header: 'Amount',
    display: true,
    type: 'number',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'createDate',
    header: 'Created date',
    display: true,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
  {
    columnDef: 'currency',
    header: 'Currency',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'customerCompany',
    header: 'Company',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'customerName',
    header: 'Customer',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'invoiceprefixAndDocNumber',
    header: 'Invoice No',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },

  {
    columnDef: 'saleTitle',
    header: 'Sale title',
    display: true,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
];

export class DisplayColumn {
  constructor(
    public columnDef: string,
    public header: string,
    public display: boolean,
    public type: string,
    public fieldType: string,
    public ind: number
  ) {}
}
export class OpeatorCheck {
  operator: string;
  operatorText: string;
}
export class QueryOptions {
  constructor(
    public queryField: string,
    public queryType: string,
    public operator: WhereFilterOp,
    public comparisonValue: any[] = [],
    public fieldType: string,
    public ind: number
  ) {}
}
export type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

export const dashboardSettingsData = [
  {
    dashboardName: 'Monthly Summary',
    colWidth: 105,
    reportsArray: [
      {
        x: 0,
        y: 0,
        cols: 6,
        reportId: '0',
        rows: 4,
      },
      {
        rows: 2,
        cols: 3,
        x: 6,
        reportId: '5',
        y: 0,
      },
      {
        cols: 3,
        x: 6,
        rows: 2,
        y: 2,
        reportId: '2',
      },
      {
        y: 4,
        reportId: '6',
        x: 9,
        cols: 3,
        rows: 2,
      },
      {
        cols: 6,
        y: 4,
        x: 0,
        reportId: '13',
        rows: 4,
      },
      {
        x: 9,
        reportId: '3',
        rows: 2,
        y: 0,
        cols: 3,
      },
      {
        cols: 3,
        rows: 2,
        y: 0,
        x: 12,
        reportId: '4',
      },
      {
        rows: 2,
        reportId: '7',
        y: 2,
        x: 9,
        cols: 3,
      },
      {
        reportId: '8',
        cols: 3,
        y: 6,
        rows: 2,
        x: 6,
      },
      {
        reportId: '9',
        rows: 2,
        y: 4,
        x: 12,
        cols: 3,
      },
      {
        reportId: '11',
        y: 2,
        rows: 2,
        cols: 3,
        x: 12,
      },
      {
        reportId: '1',
        x: 6,
        cols: 3,
        rows: 2,
        y: 4,
      },
    ],
    rowHeight: 105,
    createdDate: new Date().getTime(),
  },
];

export const ReportSettingsData = [
  {
    measureSelected: {
      field: 'NA',
      name: 'Count',
      ind: 0,
      fieldType: 'def',
    },
    primaryQuery: {
      queryType: 'boolean',
      fieldType: 'def',
      operator: true,
      queryField: 'inPipeline',
      selectionArray: [],
      queryName: 'In Pipeline',
      comparisonValue: [true],
      ind: 0,
    },
    dateGrouping: 'Daily',
    filters: [],
    summaryType: 'Vertical Bar',
    title: 'Customers in pipeline',
    module: 'customers',
    groupingSelected: {
      fieldType: 'def',
      ind: 0,
      name: 'Status',
      field: 'status',
      type: 'option',
    },
    pipelineSelected: DefaultCustomerPipelines.customerPipelines[0].pipelineId,
    segmentSelected: {
      name: 'Status',
      ind: 0,
      field: 'status',
      fieldType: 'def',
      type: 'option',
    },
    createdDate: new Date().getTime(),
  },
  {
    title: 'All sales closing today',
    primaryQuery: {
      ind: 0,
      queryField: 'expCompletionDate',
      operator: 'Today',
      comparisonValue: [],
      queryName: 'End Date',
      fieldType: 'def',
      queryType: 'timestamp',
      selectionArray: [],
    },
    segmentSelected: {
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
      ind: 0,
      name: 'Assigned to',
    },
    filters: [],
    groupingSelected: {
      name: 'Assigned to',
      fieldType: 'def',
      field: 'assignedTo',
      type: 'option',
      ind: 0,
    },
    dateGrouping: 'Daily',
    module: 'sales',
    pipelineSelected: DefaultSalePipelines.salePipelines[0].pipelineId,
    summaryType: 'Card',
    measureSelected: {
      field: 'estimatedValue',
      name: 'Value',
    },
    createdDate: new Date().getTime(),
  },
  {
    dateGrouping: 'Daily',
    pipelineSelected: DefaultCustomerPipelines.customerPipelines[0].pipelineId,
    primaryQuery: {
      queryField: 'dateCreated',
      queryName: 'Created date',
      queryType: 'date',
      operator: 'Today',
      comparisonValue: [],
      selectionArray: [],
    },
    title: 'Customers lost today',
    segmentSelected: {
      ind: '0',
      name: 'Assigned To',
      field: 'assignedTo',
      type: 'option',
      fieldType: 'def',
    },
    summaryType: 'Card',
    module: 'customers',
    filters: [
      {
        queryType: 'boolean',
        fieldType: 'def',
        ind: 0,
        operator: true,
        queryName: 'Lost',
        comparisonValue: [true],
        selectionArray: [],
        queryField: 'lost',
      },
    ],
    groupingSelected: {
      type: 'timestamp',
      fieldType: 'Additional',
      ind: 1,
      name: 'Next Serv',
      field: 'additionalFieldsArr',
    },
    measureSelected: {
      name: 'Count',
      field: 'NA',
      fieldType: 'def',
      ind: 0,
    },
    createdDate: new Date().getTime(),
  },
  {
    pipelineSelected: 0,
    module: 'tasks',
    filters: [],
    dateGrouping: 'Daily',
    groupingSelected: {
      field: 'date',
      name: 'Created date',
      type: 'date',
    },
    summaryType: 'Card',
    title: "Today's tasks",
    segmentSelected: {
      type: 'option',
      name: 'Status',
      field: 'status',
    },
    primaryQuery: {
      comparisonValue: [],
      queryName: 'Due date',
      fieldType: 'def',
      ind: 0,
      selectionArray: [],
      queryField: 'dueDate',
      operator: 'Today',
      queryType: 'timestamp',
    },
    measureSelected: {
      name: 'Count',
      ind: 0,
      fieldType: 'def',
      field: 'NA',
    },
    createdDate: new Date().getTime(),
  },
  {
    filters: [],
    dateGrouping: 'Daily',
    primaryQuery: {
      queryType: 'timestamp',
      queryName: 'Call date',
      queryField: 'callStartDate',
      operator: 'Today',
      selectionArray: [],
      ind: 0,
      fieldType: 'def',
      comparisonValue: [],
    },
    pipelineSelected: 0,
    segmentSelected: {
      type: 'option',
      fieldType: 'def',
      field: 'createdBy',
      name: 'Created by',
      ind: 0,
    },
    summaryType: 'Card',
    groupingSelected: {
      field: 'assignedTo',
      name: 'Assigned to',
      type: 'option',
    },
    measureSelected: {
      field: 'NA',
      ind: 0,
      name: 'Count',
      fieldType: 'def',
    },
    module: 'Follow Ups',
    title: "Today's calls",
    createdDate: new Date().getTime(),
  },
  {
    dateGrouping: 'Daily',
    filters: [
      {
        comparisonValue: [true],
        ind: 0,
        selectionArray: [],
        queryField: 'won',
        queryName: 'Won',
        queryType: 'boolean',
        fieldType: 'def',
        operator: true,
      },
    ],
    title: 'Customers won today',
    segmentSelected: {
      ind: 0,
      fieldType: 'def',
      type: 'option',
      field: 'status',
      name: 'Status',
    },
    summaryType: 'Card',
    primaryQuery: {
      fieldType: 'def',
      queryField: 'dateCreated',
      operator: 'Today',
      comparisonValue: [],
      selectionArray: [],
      ind: 0,
      queryName: 'Created date',
      queryType: 'date',
    },
    measureSelected: {
      field: 'NA',
      fieldType: 'def',
      name: 'Count',
      ind: 0,
    },
    groupingSelected: {
      type: 'boolean',
      ind: 0,
      field: 'inPipeline',
      fieldType: 'def',
      name: 'In Pipeline',
    },
    module: 'customers',
    pipelineSelected: DefaultCustomerPipelines.customerPipelines[0].pipelineId,
    createdDate: new Date().getTime(),
  },
  {
    dateGrouping: 'Daily',
    primaryQuery: {
      queryName: 'End Date',
      comparisonValue: [],
      queryType: 'timestamp',
      queryField: 'expCompletionDate',
      selectionArray: [],
      fieldType: 'def',
      ind: 0,
      operator: 'Today',
    },
    measureSelected: {
      name: 'Value',
      field: 'estimatedValue',
    },
    title: 'Sales completed today',
    pipelineSelected: DefaultSalePipelines.salePipelines[0].pipelineId,
    segmentSelected: {
      field: 'assignedTo',
      type: 'option',
      ind: 0,
      name: 'Assigned to',
      fieldType: 'def',
    },
    module: 'sales',
    filters: [
      {
        ind: 0,
        queryField: 'won',
        comparisonValue: [true],
        fieldType: 'def',
        queryType: 'boolean',
        queryName: 'Won',
        selectionArray: [],
        operator: true,
      },
    ],
    summaryType: 'Card',
    groupingSelected: {
      field: 'assignedTo',
      ind: 0,
      name: 'Assigned to',
      fieldType: 'def',
      type: 'option',
    },
    createdDate: new Date().getTime(),
  },
  {
    dateGrouping: 'Daily',
    filters: [],
    segmentSelected: {
      fieldType: 'def',
      name: 'Created by',
      field: 'createdBy',
      type: 'option',
      ind: 0,
    },
    title: 'Invoices created today',
    pipelineSelected: 0,
    summaryType: 'Card',
    module: 'Invoices',
    groupingSelected: {
      ind: 0,
      type: 'option',
      field: 'createdBy',
      name: 'Created by',
      fieldType: 'def',
    },
    primaryQuery: {
      fieldType: 'def',
      selectionArray: [],
      operator: 'Today',
      queryField: 'docData.createdDate',
      queryName: 'Created date',
      comparisonValue: [],
      queryType: 'date',
      ind: 0,
    },
    measureSelected: {
      fieldType: 'def',
      field: 'NA',
      name: 'Count',
      ind: 0,
    },
    createdDate: new Date().getTime(),
  },
  {
    primaryQuery: {
      fieldType: 'def',
      queryName: 'Created date',
      queryField: 'date',
      queryType: 'date',
      ind: 0,
      comparisonValue: [],
      selectionArray: [],
      operator: 'Today',
    },
    segmentSelected: {
      ind: 0,
      name: 'Created by',
      fieldType: 'def',
      field: 'createdById',
      type: 'option',
    },
    filters: [],
    pipelineSelected: 0,
    title: 'Expenses added today',
    groupingSelected: {
      field: 'createdById',
      name: 'Created by',
      ind: 0,
      fieldType: 'def',
      type: 'option',
    },
    dateGrouping: 'Daily',
    measureSelected: {
      fieldType: 'def',
      ind: 0,
      name: 'Count',
      field: 'NA',
    },
    module: 'Expenses',
    summaryType: 'Card',
    createdDate: new Date().getTime(),
  },
  {
    pipelineSelected: 0,
    module: 'paymentsreceived',
    measureSelected: {
      fieldType: 'def',
      name: 'Count',
      field: 'NA',
      ind: 0,
    },
    segmentSelected: {
      name: 'Created by',
      fieldType: 'def',
      field: 'createdById',
      type: 'option',
      ind: 0,
    },
    filters: [],
    dateGrouping: 'Daily',
    title: 'Collections added today',
    primaryQuery: {
      queryType: 'date',
      comparisonValue: [],
      selectionArray: [],
      queryField: 'createDate',
      operator: 'Today',
      ind: 0,
      queryName: 'Created date',
      fieldType: 'def',
    },
    summaryType: 'Card',
    groupingSelected: {
      ind: 0,
      type: 'option',
      field: 'createdById',
      name: 'Created by',
      fieldType: 'def',
    },
    createdDate: new Date().getTime(),
  },
  {
    filters: [],
    summaryType: 'Vertical Bar',
    measureSelected: {
      name: 'Count',
      field: 'NA',
      fieldType: 'def',
      ind: 0,
    },
    segmentSelected: {
      ind: 0,
      name: 'Created by',
      fieldType: 'def',
      type: 'option',
      field: 'createdBy',
    },
    pipelineSelected: DefaultServicePipelines.servicePipelines[0].pipelineId,
    groupingSelected: {
      ind: 0,
      type: 'option',
      field: 'servicesStage',
      name: 'Stage',
      fieldType: 'def',
    },
    title: 'Support tickets added today',
    primaryQuery: {
      selectionArray: [],
      comparisonValue: [],
      operator: 'Today',
      queryField: 'createdDate',
      fieldType: 'def',
      queryName: 'Created date',
      queryType: 'date',
      ind: 0,
    },
    module: 'services',
    dateGrouping: 'Daily',
    createdDate: new Date().getTime(),
  },
  {
    dateGrouping: 'Daily',
    primaryQuery: {
      queryName: 'Created date',
      ind: 0,
      selectionArray: [],
      operator: 'Today',
      comparisonValue: [],
      queryField: 'createdDate',
      queryType: 'date',
      fieldType: 'docData',
    },
    summaryType: 'Card',
    filters: [],
    pipelineSelected: 0,
    title: 'Quotations created today',
    measureSelected: {
      fieldType: 'def',
      name: 'Count',
      field: 'NA',
      ind: 0,
    },
    module: 'Quotations',
    groupingSelected: {
      name: 'Created by',
      type: 'option',
      field: 'createdBy',
      fieldType: 'def',
      ind: 0,
    },
    segmentSelected: {
      name: 'Created by',
      field: 'createdBy',
      fieldType: 'def',
      ind: 0,
      type: 'option',
    },
    createdDate: new Date().getTime(),
  },
  {
    groupingSelected: {
      type: 'option',
      ind: 0,
      name: 'Created by',
      fieldType: 'def',
      field: 'createdBy',
    },
    dateGrouping: 'Daily',
    module: 'Estimates',
    segmentSelected: {
      name: 'Created by',
      ind: 0,
      type: 'option',
      fieldType: 'def',
      field: 'createdBy',
    },
    filters: [],
    pipelineSelected: 0,
    measureSelected: {
      field: 'NA',
      ind: 0,
      name: 'Count',
      fieldType: 'def',
    },
    title: 'Estimates created today',
    primaryQuery: {
      queryName: 'Created date',
      fieldType: 'def',
      operator: 'Today',
      queryField: 'docData.createdDate',
      comparisonValue: [],
      queryType: 'date',
      selectionArray: [],
      ind: 0,
    },
    summaryType: 'Card',
    createdDate: new Date().getTime(),
  },
  {
    segmentSelected: {
      ind: 0,
      name: 'Created by',
      field: 'createdBy',
      fieldType: 'def',
      type: 'option',
    },
    dateGrouping: 'Daily',
    primaryQuery: {
      queryName: 'In Pipeline',
      fieldType: 'def',
      ind: 0,
      operator: true,
      queryField: 'inPipeline',
      queryType: 'boolean',
      selectionArray: [],
      comparisonValue: [true],
    },
    groupingSelected: {
      fieldType: 'def',
      field: 'salesStage',
      ind: 0,
      name: 'Stage',
      type: 'option',
    },
    pipelineSelected: DefaultSalePipelines.salePipelines[0].pipelineId,
    summaryType: 'Vertical Bar',
    measureSelected: {
      fieldType: 'def',
      name: 'Count',
      ind: 0,
      field: 'NA',
    },
    title: 'Sales in progress',
    filters: [],
    module: 'sales',
    createdDate: new Date().getTime(),
  },
];

export interface changeLogModel {
  changedBy: string;
  changedByName: string;
  changesFrom: string;
  dateModified: number;
  currentValues: string;
  previousValues: string;
}

export class defaultProfileFields {
  public static CONTENT = {
    estimateNoInit: 0,
    quoteNoInit: 0,
    invoiceNoInit: 0,
    leadPoints: 10000,
    leadSharedRating: 3,
    noOfRatingReceived: 0,
    printTemplate: 'template1',
    usertype: 'Master',
    masterId: null,
    dataAccessRule: 'All',
    userRole: 'NA',
    noSubusers: 0,
    planPricing: 'NA',
    planCurrency: 'NA',
    validityStart: 'NA',
    validityEnd: new Date(),
    createdDate: new Date().getTime(),
    existingUser: true,
    custLeadOpn: 'Online,Offline',
    custLead: ['Online', 'Offline'],
    taskStatusOpn : ['Open','Completed'],
    custLeadCheck: true,
    bankDetails: '',
    gstnumber: '',
    estimateNote: '',
    invoiceNote: '',
    quotationNote: '',
    currency: 'INR',
    taxType: 'gst',
    isFirstTimeUser: true,
    totalAttachmentsSize: 0,
    publicProfCreated: false,
    publicProfileActv: false,
    firstSettingsCard: true,
    attmgmtEnabled: false,
    enableLiteMode: true,
    smsEnabled: false,
    smsActivated: false,
    emailActivated: false,
    selectedSmsTemplate: '',
    selectedEmailTemplate: '',
    contactSequentialNumber: 0,
    saleSequentialNumber: 0,
    orderWonCheck: false,
    estimateApproval: false,
    invoiceApproval: false,
    quotationApproval: false,
    logOutTime: 900000,
    followUpStatus: FollowupStatus.DATA,
    followUpOutcome: FollowupOutcome.DATA,
    followUpDirection: FollowupDirection.DATA,
  };
}
// stageHistory contact
// export const contactStageHistory = [
//   {
//     date: new Date().getTime(),
//     stageId: DefaultCustomerPipelines.customerPipelines[0].pipelineStages[0].stageId,
//     pipelineId: DefaultCustomerPipelines.customerPipelines[0].pipelineId,
//   },
// ];
// stageHistory sale
// export const saleStageHistory = [
//   {
//     date: new Date().getTime(),
//     stageId: DefaultSalePipelines.salePipelines[0].pipelineStages[0].stageId,
//     pipelineId: DefaultSalePipelines.salePipelines[0].pipelineId,
//   },
// ];
// stageHistory service
// export const serviceStageHistory = [
//   {
//     date: new Date().getTime(),
//     stageId: DefaultServicePipelines.servicePipelines[0].pipelineStages[0].stageId,
//     pipelineId: DefaultServicePipelines.servicePipelines[0].pipelineId,
//   },
// ];
// sample searchterm
export class sampleSearchTerm {
  public static data = {
    companyName: 'ms',
    firstName: 'john',
    secondName: 'doe',
    surname: '',
  };
}
// sample searchterm
export class sampleSearchTermOrg {
  public static data = {
    companyName: 'ms',
  };
}

// sample contact data
export class sampleContact {
  public static DATA = {
    additionalFieldsArr: null,
    altContactCode: '+91',
    alternateContactNumber: '8888888888',
    billingaddress1: 'Address Line 1',
    billingaddress2: 'Address Line 2',
    bpin: '0000',
    // changeLog: true, needs to verify with Asha
    code: '+91',
    collectedAmount: 0,
    companyName: 'MS', //use in sales sample data also
    contactNo: '999999999',
    country: 'Country',
    createdYear: new Date().getFullYear(),
    currentStatusDate: new Date().getTime(),
    dateCreated: new Date().getTime(),
    department: 'HR',
    district: 'District',
    email: 'johndoe@gmail.com',
    firstName: 'John',
    followUpFlag: 0,
    inPipeline: true,
    invoicedAmount: 0,
    isCompany: true,
    lost: false,
    month: new Date().getMonth(),
    ongoingSales: 0,
    orgId: 'sampleOrg',
    priority: 'Medium',
    saleOngoingValue: 0,
    salePipelineValue: 0,
    salutation: 'Mr',
    secondName: 'Doe',
    sequenceNumber: 0,
    state: 'State',
    surname: '',
    taxId: '111111111',
    totalAmountCollected: 0,
    won: false,
    searchTerm: sampleSearchTerm.data,
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  };
}

// sample contact data
export class sampleOrg {
  public static DATA = {
    additionalFieldsArr: null,
    billingaddress1: 'Address Line 1',
    billingaddress2: 'Address Line 2',
    bpin: '0000',
    code: '+91',
    collected: 0,
    companyName: 'MS', //use in sales sample data also
    contactNo: '999999999',
    country: 'Country',
    createdDate: new Date().getTime(),
    details: '',
    district: 'District',
    email: 'ms@company.com',
    invoiced: 0,
    sequenceNumber: 0,
    state: 'State',
    taxId: '111111111',
    searchTerm: sampleSearchTermOrg.data,
    website: 'www.ms.com',
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  };
}

// sample sale data
export class sampleSale {
  public static DATA = {
    firstName: 'John',
    secondName: 'Doe',
    surname: '',
    companyName: 'MS',
    countryCode: '+91',
    contactNumber: '999999999',
    altCountryCode: '+91',
    altContactNumber: '8888888888',
    additionalFieldsArr: null,
    itemsArray: null,
    saleTitle: 'Sample Sale',
    description: null,
    estimatedValue: 0,
    expCompletionDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
    priority: 'Medium',
    collectionMode: '100% on completion',
    collectedAmount: 0,
    currentStatusDate: new Date().getTime(),
    customerId: 'sampleContact',
    invoicedAmount: 0,
    orgId: 'sampleOrg',
    sequenceNumber: 0,
    // changeLog: null,
    inPipeline: true,
    won: false,
    lost: false,
    createdDate: new Date().getTime(),
    searchTerm: sampleSearchTerm.data,
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  };
}

// sample service data
export class sampleService {
  public static DATA = {
    firstName: 'John',
    secondName: 'Doe',
    surname: '',
    companyName: 'MS',
    countryCode: '+91',
    contactNumber: '999999999',
    altCountryCode: '+91',
    altContactNumber: '8888888888',
    additionalFieldsArr: null,
    serviceTitle: 'Sample Support',
    description: null,
    estimatedValue: 0,
    expCompletionDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
    priority: 'Medium',
    collectionMode: '100% on completion',
    collectedAmount: 0,
    currentStatusDate: new Date().getTime(),
    customerId: 'sampleContact',
    invoicedAmount: 0,
    orgId: 'sampleOrg',
    sequenceNumber: 0,
    // changeLog: null,
    inPipeline: true,
    won: false,
    lost: false,
    createdDate: new Date().getTime(),
    searchTerm: sampleSearchTerm.data,
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  };
}

// task
export class sampleTask {
  public static DATA = {
    title: 'Sample Task',
    company: 'MS',
    description: null,
    dueDate: new Date(),
    saleTitle: 'Sample Sale',
    priority: 'MEDIUM',
    saleId: 'sampleSale',
    saleOrServ: 'Sale',
    serviceId: null,
    serviceTitle: null,
    status: 'Open',
    name: 'John',
    customerId: 'sampleContact',
    lastName: 'Doe',
    date: new Date().getTime(),
    orgId: 'sampleOrg',
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  };
}

// followup
export class sampleCall {
  public static DATA = {
    companyName: 'MS',
    completedStatus: false,
    customerId: 'sampleContact',
    customerName: 'John Doe',
    callStartDate: new Date(),
    dateCreated: new Date().getTime(),
    notes: null,
    callStartTime: '09:00',
    outcome: null,
    status: 'Scheduled',
    direction: 'Outbound',
    saleId: 'sampleSale',
    saleTitle: 'Sample Sale',
    serviceId: 'sampleService',
    serviceTitle: 'Sample Support',
    additionalFieldsArr: null,
    orgId: 'sampleOrg',
    assignedToDate: new Date().getTime(),
    contactNumber:'999999999',
    countryCode:'+91',
    lastModifiedDate: new Date().getTime(),
  };
}
// sample contact data
export class emailTemp1 {
  public static DATA = {
    templateName: 'Order placed',
    subject: 'Order confirmation',
    templateType: 'Sale',
    body: 'Dear #[contact.First Name],<div><br></div><div>Your order is under process and is expected to be delivered by #[sale.Expected Completion Date].</div><div><br></div><div>In case of any queries, you can reach out to&nbsp;#[user.First Name] at #[user.Contact No] or #[user.Email]</div><div><br></div><div>Regards,</div><div>Company name</div>',
  };
}
export class emailTemp2 {
  public static DATA = {
    templateType: 'Invoice',
    subject: 'Your Invoice is ready!',
    templateName: 'Invoice notification',
    body: 'Dear #[user.First Name],<div><br></div><div>Invoice No.#[invoice.Doc Prefix]#[invoice.Doc No] for #[invoice.Currency]. #[invoice.Amount Including Tax]&nbsp;has been generated. Please make the payment on or before #[invoice.Due Date] for processing the order.</div><div><br></div><div>You can view the invoice by clicking on this link #[invoice.Doc URL]</div><div><br></div><div>Reagards,</div><div>Team Company Name</div>',
  };
}
export class emailTemp3 {
  public static DATA = {
    body: 'Dear #[contact.First Name],<div><br></div><div>We acknowledge the receipt of #[collection.Currency]. #[collection.Amount Collected] on #[collection.Payment Date] against Invoice No. #[collection.Doc Prefix and No]</div><div><br></div><div>Regards,</div><div>Team Company Name</div>',
    templateName: 'Payment received',
    subject: 'Payment acknowledgement',
    templateType: 'Collection',
  };
}
export class emailTemp4 {
  public static DATA = {
    subject: 'Notification - Customer support ticket created',
    body: 'Dear #[contact.First Name],<div><br></div><div>We have created a support ticket in response to your complaint received on #[service.Start Date]. We expect to resolve your issue on or before #[service.Expected Completion Date].&nbsp;</div><div>If you need any further information regarding the status of your service ticket, please reach out to #[user.First Name] at #[user.Email].</div><div><br></div><div>Regards,</div><div>Team Company name</div><div><br></div><div><br></div><div><br></div>',
    templateType: 'Service',
    templateName: 'Ticket created',
  };
}
export class emailTemp5 {
  public static DATA = {
    templateType: 'Contact',
    body: 'Hi #[contact.First Name],<div><br></div><div><span id="docs-internal-guid-31ab9f3b-7fff-4608-f255-e62e7a589a49"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Thanks for your interest in our products and services!</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">In case you need any help, do give us a call at +91-9999999999 or drop us an email at </span><a href="mailto:youremail@gmail.com"><span style="font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; text-decoration-line: underline; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;">youremail@gmail.com</span></a><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">.</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Always here to help!</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Your name</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Designation</span></p><div><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br></span></div></span></div>',
    subject: 'Welcome to Company Name',
    templateName: 'Welcome email',
  };
}

export class autom1 {
  public static DATA = {
    createTrigger: true,
    do: 'updateStage',
    form1: {
      name: 'Update customer status to confirmed when sale is added',
      pipeline: 0,
      valueChangeTo: 'Customer-Won',
      conditionPipeline: '',
      condition: '',
      valueChangeFrom: 'any',
      action: {
        name: 'Contact status',
        value: 'contact',
      },
      trigger: {
        queryArray: ['sale', 'create'],
        name: 'sale is created',
      },
    },
    active: false,
    queryArray: ['sale', 'create'],
    data: {
      docType: 'contact',
      fromValue: 'any',
      toValue: 'Customer-Won',
      pipeline: 0,
    },
    type: 'stageTransition',
    conditionPipeline: '',
    editTrigger: false,
    name: 'Update customer status to confirmed when sale is added',
    condition: 'true',
  };
}

export class autom2 {
  public static DATA = {
    queryArray: ['sale', 'create'],
    condition: 'true',
    editTrigger: false,
    alwaysorCondition: true,
    form3: {
      template: {
        Id: '67psFNlwz668MGBe2Tsl',
        body: 'Dear #[contact.First Name],<div><br></div><div>Your order is under process and is expected to be delivered by #[sale.Expected Completion Date].</div><div><br></div><div>In case of any queries, you can reach out to&nbsp;#[user.First Name] at #[user.Contact No] or #[user.Email]</div><div><br></div><div>Regards,</div><div>Company name</div>',
        templateType: 'Sale',
        subject: 'Order confirmation',
        templateName: 'Order placed',
      },
      cc: '',
      To: '${sale.email}',
    },
    do: 'sendEmail',
    active: false,
    conditionAdder: [],
    data: {
      To: '`${sale.email}`',
      cc: '',
      customerId: 'sale.customerId',
      templateId: '67psFNlwz668MGBe2Tsl',
    },
    form1: {
      action: {
        name: 'Send Email',
        value: 'sendEmail',
        triggers: [
          'contact',
          'sale',
          'quotation',
          'invoice',
          'estimate',
          'collection',
          'service',
        ],
      },
      operation: {
        value: ['create'],
        name: 'Created',
      },
      trigger: {
        value: 'sale',
        name: 'Sale',
      },
    },
    form2: {
      conditions: [
        {
          field: '',
          condition: '',
          value: null,
        },
      ],
    },
    name: 'Send order confirmation email',
    createTrigger: true,
  };
}

export class autom3 {
  public static DATA = {
    data: {
      assignedToName: '`${contact.assignedToName}`',
      notes: '`Call the customer and check requirement`',
      assignedTo: '`${contact.assignedTo}`',
      dueDateType: {
        type: 'timestamp',
        value: 'contact.dateCreated',
        name: 'contact created date',
      },
      followUpDate: 0,
      customerId: 'contact.customerId',
      completedStatus: false,
      companyName: 'contact.companyName',
      dateCreated: 'contact.dateCreated',
      customerName:
        "contact.firstName+(contact.secondName?contact.secondName:'')",
      dateAfterorBefore: '+',
    },
    form3: {
      assignedTo: 'Contact',
      dateFieldType: {
        name: 'contact created date',
        value: 'contact.dateCreated',
        type: 'timestamp',
      },
      followUpDate: 0,
      notes: 'Call the customer and check requirement',
      afterorBefore: '+',
    },
    queryArray: ['contact', 'create'],
    active: false,
    conditionAdder: [],
    condition: 'true',
    alwaysorCondition: true,
    createTrigger: true,
    form1: {
      operation: {
        name: 'Created',
        value: ['create'],
      },
      action: {
        value: 'createfollowupTask',
        name: 'Create Follow up',
        triggers: ['contact', 'followup', 'sale', 'service'],
      },
      trigger: {
        name: 'Contact',
        value: 'contact',
      },
    },
    editTrigger: false,
    form2: {
      conditions: [
        {
          condition: '',
          field: '',
          value: null,
        },
      ],
    },
    do: 'createfollowupTask',
    name: 'Schedule call when contact is added',
  };
}

export class autom4 {
  public static DATA = {
    editTrigger: false,
    name: 'Check product availability when order is created',
    condition: 'true',
    conditionAdder: [],
    active: false,
    createTrigger: true,
    form3: {
      priority: 'HIGH',
      assignedTo: 'Sale',
      description: '',
      title: 'Check product availability',
      dateFieldType: {
        name: 'sale created date',
        value: 'sale.createdDate',
        type: 'timestamp',
      },
      dueDate: 1,
      afterorBefore: '+',
    },
    queryArray: ['sale', 'create'],
    form2: {
      conditions: [
        {
          value: null,
          field: '',
          condition: '',
        },
      ],
    },
    form1: {
      operation: {
        value: ['create'],
        name: 'Created',
      },
      action: {
        value: 'createTask',
        triggers: [
          'contact',
          'sale',
          'estimate',
          'quotation',
          'invoice',
          'collection',
          'service',
        ],
        name: 'Create Task',
      },
      trigger: {
        name: 'Sale',
        value: 'sale',
      },
    },
    alwaysorCondition: true,
    data: {
      dateAfterorBefore: '+',
      company: 'sale.companyName',
      name: 'sale.firstName',
      title: '`Check product availability`',
      description: '``',
      saleId: 'sale.saleId',
      saleTitle: 'sale.saleTitle',
      priority: 'HIGH',
      dueDate: 1,
      serviceTitle: null,
      lastName: 'sale.secondName',
      assignedToName: '`${sale.assignedToName}`',
      createdBy: '05i8ISMtA0QPGNylpqqwRY6A0jB2',
      status: 'Open',
      dueDateType: {
        name: 'sale created date',
        type: 'timestamp',
        value: 'sale.createdDate',
      },
      assignedTo: '`${sale.assignedTo}`',
      serviceId: null,
      saleOrServ: 'Sale',
      customerId: 'sale.customerId',
    },
    do: 'createTask',
  };
}

export class autom5 {
  public static DATA = {
    data: {
      fromValue: 'any',
      docType: 'sale',
      toValue: 'Sale-Completed',
      pipeline: 0,
    },
    do: 'updateStage',
    createTrigger: true,
    editTrigger: false,
    conditionPipeline: '',
    form1: {
      name: 'Update Sale stage to confirmed when invoice is created',
      trigger: {
        queryArray: ['invoice', 'create'],
        name: 'invoice is created',
      },
      valueChangeTo: 'Sale-Completed',
      pipeline: 0,
      valueChangeFrom: 'any',
      condition: '',
      conditionPipeline: '',
      action: {
        name: 'Sale stage',
        value: 'sale',
      },
    },
    active: false,
    type: 'stageTransition',
    name: 'Update Sale stage to confirmed when invoice is created',
    condition: 'true',
    queryArray: ['invoice', 'create'],
  };
}

export class autom6 {
  public static DATA = {
    active: false,
    createTrigger: false,
    form2: {
      conditions: [
        {
          value: null,
          field: '',
          condition: '',
        },
      ],
    },
    alwaysorCondition: true,
    data: {
      To: '` ${invoice.email} `',
      templateId: 'JpEtOIPPqdZIVGGnf7zP',
      customerId: 'invoice.customerId',
      cc: '',
    },
    name: 'Email invoice to customer',
    form1: {
      operation: {
        value: ['edit'],
        name: 'Edited',
      },
      trigger: {
        name: 'Invoice',
        value: 'invoice',
      },
      action: {
        name: 'Send Email',
        triggers: [
          'contact',
          'sale',
          'quotation',
          'invoice',
          'estimate',
          'collection',
          'service',
        ],
        value: 'sendEmail',
      },
    },
    queryArray: ['invoice', 'edit'],
    form3: {
      template: {
        templateType: 'Invoice',
        body: 'Dear #[user.First Name],<div><br></div><div>Invoice No.#[invoice.Doc Prefix]#[invoice.Doc No] for [invoice.Currency]. #[invoice.Amount Including Tax]&nbsp;has been generated. Please make the payment on or before #[invoice.Due Date] for processing the order.</div><div><br></div><div>You can view the invoice by clicking on this link #[invoice.Doc URL]</div><div><br></div><div>Reagards,</div><div>Team Company Name</div>',
        templateName: 'Invoice notification',
        subject: 'Your Invoice is ready!',
        Id: 'JpEtOIPPqdZIVGGnf7zP',
      },
      cc: '',
      To: ' ${invoice.email} ',
    },
    editTrigger: true,
    conditionAdder: [],
    do: 'sendEmail',
    condition: 'true',
  };
}

export class autom7 {
  public static DATA = {
    form2: {
      conditions: [
        {
          field: '',
          condition: '',
          value: null,
        },
      ],
    },
    queryArray: ['contact', 'create'],
    createTrigger: true,
    conditionAdder: [],
    condition: 'true',
    alwaysorCondition: true,
    form3: {
      template: {
        templateName: 'Welcome email',
        templateType: 'Contact',
        Id: 'uxHegVqprmSIaDkzXDjp',
        body: 'Hi #[contact.First Name],<div><br></div><div><span id="docs-internal-guid-31ab9f3b-7fff-4608-f255-e62e7a589a49"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Thanks for your interest in our products and services!</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">In case you need any help, do give us a call at +91-9999999999 or drop us an email at </span><a href="mailto:youremail@gmail.com"><span style="font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; text-decoration-line: underline; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;">youremail@gmail.com</span></a><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">.</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Always here to help!</span></p><br><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Your name</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Designation</span></p><div><span style="font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;"><br></span></div></span></div>',
        subject: 'Welcome to Company Name',
      },
      To: '${contact.email} ',
      cc: '',
    },
    editTrigger: false,
    do: 'sendEmail',
    data: {
      cc: '',
      templateId: 'uxHegVqprmSIaDkzXDjp',
      customerId: 'contact.customerId',
      To: '`${contact.email} `',
    },
    name: 'Send welcome email when a customer is added',
    active: false,
    form1: {
      trigger: {
        value: 'contact',
        name: 'Contact',
      },
      operation: {
        value: ['create'],
        name: 'Created',
      },
      action: {
        name: 'Send Email',
        triggers: [
          'contact',
          'sale',
          'quotation',
          'invoice',
          'estimate',
          'collection',
          'service',
        ],
        value: 'sendEmail',
      },
    },
  };
}

export class customerViewSettingsDef {
  public static DATA = [
    {
      viewName: 'In progress',
      filters: [],
      sortOrder: 'Desc',
      sortField: {
        columnDef: 'dateCreated',
        display: true,
        ind: 0,
        header: 'Date created',
        fieldType: 'def',
        type: 'date',
      },
      primaryQuery: {
        queryName: 'In Pipeline',
        operator: true,
        queryType: 'boolean',
        ind: 0,
        fieldType: 'def',
        selectionArray: [],
        comparisonValue: [true],
        queryField: 'inPipeline',
      },
    },
    {
      sortOrder: 'Asc',
      sortField: {
        header: 'Date created',
        type: 'date',
        display: true,
        columnDef: 'dateCreated',
        fieldType: 'def',
        ind: 0,
      },
      filters: [],
      primaryQuery: {
        selectionArray: [],
        operator: 'This Week',
        fieldType: 'def',
        comparisonValue: [],
        queryType: 'date',
        ind: 0,
        queryField: 'dateCreated',
        queryName: 'Created date',
      },
      viewName: 'Created this week',
    },
    {
      sortOrder: 'Asc',
      primaryQuery: {
        queryType: 'date',
        selectionArray: [],
        ind: 0,
        operator: 'This Month',
        queryField: 'dateCreated',
        fieldType: 'def',
        comparisonValue: [],
        queryName: 'Created date',
      },
      viewName: 'Created this month',
      sortField: {
        ind: 0,
        display: true,
        header: 'Date created',
        columnDef: 'dateCreated',
        fieldType: 'def',
        type: 'date',
      },
      filters: [],
    },
    {
      sortOrder: 'Asc',
      primaryQuery: {
        selectionArray: [],
        operator: 'This Month',
        queryType: 'date',
        queryName: 'Created date',
        queryField: 'dateCreated',
        fieldType: 'def',
        ind: 0,
        comparisonValue: [],
      },
      sortField: {
        fieldType: 'def',
        header: 'Date created',
        columnDef: 'dateCreated',
        ind: 0,
        display: true,
        type: 'date',
      },
      filters: [
        {
          queryName: 'Won',
          queryField: 'won',
          operator: true,
          ind: 0,
          queryType: 'boolean',
          comparisonValue: [true],
          fieldType: 'def',
          selectionArray: [],
        },
      ],
      viewName: 'Created this month & converted',
    },
    {
      viewName: 'Created this month & lost',
      primaryQuery: {
        queryName: 'Created date',
        fieldType: 'def',
        queryField: 'dateCreated',
        selectionArray: [],
        operator: 'This Month',
        comparisonValue: [],
        ind: 0,
        queryType: 'date',
      },
      sortOrder: 'Asc',
      filters: [
        {
          queryField: 'lost',
          selectionArray: [],
          queryType: 'boolean',
          ind: 0,
          comparisonValue: [true],
          operator: true,
          queryName: 'Lost',
          fieldType: 'def',
        },
      ],
      sortField: {
        display: true,
        fieldType: 'def',
        header: 'Date created',
        type: 'date',
        ind: 0,
        columnDef: 'dateCreated',
      },
    },
  ];
}

export class productViewSettingsDef {
  public static DATA = [
    {
      sortOrder: 'Asc',
      sortField: {
        header: 'Date created',
        type: 'date',
        display: true,
        columnDef: 'dateCreated',
        fieldType: 'def',
        ind: 0,
      },
      filters: [],
      primaryQuery: {
        selectionArray: [],
        operator: 'Before Date Tomorrow',
        fieldType: 'def',
        comparisonValue: [],
        queryType: 'date',
        ind: 0,
        queryField: 'dateCreated',
        queryName: 'Created date',
      },
      viewName: 'Before Date Tomorrow',
    }
  ];
}

export class saleViewSettingsDef {
  public static DATA = [
    {
      viewName: 'In progress',
      sortField: {
        columnDef: 'createdDate',
        header: 'Created Date',
        type: 'date',
        ind: 0,
        display: false,
        fieldType: 'def',
      },
      filters: [],
      sortOrder: 'Asc',
      primaryQuery: {
        selectionArray: [],
        queryField: 'inPipeline',
        fieldType: 'def',
        ind: 0,
        comparisonValue: [true],
        operator: true,
        queryName: 'In Pipeline',
        queryType: 'boolean',
      },
    },
    {
      primaryQuery: {
        queryField: 'createdDate',
        ind: 0,
        queryName: 'Created date',
        comparisonValue: [],
        queryType: 'date',
        operator: 'This Week',
        fieldType: 'def',
        selectionArray: [],
      },
      filters: [],
      viewName: 'Created this week',
      sortField: {
        header: 'Date created',
        fieldType: 'def',
        columnDef: 'createdDate',
        type: 'date',
        display: true,
        ind: 0,
      },
      sortOrder: 'Asc',
    },
    {
      filters: [],
      primaryQuery: {
        selectionArray: [],
        queryType: 'date',
        queryName: 'Created date',
        queryField: 'createdDate',
        operator: 'This Month',
        comparisonValue: [],
        ind: 0,
        fieldType: 'def',
      },
      sortField: {
        display: true,
        ind: 0,
        header: 'Date created',
        columnDef: 'createdDate',
        fieldType: 'def',
        type: 'date',
      },
      sortOrder: 'Asc',
      viewName: 'Created this month',
    },
    {
      sortField: {
        fieldType: 'def',
        type: 'date',
        columnDef: 'createdDate',
        header: 'Date created',
        ind: 0,
        display: true,
      },
      viewName: 'Created this month & converted',
      primaryQuery: {
        queryType: 'date',
        queryName: 'Created date',
        selectionArray: [],
        comparisonValue: [],
        queryField: 'createdDate',
        fieldType: 'def',
        operator: 'This Month',
        ind: 0,
      },
      sortOrder: 'Asc',
      filters: [
        {
          selectionArray: [],
          comparisonValue: [true],
          queryField: 'won',
          queryType: 'boolean',
          fieldType: 'def',
          queryName: 'Won',
          ind: 0,
          operator: true,
        },
      ],
    },
    {
      sortOrder: 'Desc',
      primaryQuery: {
        comparisonValue: [],
        ind: 0,
        queryName: 'Created date',
        operator: 'This Month',
        selectionArray: [],
        queryField: 'createdDate',
        fieldType: 'def',
        queryType: 'date',
      },
      viewName: 'Created this month & lost',
      sortField: {
        type: 'date',
        header: 'Created Date',
        display: false,
        ind: 0,
        fieldType: 'def',
        columnDef: 'createdDate',
      },
      filters: [
        {
          operator: true,
          fieldType: 'def',
          queryType: 'boolean',
          comparisonValue: [true],
          ind: 0,
          queryField: 'lost',
          queryName: 'Lost',
          selectionArray: [],
        },
      ],
    },
    {
      sortOrder: 'Asc',
      filters: [],
      primaryQuery: {
        fieldType: 'def',
        queryName: 'Start Date',
        selectionArray: [],
        comparisonValue: [],
        queryField: 'startDate',
        queryType: 'timestamp',
        ind: 0,
        operator: 'This Week',
      },
      sortField: {
        fieldType: 'def',
        ind: 0,
        header: 'Created Date',
        display: false,
        type: 'date',
        columnDef: 'createdDate',
      },
      viewName: 'Starting this week',
    },
    {
      viewName: 'Starting this month',
      primaryQuery: {
        ind: 0,
        queryField: 'startDate',
        fieldType: 'def',
        queryName: 'Start Date',
        operator: 'This Month',
        queryType: 'timestamp',
        selectionArray: [],
        comparisonValue: [],
      },
      filters: [],
      sortField: {
        type: 'date',
        ind: 0,
        display: false,
        fieldType: 'def',
        columnDef: 'createdDate',
        header: 'Created Date',
      },
      sortOrder: 'Asc',
    },
    {
      viewName: 'Ending this week',
      sortOrder: 'Asc',
      sortField: {
        header: 'Created Date',
        type: 'date',
        fieldType: 'def',
        display: false,
        columnDef: 'createdDate',
        ind: 0,
      },
      primaryQuery: {
        operator: 'This Week',
        comparisonValue: [],
        queryType: 'timestamp',
        selectionArray: [],
        ind: 0,
        queryName: 'End Date',
        fieldType: 'def',
        queryField: 'expCompletionDate',
      },
      filters: [],
    },
    {
      viewName: 'Ending this month',
      sortOrder: 'Asc',
      primaryQuery: {
        comparisonValue: [],
        queryName: 'End Date',
        ind: 0,
        queryField: 'expCompletionDate',
        selectionArray: [],
        fieldType: 'def',
        queryType: 'timestamp',
        operator: 'This Month',
      },
      filters: [],
      sortField: {
        ind: 0,
        display: false,
        type: 'date',
        header: 'Created Date',
        fieldType: 'def',
        columnDef: 'createdDate',
      },
    },
  ];
}

export class taskViewSettingsDef {
  public static DATA = [
    {
      sortOrder: 'Desc',
      primaryQuery: {
        ind: 0,
        selectionArray: ['Completed'],
        fieldType: 'def',
        queryField: 'status',
        operator: 'not-in',
        queryName: 'Status',
        comparisonValue: ['Completed'],
        queryType: 'option',
      },
      sortField: {
        display: true,
        fieldType: 'def',
        columnDef: 'dueDate',
        type: 'date',
        header: 'Due date',
        ind: 0,
      },
      filters: [],
      viewName: 'Open Tasks',
    },
    {
      viewName: 'Tasks due today',
      sortOrder: 'Desc',
      filters: [],
      sortField: {
        type: 'date',
        fieldType: 'def',
        header: 'Due date',
        columnDef: 'dueDate',
        ind: 0,
        display: true,
      },
      primaryQuery: {
        queryType: 'timestamp',
        queryField: 'dueDate',
        comparisonValue: [],
        queryName: 'Due date',
        ind: 0,
        operator: 'Today',
        selectionArray: [],
        fieldType: 'def',
      },
    },

    {
      primaryQuery: {
        fieldType: 'def',
        comparisonValue: [],
        ind: 0,
        selectionArray: [],
        operator: 'This Week',
        queryField: 'dueDate',
        queryType: 'timestamp',
        queryName: 'Due date',
      },
      sortOrder: 'Asc',
      viewName: 'Task due this week',
      filters: [],
      sortField: {
        columnDef: 'dueDate',
        ind: 0,
        fieldType: 'def',
        display: true,
        type: 'date',
        header: 'Due date',
      },
    },
    {
      filters: [],
      viewName: 'Task due this month',
      sortField: {
        ind: 0,
        columnDef: 'dueDate',
        header: 'Due date',
        display: true,
        type: 'date',
        fieldType: 'def',
      },
      primaryQuery: {
        ind: 0,
        fieldType: 'def',
        queryName: 'Due date',
        queryType: 'timestamp',
        selectionArray: [],
        queryField: 'dueDate',
        comparisonValue: [],
        operator: 'This Month',
      },
      sortOrder: 'Asc',
    },
    {
      sortField: {
        type: 'date',
        display: true,
        fieldType: 'def',
        ind: 0,
        header: 'Due date',
        columnDef: 'dueDate',
      },
      primaryQuery: {
        comparisonValue: [],
        selectionArray: [],
        queryType: 'timestamp',
        ind: 0,
        operator: 'This Week',
        queryField: 'dueDate',
        fieldType: 'def',
        queryName: 'Due date',
      },
      sortOrder: 'Desc',
      filters: [
        {
          ind: 0,
          comparisonValue: ['Completed'],
          fieldType: 'def',
          operator: 'in',
          queryField: 'status',
          selectionArray: ['Completed'],
          queryName: 'Status',
          queryType: 'option',
        },
      ],
      viewName: 'Due this week and closed',
    },
    {
      viewName: 'Due this month and closed',
      filters: [
        {
          selectionArray: ['Completed'],
          comparisonValue: ['Completed'],
          queryName: 'Status',
          fieldType: 'def',
          operator: 'in',
          queryField: 'status',
          queryType: 'option',
          ind: 0,
        },
      ],
      sortOrder: 'Asc',
      sortField: {
        type: 'date',
        display: true,
        columnDef: 'dueDate',
        header: 'Due date',
        fieldType: 'def',
        ind: 0,
      },
      primaryQuery: {
        queryField: 'dueDate',
        fieldType: 'def',
        ind: 0,
        queryType: 'timestamp',
        comparisonValue: [],
        queryName: 'Due date',
        operator: 'This Month',
        selectionArray: [],
      },
    },
  ];
}

export class orgViewSettingsDef {
  public static DATA = [
    {
      sortOrder: 'Asc',
      sortField: {
        header: 'Date created',
        type: 'date',
        display: true,
        columnDef: 'createdDate',
        fieldType: 'def',
        ind: 0,
      },
      filters: [],
      primaryQuery: {
        selectionArray: [],
        operator: 'This Week',
        fieldType: 'def',
        comparisonValue: [],
        queryType: 'date',
        ind: 0,
        queryField: 'createdDate',
        queryName: 'Created date',
      },
      viewName: 'Created this week',
    },
    {
      sortOrder: 'Asc',
      sortField: {
        header: 'Date created',
        type: 'date',
        display: true,
        columnDef: 'createdDate',
        fieldType: 'def',
        ind: 0,
      },
      filters: [],
      primaryQuery: {
        selectionArray: [],
        operator: 'This Month',
        fieldType: 'def',
        comparisonValue: [],
        queryType: 'date',
        ind: 0,
        queryField: 'createdDate',
        queryName: 'Created date',
      },
      viewName: 'Created this month',
    },
  ];
}
// Oragnanisation data-model
export class OrganisationModel {
  constructor(
    public id: string,
    public assignedTo: string,
    public assignedToName: string,
    public associatedBranch: string,
    public billingaddress1: string,
    public billingaddress2: string,
    public bpin: number,
    public code: string,
    public companyName: string,
    public contactNo: string,
    public country: string,
    public state: string,
    public createdDate: number,
    public district: string,
    public website: string,
    public taxId: string,
    public createdBy: string,
    public searchTerm: SearchTerm,
    public sequenceNumber: number,
    public details: string,
    public changeLog: any,
    public invoiced: number,
    public collected: number,
    public additionalFieldsArr: addFieldsArr[],
    public email: string,
    public lastModifiedDate: any,
    public assignedToDate: number,
  ) {}
}

export class hsnCodeDisplay {
  public static DATA = {
    estimate: true,
    quotation: true,
    invoice: true,
  };
}
export const waLanguages = [
  { name: 'Afrikaans', code: 'af' },
  { name: 'Albanian', code: 'sq' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Azerbaijani', code: 'az' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Bulgarian', code: 'bg' },
  { name: 'Catalan', code: 'ca' },
  { name: 'Chinese (CHN)', code: 'zh_CN' },
  { name: 'Chinese (HKG)', code: 'zh_HK' },
  { name: 'Chinese (TAI)', code: 'zh_TW' },
  { name: 'Croatian', code: 'hr' },
  { name: 'Czech', code: 'cs' },
  { name: 'Danish', code: 'da' },
  { name: 'Dutch', code: 'nl' },
  { name: 'English', code: 'en' },
  { name: 'English (UK)', code: 'en_GB' },
  { name: 'English (US)', code: 'en_US' },
  { name: 'Estonian', code: 'et' },
  { name: 'Filipino', code: 'fil' },
  { name: 'Finnish', code: 'fi' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Greek', code: 'el' },
  { name: 'Gujarati', code: 'gu' },
  { name: 'Hausa', code: 'ha' },
  { name: 'Hebrew', code: 'he' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Hungarian', code: 'hu' },
  { name: 'Indonesian', code: 'id' },
  { name: 'Irish', code: 'ga' },
  { name: 'Italian', code: 'it' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Kazakh', code: 'kk' },
  { name: 'Korean', code: 'ko' },
  { name: 'Lao', code: 'lo' },
  { name: 'Latvian', code: 'lv' },
  { name: 'Lithuanian', code: 'lt' },
  { name: 'Macedonian', code: 'mk' },
  { name: 'Malay', code: 'ms' },
  { name: 'Malayalam', code: 'ml' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Norwegian', code: 'nb' },
  { name: 'Persian', code: 'fa' },
  { name: 'Polish', code: 'pl' },
  { name: 'Portuguese (BR)', code: 'pt_BR' },
  { name: 'Portuguese (POR)', code: 'pt_PT' },
  { name: 'Punjabi', code: 'pa' },
  { name: 'Romanian', code: 'ro' },
  { name: 'Russian', code: 'ru' },
  { name: 'Serbian', code: 'sr' },
  { name: 'Slovak', code: 'sk' },
  { name: 'Slovenian', code: 'sl' },
  { name: 'Spanish', code: 'es' },
  { name: 'Spanish (ARG)', code: 'es_AR' },
  { name: 'Spanish (SPA)', code: 'es_ES' },
  { name: 'Spanish (MEX)', code: 'es_MX' },
  { name: 'Swahili', code: 'sw' },
  { name: 'Swedish', code: 'sv' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Thai', code: 'th' },
  { name: 'Turkish', code: 'tr' },
  { name: 'Ukrainian', code: 'uk' },
  { name: 'Urdu', code: 'ur' },
  { name: 'Uzbek', code: 'uz' },
  { name: 'Vietnamese', code: 'vi' },
  { name: 'Zulu', code: 'zu' },
];

export interface LanguageModel {
  name: string;
  code: string;
}
export interface MsgCountModel {
  id: string;
  date: any;
  type: string;
  counted: number;
}

export const no_Network_Logout_Time = 30000; //no network logout time

// for getting the default view (eg: table, grid view)
export class DefaulView {
  constructor(public view: string, public viewName: string) {}
}
export abstract class DefaulViewList {
  static getDefaulView(): DefaulView[] {
    let defaulViewList: DefaulView[] = [];
    defaulViewList.push(new DefaulView('grid', 'Grid View'));
    defaulViewList.push(new DefaulView('table', 'Table View'));
    return defaulViewList;
  }
}
// delete log model
export interface deleteLogModel {
  delByemail: string;
  delByuserId: string;
  dateNtime: Date;
  tasksDeleted: number;
  contDeleted: number;
  follDeleted: number;
}
export interface reportsToModel {
  userId: string;
  name: string;
}
// export const shareAttOrDocLink = 'https://zenyscustomer.web.app/login'; //sales details attachment/sales doc share link

export const shareAttOrDocLink = 'https://customer.zenys.org/'; //sales details attachment/sales doc share link

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry',
];
