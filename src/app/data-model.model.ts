
// /*************************************
// Data model file for project
// Author: Mohan
// Date: 26/1/2020
// **************************************/

// import { Time } from "@angular/common";
// import { EmptyError } from "rxjs";

// export class Inquiries {
//     id: string;
//     date: Date;
//     email: string;
//     message: string;
//     phone: number;
//     status: number;
//     name: string;
// }


// export interface TaskData {
//     id: string;
//     assignedTo: String,
//     company: String,
//     customerId: String,
//     date: number,
//     description: number,
//     dueDate: any,
//     name: string,
//     priority: string,
//     startDate: string,
//     status: string,
//     title: string
// }
// export class InvoiceModelActual {

//     id: string;
//     idstate: string;
//     collectedAmount: any;
//     customerData: {
//         addressline1: string;
//         addressline2: string;
//         companyName: string;
//         country: string;
//         custID: string;
//         district: string;
//         gst: string;
//         pinCode: number;
//         state: string;

//     }
//     docData: {
//         bankDetails: string;
//         cessValue: number;
//         cgstValue: number;
//         currency: string;
//         docDate: any;
//         docNumber: string;
//         docTitle: string;
//         docType: string;
//         docValidity: string;
//         dueDate: Date;
//         igstValue: number;
//         includeCess: boolean;
//         includeTax: boolean;
//         interState: boolean;
//         notes: string;
//         paymentTerm: string;
//         poRef: string;
//         quoteRef: string;
//         saleID: string;
//         sgstValue: number;
//         total: number;
//         totalInclTax: number;
//         amountCollected: number;
//         id: any;
//     }
//     itemList: [
//         {
//             amount: number;
//             amountInclTax: number;
//             cessAmount: number;
//             cessRate: number;
//             cgstAmount: number;
//             cgstRate: number;
//             description: string;
//             igstAmount: number;
//             igstRate: number;
//             item: string;
//             qty: number;
//             rate: number;
//             sgstAmount: number;
//             sgstRate: number;
//             slno: number;
//         }
//     ]
//     userData: {
//         addressline1: string;
//         adrressline2: string;
//         companyName: string;
//         country: string;
//         designation: string;
//         district: string;
//         gst: string;
//         logo: string;
//         pinCode: string;
//         signatoryName: string;
//         signature: string;
//         state: string;
//     }
// }
// export class Payment {

//     amount: number;
//     customerId: string;
//     invoiceno: string;
//     paymentdate: string;
//     paymentmode: String;
//     pendingamount: string;
//     saleid: string;
// }
// export class Gallery{
//     id:any;
//     downloadURL:string;
//     date:any;
//     path:any;
// }
// //MK 2/4/2021 - Use this interface for reading User document data
// export interface User {
//     ID: string;
//     id: string;
//     salutation: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     usertype: string; //to be replaced by userRole
//     company: string;
//     phone: number;
//     altphone: number;
//     leadPoints:number;
//     leadSharedRating:number;
//     noOfRatingReceived:number;
//     street1: string;
//     street2: string;
//     state: string;
//     country: string;
//     pincode: number;
//     masterId: string; //to be replaced by superUserId
//     userRole: string;
//     accountType: string;
//     superUserId: string;
//     dataAccessRule: string;
// }
// export interface Item {
//     map(arg0: (e: any) => Item): Item[];
//     ID: String;
//     salutation: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     utype: string;
//     company: string;
//     phone: number;
//     altphone: number;
//     street1: string;
//     street2: string;
//     state: string;
//     country: string;
//     pincode: number;
//     path: string;
//     printemail: string;
//     printstreet1: string
//     printstreet2: string;
//     currency: string;
//     gstnumber: number;
//     printphone: number;
//     template: string;
//     printcountry: string;
//     printstate: string;
//     printpincode: string;
//     quotation: string;
//     invoice: string;
//     invoiceNoInit: number;
//     quoteNoInit: number;
//     bankDetails: string;
//     id: string;
//     about: any;
//     estimatenote: any;
//     printTemplate:any;

// }

// export interface Items {
//     id: string;
//     title: string;
//     description: string;
//     assignedTo: string;
//     dueDate: Date;
//     startDate: Date;
//     priority: string;
//     status: string;
//     company: string;
//     name: string;
//     estimatenote: any;

// }
// export class Payments {

//     id: string;
//     amount: number;
//     customerId: string;
//     invoiceno: string;
//     paymentdate: string;
//     paymentmode: String;
//     pendingamount: string;
//     saleid: string;
//     prevSaleAmount: number;
//     prevCustomerAmount: number;
//     prevInvoiceAmount: number;
//     collectedAmount: number;
//     docData: any;
// }




// export interface Leads {
//     customerId: string;
//     category: string;
//     id: string;
//     createDate: string;
//     submittedBy: string;
//     noPurchases: number;
//     pointsEarned: number;
//     rating: number;
//     usrProfileScore: number;
//     invContactCount: number;
//     invReqCount: number;
//     reqMetCount: number;
//     reqStatus: boolean;
//     title: string;
//     description: string;
//     name: string;
//     countryCode: number;
//     leadContactNo: number;
//     leadEmail: string;
//     leadSharedRating:number;
//     ownReq: boolean;
//     companyName: string;
//     noOfRatingReceived:number
// }
// export class LeadPurchased {
//     id: string;
//     date: any;
//     description: string;
//     invalidContactFlag: boolean;
//     invalidReqFlag: boolean;
//     leadId: string;
//     name: string;
//     companyName: string;
//     leadSharedRating: number;
//     purchaseValue: number;
//     reqMetFlag: boolean;
//     saleId: string;
// }
// export interface Meeting {
//     id?: string | number;
//     start: Date;
//     end?: Date;
//     title: string;
//     name: string,
//     company: string,
//     description: string;
//     assignedCustomer: string;
//     // name:string;
//     // date:Date;
//     // company:string;
//     // customerID:string;
// }
// export interface Sales {
//     EstimatedValue: number;
//     ExpCompletionDate: Date;
//     assignedto: string;
//     customerId: string;
//     date: number;
//     description: string;
//     payment: string;
//     priority: string;
//     salesstage: string;
//     salestype: string;
//     salesAmount: number;
//     id: string;
//     cname: string;
//     fname1: string;
//     amountcollected: number;
//     title: string;
//     collectedAmount: number;
// }

// export class Sale {
//     constructor(

//         public id: string,
//         public fname1: string,
//         public cname: string,
//         public title: string,
//         public description: string,
//         public estimatedValue: number,
//         public expCompletionDate: any,
//         public startDate: any,
//         public salesStage: string,
//         public salesType: string,
//         public priority: string,
//         public assignedTo: string,
//         public payment: string,
//         public saleField1: string,
//         public saleField2: string,
//         public saleField3: string,
//         public saleField4: string,
//         public saleCategory1: string,
//         public saleCategory2: string,
//         public saleField1Title: string,
//         public saleField2Title: string,
//         public saleField3Title: string,
//         public saleField4Title: string,
//     ) {
//     }
// }
// export class Cust {
//     constructor(

//         public fname1: string,
//         public cname: string) { }
// }
// // export interface salesAmount{
// //     EstimatedValue:number;
// // }


// export class Upload {
//     $key: string;
//     file: File;
//     name: string;
//     url: string;
//     progress: number;
//     createAt: Date = new Date();

//     constructor(file: File) {
//         this.file = file;
//     }

// }
// export class FileUpload {

//     key: string;
//     name: string;
//     url: string;
//     file: File;

//     constructor(file: File) {
//         this.file = file;
//     }
// }

// export interface Customers {
//     id: string;
//     assigned: string;
//     billingaddress1: string;
//     billingaddress2: string;
//     bpin: number;
//     code: string;
//     cname: string;
//     collectedAmount: number;
//     contact: string;
//     country: string;
//     createdDate: number;
//     customerDate: Date;
//     date: any;
//     days: number;
//     daysRange: string;
//     district: string;
//     email: string;
//     fname1: string;
//     gst: number;
//     leadDate: Date;
//     month: number;
//     opportunityDate: Date;
//     prospectDate: Date;
//     saleOngoingValue: number;
//     salePipelineValue: number;
//     year: number;
//     pan: string;
//     priority: string;
//     rejectionDate: string;
//     salutation: string;
//     sname: string;
//     state: string;
//     status: string;
//     unConfirmedSales: number;
//     ongoingSales: number;
//     amountToBeCollected: number;
//     taskOpen: number;
//     lifeTimeValue: number;
//     totalAmountCollected: number;
//     invoicedAmount:number;
//     isCompany:boolean;
//     field1:any;
//     field2:any;
//     field3:any;
//     field4:any;
//     custField1:any;
//     custField2:any;
//     custField3:any;
//     custField4:any;
//     custCategory1:any;
//     custCategory2:any;
//     custCategory1Title:any;
//     custCategory2Title:any;
//     custField1Title:any;
//     custField2Title:any;
//     custField3Title:any;
//     custField4Title:any;
 

// }
// export interface CustomersImport {
   

//     assigned: string;
//     billingaddress1: string;
//     billingaddress2: string;
//     bpin: number;
//     code: string;
//     cname: string;
//     collectedAmount: number;
//     contact: string;
//     country: string;
//     createdDate: number;
//     customerDate: Date;
//     date: any;
//     days: number;
//     daysRange: string;
//     district: string;
//     email: string;
//     fname1: string;
//     gst: number;
//     leadDate: Date;
//     month: number;
//     opportunityDate: Date;
//     prospectDate: Date;
//     saleOngoingValue: number;
//     salePipelineValue: number;
//     year: number;
//     pan: string;
//     priority: string;
//     rejectionDate: string;
//     salutation: string;
//     sname: string;
//     state: string;
//     status: string;
//     unConfirmedSales: number;
//     ongoingSales: number;
//     amountToBeCollected: number;
//     taskOpen: number;
//     lifeTimeValue: number;
//     totalAmountCollected: number;
//     invoicedAmount:number;
//     isCompany:boolean;
//     field1:any;
//     field2:any;
//     field3:any;
//     field4:any;
//     custField1:any;
//     custField2:any;
//     custField3:any;
//     custField4:any;
//     custCategory1:any;
//     custCategory2:any;
//     custCategory1Name:any;
//     custCategory2Name:any;
//     custField1Name:any;
//     custField2Name:any;
//     custField3Name:any;
//     custField4Name:any;
 
// }
// export class SalesDetailsArray{
//     constructor( public title:string,
//         public cname:string,public createdDate:any,
//         public salesStage:string,public estimatedValue:number,
//         public startDate:any,public expCompletionDate:any){
       

//     }
// }
// export class SalesDetails {
//     id: string;
//     assignedTo: string
//     customerId: string;
//     cname: string;
//     collectedAmount: number;
//     completedSaleDate: any;
//     confirmedSaleDate: any;
//     opportunityDate: any;
//     inquiryDate: any;
//     createdDate: any;
//     expCompletionDate: any;
//     estimatedValue: number;
//     fname1: string;
  
//     description: string;
//     title: string;
//     invoicedAmount: number;
//     salesStage: string;
//     saleType: string;
//     lostDate: any;
  
//     payment: string;
//     priority: string;
//     startDate: any;
//     days: number;
//     daysRange: string;
//     saleCategory2Title: any;
//     saleCategory2: any;
//     saleCategory1Title: any;
//     saleCategory1: any;
// }
// export interface Profile {
//     Name: string
// }
// export interface ImageListItem {
//     src: string;
//     caption: string;
// }

// export class Notifications {
//     id: string;
//     date: any;
//     source: string;
//     description: string;
//     read: string;
//     route: string;
// }
// export class PaymentReceipt {
//     public id: string;
//     amount: number;
//     customerCompany: string;
//     customerId: string;
//     customerName: string;
//     invoiceno: string;
//     invoiceDate: any;
//     invoiceAmount: number;
//     paymentdate: any;
//     paymentmode: string;
//     pendingamount: number;
//     prevCustomerAmount: number;
//     prevInvoiceAmount: number;
//     prevSaleAmount: number;
//     saleTitle: string;
//     saleid: string;
// }


// export class Task {


//     public title: string;
//     public description: string;
//     public assignedTo: string;
//     public dueDate: Date;
//     public startDate: Date;
//     public priority: string;
//     public status: string;
//     public id: string;
//     public company: string;
//     public name: string;
//     public customerId: string;
//     public dateCreated:any;

// }


// export class DocumentModal {
//     id: string;
//     idstate: string;
//     collectedAmount: any;
//     customerData: {
//         addressline1: string;
//         addressline2: string;
//         companyName: string;
//         country: string;
//         custID: string;
//         district: string;
//         gst: string;
//         pinCode: number;
//         state: string;
//         fname1: string;

//     }
//     docData: {
//         bankDetails: string;
//         cessValue: number;
//         cgstValue: number;
//         currency: string;
//         docDate: any;
//         docNumber: number;
//         docTitle: string;
//         docType: string;
//         docValidity: string;
//         dueDate: Date;
//         igstValue: number;
//         includeCess: boolean;
//         includeTax: boolean;
//         interState: boolean;
//         notes: string;
//         paymentTerms: string;
//         poRef: string;
//         quoteRef: string;
//         saleID: string;
//         sgstValue: number;
//         total: number;
//         totalInclTax: number;
//     }
//     itemList: [
//         {
//             amount: number;
//             amountInclTax: number;
//             cessAmount: number;
//             cessRate: number;
//             cgstAmount: number;
//             cgstRate: number;
//             description: string;
//             igstAmount: number;
//             igstRate: number;
//             item: string;
//             qty: number;
//             rate: number;
//             sgstAmount: number;
//             sgstRate: number;
//             slno: number;
//         }
//     ]
//     userData: {
//         addressline1: string;
//         adrressline2: string;
//         companyName: string;
//         country: string;
//         designation: string;
//         district: string;
//         gst: string;
//         logo: string;
//         pinCode: string;
//         signatoryName: string;
//         signature: string;
//         state: string;
//     }
// }

// //Userdata model used in documents such as invoices/ quotes etc
// export interface UserData {
//     logo: File,
//     signature: File,
//     signatoryName: string,
//     designation: string,
//     state: string,
//     addressline1: string,
//     addressline2: string,
//     district: string,
//     gst: string,
//     companyName: string,
//     pinCode: string,
//     country: string,

// }

// //Customer data model used in documents such as invoices/ quotes etc
// export interface CustomerData {
//     pinCode: string,
//     district: string,
//     state: string,
//     country: string,
//     gst: string,
//     companyName: string,
//     addressline1: string,
//     addressline2: string,
//     custID: string,

// }
// //docuemntdata model used in documents such as invoices/ quotes etc
// export interface DocData {
//     docDate: string,
//     dueDate: string,
//     sgstValue: number,
//     cgstValue: number,
//     igstValue: number,
//     cessValue: number,
//     total: number,
//     docNumber: string,
//     quoteRef: string,
//     totalInclTax: number,
//     poRef: string,
//     paymentTerm: string,
//     docType: string,
//     bankDetails: string,
//     notes: string,
//     currency: string,
//     includeTax: boolean,
//     includeCess: boolean,
//     interState: boolean,
//     docTitle: string,
//     docValidity: string,
//     saleID: string
// }

// //Line item data model used in documents such as invoices/ quotes etc
// export interface LineItemData {
//     slno: number,
//     item: string,
//     qty: number,
//     rate: number,
//     sgstRate: number,
//     sgstAmount: number,
//     cgstRate: number,
//     cgstAmount: number,
//     igstRate: number,
//     igstAmount: number,
//     cessRate: number,
//     cessAmount: number,
//     amount: number,
//     amountInclTax: number,
//     description: string
// }


// //for followup table
// export interface FollowUpsList {

//     id: string,
//     customerName: string,
//     companyName: string,
//     dateCreated: string,
//     date: any,
//     time: string,
//     completed: string,
//     assignedTo: string,
//     customerId: string,
//     notes: string,
//     updated: boolean;
// }

// export class Sales {
//     constructor(
//         public id: string,
//         public salesStage: string,
//         public salesType: string,
//         public payment: string,
//         public customerId: string,
//         public startDate: Date,
//         public EstimatedValue: number,
//         public ExpCompletionDate: Date,
//         public collectedAmount: number,
//         public invoicedAmount: number,
//     ) { }
// }
// export class InvoiceAmount {
//     constructor(
//         public id: string,
//         public docDate: any,
//         public totalInclTax: number

//     ) {
//     }
// }
// export class InvAmount {
//     public id: string;
//     public docData: any;
// }
// export class CustomerssS {
//     id: string;
//     assigned: string;
//     billingaddress1: string;
//     billingaddress2: string;
//     bpin: number;
//     cname: string;
//     contact: number;
//     country: string;
//     date: number;
//     email: string;
//     fname1: string;
//     gst: number;
//     pan: string;
//     priority: string;
//     salutation: string;
//     sname: string;
//     state: string;
//     status: string;
// }
// export class Documentscustomers {
//     id: string;
//     id1: string;
//     total: number;
//     bname: string;
//     cessvalue: number;
//     doctype: string;
//     duedate: string;
//     fgst: number;
//     igstvalue: number;
//     invoiceno: string;
//     time: number;
//     alltotal: number;
//     paymentterm: string;
//     cname: string;
//     fname1: string;
//     contact: string;
//     gst: number;

// }
// export class PaymentAmount {
//     constructor(
//         public id: string,
//         public amount: number,
//         public paymentdate: string

//     ) {
//     }
// }
// export class QuotationData {
//     id: string;
//     customerData: any;
//     docData: any;

// }
// export class InvoiceData {
//     id: string;
//     customerData: any;
//     docData: any;

// }
// export class InvoiceDatas {

//     constructor(

//         public docNumber: string,
//         public companyName: string,
//         public salutation: string,
//         public fname1: string,
//         public sname: string,
//         public docDate: string,

//         public totalInclTax: string,


//     ) {

//     }
// }
// export class PrintDatas {

//     constructor(

//         public docNumber: string,
//         public companyName: string,
//         public docDate: string,
//         public cgstValue: number,
//         public igstValue: number,
//         public cessValue: number,
//         public totalInclTax: string,


//     ) {

//     }
// }
// export class QuotationDatas {

//     constructor(

//         public docNumber: string,
//         public companyName: string,
//         public salutation: string,
//         public fname1: string,
//         public sname: string,
//         public docDate: string,
//         public totalInclTax: string,
//         public saleID: string,
//         public custID: string) {

//     }
// }
// export class FollowUps {
//     id: string;
//     date: Date;
//     time: Time;
//     notes: string;
//     assignedTo: string
// }
// export class CustomerLastData {

//     constructor(

//         public id: string,
//         public cname: string,
//         public salutation: string,
//         public fname1: string,
//         public sname: string
//     ) {

//     }
// }


// export class LeadInfo {
//     constructor(
//         public id: string,
//         public noPurchases: number,
//         public pointsEarned: number
//     ) {
//     }
// }
// export class FollowsUp {
//     date: Date;
//     time: Time;
//     notes: string;
//     assignedTo: string

// }
// export class CustomerArray {
//     constructor(
//         public id: string,
//         public cname: string,
//         public salutation: string,
//         public fname1: string,
//         public sname: string,
//     ) { }
// }
// //Temporary model for temporary 'users' collection created
// export class Profileusers {
//     id: any;
//     firstname: string;
//     category: string;
//     location: string;
// }

// export class PurchasedLeads {
//     id: any;
//     leadId: string;
//     purchasedDate: Date;
//     purchaseValue: number;
//     leadSharedRating: number;
//     invalidContactFlag: boolean;
//     invalidReqFlag: boolean;
//     reqMetFlag: boolean;
//     saleId: string;
//     contactId: string;
//     title: string;
//     description: string;
//     leadName: string;
//     leadContactNo: string;
//     leadEmail: string;

// }
// export class Documentscustomerss {
//     id: string;
//     id1: string;
//     total: number;
//     bname: string;
//     cessvalue: number;
//     doctype: string;
//     duedate: string;
//     fgst: number;
//     igstvalue: number;
//     invoiceno: string;
//     time: number;
//     alltotal: number;
//     paymentterm: string;
//     cname: string;
//     fname1: string;
//     contact: string;
// }

// export interface CustomerNotes {
//     createdById: string;//user ID of the user who has created the note
//     cratedByName: string;// name of the user wo has created the note
//     createdDate: Date;//Date and time at which the note was created;
//     note: string;//Note submitted
//     id: string;

// }

// export class Month {
//     constructor(
//         public jan: number = 0,
//         public feb: number = 0,
//         public mar: number = 0,
//         public apr: number = 0,
//         public may: number = 0,
//         public jun: number = 0,
//         public jul: number = 0,
//         public aug: number = 0,
//         public sep: number = 0,
//         public oct: number = 0,
//         public nov: number = 0,
//         public dec: number = 0
//     ) { }
// }


// // this.dataArray.custCategory2=tarr[k]
// // this.dataArray.custCategory1=tarr[k++]
// // this.dataArray.custField4=tarr[k++]
// // this.dataArray.custField3=tarr[k++]
// // this.dataArray.custField2=tarr[k++]
// // this.dataArray.custField1=tarr[k++]
// // this.dataArray.priority=tarr[k++]
// // this.dataArray.status=tarr[k++]
// // this.dataArray.gst=tarr[k++]
// // this.dataArray.assigned=tarr[k++]
// // this.dataArray.email=tarr[k++]
// // this.dataArray.contact=tarr[k++]
// // this.dataArray.code=tarr[k++]
// // this.dataArray.country=tarr[k++]
// // this.dataArray.state=tarr[k++]
// // this.dataArray.district=tarr[k++]
// // this.dataArray.billingaddress2=tarr[k++]
// // this.dataArray.billingaddress1=tarr[k++]
// // this.dataArray.cname=tarr[k++]
// // this.dataArray.sname=tarr[k++]
// // this.dataArray.fname1=tarr[k++]
// // this.dataArray.salutation=tarr[k++]
