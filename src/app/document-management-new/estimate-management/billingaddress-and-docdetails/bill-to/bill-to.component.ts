/*------------------------------------------------
Description : For handle bill to field display
input: custID,orgID,saleID,customerData
----------------------------------------------------*/
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { getCountryCodes } from 'src/app/countryCode';
import { CustomerData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { EstimateManagementComponent } from '../../estimate-management.component';

@Component({
  selector: 'app-bill-to',
  templateUrl: './bill-to.component.html',
  styleUrls: ['./bill-to.component.scss']
})
export class BillToComponent implements OnInit, OnDestroy {
  //here customerData are taken via input because any changes are not allowed while editing the doc ...(eg:if customer details edited the bill to part will reset)
  @Input() orgID: string;
  @Input() custID: string;
  @Input() saleID: string;
  @Input() customerData: CustomerData;
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  customerDetailsSubscription: Subscription;
  orgDetailsSubscription: Subscription;
  saleDetailsSubscription: Subscription;
  constructor(public estimateService: EstimateService, public dialog: MatDialog) {}
  get form(): FormGroup {
    return this.estimateService.billToForm;
  }
  ngOnInit(): void {
    if (this.estimateService.scenario == 'create') {
      //get customer sale and org details based on its id
      if (this.custID) {
        this.estimateService.estimate.customerData.custID = this.custID;
        this.getCustomerDetails(this.custID)
      }
      if (this.orgID) {
        this.estimateService.estimate.customerData.orgID = this.orgID;
        this.getOrgDetails(this.orgID)
      }
      if (this.saleID) {
        this.estimateService.estimate.docData.saleID = this.saleID;
        this.getSaleDetails(this.saleID)
      }
    }
    else {
      // bind details on edit
      this.estimateService.estimate.customerData.custID = this.customerData?.custID ? this.customerData?.custID : null
      this.estimateService.estimate.customerData.orgID = this.customerData?.orgID ? this.customerData?.orgID : null
      this.estimateService.estimate.customerData.contactAssignedToOwner = this.customerData?.contactAssignedToOwner ? this.customerData?.contactAssignedToOwner : null
      this.estimateService.estimate.customerData.companyName = this.customerData.companyName ? this.customerData.companyName : null,
        this.estimateService.estimate.customerData.fname1 = this.customerData.fname1,
        this.estimateService.estimate.customerData.sname = this.customerData.sname ? this.customerData.sname : null,
        this.estimateService.estimate.customerData.surname = this.customerData.surname ? this.customerData.surname : null,
        this.estimateService.estimate.customerData.addressline1 = this.customerData.addressline1,
        this.estimateService.estimate.customerData.addressline2 = this.customerData.addressline2,
        this.estimateService.estimate.customerData.district = this.customerData.district,
        this.estimateService.estimate.customerData.pinCode = this.customerData.pinCode,
        this.estimateService.estimate.customerData.state = this.customerData.state,
        this.estimateService.estimate.customerData.country = this.customerData.country,
        this.estimateService.estimate.customerData.countryCode = this.customerData.countryCode ? this.customerData.countryCode : null,
        this.estimateService.estimate.customerData.contactNumber = this.customerData.contactNumber ? this.customerData.contactNumber : null,
        this.estimateService.estimate.customerData.email = this.customerData.email ? this.customerData.email : null,
        this.estimateService.estimate.customerData.gst = this.customerData.gst ? this.customerData.gst : null

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
      //get form values before change
      this.estimateService.prevBillToForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
    // for showing the search icon
    if (!this.estimateService.estimate.customerData.custID || !this.estimateService.estimate.customerData.orgID
      || !this.estimateService.estimate.docData.saleID) {
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
    this.customerDetailsSubscription = this.estimateService.getCustomerDetails(custId)
      .subscribe((data) => {
        this.estimateService.billToForm.patchValue({
          billToCompanyName: data.companyName ? data.companyName : null,
          billToFname1: data.firstName,
          billToSname: data.secondName ? data.secondName : null,
          billToSurname: data.surname ? data.surname : null,
        })
        this.estimateService.billToForm.get('billToCompanyName').markAsDirty();
        this.estimateService.billToForm.get('billToFname1').markAsDirty();
        this.estimateService.billToForm.get('billToSname').markAsDirty();
        this.estimateService.billToForm.get('billToSurname').markAsDirty();

        this.estimateService.estimate.customerData.contactAssignedToOwner = data.assignedTo;
        if (this.orgID == null) {
           // if org id not exits bind contact address
          this.estimateService.billToFormPatchValueForAddress(data)
        } else {
        }
      })
  }
   // gets org details and bind data
  getOrgDetails(orgID) {
    this.orgDetailsSubscription = this.estimateService.getOrgDetails(orgID).subscribe((data) => {
      this.estimateService.billToFormPatchValueForAddress(data)
    })
  }
  // gets sale details and bind data
  getSaleDetails(saleId) {
    this.saleDetailsSubscription = this.estimateService.getSaleDetails(saleId).subscribe((data) => {
      this.estimateService.estimate.docData.saleAssignedToOwner = data.assignedTo;
      this.estimateService.estimate.docData.saleTitle = data.saleTitle;
      if (data.itemsArray != undefined) {
        let items: any[] = Object.values(data.itemsArray);
        if (items.length > 0) {
          // if items length grater than 0 bind sale item in table
          this.estimateService.updateItem(items)
        }
      }
    })
  }
  orgSelect(data) {
     //if org is slected bind orgid and billing address
    if (data[0]?.id) {
      this.estimateService.estimate.customerData.orgID = data[0].id
      this.estimateService.billToFormPatchValueForAddress(data[0])
      
    } else {
       //reset billing addres if orgid is not there
      this.estimateService.estimate.customerData.orgID = null
      this.estimateService.billToFormPatchEmptyValueForAddress()
      
    }

  }
  customerSelect(data) {
    //if customer is slected bind custid and billing address
    if (data[0]?.id) {
      this.estimateService.estimate.customerData.custID = data[0].id
      this.estimateService.billToForm.patchValue({
        billToFname1: data[0].firstName,
        billToSname: data[0].secondName ? data[0].secondName : null,
        billToSurname: data[0].surname ? data[0].surname : null,
      })
      this.estimateService.billToForm.get('billToFname1').markAsDirty();
      this.estimateService.billToForm.get('billToSname').markAsDirty();
      this.estimateService.billToForm.get('billToSurname').markAsDirty();

      this.estimateService.estimate.customerData.contactAssignedToOwner = data[0].assignedTo;
      if (this.estimateService.estimate.customerData.orgID == null) {
        this.estimateService.billToFormPatchValueForAddress(data[0])

      } else {

      }
    } else {
      this.estimateService.estimate.customerData.custID = null
      this.estimateService.billToForm.patchValue({
        billToFname1: '',
        billToSname: '',
        billToSurname: '',
      })
      this.estimateService.billToForm.get('billToFname1').markAsDirty();
      this.estimateService.billToForm.get('billToSname').markAsDirty();
      this.estimateService.billToForm.get('billToSurname').markAsDirty();
      this.estimateService.estimate.customerData.contactAssignedToOwner = null;
      if (this.estimateService.estimate.customerData.orgID == null) {
         //reset billing addres if orgid is not there
        this.estimateService.billToFormPatchEmptyValueForAddress()
      } else {

      }
        this.estimateService.estimate.docData.saleID = null;
        this.estimateService.estimate.docData.saleAssignedToOwner = null;
        this.estimateService.estimate.docData.saleTitle = null;
        this.estimateService.document.itemList = [this.estimateService.createEmptyProduct()]
        this.estimateService.estimate.itemList = [{
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
        this.estimateService.updateValues();
    }
  }
  saleSelect(data) {
     //if sale is slected bind saleID,saleTitle and saleTitle and add items
    if (data[0]?.id) {
      this.estimateService.estimate.docData.saleID = data[0].id;
      this.estimateService.estimate.docData.saleAssignedToOwner = data[0].assignedTo;
      this.estimateService.estimate.docData.saleTitle = data[0].saleTitle;
      //added saleTitle to changelog
      this.estimateService.prevBillToForm?.addControl('saleTitle', new FormControl(null));
      this.estimateService.billToForm?.addControl('saleTitle', new FormControl(data[0].saleTitle));
      this.estimateService.billToForm?.get('saleTitle').markAsDirty();
      if (data[0].itemsArray != undefined) {
        let items: any[] = Object.values(data[0].itemsArray);
        if (items.length > 0) {
          // if items length grater than 0 bind sale item in table
          this.estimateService.updateItem(items)
        }
      }
    } else {
      //if sale is not slected reset saleID,saleTitle and saleTitle and add items
      this.estimateService.estimate.docData.saleID = null;
      this.estimateService.estimate.docData.saleAssignedToOwner = null;
      this.estimateService.estimate.docData.saleTitle = null;
      this.estimateService.document.itemList.forEach((element, index) => {
        this.estimateService.itemList?.removeAt(index)
      });
      this.estimateService.document.itemList = [this.estimateService.createEmptyProduct()]
      this.estimateService.estimate.itemList = [{
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
      this.estimateService.updateValues();
    }
  }
}
