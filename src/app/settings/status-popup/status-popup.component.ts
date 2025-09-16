import {  StageHistory, addFieldsArr, Profile, itemMax } from './../../data-models';
/*********************************************************************************
Description: component used for popup of edit/add/delete of status in customer/sale/expense and additional field
Inputs: replace value,status array,added value etc
Outputs:
***********************************************************************************/

import { CustomersettingsComponent } from './../customersettings/customersettings.component';
import { StatusPopupService } from './status-popup.service';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { statusDatas } from '../customersettings/customersettings.component';
import {
  Customer,
  Expenses,
  Sales,
  Service,
  StageValues,
} from 'src/app/data-models';
import { Observable, Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-status-popup',
  templateUrl: './status-popup.component.html',
  styleUrls: ['./status-popup.component.scss'],
})
export class StatusPopupComponent implements OnInit, OnDestroy {
  filtered: any = []; //to store filtered status array got from component
  editedStatus: string = ''; //to store latest edited status value
  addedStatus: string; //to store latest added status value
  addedStatusAge: number = 5;
  index: any; //to store index of changed status array while edited
  statusArray: any = []; //to store whole status array before editing or adding
  id: any; //to store user id
  newHistory: any = []; //array to store new status and its history later pushed to existing history
  customers: Customer[]; //array to get all customer for updating latest status values
  expense: Expenses[]; //array to get all expense for updating latest status values
  sales: Sales[]; //array to get all sales for updating latest status values
  stageValues: StageValues = {
    //array defined for storing value of current stage value like name,date ....
    date: null,
    stageName: null,
    stageNo: null,
  };
  superUserDetails: any; //to store super user details
  inputData: statusDatas = null;
  dummyBoolean: boolean = true;
  updatingDb: boolean = false;
  fieldNameContact: string = 'Contact'; //setting default value for customer
  fieldNameSale: string = 'Sale'; //setting default value for sale
  fieldNameService: string = 'Support'; //setting default value for sale
  fieldNameExpense: string = 'Expense'; //setting default value for task
  accountType: string; //to store current user's account type
  customerSubscription: Subscription; //subscription to customers from db
  saleSubscription: Subscription; //subscription to all sales from db
  expenseSubscription: Subscription; //subscription to expenses from db
  userDetailsSubscription: Subscription; //subscription to all user details from common service file
  form: any; //for storing all user details
  saves: boolean = true; //boolean to check save button clicked or not
  filteredSales: Sales[] = []; //array to store sales having changed status as status for updating
  filteredCustomers: Customer[] = []; //array to store customers having changed status as status for updating
  filteredExpenses: Expenses[] = []; //array to store expenses having changed status as status for updating
  statusAgeArray: any;
  editedStatusAge = null;
  filteredAge: any;
  servicesArray: Service[] = [];
  uploadProgress = 0;

  disableDeleteBtn = false;
  salesArray: Sales[] = [];
  contactsArray: Customer[] = [];

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable
  userIdsArray:any[]=[];
  userNamesArray:any[]=[];
  superUserId:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public value: statusDatas,
    public dialogRef: MatDialogRef<CustomersettingsComponent>,
    private db: StatusPopupService,
    public commonService: CommonService,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) {
    //value got from input data
    this.inputData = this.value;
    // console.log(this.inputData);
    // console.log(this.inputData);
    //getting user id form popup data
    this.id = this.inputData.uid;
    //getting user data from common service file

    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.id = allData.userId;
          this.accountType = allData.userDetails.accountType;
          //checking its whether super user account or not
          if (allData.userDetails.superUserId) {
            this.id = allData.userDetails.superUserId;
            this.form = allData.userDetails;
          } else {
            this.form = allData.superUserDetails;
          }
          this.superUserId=allData.userDetails.superUserId
          this.superUserDetails = allData.superUserDetails;
          [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
          //getting field name to display
          this.fieldNameContact =
            this.superUserDetails.fieldNames.fieldNameContact;
          this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
          this.fieldNameExpense =
            this.superUserDetails.fieldNames.fieldNameExpense;
            if(this.superUserDetails?.fieldNames?.fieldNameService){
              this.fieldNameService = this.superUserDetails.fieldNames.fieldNameService;
            }
        }
      }
    );
  }

  ngOnInit(): void {
    //getting current status array passed through popup
    // console.log(this.inputData)
    this.filtered = this.inputData.statusArray;
    this.filteredAge = this.inputData.statusAgeArray;
    // console.log(this.filteredAge)
    //checking whether mode of changing status is edit
    if (this.inputData.type == 'edit') {
      //if edit storing values from popup data into field
      this.index = this.inputData.currentIndex;
      this.editedStatus = this.inputData.currentData;
      this.editedStatusAge = this.inputData.currentDataAge;
    }
    this.statusArray = this.filtered;
    this.statusAgeArray = this.filteredAge;
  }
  //save button click to add new status for sale,customer,expense
  async save() {
    //check whether status is added to sale
    if (this.inputData.mode == 'sale') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new sale status array in user level
      this.db.updateSaleStatus(
        this.inputData.uid,
        this.filtered,
        this.filteredAge
      );
      this.snack.open('Sale status added successfully', '', {
        duration: 2000,
      });
    }
    //check whether status is added to contact
    else if (this.inputData.mode == 'customer') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new customer status array in user level
      this.db.updateCustStatus(
        this.inputData.uid,
        this.filtered,
        this.filteredAge
      );
      this.snack.open('Contact status added successfully', '', {
        duration: 2000,
      });
    } else if (this.inputData.mode == 'service') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new customer status array in user level
      this.db
        .updateServiceStatus(
          this.inputData.uid,
          this.filtered,
          this.filteredAge
        )
        .then((resp) => {
          this.snack.open('Stage added successfully', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'servicePipeline') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new customer status array in user level
      this.db
        .updateServiceStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Stage added successfully', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'salePipeline') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new customer status array in user level
      this.db
        .updateSaleStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Stage added successfully', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'contactPipeline') {
      let length = this.filtered.length - 2;
      //inserting new status into status array
      this.filtered.splice(length, 0, this.addedStatus);
      this.filteredAge.splice(length, 0, this.addedStatusAge);
      //updating new customer status array in user level
      this.db
        .updateContactStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Status added successfully', '', {
            duration: 2000,
          });
        });
    }
    //check whether status is added to sale
    else if (this.inputData.mode == 'expense') {
      //inserting new status into status array
      this.filtered.push(this.addedStatus);
      //updating new exepense status array in user level
      this.db.updateExpenseStatus(this.inputData.uid, this.filtered);
      this.snack.open('Expense added successfully', '', {
        duration: 2000,
      });
    }
    //closing popup
    this.dialogRef.close();
  }
  //if edit confirmation in sale clicked
  updateSaleStatHistory() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;
    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateSaleStatus(this.id, this.statusArray, this.statusAgeArray);

      //getting all sales having sale stage as previous stage
      if (this.editedStatus != this.inputData.currentData)
        this.saleSubscription = this.db
          .getSaleWithPrevStatus(this.inputData.uid, this.inputData.currentData)
          .pipe(take(1))
          .subscribe((data) => {
            this.filteredSales = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Sales;
            });
            let sales = [];
            // console.log(sales)
            sales = this.filteredSales;
            // console.log(this.filteredSales)
            if (this.filteredSales?.length != 0) {
              //all such status adding new status in that sales history;
              this.filteredSales.forEach(async (sale, index, sales) => {
                // console.log(sale)
                if (!sale.stageHistory) {
                  sale.stageHistory = [];
                }
                //checking stage history exists
                if (sale.stageHistory?.length > 0) {
                  let size = sale.stageHistory.length - 1;
                  sale.stageHistory[size].stageName = this.editedStatus;
                  this.newHistory = sale.stageHistory;
                }
                //if  history is not present
                if (sale.stageHistory?.length == 0) {
                  let date = new Date().getTime();
                  let selectedIndex = this.form?.saleStatus.findIndex(
                    (s) => s === this.inputData.currentData
                  );
                  this.stageValues.date = date;
                  this.stageValues.stageName = this.editedStatus;
                  this.stageValues.stageNo = selectedIndex;
                  this.newHistory.push(this.stageValues);
                }
                //updating this status and history for existed status sales
                await this.db.onUpdateSaleStatus(
                  this.id,
                  sale.id,
                  this.editedStatus,
                  this.newHistory
                );
                if (index == sales.length - 1 && sales.length > 0) {
                  // console.log("hello")
                  this.snack.open('Sale stages updated successfully', '', {
                    duration: 2000,
                  });
                  //closing popup
                  this.dialogRef.close();
                  this.updatingDb = false;
                }
              });
            } else {
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
      //if edited statused array is present
      else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }

  }

  async updateExpRecords() {
    if (this.editedStatus != this.inputData.currentData) {
      this.updatingDb = true;
      //replacing new edited status instead of old one
      this.statusArray[this.inputData.currentIndex] = this.editedStatus;
      //updating new expense status to user level
      this.db.updateExpenseStatus(this.id, this.statusArray);
      //getting all expenses to check status edited is same status in expenses
      this.filteredExpenses = await this.db.getExpense(this.inputData.uid, this.inputData.currentData);
      let expenses = [];
      expenses = this.filteredExpenses;
      //if edited statused array is present
      if (this.filteredExpenses?.length != 0) {
        //all such status adding new status ;
        this.filteredExpenses.forEach((expense, index, expenses) => {
          this.db.onUpdateExpenseCategory(this.id, expense.id, this.editedStatus)
        });
        //if (index == 0 && expenses.length == 1) {
        this.snack.open("Expense category updated successfully", "", {
          duration: 2000,
        });
        //closing popup
        this.dialogRef.close();
        this.updatingDb = false;
      }
      else {
        this.snack.open("Expense category updated successfully", "", {
          duration: 2000,
        });
        this.dialogRef.close();
        this.updatingDb = false;
      }
    }
    else {
      this.dialogRef.close();
    }
  }

  async updateServiceStageHistory() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateServiceStatus(
        this.inputData.uid,
        this.statusArray,
        this.statusAgeArray
      );
      //getting all customers having status as previous status
      if (this.editedStatus != this.inputData.currentData) {
        await this.getServWithPrevStages();

        // updationg starts here
        let services = [];
        // console.log(services)
        services = this.servicesArray;
        // console.log(this.filteredservices)
        if (this.servicesArray?.length != 0) {
          //all such status adding new status in that services history;
          this.servicesArray.forEach(async (service, index, services) => {
            const servLength = this.servicesArray?.length;
            this.uploadProgress = (index / servLength) * 100;
            // console.log(service)
            if (!service.stageHistory) {
              service.stageHistory = [];
            }
            //checking stage history exists
            if (service.stageHistory?.length > 0) {
              let size = service.stageHistory.length - 1;
              service.stageHistory[size].stageName = this.editedStatus;
              this.newHistory = service.stageHistory;
            }
            //if  history is not present
            if (service.stageHistory?.length == 0) {
              let date = new Date().getTime();

              this.stageValues.date = date;
              this.stageValues.stageName = this.editedStatus;
              this.stageValues.stageNo = this.inputData.currentIndex;
              this.newHistory.push(this.stageValues);
            }
            //updating this status and history for existed status services
            await this.db.onUpdateServiceStages(
              this.inputData.uid,
              service.id,
              this.editedStatus,
              this.newHistory
            );
            if (index == services.length - 1 && services.length > 0) {
              // console.log("hello")
              this.snack.open('Stages updated successfully', '', {
                duration: 2000,
              });
              //closing popup
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
        } else {
          this.dialogRef.close();
          this.updatingDb = false;
        }
        // updating ends here
      } else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }
  }
  async updateSalePipelineStage() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateSaleStatusPipeline(
        this.inputData.uid,
        this.statusArray,
        this.statusAgeArray,
        this.inputData.selectedPipeline
      );

      //getting all customers having status as previous status
      if (this.editedStatus != this.inputData.currentData) {
        await this.getSalesWithPrevStagesPipeLine();
        // console.log(this.salesArray);
        // updationg starts here
        let sales = [];
        // console.log(services)
        sales = this.salesArray;
        // console.log(this.filteredservices)
        if (this.salesArray?.length != 0) {
          //all such status adding new status in that services history;
          this.salesArray.forEach(async (sale, index, sales) => {
            const salLength = this.salesArray?.length;
            this.uploadProgress = (index / salLength) * 100;
            // console.log(service)
            if (!sale.stageHistory) {
              sale.stageHistory = [];
            }
            //checking stage history exists
            if (sale.stageHistory?.length > 0) {
              let size = sale.stageHistory.length - 1;
              sale.stageHistory[size].stageName = this.editedStatus;
              this.newHistory = sale.stageHistory;
            }
            //if  history is not present
            if (sale.stageHistory?.length == 0) {
              let date = new Date().getTime();

              this.stageValues.date = date;
              this.stageValues.stageName = this.editedStatus;
              this.stageValues.stageNo = this.inputData.currentIndex;
              this.newHistory.push(this.stageValues);
            }
            //updating this status and history for existed status services
            await this.db.onUpdateSaleStatus(
              this.inputData.uid,
              sale.id,
              this.editedStatus,
              this.newHistory
            );
            if (index == sales.length - 1 && sales.length > 0) {
              // console.log("hello")
              this.snack.open('Stages updated successfully', '', {
                duration: 2000,
              });
              //closing popup
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
        } else {
          this.dialogRef.close();
          this.updatingDb = false;
        }
        // updating ends here
      } else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }
  }
  async updateServicePipelineStage() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateServiceStatusPipeline(
        this.inputData.uid,
        this.statusArray,
        this.statusAgeArray,
        this.inputData.selectedPipeline
      );

      //getting all customers having status as previous status
      if (this.editedStatus != this.inputData.currentData) {
        await this.getServWithPrevStagesPipeLine();
        // console.log(this.servicesArray);
        // updationg starts here
        let services = [];
        // console.log(services)
        services = this.servicesArray;
        // console.log(this.filteredservices)
        if (this.servicesArray?.length != 0) {
          //all such status adding new status in that services history;
          this.servicesArray.forEach(async (service, index, services) => {
            const servLength = this.servicesArray?.length;
            this.uploadProgress = (index / servLength) * 100;
            // console.log(service)
            if (!service.stageHistory) {
              service.stageHistory = [];
            }
            //checking stage history exists
            if (service.stageHistory?.length > 0) {
              let size = service.stageHistory.length - 1;
              service.stageHistory[size].stageName = this.editedStatus;
              this.newHistory = service.stageHistory;
            }
            //if  history is not present
            if (service.stageHistory?.length == 0) {
              let date = new Date().getTime();

              this.stageValues.date = date;
              this.stageValues.stageName = this.editedStatus;
              this.stageValues.stageNo = this.inputData.currentIndex;
              this.newHistory.push(this.stageValues);
            }
            //updating this status and history for existed status services
            await this.db.onUpdateServiceStages(
              this.inputData.uid,
              service.id,
              this.editedStatus,
              this.newHistory
            );
            if (index == services.length - 1 && services.length > 0) {
              // console.log("hello")
              this.snack.open('Stages updated successfully', '', {
                duration: 2000,
              });
              //closing popup
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
        } else {
          this.dialogRef.close();
          this.updatingDb = false;
        }
        // updating ends here
      } else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }
  }
  async updateContactPipelineStage() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateContactStatusPipeline(
        this.inputData.uid,
        this.statusArray,
        this.statusAgeArray,
        this.inputData.selectedPipeline
      );

      //getting all customers having status as previous status
      if (this.editedStatus != this.inputData.currentData) {
        await this.getContactsWithPrevStatusPipeLine();
        // console.log(this.contactsArray);
        // updationg starts here

        // console.log(this.filteredservices)
        if (this.contactsArray?.length != 0) {
          //all such status adding new status in that services history;
          this.contactsArray.forEach(async (contact, index, contacts) => {
            const contLength = this.contactsArray?.length;
            this.uploadProgress = (index / contLength) * 100;
            // console.log(service)
            if (!contact.stageHistory) {
              contact.stageHistory = [];
            }
            //checking stage history exists
            if (contact.stageHistory?.length > 0) {
              let size = contact.stageHistory.length - 1;
              contact.stageHistory[size].stageName = this.editedStatus;
              this.newHistory = contact.stageHistory;
            }
            //if  history is not present
            if (contact.stageHistory?.length == 0) {
              let date = new Date().getTime();

              this.stageValues.date = date;
              this.stageValues.stageName = this.editedStatus;
              this.stageValues.stageNo = this.inputData.currentIndex;
              this.newHistory.push(this.stageValues);
            }
            //updating this status and history for existed status services
            await this.db.onUpdateCustStatus(
              this.inputData.uid,
              contact.id,
              this.editedStatus,
              this.newHistory
            );
            if (index == contacts.length - 1 && contacts.length > 0) {
              // console.log("hello")
              this.snack.open('Status updated successfully', '', {
                duration: 2000,
              });
              //closing popup
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
        } else {
          this.dialogRef.close();
          this.updatingDb = false;
        }
        // updating ends here
      } else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }
  }

  getServWithPrevStages() {
    return new Promise<void>((resolve) => {
      this.db
        .getServWithPrevStages(this.inputData.uid, this.inputData.currentData)
        .pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          this.servicesArray = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          resolve();
        });
    });
  }

  getServWithPrevStagesPipeLine() {
    return new Promise<void>((resolve) => {
      this.db
        .getServWithPrevStagesPipeline(
          this.inputData.uid,
          this.inputData.currentData,
          this.inputData.selectedPipeline
        )
        .pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          this.servicesArray = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });

          // console.log(this.servicesArray);
          resolve();
        });
    });
  }

  getSalesWithPrevStagesPipeLine() {
    return new Promise<void>((resolve) => {
      this.db
        .getSalesWithPrevStagesPipeline(
          this.inputData.uid,
          this.inputData.currentData,
          this.inputData.selectedPipeline
        )
        .pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          this.salesArray = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });

          // console.log(this.salesArray);
          resolve();
        });
    });
  }

  getContactsWithPrevStatusPipeLine() {
    return new Promise<void>((resolve) => {
      this.db
        .getContactWithPrevStatusPipeline(
          this.inputData.uid,
          this.inputData.currentData,
          this.inputData.selectedPipeline
        )
        .pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
          this.contactsArray = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Customer;
          });

          // console.log(this.contactsArray);
          resolve();
        });
    });
  }

  //if edit confirmation in customer clicked
  updateContStatHistory() {
    this.updatingDb = true;
    //replacing new edited status instead of old one
    this.statusArray[this.inputData.currentIndex] = this.editedStatus;
    this.statusAgeArray[this.inputData.currentIndex] = this.editedStatusAge;

    //updating new sale status to user level
    if (
      this.editedStatus != this.inputData.currentData ||
      this.editedStatusAge != this.inputData.currentDataAge
    ) {
      this.db.updateCustStatus(this.id, this.statusArray, this.statusAgeArray);
      //getting all customers having status as previous status
      if (this.editedStatus != this.inputData.currentData) {
        this.customerSubscription = this.db
          .getCustWithPrevStatus(this.inputData.uid, this.inputData.currentData)
          .pipe(take(1))
          .subscribe((data) => {
            this.filteredCustomers = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Customer;
            });
            let customers = [];
            customers = this.filteredCustomers;
            // console.log(this.filteredCustomers)
            //if edited statused array is present
            if (this.filteredCustomers?.length != 0) {
              //all such status adding new status in that contact history;
              this.filteredCustomers.forEach(
                async (customer, index, customers) => {
                  if (!customer.stageHistory) {
                    customer.stageHistory = [];
                  }
                  //checking size of history exists
                  if (customer.stageHistory?.length > 0) {
                    let size = customer.stageHistory.length - 1;
                    customer.stageHistory[size].stageName = this.editedStatus;
                    this.newHistory = customer.stageHistory;
                  }
                  //if history is not present
                  if (customer.stageHistory?.length == 0) {
                    let date = new Date().getTime();
                    let selectedIndex = this.form?.custStatus.findIndex(
                      (s) => s === this.inputData.currentData
                    );
                    this.stageValues.date = date;
                    this.stageValues.stageName = this.editedStatus;
                    this.stageValues.stageNo = selectedIndex;
                    this.newHistory.push(this.stageValues);
                  }
                  //updating this status and history for existed status customer
                  await this.db.onUpdateCustStatus(
                    this.id,
                    customer.id,
                    this.editedStatus,
                    this.newHistory
                  );

                  if (index == customers.length - 1 && customers.length > 0) {
                    this.snack.open('Contact status updated successfully', '', {
                      duration: 2000,
                    });
                    //closing popup
                    this.dialogRef.close();
                    this.updatingDb = false;
                  }
                  // if(index==0){
                  //   if(this.firstLoop==true){
                  //     console.log("first point")
                  //     this.firstLoop=false;
                  //   }
                  //   else{
                  //     console.log("last point")
                  //   }
                  // }
                  // if (index == customers.length - 1) {
                  //   console.log("Last callback call at index " + index,customers.length);
                  // }
                }
              );
            } else {
              this.snack.open('Contact status updated successfully', '', {
                duration: 2000,
              });
              this.dialogRef.close();
              this.updatingDb = false;
            }
          });
      } else {
        this.dialogRef.close();
        this.updatingDb = false;
      }
    } else {
      this.dialogRef.close();
      this.updatingDb = false;
    }
  }

  //for deleting a status field
  deleted() {
    //deleting a variable form current array using delete index
    this.filtered.splice(this.inputData.currentIndex, 1);
    //delete a status field for sale
    if (this.inputData.mode == 'sale') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db.updateSaleStatus(
        this.inputData.uid,
        this.filtered,
        this.filteredAge
      );

      this.snack.open('Sale status deleted successfully', '', {
        duration: 2000,
      });
    }
    //delete a status field for customer
    else if (this.inputData.mode == 'customer') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db.updateCustStatus(
        this.inputData.uid,
        this.filtered,
        this.filteredAge
      );
      this.snack.open('Contact status deleted successfully', '', {
        duration: 2000,
      });
    } else if (this.inputData.mode == 'service') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db
        .updateServiceStatus(
          this.inputData.uid,
          this.filtered,
          this.filteredAge
        )
        .then((resp) => {
          this.snack.open('Stage deleted', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'servicePipeline') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db
        .updateServiceStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Stage deleted', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'salePipeline') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db
        .updateSaleStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Stage deleted', '', {
            duration: 2000,
          });
        });
    } else if (this.inputData.mode == 'contactPipeline') {
      this.filteredAge.splice(this.inputData.currentIndex, 1);
      //updating updated status in user level
      this.db
        .updateContactStatusPipeline(
          this.inputData.uid,
          this.filtered,
          this.filteredAge,
          this.inputData.selectedPipeline
        )
        .then((resp) => {
          this.snack.open('Status deleted', '', {
            duration: 2000,
          });
        });
    }
    //delete a status field for expense
    else if (this.inputData.mode == 'expense') {
      //updating updated status in user level
      this.db.updateExpenseStatus(this.inputData.uid, this.filtered);
      this.snack.open('expense category deleted successfully', '', {
        duration: 2000,
      });
    }
    //closing popup
    this.dialogRef.close();
  }
  deleteContactDocument(arrayName){
     //   /***** Handle the delete in contactCustomDoc *****/
    const custDocsArray = this.inputData.statusArray;
    //shift the elements of the array to the prev index to perform delete
    custDocsArray.forEach((elem, index) => {
      if (index >= this.inputData.currentIndex) {
        custDocsArray[index] = custDocsArray[index + 1]
      }
    });
    //remove the last index after shifting elements
    custDocsArray.pop();

    //updating the contactCustomDoc array in db
  this.db.updateContacDocs(this.inputData.uid, custDocsArray,arrayName).then(()=>{
      //closing popup
    this.dialogRef.close();
    this.snack.open('Document deleted successfully', '', {
      duration: 2000,
    });
    });
    
  }
  //deletes an additional field
  deleteAdditionalField(arrayName: string) {
    //disabling active fields on delete inorder to hide inactive field from user
    this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
    //set deleted fields as non-mandatory
    this.inputData.statusArray[this.inputData.currentIndex].mandatory = false;
    //set deafult value as null for deleted fields
    this.inputData.statusArray[this.inputData.currentIndex].defaultValue = null;
    //updating the customFieldsContact array under superUser
    this.db.updateCustomField(this.inputData.uid, arrayName, this.inputData.statusArray);
    //closing popup
    this.dialogRef.close();
    this.snack.open('Custom field deleted successfully', '', {
      duration: 2000,
    });
  }

  //delete an additional field in contact
  // async deletedFieldContact() {
  //   //disabling active fields on delete inorder to hide inactive field from user
  //   this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //set deleted fields as non-mandatory
  //   this.inputData.statusArray[this.inputData.currentIndex].mandatory = false;
  //   //set deafult value as null for deleted fields
  //   this.inputData.statusArray[this.inputData.currentIndex].defaultValue = null;
  //   //updating the customFieldsContact array under superUser
  //   this.db.updateCustomFields(this.inputData.uid, this.inputData.statusArray);
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open('Custom field deleted successfully', '', {
  //     duration: 2000,
  //   });
  // }

  //deletes a contact additional field
  // async deletedFieldContact() {
  //   /***** Handle the delete in customFieldsContact *****/
  //   const custFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   custFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       custFieldsArray[index] = custFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   custFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(custFieldsArray,'displayCustomerColumns','customerCardFields','customers')
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFieldsContact array in db
  //   await this.db.updateCustomFields(this.inputData.uid, custFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each customer*****/
  //   const custArray = await this.db.getCustWithAddFields(this.inputData.uid);
  //   //checking if there is any customer
  //   if (custArray.length != 0) {
  //     //loops through each customer
  //     custArray.forEach(async (customer, indexes, custArray) => {
  //       //checking if additionalFieldsArr present
  //       if (customer.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = customer.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         delete additionalFields[this.inputData.currentIndex];
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //         //updating the customFields array in db
  //         await this.db.updateAdditionalFieldsContact(this.inputData.uid, customer.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
/*
  //delete an additional field in sale
  deletedFieldSale() {
    //disabling active field such that we will hide false active field from user
    this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
    //updating the isactive field in sale Custome fields array
    this.db.updateCustomFieldsSale(
      this.inputData.uid,
      this.inputData.statusArray
    );
    //closing popup
    this.dialogRef.close();
    this.snack.open('Custom field deleted successfully', '', {
      duration: 2000,
    });
  }
  */
  // async deletedFieldService() {
  //   this.disableDeleteBtn = true;
  //   /***** Handle the delete in customFieldsserviceFieldArray *****/
  //   const serviceFieldArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   serviceFieldArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       serviceFieldArray[index] = serviceFieldArray[index + 1];
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   serviceFieldArray.pop();
  //   await  this.onAdditionaFiledRemove(serviceFieldArray,'displayServiceColumns','serviceCardFields','services')
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFieldsserviceFieldArray array in db
  //   await this.db.updateCustomFieldsService(
  //     this.inputData.uid,
  //     serviceFieldArray
  //   );

  //   /***** Handle the delete in additionalFieldsArray in each serviceFieldArray *****/
  //   const servicesArray = await this.db.getServicesWithAddFields(
  //     this.inputData.uid
  //   );
  //   //checking if there is any serviceFieldArrays
  //   if (servicesArray.length != 0) {
  //     //loops through each serviceFieldArrays
  //     servicesArray.forEach(
  //       async (serviceFieldArray, indexes, servicesArray) => {
  //         //checking if additionalFieldsArr present
  //         if (serviceFieldArray.additionalFieldsArr) {
  //           //storing additional fields array in local variable
  //           const additionalFields = serviceFieldArray.additionalFieldsArr;
  //           const _length = Object.keys(additionalFields).length;
  //           //delete additional field value when superuser deletes additional field
  //           delete additionalFields[this.inputData.currentIndex];
  //           //shift the keys to eliminate null values
  //           const addFieldsArray = {};
  //           Object.keys(additionalFields).forEach((key, index) => {
  //             addFieldsArray[index] = additionalFields[key];
  //           });
  //           //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //           //updating the customFields array in db
  //           await this.db.updateAdditionalFieldsServices(
  //             this.inputData.uid,
  //             serviceFieldArray.id,
  //             addFieldsArray
  //           );
  //         }
  //       }
  //     );
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open('Custom field deleted successfully', '', {
  //     duration: 2000,
  //   });
  // }
  //delete addditional field in task starts here
  // async deletedFieldTask() {
  //   this.disableDeleteBtn = true;
  //   /***** Handle the delete in customFieldsserviceFieldArray *****/
  //   const taskFieldArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   taskFieldArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       taskFieldArray[index] = taskFieldArray[index + 1];
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   taskFieldArray.pop();
  //   await this.onAdditionaFiledRemove(taskFieldArray,'displayTaskColumns','taskCardFields','tasks')
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFieldsserviceFieldArray array in db
  //   await this.db.updateCustomFieldsTask(
  //     this.inputData.uid,
  //     taskFieldArray
  //   );

  //   /***** Handle the delete in additionalFieldsArray in each serviceFieldArray *****/
  //   const taskArray = await this.db.getTaskWithAddFields(
  //     this.inputData.uid
  //   );
  //   //checking if there is any serviceFieldArrays
  //   if (taskArray.length != 0) {
  //     //loops through each serviceFieldArrays
  //     taskArray.forEach(
  //       async (taskFieldArray, indexes, taskArray) => {
  //         //checking if additionalFieldsArr present
  //         if (taskFieldArray.additionalFieldsArr) {
  //           //storing additional fields array in local variable
  //           const additionalFields = taskFieldArray.additionalFieldsArr;
  //           const _length = Object.keys(additionalFields).length;
  //           //delete additional field value when superuser deletes additional field
  //           delete additionalFields[this.inputData.currentIndex];
  //           //shift the keys to eliminate null values
  //           const addFieldsArray = {};
  //           Object.keys(additionalFields).forEach((key, index) => {
  //             addFieldsArray[index] = additionalFields[key];
  //           });
  //           //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //           //updating the customFields array in db
  //           await this.db.updateAdditionalFieldsTask(
  //             this.inputData.uid,
  //             taskFieldArray.id,
  //             addFieldsArray
  //           );
  //         }
  //       }
  //     );
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open('Custom field deleted successfully', '', {
  //     duration: 2000,
  //   });
  // }
  //delete additional fields in task ends here
  // async deletedFieldProduct() {
  //   this.disableDeleteBtn = true;
  //   /***** Handle the delete in customFieldsserviceFieldArray *****/
  //   const productFieldArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   productFieldArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       productFieldArray[index] = productFieldArray[index + 1];
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   productFieldArray.pop();
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFieldsserviceFieldArray array in db
  //   await this.db.updateCustomFieldsProduct(
  //     this.inputData.uid,
  //     productFieldArray
  //   );

  //   /***** Handle the delete in additionalFieldsArray in each serviceFieldArray *****/
  //   const productsArray = await this.db.getProductsWithAddFields(
  //     this.inputData.uid
  //   );


  //   //checking if there is any serviceFieldArrays
  //   if (productsArray.length != 0) {

  //     let prodIdArray = [];
  //     let itemArr = [];
  //     const maxItems = this.superUserDetails.itemMaxAllowed
  //       ? this.superUserDetails.itemMaxAllowed
  //       : itemMax.MAX_ITEM;
  //     for (const prod of productsArray) {
  //       prodIdArray.push(prod.id)
  //     }

  //     console.log('prodIdArray',prodIdArray);
  //     if(prodIdArray.length > 0){
  //       this.sales = [];
  //       for (let index = 0; index < maxItems; index++) {
  //         await this.getAllSalesWithItems(this.superUserId, index, prodIdArray);
  //         itemArr = itemArr.concat(this.sales);
  //       }
  //       itemArr = itemArr.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any
  //       console.log(itemArr);
  //       if(itemArr?.length > 0){
  //         itemArr.forEach(async (item) => {
  //           for (let i = 0; i < maxItems; i++) {
  //             if(item.itemsArray[i]?.additionalFieldsArr){
  //               //storing additional fields array in local variable
  //               const additionalFieldsItems = item.itemsArray[i].additionalFieldsArr;
  //               const _lengthItems = Object.keys(additionalFieldsItems).length;
  //               //delete additional field value when superuser deletes additional field
  //               delete additionalFieldsItems[this.inputData.currentIndex];
  //               //shift the keys to eliminate null values
  //               const addFieldsArrayItems = {};
  //               Object.keys(additionalFieldsItems).forEach((key, index) => {
  //                 addFieldsArrayItems[index] = additionalFieldsItems[key];
  //               });
  //               item.itemsArray[i].additionalFieldsArr = addFieldsArrayItems;
  //             }
  //           }
  //           await this.db.updateCatNameInItem(
  //             this.superUserId,
  //             item.id,
  //             item.itemsArray
  //           );
  //         })
  //       }
  //     }

  //     //loops through each serviceFieldArrays
  //     productsArray.forEach(
  //       async (productFieldArray, indexes, productsArray) => {


  //         //checking if additionalFieldsArr present
  //         if (productFieldArray.additionalFieldsArr) {
  //           //storing additional fields array in local variable
  //           const additionalFields = productFieldArray.additionalFieldsArr;
  //           const _length = Object.keys(additionalFields).length;
  //           //delete additional field value when superuser deletes additional field
  //           delete additionalFields[this.inputData.currentIndex];
  //           //shift the keys to eliminate null values
  //           const addFieldsArray = {};
  //           Object.keys(additionalFields).forEach((key, index) => {
  //             addFieldsArray[index] = additionalFields[key];
  //           });
  //           //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //           //updating the customFields array in db
  //           await this.db.updateAdditionalFieldsProducts(
  //             this.inputData.uid,
  //             productFieldArray.id,
  //             addFieldsArray
  //           );
  //         }

  //         // // console.log(productFieldArray.id);
  //         // const itemsArray = await this.db.getItemsWithAddFields(productFieldArray.id)
  //         // if(itemsArray.length != 0){
  //         //   itemsArray.forEach(
  //         //     async (itemFieldArray, indexs, itemsArray) => {
  //         //       // console.log(itemFieldArray);
  //         //       const userID = itemFieldArray.refId.split('/')[1];
  //         //       const saleID = itemFieldArray.refId.split('/')[3];
  //         //       const itemID = itemFieldArray.refId.split('/')[5];


  //         //       if(itemFieldArray.additionalFieldsArr){
  //         //                                   //storing additional fields array in local variable
  //         //                 const additionalFieldsItems = itemFieldArray.additionalFieldsArr;
  //         //                 const _length = Object.keys(additionalFieldsItems).length;
  //         //                 //delete additional field value when superuser deletes additional field
  //         //                 delete additionalFieldsItems[this.inputData.currentIndex];
  //         //                 //shift the keys to eliminate null values
  //         //                 const addFieldsArray = {};
  //         //                 Object.keys(additionalFieldsItems).forEach((key, index) => {
  //         //                   addFieldsArray[index] = additionalFieldsItems[key];
  //         //                 });
  //         //                 //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //         //                 //updating the customFields array in db
  //         //                 await this.db.updateAdditionalFieldsItems(
  //         //                   userID,
  //         //                   saleID,
  //         //                   itemID,
  //         //                   addFieldsArray
  //         //                 );

  //         //       }
  //         //     }
  //         //   )
  //         // }
  //       }
  //     );
  //   }


  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open('Custom field deleted successfully', '', {
  //     duration: 2000,
  //   });
  // }

  //delete an additional field in sale
  // async deletedFieldSale() {
  //   /***** Handle the delete in customFieldsSale *****/
  //   const saleFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   saleFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       saleFieldsArray[index] = saleFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   saleFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(saleFieldsArray,'displaySaleColumns','saleCardFields','sales')
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFieldsSale array in db
  //   await this.db.updateCustomFieldsSale(this.inputData.uid, saleFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each sale *****/
  //   const salesArray = await this.db.getSalesWithAddFields(this.inputData.uid);
  //   //checking if there is any sales
  //   if (salesArray.length != 0) {
  //     //loops through each sales
  //     salesArray.forEach(async (sale, indexes, salesArray) => {
  //       //checking if additionalFieldsArr present
  //       if (sale.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = sale.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         delete additionalFields[this.inputData.currentIndex];
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //         //updating the customFields array in db
  //         await this.db.updateAdditionalFieldsSales(this.inputData.uid, sale.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
  getAllSalesWithItems(userId, index, id) {
    return new Promise<void>((resolve) => {
      this.db
        .getSaleItems(userId, index, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          resolve();
        });
    });
  }
  //delete an additional field in expense
  // async deletedFieldExpense() {
  //   /***** Handle the delete in customFieldsExpense *****/
  //   const expenseFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   expenseFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       expenseFieldsArray[index] = expenseFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   expenseFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(expenseFieldsArray,'displayExpenseColumns',null,'Expenses')
  //   // console.log("Val",expenseFieldsArray);

  //   //updating the customFieldsExpense array in db
  //   await this.db.updateCustomFieldsExpense(this.inputData.uid, expenseFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each expense *****/
  //   const expenseArray = await this.db.getExpenseWithAddFields(this.inputData.uid);
  //   //checking if there is any expense
  //   if (expenseArray.length != 0) {
  //     //loops through each expense
  //     expenseArray.forEach(async (expense, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (expense.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = expense.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //updating the customFields array in db

  //         await this.db.updateAdditionalFieldsExpense(this.inputData.uid, expense.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
  //delete an additional field in estimate
  // async deletedFieldEstimate() {
  //   /***** Handle the delete in customFieldsEstimate *****/
  //   const estimateFieldsArray = this.inputData.statusArray;

  //   //shift the elements of the array to the prev index to perform delete
  //   estimateFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       estimateFieldsArray[index] = estimateFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   estimateFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(estimateFieldsArray,'displayEstimateColumns',null,'Estimates')
  //   //updating the customFieldsEstimate array in db
  //   await this.db.updateCustomFieldsEstimate(this.inputData.uid, estimateFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each estimate *****/
  //   const estimateArray = await this.db.getEstimateWithAddFields(this.inputData.uid);
  //   //checking if there is any extimate
  //   if (estimateArray.length != 0) {
  //     //loops through each expense
  //     estimateArray.forEach(async (estimate, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (estimate.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = estimate.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //updating the customFields array in db

  //         await this.db.updateAdditionalFieldsEstimate(this.inputData.uid, estimate.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }

  //delete an additional field in estimate
  // async deletedFieldInvoice() {
  //   const invoiceFieldsArray = this.inputData.statusArray;

  //   //shift the elements of the array to the prev index to perform delete
  //   invoiceFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       invoiceFieldsArray[index] = invoiceFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   invoiceFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(invoiceFieldsArray,'displayInvoiceColumns',null,'Invoices')
  //   //updating the customFieldsEstimate array in db
  //   await this.db.updateCustomFieldsInvoice(this.inputData.uid, invoiceFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each estimate *****/
  //   const invoiceArray = await this.db.getInvoiceWithAddFields(this.inputData.uid);
  //   //checking if there is any extimate
  //   if (invoiceArray.length != 0) {
  //     //loops through each expense
  //     invoiceArray.forEach(async (invoice, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (invoice.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = invoice.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         await this.db.updateAdditionalFieldsInvoices(this.inputData.uid, invoice.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }


  //delete an additional field in quotation
  // async deletedFieldQuotation() {
  //   /***** Handle the delete in customFieldsQuotation *****/
  //   const quotationFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   quotationFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       quotationFieldsArray[index] = quotationFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   quotationFieldsArray.pop();
  //   await  this.onAdditionaFiledRemove(quotationFieldsArray,'displayQuotationColumns',null,'Quotations')
  //   //updating the customFieldsEstimate array in db
  //   await this.db.updateCustomFieldsQuotation(this.inputData.uid, quotationFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each invoice *****/
  //   const quotationArray = await this.db.getQuotationWithAddFields(this.inputData.uid);
  //   //checking if there is any extimate
  //   if (quotationArray.length != 0) {
  //     //loops through each invoice
  //     quotationArray.forEach(async (quotation, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (quotation.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = quotation.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //updating the customFields array in db
  //         await this.db.updateAdditionalFieldsquotation(this.inputData.uid, quotation.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
  // async deletedFieldOrg() {
  //   /***** Handle the delete in customFieldsOrganisation *****/
  //   const organisationFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   organisationFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       organisationFieldsArray[index] = organisationFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   organisationFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(organisationFieldsArray,'displayOrgColumns','orgCardFields','Organisations')

  //   //updating the customFieldsEstimate array in db
  //   await this.db.updateCustomFieldsOrganisation(this.inputData.uid, organisationFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each invoice *****/
  //   const organisationArray = await this.db.getOrganisationWithAddFields(this.inputData.uid);
  //   //checking if there is any extimate
  //   if (organisationArray.length != 0) {
  //     //loops through each invoice
  //     organisationArray.forEach(async (organisation, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (organisation.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = organisation.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //updating the customFields array in db
  //         await this.db.updateAdditionalFieldsOrganisation(this.inputData.uid, organisation.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
  ////**************//////////////// */
  //delete an additional field in payment
  // async deleteFieldPayment() {
  //   /***** Handle the delete in customFieldsPayment *****/
  //   const paymentFieldsArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   paymentFieldsArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       paymentFieldsArray[index] = paymentFieldsArray[index + 1]
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   paymentFieldsArray.pop();
  //   await this.onAdditionaFiledRemove(paymentFieldsArray,'displayCollectionColumns',null,'paymentsreceived')
  //   //updating the customFieldsExpense array in db
  //   await this.db.updateCustomFieldsPayment(this.inputData.uid, paymentFieldsArray);

  //   /***** Handle the delete in additionalFieldsArray in each payment *****/
  //   const expenseArray = await this.db.getPaymentWithAddFields(this.inputData.uid);
  //   //checking if there is any payment
  //   if (expenseArray.length != 0) {
  //     //loops through each payment
  //     expenseArray.forEach(async (payments, indexes) => {
  //       //checking if additionalFieldsArr present
  //       if (payments.additionalFieldsArr) {
  //         //storing additional fields array in local variable
  //         const additionalFields = payments.additionalFieldsArr;
  //         const _length = Object.keys(additionalFields).length;
  //         //delete additional field value when superuser deletes additional field
  //         if(additionalFields[this.inputData.currentIndex]){
  //         delete additionalFields[this.inputData.currentIndex];
  //         }
  //         //shift the keys to eliminate null values
  //         const addFieldsArray = {};
  //         Object.keys(additionalFields).forEach((key, index) => {
  //           addFieldsArray[index] = additionalFields[key];
  //         });
  //         //updating the customFields array in db

  //         await this.db.updateAdditionalFieldsPayment(this.inputData.uid, payments.id, addFieldsArray);

  //       }
  //     });
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open("Custom field deleted successfully", "", {
  //     duration: 2000,
  //   });
  // }
  //closing popup
  close() {
    this.dialogRef.close();
  }
  // async deletedFieldFollowUp() {
  //   this.disableDeleteBtn = true;
  //   /***** Handle the delete in customField followup FieldArray *****/
  //   const followUpFieldArray = this.inputData.statusArray;
  //   //shift the elements of the array to the prev index to perform delete
  //   followUpFieldArray.forEach((elem, index) => {
  //     if (index >= this.inputData.currentIndex) {
  //       followUpFieldArray[index] = followUpFieldArray[index + 1];
  //     }
  //   });
  //   //remove the last index after shifting elements
  //   followUpFieldArray.pop();
  //   await this.onAdditionaFiledRemove(followUpFieldArray,'displayFollowupColumns','followupCardFields','Follow Ups')
  //   //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //   //updating the customFields followup FieldArray array in db
  //   await this.db.updateCustomFieldsFollowUp(
  //     this.inputData.uid,
  //     followUpFieldArray
  //   );

  //   /***** Handle the delete in additionalFieldsArray in each followupFieldArray *****/
  //   const followUpArray = await this.db.getFollowUpsWithAddFields(
  //     this.inputData.uid
  //   );
  //   //checking if there is any followupFieldArrays
  //   if (followUpArray.length != 0) {
  //     //loops through each followupFieldArrays
  //     followUpArray.forEach(
  //       async (fieldArray, indexes, servicesArray) => {
  //         //checking if additionalFieldsArr present
  //         if (fieldArray.additionalFieldsArr) {
  //           //storing additional fields array in local variable
  //           const additionalFields = fieldArray.additionalFieldsArr;
  //           const _length = Object.keys(additionalFields).length;
  //           //delete additional field value when superuser deletes additional field
  //           delete additionalFields[this.inputData.currentIndex];
  //           //shift the keys to eliminate null values
  //           const addFieldsArray = {};
  //           Object.keys(additionalFields).forEach((key, index) => {
  //             addFieldsArray[index] = additionalFields[key];
  //           });
  //           //this.inputData.statusArray[this.inputData.currentIndex].isActive = false;
  //           //updating the customFields array in db
  //           await this.db.updateAdditionalFieldsFollowUp(
  //             this.inputData.uid,
  //             fieldArray.id,
  //             addFieldsArray
  //           );
  //         }
  //       }
  //     );
  //   }
  //   //closing popup
  //   this.dialogRef.close();
  //   this.snack.open('Custom field deleted successfully', '', {
  //     duration: 2000,
  //   });
  // }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //closing all subscription
    this.customerSubscription?.unsubscribe();
    this.saleSubscription?.unsubscribe();
    this.expenseSubscription?.unsubscribe();
    this.userDetailsSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async onAdditionaFiledRemove(additionalfieldsArray, columnFieldName, cardFields,module) {
    let userDetails:Profile[]=[]
    for (var ele of this.userIdsArray) {
      let data = await this.db.getUser(ele);
      data.id=ele
      userDetails.push(data)
    }
    if (userDetails) {
      for (var element of userDetails) {
        let displayColumn = element[`${columnFieldName}`]
        let object3Names = additionalfieldsArray?.map(obj => obj.fieldName); // for caching the result
        let object2Names = displayColumn?.map(obj => obj.columnDef); // for caching the result
        object2Names?.filter(ele => {
          if (!object3Names?.includes(ele)) {
            for (var i = displayColumn.length - 1; i >= 0; i--) {
              if (displayColumn[i].fieldType == 'Additional' && displayColumn[i].columnDef == ele) {
                let inds: Number
                inds = displayColumn[i].ind
                displayColumn.splice(i, 1)

                // rearrage index if the removed index greater than column ind
                displayColumn.forEach(element => {
                  let indd: Number = element.ind
                  if (element.fieldType == 'Additional') {
                    if (indd > inds) {
                      element.ind = element.ind - 1

                    }
                  }
                });
              }
            }
          }
        });
        if (cardFields) {
          let displayCard = element[`${cardFields}`]
          let object4Names = displayCard?.map(obj => obj.header); // for caching the result
          if(object4Names){
            object4Names?.filter(ele => {
              if (!object3Names?.includes(ele)) {
                for (var i = displayCard.length - 1; i >= 0; i--) {
                  if (displayCard[i].fieldType == 'Additional' && displayCard[i].header == ele) {
                    let inds: Number
                    inds = displayCard[i].ind
                    displayCard.splice(i, 1)
                    // rearrage index if the removed index greater than column ind
                    displayCard.forEach(element => {
                      let indd: Number = element.ind
                      if (element.fieldType == 'Additional') {
                        if (indd > inds) {
                          element.ind = element.ind - 1
                          element.columnDef='additionalFieldsArr['+ element.ind +']fieldValue';
                        }
                      }
                    });
                  }
                }
              }
            });
            let cardviewSetting = {};
            cardviewSetting[cardFields] = displayCard
            this.db.updateDisplayField(element.id, cardviewSetting)
          }
        }
        if(displayColumn){
          let keyValuePair = {};
          keyValuePair[columnFieldName] = displayColumn
          this.db.updateDisplayField(element.id, keyValuePair)
        }

        element.ReportSettings?.filter((ele,index) => {
          if (ele.module == module) {
            let displayFieldSetting = ele.displayColumns
            let object4Names = displayFieldSetting?.map(obj => obj.header); // for caching the result
            if (object4Names) {
              object4Names?.filter(ele => {
                if (!object3Names?.includes(ele)) {
                  for (var i = displayFieldSetting.length - 1; i >= 0; i--) {
                    if (displayFieldSetting[i].fieldType == 'Additional' && displayFieldSetting[i].header == ele) {
                      let inds: Number
                      inds = displayFieldSetting[i].ind
                      displayFieldSetting.splice(i, 1)
                      // rearrage index if the removed index greater than column ind
                      displayFieldSetting.forEach(element => {
                        let indd: Number = element.ind
                        if (element.fieldType == 'Additional') {
                          if (indd > inds) {
                            element.ind = element.ind - 1
                            element.columnDef = 'additionalFieldsArr[' + element.ind + '].fieldValue';
                          }
                        }
                      });
                    }
                  }
                }
              });

            }
          }
        })
        if(element.ReportSettings){
          this.db.updateReportSettings(element.id, element.ReportSettings)
        }

      }
    }
  }
}
