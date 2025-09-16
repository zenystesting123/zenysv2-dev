/**********************************************************************************
Description: Component is used to customise field names for a particular user
             Only for Web
Inputs:
Outputs:
**********************************************************************************/
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/common.service';
import {
  fieldNameLEngth,
  Profile,
  UserAccessDetails,
} from 'src/app/data-models';
import { FieldNameSettingsService } from './field-name-settings.service';

@Component({
  selector: 'app-field-name-settings',
  templateUrl: './field-name-settings.component.html',
  styleUrls: ['./field-name-settings.component.scss'],
})
export class FieldNameSettingsComponent implements OnInit {
  userId: string; //variable storing loggedin userId
  superUserId: string; //loggedIn's superuserId
  fieldNameContact: string = 'Contact'; //local variable to store contact field name
  fieldNameSale: string = 'Sale'; //local variable to store sale field name
  fieldNameService: string = 'Support'; //local variable to store sale field name
  fieldNameFollowup: string = 'FollowUp'; //local variable to store followup field name
  fieldNameTask: string = 'Task'; //local variable to store field name task
  fieldNameMeeting: string = 'Meeting'; //local variable to store field name meeting
  fieldNameEstimate: string = 'Estimate'; //local variable to store field name estimate
  fieldNameQuotation: string = 'Quotation'; //local variable to store field name Quotation
  fieldNameInvoice: string = 'Invoice'; //local variable to store field name invoice
  fieldNameCollection: string = 'Collection'; //local variable to store field name collection
  fieldNameExpense: string = 'Expense'; //local variable to store field name expense
  fieldNameItems: string = 'Products and Service'; //local variable to store field name items
  fieldNameItemsCategory: string = 'Category'; //local variable to store field name items category
  fieldNameContactNotes: string = 'Note'; //local variable to store field name contact notes
  fieldNameSaleNotes: string = 'Note'; //local variable to store field name sale notes
  superUserDetails: Profile; //Superuser details from commonService
  userData: Profile; //userdata from common service
  progressBarStatus: boolean = false;
  usrProfileData: UserAccessDetails; //check for restriction,thus block direct route
  disableSettView: boolean = false; //direct route is blocke dby this variable according to access control check;
  maxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services

  editContact: boolean = false;
  editSale: boolean = false;
  editService = false;
  editFollowUp: boolean = false;
  editTask: boolean = false;
  editMeeting: boolean = false;
  editEstimate: boolean = false;
  editQuotation: boolean = false;
  editInvoice: boolean = false;
  editCollection: boolean = false;
  editExpense: boolean = false;
  editItems: boolean = false;
  editItemsCategory: boolean = false;
  editContactNotes: boolean = false;
  editSaleNotes: boolean = false;

  constructor(
    public commonService: CommonService,
    private serviceInstance: FieldNameSettingsService,
    private snackBar: MatSnackBar,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {
    // once we edit and save some fields, it wont reflect until we refresh in subusers,
    // so if we aagian try to edit and clear we wont get the intermittent saved value,
    // so we are trying to get the updated values to handle this scenario
    this.commonService.changeDetectionEmitter.subscribe(() => {
      this.cdRef.detectChanges();
      this.superUserDetails = this.commonService.getSuperUserData();
    });
  }

  ngOnInit(): void {
    // userDatas, userId, superUserId, superUserdetails are fetched from Common service
    this.userData = this.commonService.getUserData();
    this.userId = this.commonService.getUserId();
    this.superUserId = this.userData.superUserId;
    this.superUserDetails = this.commonService.getSuperUserData();

    //get the details of user profile assigned to the user
    this.usrProfileData = this.commonService.getProfileData();
    if (this.usrProfileData) {
      if (this.usrProfileData[0]) {
        // disable Settings view from direct route
        if (this.usrProfileData[0].isCheckedSett == false) {
          this.disableSettView = true;
        } else {
          if (this.usrProfileData[0].settView == false) {
            this.disableSettView = true;
          } else {
            this.disableSettView = false;
          }
        }
      }
    }
    if (this.superUserDetails) {
      this.progressBarStatus = true;
    }

    if (this.superUserDetails.fieldNames) {
      // fetched values are assigned to local variables
      this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
      this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
      this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
      this.fieldNameMeeting = this.superUserDetails.fieldNames.fieldNameMeeting;
      this.fieldNameFollowup =
        this.superUserDetails.fieldNames.fieldNameFollowup;
      this.fieldNameEstimate =
        this.superUserDetails.fieldNames.fieldNameEstimate;
      this.fieldNameQuotation =
        this.superUserDetails.fieldNames.fieldNameQuotation;
      this.fieldNameInvoice = this.superUserDetails.fieldNames.fieldNameInvoice;
      this.fieldNameCollection =
        this.superUserDetails.fieldNames.fieldNameCollection;
      this.fieldNameExpense = this.superUserDetails.fieldNames.fieldNameExpense;
      this.fieldNameItems = this.superUserDetails.fieldNames.fieldNameItems;
      // if (this.superUserDetails.fieldNames.fieldNameItemsCategory) {
      //   this.fieldNameItemsCategory =
      //     this.superUserDetails.fieldNames.fieldNameItemsCategory;
      // }
      if(this.superUserDetails?.productSettings?.category?.displayName){
        this.fieldNameItemsCategory = this.superUserDetails.productSettings.category.displayName;
      }
      if (this.superUserDetails.fieldNames.fieldNameService) {
        this.fieldNameService =
          this.superUserDetails.fieldNames.fieldNameService;
      }

      this.fieldNameContactNotes =
        this.superUserDetails.fieldNames.fieldNameContactNotes;
      this.fieldNameSaleNotes =
        this.superUserDetails.fieldNames.fieldNameSaleNotes;
    }
  }

  // back icon of toolbar
  onBack() {
    this.location.back();
  }

  // edit button on contact field actions
  editContactfn() {
    this.editContact = true;
  }
  // clear button on contact field actions
  clearContact() {
    this.editContact = false;
    this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
  }
  // save button on contact field actions
  saveContact() {
    this.editContact = false;
    this.serviceInstance.updateContactfieldName(
      this.superUserId,
      this.fieldNameContact
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Sale field actions
  editSalefn() {
    this.editSale = true;
  }
  // clear button on Sale field actions
  clearSale() {
    this.editSale = false;
    this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
  }
  // save button on contact field actions
  saveSale() {
    this.editSale = false;
    this.serviceInstance.updateSalefieldName(
      this.superUserId,
      this.fieldNameSale
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }
  editServicefn(){
    this.editService = true;
  }
  // clear button on Sale field actions
  clearService() {
    this.editService = false;
    this.fieldNameService = this.superUserDetails.fieldNames.fieldNameService;
  }
  // save button on contact field actions
  saveService() {
    this.editService = false;
    this.serviceInstance.updateServicefieldName(
      this.superUserId,
      this.fieldNameService
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Task field actions
  editTaskfn() {
    this.editTask = true;
  }
  // clear button on Task field actions
  clearTask() {
    this.editTask = false;
    this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
  }
  // save button on Task field actions
  saveTask() {
    this.editTask = false;
    this.serviceInstance.updateTaskfieldName(
      this.superUserId,
      this.fieldNameTask
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Meeting field actions
  editMeetingfn() {
    this.editMeeting = true;
  }
  // clear button on Meeting field actions
  clearMeeting() {
    this.editContact = false;
    this.fieldNameMeeting = this.superUserDetails.fieldNames.fieldNameMeeting;
  }
  // save button on Meeting field actions
  saveMeeting() {
    this.editMeeting = false;
    this.serviceInstance.updateMeetingfieldName(
      this.superUserId,
      this.fieldNameMeeting
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Estimate field actions
  editEstimatefn() {
    this.editEstimate = true;
  }
  // clear button on contact field actions
  clearEstimate() {
    this.editEstimate = false;
    this.fieldNameEstimate = this.superUserDetails.fieldNames.fieldNameEstimate;
  }
  // save button on contact field actions
  saveEstimate() {
    this.editEstimate = false;
    this.serviceInstance.updateEstimatefieldName(
      this.superUserId,
      this.fieldNameEstimate
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Quotation field actions
  editQuotationfn() {
    this.editQuotation = true;
  }
  // clear button on Quotation field actions
  clearQuotation() {
    this.editQuotation = false;
    this.fieldNameQuotation =
      this.superUserDetails.fieldNames.fieldNameQuotation;
  }
  // save button on Quotation field actions
  saveQuotation() {
    this.editQuotation = false;
    this.serviceInstance.updateQuotationfieldName(
      this.superUserId,
      this.fieldNameQuotation
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Invoice field actions
  editInvoicefn() {
    this.editInvoice = true;
  }
  // clear button on Invoice field actions
  clearInvoice() {
    this.editInvoice = false;
    this.fieldNameInvoice = this.superUserDetails.fieldNames.fieldNameInvoice;
  }
  // save button on Invoice field actions
  saveInvoice() {
    this.editInvoice = false;
    this.serviceInstance.updateInvoicefieldName(
      this.superUserId,
      this.fieldNameInvoice
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Collection field actions
  editCollectionfn() {
    this.editCollection = true;
  }
  // clear button on contact field actions
  clearCollection() {
    this.editCollection = false;
    this.fieldNameCollection =
      this.superUserDetails.fieldNames.fieldNameCollection;
  }
  // save button on Collection field actions
  saveCollection() {
    this.editCollection = false;
    this.serviceInstance.updateCollectionfieldName(
      this.superUserId,
      this.fieldNameCollection
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Expense field actions
  editExpensefn() {
    this.editExpense = true;
  }
  // clear button on Expense field actions
  clearExpense() {
    this.editExpense = false;
    this.fieldNameExpense = this.superUserDetails.fieldNames.fieldNameExpense;
  }
  // save button on Expense field actions
  saveExpense() {
    this.editExpense = false;
    this.serviceInstance.updateExpensefieldName(
      this.superUserId,
      this.fieldNameExpense
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on FollowUp field actions
  editFollowUpfn() {
    this.editFollowUp = true;
  }
  // clear button on FollowUp field actions
  clearFollowUp() {
    this.editFollowUp = false;
    this.fieldNameFollowup = this.superUserDetails.fieldNames.fieldNameFollowup;
  }
  // save button on FollowUp field actions
  saveFollowUp() {
    this.editFollowUp = false;
    this.serviceInstance.updateFollowupfieldName(
      this.superUserId,
      this.fieldNameFollowup
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on Items field actions
  editItemsfn() {
    this.editItems = true;
  }
  // clear button on Items field actions
  clearItems() {
    this.editItems = false;
    this.fieldNameItems = this.superUserDetails.fieldNames.fieldNameItems;
  }
  // save button on Items field actions
  saveItems() {
    this.editItems = false;
    this.serviceInstance.updateItemsfieldName(
      this.superUserId,
      this.fieldNameItems
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Items category field actions
  editItemsCategoryfn() {
    this.editItemsCategory = true;
  }
  // clear button on Items field actions
  clearItemsCategory() {
    this.editItemsCategory = false;
    this.fieldNameItemsCategory =
      this.superUserDetails.productSettings.category.displayName;
  }
  // save button on Items field actions
  saveItemsCategory() {
    this.editItemsCategory = false;
    this.serviceInstance.updateItemscategoryfieldName(
      this.superUserId,
      this.fieldNameItemsCategory
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on ContactNotes field actions
  editContactNotesfn() {
    this.editContactNotes = true;
  }
  // clear button on contactNotes field actions
  clearContactNotes() {
    this.editContact = false;
    this.fieldNameContactNotes =
      this.superUserDetails.fieldNames.fieldNameContactNotes;
  }
  // save button on contact field actions
  saveContactNotes() {
    this.editContactNotes = false;
    this.serviceInstance.updateContactNotesfieldName(
      this.superUserId,
      this.fieldNameContactNotes
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }

  // edit button on SaleNotes field actions
  editSaleNotesfn() {
    this.editSaleNotes = true;
  }
  // clear button on SaleNotes field actions
  clearSaleNotes() {
    this.editSaleNotes = false;
    this.fieldNameSaleNotes =
      this.superUserDetails.fieldNames.fieldNameSaleNotes;
  }
  // save button on SaleNotes field actions
  saveSaleNotes() {
    this.editSaleNotes = false;
    this.serviceInstance.updateSaleNotesfieldName(
      this.superUserId,
      this.fieldNameSaleNotes
    );
    this.snackBar.open('Successfully updated', '', {
      duration: 500,
    });
  }
}
