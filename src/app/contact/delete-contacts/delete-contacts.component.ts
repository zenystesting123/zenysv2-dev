/**********************************************************************************
Description: Component is used to delete contact if logged in user is a superuser
             For Web and mobile
Inputs: userId, customer List Array String of to be deleted,custom field names from customer list/ customer details component
Outputs:
**********************************************************************************/
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Attachments,
  Customer,
  deleteLogModel,
  Expenses,
  FollowUps,
  Invoice,
  PaymentReceipt,
  Sales,
  Service,
  Task,
} from '../../data-models';
import { DeleteContactsService } from './delete-contacts.service';
import * as firebase from 'firebase';
import { NetworkCheckService } from '../../networkcheck.service';
import { Router } from '@angular/router';
import { FullLayoutService } from 'src/app/full-layout/full-layout.service';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { CustomerDetailsService } from '../customer-details/customer-details.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-delete-contacts',
  templateUrl: './delete-contacts.component.html',
  styleUrls: ['./delete-contacts.component.scss'],
})
export class DeleteContactsComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  userEmail = '';
  userId = '';
  sales: Sales[]; //array which holds all sales fetched from DB
  services: Service[] = []; //array which holds all services fetched from DB
  ests: Invoice[] = []; //array which holds all ests fetched from DB
  quots: Invoice[] = []; //array which holds all quotes fetched from DB
  invs: Invoice[] = []; //array which holds all invs fetched from DB
  colls: PaymentReceipt[] = []; //array which holds all colls fetched from DB
  exps: Expenses[] = []; //array which holds all exps fetched from DB
  followUps: FollowUps[]; //array which hols all followups fetched from DB
  tasks: Task[]; //array which all tasks fetched from DB
  attachments: any[]; //array which all attachments fetched from DB
  networkConnection: boolean; //network check
  isLoadedTask: boolean = false; //confirm if all tasks are loaded
  isLoadedSale: boolean = false; // confirm if all sales are loaded
  isLoadedAttachment: boolean = false; //confirm if all customers are loaded
  isLoadedFollwUps: boolean = false; //confirm if all followups are loaded
  fieldNameContact: string = 'Contact';
  spinner: boolean = false;
  commonServSub: Subscription;
  attSize: number;
  count = 0;
  customerLength = 0;
  custLength: number = 0; // for displaying the deleted doc count
  follCount = 0; //no of followups deleted
  tasksCount = 0; //no of tasks deleted
  custCount = 0; //no of customers deleted
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<DeleteContactsComponent>,
    public service: DeleteContactsService,
    @Inject(MAT_DIALOG_DATA) public data,
    public networkCheck: NetworkCheckService,
    public fullLayoutService: FullLayoutService,
    public commonService: CommonService
  ) {
    this.fieldNameContact = data.fieldNameContact;
    this.commonServSub = this.commonService.userDatas.subscribe((allData) => {
      if (allData) {
        this.attSize = allData.superUserDetails.totalAttachmentsSize;
        this.userEmail = allData.userDetails.email;
        this.userId = allData.userId;
      }
    });
  }

  ngOnInit(): void {
    if (!this.data.scenario) {
      let customer: Customer[] = JSON.parse(this.data.custListArrayString);
      this.custLength = customer.length;
    } else {
      this.custLength = 1;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  // fetch estimates from DB
  async getEstimates(id: string) {
    this.ests = await this.service.getDocsWithCustomer(
      this.data.userId,
      id,
      'Estimates'
    );
  }
  // fetch quotations from DB
  async getQuotations(id: string) {
    this.quots = await this.service.getDocsWithCustomer(
      this.data.userId,
      id,
      'Quotations'
    );
  }
  // fetch invs from DB
  async getInvoices(id: string) {
    this.invs = await this.service.getDocsWithCustomer(
      this.data.userId,
      id,
      'Invoices'
    );
  }
  // fetch sales
  async getSales(id: string) {
    this.sales = await this.service.getSalesWithCustomer(this.data.userId, id);
  }
  // fetch support
  async getServices(id: string) {
    this.services = await this.service.getServicesWithCustomer(
      this.data.userId,
      id
    );
  }
  // fetch collection
  async getColls(id: string) {
    this.colls = await this.service.getCollsWithCustomer(this.data.userId, id);
  }
  // fetch expenses
  async getExps(id: string) {
    this.exps = await this.service.getExpsWithCustomer(this.data.userId, id);
  }
  // fetch followups, delete followup and count is recorded
  async getCalls(id: string) {
    this.followUps = await this.service.getCallsWithCustomer(
      this.data.userId,
      id
    );
    this.follCount += this.followUps.length;
    this.followUps.forEach((followup) => {
      this.service.onDeleteFollowUps(this.data.userId, followup.id);
    });
  }
  // fetch tasks, delete task and count is recorded
  async getTasks(id: string) {
    this.tasks = await this.service.getTasksWithCustomer(this.data.userId, id);
    this.tasksCount += this.tasks.length;

    for (const taks of this.tasks) {
      //get Attachments in task
      let taskAttachments = await this.getAttachmentsTask(
        this.data.userId,
        taks.id
      );
      // delete att
      if (!!taskAttachments) {
        for (const att of taskAttachments) {
          if (!!att) {
            this.attSize = this.attSize - att.size;
            //update total size
            this.service.updateSize(this.data.userId, this.attSize);
            //delete from storage
            const storageRef = firebase.default.storage().ref();
            var desertRef = storageRef.child(att.path);
            await desertRef.delete();
          }
        }
      }
      this.service.onDeleteTasks(this.data.userId, taks.id);
    }
  }
  //get Attachments for task as a promise
  getAttachmentsTask(superId, id) {
    return new Promise<Attachments[]>((resolve) => {
      this.service
        .getAttachmentsTask(superId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          resolve(attachments);
        });
    });
  }

  // fetch attachments from customer's subcollection, and delete from Storage, update size at superuser
  async getAtts(id: string) {
    let attachments = await this.service.getAttsWithCustomer(
      this.data.userId,
      id
    );
    if (!!attachments) {
      attachments.forEach((att) => {
        if (!!att) {
          // update size in superuser profile
          this.attSize = this.attSize - att.size;
          this.service.updateSize(this.data.userId, this.attSize);
          // delete from storage coll
          const storageRef = firebase.default.storage().ref();
          var desertRef = storageRef.child(att.path);
          if (!!desertRef) {
            desertRef.delete();
          }
        }
      });
    }
  }
  // customer delete function
  async deleteCustomer() {
    // check customer id of sales/supp/salesdoc/collection/expens with the id of contact to be deleted
    // and display message 'The contacts having sales/supp/salesdoc/collection/expens is not deleted' if customer have any
    // otherwise delete contact and particular tasks, followups, attachments under tasks, followup collections, and attchment from Storage
    this.spinner = true;
    const cust: Customer[] = JSON.parse(this.data.custListArrayString);
    this.customerLength = cust.length;
    for (let i = 0; i < cust.length; i++) {
      await this.getSales(cust[i].id);
      await this.getServices(cust[i].id);
      await this.getEstimates(cust[i].id);
      await this.getQuotations(cust[i].id);
      await this.getInvoices(cust[i].id);
      await this.getColls(cust[i].id);
      await this.getExps(cust[i].id);
      if (
        this.sales.length > 0 ||
        this.services.length > 0 ||
        this.ests.length > 0 ||
        this.quots.length > 0 ||
        this.invs.length > 0 ||
        this.colls.length > 0 ||
        this.exps.length > 0
      ) {
        // cannot delete
        this.count++;
        // current item cannot be deleted, already deleted count is saving if count reached cust.length
        if (this.count === cust.length) {
          let deleteLog: deleteLogModel = {
            delByemail: this.userEmail,
            delByuserId: this.userId,
            dateNtime: new Date(),
            tasksDeleted: this.tasksCount,
            contDeleted: this.custCount,
            follDeleted: this.follCount,
          };
          this.service.addToDeleteLog(this.data.userId, deleteLog);
          if (this.custCount === 1) {
            this._snackBar.open(`${this.custCount} ${this.fieldNameContact} deleted`, '', {
              duration: 2000,
            });
          } else {
            this._snackBar.open(
              `${this.custCount} ${this.fieldNameContact}s deleted`,
              '',
              {
                duration: 2000,
              }
            );
          }
          this.spinner = false;
          this.dialogRef.close();
        }
      } else {
        await this.getCalls(cust[i].id); //delete calls
        await this.getTasks(cust[i].id); //delete tasks
        await this.getAtts(cust[i].id); //delete atts

        // delete contact
        this.service
          .onDeleteCustomer(this.data.userId, cust[i].id)
          .then((data) => {
            this.count++;
            this.custCount++;
            if (this.count === cust.length) {
              let deleteLog: deleteLogModel = {
                delByemail: this.userEmail,
                delByuserId: this.userId,
                dateNtime: new Date(),
                tasksDeleted: this.tasksCount,
                contDeleted: this.custCount,
                follDeleted: this.follCount,
              };
              this.service.addToDeleteLog(this.data.userId, deleteLog);
              if (this.custCount === 1) {
                this._snackBar.open(`${this.custCount} ${this.fieldNameContact} deleted`, '', {
                  duration: 2000,
                });
              } else {
                this._snackBar.open(
                  `${this.custCount} ${this.fieldNameContact}s deleted`,
                  '',
                  {
                    duration: 2000,
                  }
                );
              }
              this.spinner = false;
              this.dialogRef.close();
            }
          });
      }
    }
  }

  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.commonServSub?.unsubscribe();
  }
}
