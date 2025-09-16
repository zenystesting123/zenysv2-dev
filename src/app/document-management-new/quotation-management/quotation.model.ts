

export class ProductSummaryUiData {
    constructor(
        public currency: string,
        public total: string,
        public discountTotal: string,
        public totalAfterDiscount: string,
        public cgstTotal: string,
        public sgstTotal: string,
        public cessTotal: string,
        public vatTotal: string,
        public igstTotal: string,
        public totalIncludingTax: string,
        public totalAmountDiscounted: string,

        public showDiscountTotal: boolean,
        public showTotalAfterDiscount: boolean,
        public showCgstTotal: boolean,
        public showSgstTotal: boolean,
        public showCessTotal: boolean,
        public showVatTotal: boolean,
        public showIgstTotal: boolean,
        public showTotalIncludingTax: boolean,
    ) { }
}

export class Document {
    billingAmountDetails: BillingAmountDetails;
    itemList: ItemList[];
    summaryData: SummaryData;
}
export class BillingAmountDetails {
    constructor(
        public currency: string,
        public includeCess: boolean,
        public includeUnit: boolean,
        public includeTax: boolean,
        public interState: boolean,
        public includeDiscount: boolean,
        public taxType: string,
    ) { }


}
export class ItemList {
    constructor(
        public totalProductRate: number,
        public amountInclTax: number,
        public cessAmount: number,
        public cessPercentage: number,
        public cgstAmount: number,
        public cgstPercentage: number,
        public vatPercentage: number,
        public vatAmount: number,
        public description: string,
        public igstAmount: number,
        public igstPercentage: number,
        public item: string,
        public qty: number,
        public unit: string,
        public rate: number,
        public sgstAmount: number,
        public sgstPercentage: number,
        public slno: number,
        public hsnCode: string,
        public discountPercentage: number,
        public rateAfterDiscount: number,
        public amountDiscounted: number
    ) {

    }

}
export class SummaryData {
    constructor(
        public currency: string,
        public cessValue: number,
        public cgstValue: number,
        public vatValue: number,
        public igstValue: number,
        public sgstValue: number,
        public total: number,
        public totalAfterDiscount: number,
        public totalInclTax: number,
        public totalAmountDiscounted: number
    ) { }

}

export class SignatureAndAdditionalDetails {
    constructor(
        public notes: string,
        public bankDetails: string,
        public signature: string,
        public showSignature: boolean,
        public signatoryName: string,
        public designation: string,
        public contactname: string,
        public contactno: string,
        public email: string,

    ) { }
}
export class BillFrom {
    constructor(
        public companyName: string,
        public contactname: string,
        // public secondName: string,
        public addressline1: string,
        public addressline2: string,
        public city: string,
        public pinCode: string,
        public state: string,
        public country: string,
        public gst: string
    ) { }
}
export class Quotation {
    additionalFieldsArr: any;
    createdBy: string;
    sharedDocId: string;
    customerData: CustomerData;
    docData: DocumentData;
    itemList: ItemsList[];
    searchTerm: SearchTearm;
    userData: userData;
    // billFrom: BillFrom
}
export class CustomerData {
    constructor(
        public addressline1: string,
        public addressline2: string,
        public companyName: string,
        public contactNumber: string,
        public country: string,
        public countryCode: string,
        public custID: string,
        public contactAssignedToOwner: string,
        public orgID: string,
        public district: string,
        public email: string,
        public fname1: string,
        public gst: string,
        public isDeliveryAddressPresent: boolean,
        public pinCode: string,
        public sname: string,
        public state: string,
        public surname: string,
        public deliveryAddressline1: string,
        public deliveryAddressline2: string,
        public deliveryContactName: string,
        public deliveryContactNumber: string,
        public deliverycountryCode:string,
        public deliveryCountry: string,
        public deliveryDistrict: string,
        public deliveryPinCode: string,
        public deliveryState: string,
        public deliveryCompanyName: string,
        public deliveryEmail: string,


    ) { }
}
export class DocumentData {
    constructor(
        public bankDetails: string,
        public cancel: boolean,
        public cessValue: number,
        public cgstValue: number,
        public createdDate: number,
        public currency: string,
        public discountValue: number,
        public discountedAmount: number,
        public docDate: any,
        public docNumber: string,
        public docPrefix: string,
        public docTitle: string,
        public docType: string,
        public docValidity: any,
        public igstValue: number,
        public includeCess: boolean,
        public includeDiscount: boolean,
        public includeTax: boolean,
        public includeUnit: boolean,
        public interState: boolean,
        public notes: string,
        public prefixAndDocNumber: string,
        public saleAssignedToOwner: string,
        public saleID: string,
        public saleTitle: string,
        public sgstValue: number,
        public statusApproved: boolean,
        public taxType: string,
        public total: number,
        public totalInclTax: number,
        public vatValue: number,
        public gstStateCode: string,
        public gstPlaceOfSupplyCode: string,
        public estRef: string,
    ) { }
}
export class ItemsList {
    constructor(
        public amount: number,
        public amountInclTax: number,
        public cessAmount: number,
        public cessRate: number,
        public cgstAmount: number,
        public cgstRate: number,
        public description: string,
        public discountAmount: number,
        public discountRate: number,
        public discountedAmount: number,
        public hsnCode: string,
        public igstAmount: number,
        public igstRate: number,
        public item: string,
        public qty: number,
        public rate: number,
        public sgstAmount: number,
        public sgstRate: number,
        public slno: number,
        public unit: string,
        public vatAmount: number,
        public vatRate: number,

    ) { }
}
export class SearchTearm {
    constructor(
        public companyName: string,
        public firstName: string,
        public secondName: string,
        public surname: string,

    ) { }
}
export class userData {
    constructor(
        public addressline1: string,
        public addressline2: string,
        public city: string,
        public companyName: string,
        public contactname: string,
        public contactno: string,
        public country: string,
        public designation: string,
        public email: string,
        public gst: string,
        public pinCode: string,
        // public secondName: string,
        public signatoryName: string,
        public state: string,
    ) { }
}
