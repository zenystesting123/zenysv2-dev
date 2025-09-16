export class Toolbar{
    constructor(
       public documentTypeFeildName:string,
       public prefixAndDocNumber:string,
       public fieldNameQuotation:string,
       public fieldNameInvoice:string,
       public statusApproved:boolean,
       public createQuotation:boolean,
       public createInvoice:boolean,
       public sendPaymentLink:boolean,
       public shareDocument:boolean,
       public shared:boolean,
       public cancelStatus:boolean,
       public disableDownload:boolean,
       public disablCreateQuo:boolean,
       public disableCreateInvoice:boolean,
       public disableEdit:boolean,
       public disableSendPaymentLink:boolean,
       public disableShareDocument:boolean,
       public disableShared:boolean,
       public disableCancelStatus:boolean,

    ){}
   
}