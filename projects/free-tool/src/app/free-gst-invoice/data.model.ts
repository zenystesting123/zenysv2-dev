export interface UserData {
    logo:File,
    signature:File,
    signatoryname:string,
    designation:string,
    statefrom:string,
    youraddressline:string,
    yourdistrict:string,
    yourgst:string,  
    yourcompanyname:string,
    yourpincode:string,
    yourcountry: string,
    showSign:boolean,
    
    
}
export interface DbUserData{
    contactname:string,
    contactno:string,
    email:string
}

export interface CustomerData {
   billpincode:string,
    billdistrict:string,
    stateto:string,
    billcountry:string,
    billgst:string,
    billcompanyname:string,
    billaddressline:string,
    deliveredto:string,
    delto:boolean;  
    
}
export interface ShippingData {
    shipname:string,
    shipaddress:string,
    shipcompanyname:string,
    zip:number,
    frieghttype:string,
    shipdate:Date,
    grossweight:number,
    totalpackage:number,
    shipto:boolean,
    shipdet:boolean,

    requisition:string,
    shipvia:string,
    fob:string,
    shippingterms:string

 }

export interface DocData {
     date:Date,
     duedate:Date,
     docValidity:Date,
     sgstvalue:number,
     cgstvalue:number,
     igstvalue:number,
     cessvalue:number,
     vatvalue:number,
     discountValue:number,
     discountedAmount:number,
     total:number,
     invoiceno:number,
     quatationreference:string,
     alltotal:number,
     purchaseorder:string,
     paymentterm:string,
     invoiceorquote:string,
     bankdetails:string,
     notes:string,
     currency:string,
     includetax:boolean,
     includecess:boolean,
     interstate:boolean,
     docTitle:string,
     docType:string,
     includeunit:boolean,
     country:string,
     embarkation:string,
     discharge:string,
     taxType:string,
     includeDiscount:boolean
}
export interface DocType{
    invoice:string,
    quatation:string,
    estimate:string,
    proforma:string,
    doctype:string,
}
export interface LineItemData {
    slno:number,
    item:string,
    qty:number, 
    unit:string,
    rate:number, 
    sgstRate:number,
    sgstAmount:number,
    cgstRate:number, 
    cgstAmount:number,
    igstRate:number, 
    igstAmount:number,
    cessRate:number, 
    cessAmount:number,
    vatRate:number,
    vatAmount:number,
    discountRate:number,
    discountAmount:number,
    amount:number, 
    amountInclTax:number,
    description:string ,
    discountedAmount:number ,
    hsnCode:string
}