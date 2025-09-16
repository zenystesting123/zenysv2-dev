/*------------------------------------------------
Description : For handle bill to field display
input: custID,orgID,saleID,customerData
----------------------------------------------------*/
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { getCountryCodes } from 'src/app/countryCode';
import { CustomerData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-bill-to-quote',
  templateUrl: './bill-to-quote.component.html',
  styleUrls: ['./bill-to-quote.component.scss']
})
export class BillToQuoteComponent implements OnInit, OnDestroy {
   //here customerData are taken via input because any changes are not allowed while editing the doc ...(eg:if customer details edited the bill to part will reset)
  @Input() orgID: string;
  @Input() custID: string;
  @Input() saleID: string;
  @Input() customerData: CustomerData;
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts

  customerDetailsSubscription: Subscription;
  orgDetailsSubscription: Subscription;
  saleDetailsSubscription: Subscription;
  constructor(public quotationService: QuotationService, public dialog: MatDialog) {}
  get form(): FormGroup {
    return this.quotationService.billToForm;
  }
  ngOnInit(): void {
    if (this.quotationService.scenario == 'create') {
      //get customer sale and org details based on its id
      if (this.custID) {
        this.quotationService.quotation.customerData.custID = this.custID;
        this.getCustomerDetails(this.custID)
      }

      if (this.orgID) {
        this.quotationService.quotation.customerData.orgID = this.orgID;
        this.getOrgDetails(this.orgID)
      }

      if (this.saleID) {
        this.quotationService.quotation.docData.saleID = this.saleID;
        this.getSaleDetails(this.saleID)
      }
    } else {
      // bind details on edit
      this.quotationService.quotation.customerData.custID = this.customerData?.custID ? this.customerData?.custID : null
      this.quotationService.quotation.customerData.orgID = this.customerData?.orgID ? this.customerData?.orgID : null
      this.quotationService.quotation.customerData.contactAssignedToOwner = this.customerData?.contactAssignedToOwner ? this.customerData?.contactAssignedToOwner : null
      this.quotationService.quotation.customerData.companyName = this.customerData.companyName ? this.customerData.companyName : null,
        this.quotationService.quotation.customerData.fname1 = this.customerData.fname1,
        this.quotationService.quotation.customerData.sname = this.customerData.sname ? this.customerData.sname : null,
        this.quotationService.quotation.customerData.surname = this.customerData.surname ? this.customerData.surname : null,
        this.quotationService.quotation.customerData.addressline1 = this.customerData.addressline1,
        this.quotationService.quotation.customerData.addressline2 = this.customerData.addressline2,
        this.quotationService.quotation.customerData.district = this.customerData.district,
        this.quotationService.quotation.customerData.pinCode = this.customerData.pinCode,
        this.quotationService.quotation.customerData.state = this.customerData.state,
        this.quotationService.quotation.customerData.country = this.customerData.country,
        this.quotationService.quotation.customerData.countryCode = this.customerData.countryCode ? this.customerData.countryCode : null,
        this.quotationService.quotation.customerData.contactNumber = this.customerData.contactNumber ? this.customerData.contactNumber : null,
        this.quotationService.quotation.customerData.email = this.customerData.email ? this.customerData.email : null,
        this.quotationService.quotation.customerData.gst = this.customerData.gst ? this.customerData.gst : null

      this.form.patchValue({
        billToCompanyName: this.customerData.companyName ? this.customerData.companyName : null,
        billToFname1: this.customerData.fname1,
        billToSname: this.customerData.sname ? this.customerData.sname : null,
        billToSurname: this.customerData.surname ? this.customerData.surname : null,
        billToAddressline1: this.customerData.addressline1,
        billToAddressline2: this.customerData.addressline2,
        billToDistrict: this.customerData.district,
        billToPinCode: this.customerData.pinCode,
        billToState: this.customerData.state,
        billToCountry: this.customerData.country,
        billToCountryCode: this.customerData.countryCode ? this.customerData.countryCode : null,
        billToContactNumber: this.customerData.contactNumber ? this.customerData.contactNumber : null,
        billToEmail: this.customerData.email ? this.customerData.email : null,
        billToGst: this.customerData.gst ? this.customerData.gst : null
      })
      //get form details before change
      this.quotationService.prevBillToForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
    // for showing the search icon
    if (!this.quotationService.quotation.customerData.custID || !this.quotationService.quotation.customerData.orgID
      || !this.quotationService.quotation.docData.saleID) {
      this.form.patchValue({
        showTags: true
      })
    } else {
      this.form.patchValue({
        showTags: false
      })
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.customerDetailsSubscription?.unsubscribe();
    this.orgDetailsSubscription?.unsubscribe();
    this.saleDetailsSubscription?.unsubscribe();
  }
  // gets customer details and bind data
  getCustomerDetails(custId: string) {
    this.customerDetailsSubscription = this.quotationService.getCustomerDetails(custId)
      .subscribe((data) => {
        this.quotationService.billToForm.patchValue({
          billToCompanyName: data.companyName ? data.companyName : null,
          billToFname1: data.firstName,
          billToSname: data.secondName ? data.secondName : null,
          billToSurname: data.surname ? data.surname : null,
        })
        this.quotationService.billToForm.get('billToCompanyName').markAsDirty();
        this.quotationService.billToForm.get('billToFname1').markAsDirty();
        this.quotationService.billToForm.get('billToSname').markAsDirty();
        this.quotationService.billToForm.get('billToSurname').markAsDirty();

        this.quotationService.quotation.customerData.contactAssignedToOwner = data.assignedTo;
        if (this.orgID == null) {
          // if org id not exits bind contact address
          this.quotationService.billToFormPatchValueForAddress(data)
        } else {
        }
      })
  }
   // gets org details and bind data
  getOrgDetails(orgID) {
    this.orgDetailsSubscription = this.quotationService.getOrgDetails(orgID).subscribe((data) => {
      this.quotationService.billToFormPatchValueForAddress(data)
    })
  }
  // gets sale details and bind data
  getSaleDetails(saleId) {
    this.saleDetailsSubscription = this.quotationService.getSaleDetails(saleId).subscribe((data) => {
      this.quotationService.quotation.docData.saleAssignedToOwner = data.assignedTo;
      this.quotationService.quotation.docData.saleTitle = data.saleTitle;
      if (data.itemsArray != undefined) {
        let items: any[] = Object.values(data.itemsArray);
        if (items.length > 0) {
           // if items length grater than 0 bind sale item in table
          this.quotationService.updateItem(items)
        }
      }
    })
  }
  orgSelect(data) {
     //if org is slected bind orgid and billing address
    if (data[0]?.id) {
      this.quotationService.quotation.customerData.orgID = data[0].id
      this.quotationService.billToFormPatchValueForAddress(data[0])
    } else {
       //reset billing addres if orgid is not there
      this.quotationService.quotation.customerData.orgID = null
      this.quotationService.billToFormPatchEmptyValueForAddress()
    }
  }
  customerSelect(data) {
    //if customer is slected bind custid and billing address
    if (data[0]?.id) {
      this.quotationService.quotation.customerData.custID = data[0].id
      this.quotationService.billToForm.patchValue({
        billToFname1: data[0].firstName,
        billToSname: data[0].secondName ? data[0].secondName : null,
        billToSurname: data[0].surname ? data[0].surname : null,
      })
      this.quotationService.billToForm.get('billToFname1').markAsDirty();
      this.quotationService.billToForm.get('billToSname').markAsDirty();
      this.quotationService.billToForm.get('billToSurname').markAsDirty();
      this.quotationService.quotation.customerData.contactAssignedToOwner = data[0].assignedTo;
      if (this.quotationService.quotation.customerData.orgID == null) {
         //reset billing addres if orgid is not there
        this.quotationService.billToFormPatchValueForAddress(data[0])
      } else {

      }
    } else {
      this.quotationService.quotation.customerData.custID = null
      this.quotationService.billToForm.patchValue({
        billToFname1: '',
        billToSname: '',
        billToSurname: '',
      })
      this.quotationService.billToForm.get('billToFname1').markAsDirty();
      this.quotationService.billToForm.get('billToSname').markAsDirty();
      this.quotationService.billToForm.get('billToSurname').markAsDirty();
      this.quotationService.quotation.customerData.contactAssignedToOwner = null;
      if (this.quotationService.quotation.customerData.orgID == null) {
         //reset billing addres if orgid is not there
        this.quotationService.billToFormPatchEmptyValueForAddress()
      } else {

      }
      this.quotationService.quotation.docData.saleID = null;
      this.quotationService.quotation.docData.saleAssignedToOwner = null;
      this.quotationService.quotation.docData.saleTitle = null;
      this.quotationService.document.itemList = [this.quotationService.createEmptyProduct()]
      this.quotationService.quotation.itemList = [{
        amount: 0,
        amountInclTax: 0,
        cessAmount: 0,
        cessRate: 0,
        cgstAmount: 0,
        cgstRate: 0,
        description: null,
        discountAmount: 0,
        discountRate: 0,
        discountedAmount: 0,
        hsnCode: null,
        igstAmount: 0,
        igstRate: 0,
        item: null,
        qty: 0,
        rate: 0,
        sgstAmount: 0,
        sgstRate: 0,
        slno: 0,
        unit: null,
        vatAmount: 0,
        vatRate: 0,
      }]
      this.quotationService.updateValues();
    }
  }
  saleSelect(data) {
     //if sale is slected bind saleID,saleTitle and saleTitle and add items
    if (data[0]?.id) {
      this.quotationService.quotation.docData.saleID = data[0].id;
      this.quotationService.quotation.docData.saleAssignedToOwner = data[0].assignedTo;
      this.quotationService.quotation.docData.saleTitle = data[0].saleTitle;
      //added saleTitle to changelog
      this.quotationService.prevBillToForm?.addControl('saleTitle', new FormControl(null));
      this.quotationService.billToForm?.addControl('saleTitle', new FormControl(data[0].saleTitle));
      this.quotationService.billToForm?.get('saleTitle').markAsDirty();
      if (data[0].itemsArray != undefined) {
        let items: any[] = Object.values(data[0].itemsArray);
        if (items.length > 0) {
          // if items length grater than 0 bind sale item in table
          this.quotationService.updateItem(items)
        }
      }
    } else {
      //if sale is not slected reset saleID,saleTitle and saleTitle and add items
      this.quotationService.quotation.docData.saleID = null;
      this.quotationService.quotation.docData.saleAssignedToOwner = null;
      this.quotationService.quotation.docData.saleTitle = null;
      this.quotationService.document.itemList.forEach((element, index) => {
        this.quotationService.itemList?.removeAt(index)
      });
      this.quotationService.document.itemList = [this.quotationService.createEmptyProduct()]
      this.quotationService.quotation.itemList = [{
        amount: 0,
        amountInclTax: 0,
        cessAmount: 0,
        cessRate: 0,
        cgstAmount: 0,
        cgstRate: 0,
        description: null,
        discountAmount: 0,
        discountRate: 0,
        discountedAmount: 0,
        hsnCode: null,
        igstAmount: 0,
        igstRate: 0,
        item: null,
        qty: 0,
        rate: 0,
        sgstAmount: 0,
        sgstRate: 0,
        slno: 0,
        unit: null,
        vatAmount: 0,
        vatRate: 0,
      }]
        // used to update item summary
      this.quotationService.updateValues();
    }
  }
}
