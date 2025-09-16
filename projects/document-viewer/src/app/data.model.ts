
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
    contactNumber:string,
    email:string,
    isDeliveryAddressPresent:boolean,


}
export interface DocData {
  gstStateCode:string,
  gstPlaceOfSupplyCode:string,
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
}
export class Sales {
    id: string;
    firstName: string;
    secondName: string;
    companyName: string;
    saleTitle: string;
    description: string;
    estimatedValue: number;
    expCompletionDate: any;
    expenseAmount: number;
    startDate: any;
    salesStage: string;
    additionalFieldsArray:any[];
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
    searchTerm:SearchTermSale

}

export class SearchTermSale{
    public firstName: string='';
    public secondName: string='';
    public companyName:string='';
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
