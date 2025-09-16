/**********************************************************************************
Description: Component is used to re-assign contact to subuser
             Only for Web
Inputs: userId, assignedToName, customer List Array String of to be reassigned, userType, custom field names from customer list component
Outputs:
**********************************************************************************/
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { resolve } from 'dns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer, FollowUps, Invoice, Sales, Service, Task } from '../../data-models';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { ReAssignSaleService } from './re-assign-sale.service';

@Component({
  selector: 'app-re-assign-sale',
  templateUrl: './re-assign-sale.component.html',
  styleUrls: ['./re-assign-sale.component.scss'],
})
export class ReAssignSaleComponent implements OnInit {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  checked = false;
  sales: Sales[]; //this array holds all sales fetched DB
  services: Service[];
  tasks: Task[];
  followUps: FollowUps[];
  estimates: Invoice[];
  invoices: Invoice[];
  quotations: Invoice[];
  spinner: boolean = false; //to display spinner while reassigning operation in DB
  count = 0; // to confirm dialog closes only after the reassigning
  saleupdated: boolean = true;
  customerLength = 0;
  custLength:number=0;// for displaying the deleted doc count
  // lastStatusOption=
  constructor(
    public dialogRef: MatDialogRef<ReAssignSaleComponent>,
    public salesService: ReAssignSaleService,
    @Inject(MAT_DIALOG_DATA) public data,
    private snack: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    let customer: Customer[] = JSON.parse(this.data.custListArrayString);
    this.custLength = customer.length;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // re-assigning function
  async onReassign() {
    this.spinner = true;
    let val: Customer[] = JSON.parse(this.data.custListArrayString);
    this.customerLength = val.length;
    for (let i = 0; i < val.length; i++) {
      if (this.checked === true) {
        if (this.data.userType == 'Main User') {

          await this.getSales(val[i].id, val[i].assignedTo);
          this.sales.forEach(async (ele) => {
            await this.getEstimates(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','main');
            await this.getQuotations(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','main');
            await this.getInvoices(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','main');
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateSaleMain(
                this.data.userId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in sale collection

          await this.getServices(val[i].id, val[i].assignedTo);
          this.services.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateServiceMain(
                this.data.userId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in service collection

          await this.getTasks(val[i].id, val[i].assignedTo);
          this.tasks.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateTaskMain(
                this.data.userId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in task collection

          await this.getFollowUps(val[i].id, val[i].assignedTo);
          this.followUps.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
            this.salesService.onUpdateFollowUpsMain(
              this.data.userId,
              ele.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: ele.assignedTo,
                  assignedToName: ele.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === ele.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                ele.changeLog
              )
            );
          }); //update in followups collection
          await this.getEstimates(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','main');

          await this.getQuotations(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','main');

          await this.getInvoices(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','main');
          if(val[i].assignedTo != this.data.subUserId){
            this.salesService.onUpdateCustomerMain(
              this.data.userId,
              val[i].id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: val[i].assignedTo,
                  assignedToName: val[i].assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === val[i].associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === val[i].associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                val[i].changeLog
              )
            ).then(resp => {
              this.count++;
              if (i == val.length - 1) {
                this.spinner = false;
                this.dialogRef.close();
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            }) //update in customer collection
          } else {
            this.count++;
            if (i == val.length - 1) {
            this.spinner = false;
                this.dialogRef.close();
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
          }
        } else {
          await this.getSales(val[i].id, val[i].assignedTo);
          this.sales.forEach(async (ele) => {
            await this.getEstimates(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','sub');
            await this.getQuotations(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','sub');
            await this.getInvoices(ele.id,ele.assignedTo,'docData.saleID','docData.saleAssignedToOwner','fromsale','sub');
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateSaleSub(
                this.data.userId,
                this.data.subUserId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in sale collection

          await this.getServices(val[i].id, val[i].assignedTo);
          this.services.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateServiceSub(
                this.data.userId,
                this.data.subUserId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in sale collection

          await this.getTasks(val[i].id, val[i].assignedTo);
          this.tasks.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
              this.salesService.onUpdateTaskSub(
                this.data.userId,
                this.data.subUserId,
                ele.id,
                this.data.assignedToName,
                this.data.branchId,
                ChangeLogComponent.saveLog(
                  'CustomerlistComponent',
                  this.data.userId,
                  this.data.assignedToName,
                  {
                    assignedTo: ele.assignedTo,
                    assignedToName: ele.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === ele.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: this.data.subUserId,
                    assignedToName: this.data.assignedToName,
                    ...(this.data.branches.length > 0 && {
                      associatedBranch:
                        this.data.branches.length > 0
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                            ? this.data.branches.find(
                                (item) => item.id === this.data.branchId
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  ele.changeLog
                )
              );
          }); //update in task collection

          await this.getFollowUps(val[i].id, val[i].assignedTo);

          this.followUps.forEach((ele) => {
            if(ele.assignedTo  && ele.assignedTo != this.data.subUserId)
            this.salesService.onUpdateFollowUpsSub(
              this.data.userId,
              this.data.subUserId,
              ele.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: ele.assignedTo,
                  assignedToName: ele.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === ele.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                ele.changeLog
              )
            );
          }); //update in followups collection

          await this.getEstimates(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','sub');

          await this.getQuotations(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','sub');

          await this.getInvoices(val[i].id, val[i].assignedTo,'customerData.custID','customerData.contactAssignedToOwner','fromcust','sub');
          if(val[i].assignedTo  && val[i].assignedTo != this.data.subUserId){
            this.salesService.onUpdateCustomerSub(
              this.data.userId,
              val[i].id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: val[i].assignedTo,
                  assignedToName: val[i].assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === val[i].associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === val[i].associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                val[i].changeLog
              )
            ).then(res=>{
              this.count++;
              if (i == val.length - 1) {
                this.spinner = false;
                this.dialogRef.close();
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            }) //update in customer collection
          } else {
            this.count++;
            if (i == val.length - 1) {
            this.spinner = false;
            this.dialogRef.close();
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
          }
        }
      } else {
        if (this.data.userType == 'Main User') {
          if(val[i].assignedTo && val[i].assignedTo != this.data.subUserId){
            this.salesService.onUpdateCustomerMain(
              this.data.userId,
              val[i].id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: val[i].assignedTo,
                  assignedToName: val[i].assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === val[i].associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === val[i].associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                val[i].changeLog
              )
            ).then(resp=>{
              this.count++;
              if (i == val.length - 1) {
                this.spinner = false;
                this.dialogRef.close();
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            }) //update in customer collection
          } else {
            this.count++;
            if (i == val.length - 1) {
            this.spinner = false;
            this.dialogRef.close();
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
          }
        } else {
          if(val[i].assignedTo && val[i].assignedTo != this.data.subUserId){
            this.salesService.onUpdateCustomerSub(
              this.data.userId,
              val[i].id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'CustomerlistComponent',
                this.data.userId,
                this.data.assignedToName,
                {
                  assignedTo: val[i].assignedTo,
                  assignedToName: val[i].assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === val[i].associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === val[i].associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                val[i].changeLog
              )
            ).then(response=>{
              this.count++;
              console.log('this.count', this.count)
              if (i == val.length - 1) {
                this.spinner = false;
                this.dialogRef.close();
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            }) //update in customer collection
          } else {
            this.count++;
            if (i == val.length - 1) {
            this.spinner = false;
            this.dialogRef.close();
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
          }
        }
      }
    }
  }
  getServices(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getAllServicesWithCustomer(this.data.userId, id, assignedTo)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.services = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          resolve();
        });
    });
  }
  getSales(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getAllSalesWithCustomer(this.data.userId, id, assignedTo)
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
  getTasks(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getTaskswithCustomer(this.data.userId, id, assignedTo)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.tasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          resolve();
        });
    });
  }
  getFollowUps(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getFollowUpsWithCustomer(this.data.userId, id, assignedTo)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.followUps = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          resolve();
        });
    });
  }
  async getEstimates(id:string,assignedTo,queryField1,queryField2,scenario,userType) {
    let estimates = await this.salesService.getDocsWithCustomer(this.data.userId,id,assignedTo,'Estimates',queryField1,queryField2);
    estimates.forEach((ele) => {
      if(userType=='main'){
        this.salesService.onUpdateDocsMain(
          this.data.userId,
          ele.id,
          'Estimates',
          scenario
        );
      }else{
        this.salesService.onUpdateDocsSub(
          this.data.userId,
          this.data.subUserId,
          ele.id,
          'Estimates',
          scenario
        );
      }
    }); //update in estimates collection
  }
  async getQuotations(id:string,assignedTo,queryField1,queryField2,scenario,userType) {
    let quotations = await this.salesService.getDocsWithCustomer(this.data.userId, id,assignedTo,'Quotations',queryField1,queryField2);
    quotations.forEach((ele) => {
      if(userType=='main'){
        this.salesService.onUpdateDocsMain(
          this.data.userId,
          ele.id,
          'Quotations',
          scenario
        );
      }else{
        this.salesService.onUpdateDocsSub(
          this.data.userId,
          this.data.subUserId,
          ele.id,
          'Quotations',
          scenario
        );
      }

    }); //update in quotations collection
  }
  async getInvoices(id:string,assignedTo,queryField1,queryField2,scenario,userType) {
    let invoices = await this.salesService.getDocsWithCustomer(this.data.userId,id,assignedTo,'Invoices',queryField1,queryField2);
    invoices.forEach((ele) => {
      if(userType=='main'){
        this.salesService.onUpdateDocsMain(
          this.data.userId,
          ele.id,
          'Invoices',
          scenario
        );
      }else{
        this.salesService.onUpdateDocsSub(
          this.data.userId,
          this.data.subUserId,
          ele.id,
          'Invoices',
          scenario
        );
      }
    }); //update in invoices collection
  }

  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
