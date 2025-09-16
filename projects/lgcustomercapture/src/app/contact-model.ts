export class Contact {
  constructor(
    public firstName: string,
    public contactNo: string,
    public additionalFieldsArr: any[]
  ) {}
}
export class ContactDetails {
  additionalFieldsArr: any[];
  alternateContactNumber: string;
  assignedTo: string;
  assignedToName: string;
 
  billingaddress1: string;
  billingaddress2: string;
  bpin: number;
  code: string;
  collectedAmount: number;
  companyName: string;
  contactNo: string;
  country: string;
  createdBy: string;
  createdYear: number;
  currentStatusDate: number;
  custLeadValue: string;
  dateCreated: number;
  department:string;
  district: string;
  firstName: string;
  followUpFlag: number;
  inPipeline:boolean
  email: string;
  invoicedAmount: number;
  isCompany: boolean;
  lost:boolean;
  month: number;
  ongoingSales: number;
  priority: string;
  saleOngoingValue: number;
  salePipelineValue: number;
  salutation:string;
  surname:string;
  searchTerm: SearchTerm;
  secondName: string;
  selectedContactPipeline: number;
  stageHistory: StageHistory[];
  state: string;
  status: string;
  won:boolean;
  totalAmountCollected: number;
  taxId: string;
  
}
export class StageHistory {
  date: number;
  stageName: string;
  stageNo: number;
}
export class SearchTerm {
  public firstName: string = '';
  public secondName: string = '';
  public companyName: string = '';
  public surname: string = '';
}
