import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer, Invoice, Sales } from 'src/app/data-models';
import { SearchtermScriptService } from './searchterm-script.service';
import { log } from 'console';
import { pipeline } from 'stream';
export class SearchTerm {
  public firstName: string = '';
  public secondName: string = '';
  public companyName: string = '';
}
// export class Collections {
//   public userId: string;
//   public docId: string;
//   public searchTerm: SearchTerm;
// }

@Component({
  selector: 'app-searchterm-script',
  templateUrl: './searchterm-script.component.html',
  styleUrls: ['./searchterm-script.component.scss'],
})
export class SearchtermScriptComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  customerSubscription: Subscription;
  saleSubscription: Subscription;
  estimateSubscription: Subscription;
  quotatiomSubscription: Subscription;
  invoiceSubscription: Subscription;
  itemDoc: any;
  customers: any = [];
  // customersAltered: import("/Users/mohan/Documents/GitHub/ZenysAngularMaterial/src/app/data-models").Customer[];
  customerCreated: number;

  sourceUser: string = 'OFzEPTfqgpUUWRJmgXQbZzWtq5g1';
  targetUser: string = 'ACPPx5NJTBQmMsyHmnIjUUNdcKw1';
  sales: any[] = [];
  saleCreated: number;
  items: any[];
  Quotes: any[] = [];
  quoteCreated: number;
  tasks: any[] = [];
  taskCreated: number;
  custStatusAge = [5, 5, 5, 5, 5, 5, 5];

  saleStatusAge = [5, 5, 5, 5, 5, 5, 5];
  users: any[] = [];
  subUserCreated: number = 0;
  products: any[] = [];
  prodCreated: number = 0;
  customerPipeline: any; //a duplicate variable
  // detailsCustomer: Collections[];
  // detailsSales: Collections[];
  // detailsEstimates: Collections[];
  // detailsQuotations: Collections[];
  // detailsInvoices: Collections[];
  constructor(
    private searchtermScriptService: SearchtermScriptService,
    private db: AngularFirestore
  ) {
    // this.detailsCustomer = [];
    // this.detailsSales = [];
    // this.detailsEstimates = [];
    // this.detailsQuotations = [];
    // this.detailsInvoices = [];
  }

  ngOnInit(): void { }

  // get all contact and update search term
  getAllContacts() {
    this.customerSubscription = this.searchtermScriptService
      .getAllCustomers()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          let searchTerm = new SearchTerm(); // adding the search term
          if (element.firstName) {
            searchTerm.firstName = element.firstName.toLowerCase(); //lower case of first name
          } else {
            searchTerm.firstName = ''; // if it is null we cant use lowercase on null
          }
          if (element.secondName) {
            searchTerm.secondName = element.secondName.toLowerCase(); //lower case of second name
          } else {
            searchTerm.secondName = ''; // if it is null we cant use lowercase on null
          }
          if (element.companyName) {
            searchTerm.companyName = element.companyName.toLowerCase(); //lower case of company name
          } else {
            searchTerm.companyName = ''; // if it is null we cant use lowercase on null
          }
          console.log('searchTerm' + JSON.stringify(searchTerm));
          //update the search term using the db path
          this.searchtermScriptService.onUpdate(
            dbPath,
            searchTerm.firstName,
            searchTerm.secondName,
            searchTerm.companyName
          );
        });
      });
  }
  // get all sales and update search term
  getAllSales() {
    this.saleSubscription = this.searchtermScriptService
      .getAllSale()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          let searchTerm = new SearchTerm();
          if (element.firstName) {
            searchTerm.firstName = element.firstName.toLowerCase();
          } else {
            searchTerm.firstName = '';
          }
          if (element.secondName) {
            searchTerm.secondName = element.secondName.toLowerCase();
          } else {
            searchTerm.secondName = '';
          }
          if (element.companyName) {
            searchTerm.companyName = element.companyName.toLowerCase();
          } else {
            searchTerm.companyName = '';
          }
          console.log('searchTerm' + JSON.stringify(searchTerm));
          //update the search term using the db path
          this.searchtermScriptService.onUpdate(
            dbPath,
            searchTerm.firstName,
            searchTerm.secondName,
            searchTerm.companyName
          );
        });
      });
  }
  // get all estimates and update search term
  getAllEstimates() {
    this.estimateSubscription = this.searchtermScriptService
      .getAllEstimates()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          let searchTermEstimate = new SearchTerm();
          if (element.customerData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error
            if (element.customerData.fname1) {
              searchTermEstimate.firstName =
                element.customerData.fname1.toLowerCase();
            } else {
              searchTermEstimate.firstName = '';
            }
            if (element.customerData.sname) {
              searchTermEstimate.secondName =
                element.customerData.sname.toLowerCase();
            } else {
              searchTermEstimate.secondName = '';
            }
            if (element.customerData.companyName) {
              searchTermEstimate.companyName =
                element.customerData.companyName.toLowerCase();
            } else {
              searchTermEstimate.companyName = '';
            }
            console.log('searchTerm' + JSON.stringify(searchTermEstimate));
            //update the search term using the db path
            this.searchtermScriptService.onUpdate(
              dbPath,
              searchTermEstimate.firstName,
              searchTermEstimate.secondName,
              searchTermEstimate.companyName
            );
          }
        });
      });
  }
  // get all quotations and update search term
  getAllQuotations() {
    this.quotatiomSubscription = this.searchtermScriptService
      .getAllQuotations()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          let searchTermEstimate = new SearchTerm();
          if (element.customerData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error
            if (element.customerData.fname1) {
              searchTermEstimate.firstName =
                element.customerData.fname1.toLowerCase();
            } else {
              searchTermEstimate.firstName = '';
            }
            if (element.customerData.sname) {
              searchTermEstimate.secondName =
                element.customerData.sname.toLowerCase();
            } else {
              searchTermEstimate.secondName = '';
            }
            if (element.customerData.companyName) {
              searchTermEstimate.companyName =
                element.customerData.companyName.toLowerCase();
            } else {
              searchTermEstimate.companyName = '';
            }
            console.log('searchTerm' + JSON.stringify(searchTermEstimate));
            //update the search term using the db path
            this.searchtermScriptService.onUpdate(
              dbPath,
              searchTermEstimate.firstName,
              searchTermEstimate.secondName,
              searchTermEstimate.companyName
            );
          }
        });
      });
  }
  // get all invoices and update search term
  getAllInvoices() {
    this.invoiceSubscription = this.searchtermScriptService
      .getAllInvoices()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          let searchTermEstimate = new SearchTerm();
          if (element.customerData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error
            if (element.customerData.fname1) {
              searchTermEstimate.firstName =
                element.customerData.fname1.toLowerCase();
            } else {
              searchTermEstimate.firstName = '';
            }
            if (element.customerData.sname) {
              searchTermEstimate.secondName =
                element.customerData.sname.toLowerCase();
            } else {
              searchTermEstimate.secondName = '';
            }
            if (element.customerData.companyName) {
              searchTermEstimate.companyName =
                element.customerData.companyName.toLowerCase();
            } else {
              searchTermEstimate.companyName = '';
            }
            console.log('searchTerm' + JSON.stringify(searchTermEstimate));
            //update the search term using the db path
            this.searchtermScriptService.onUpdate(
              dbPath,
              searchTermEstimate.firstName,
              searchTermEstimate.secondName,
              searchTermEstimate.companyName
            );
          }
        });
      });
  }
  //check all contact are updated
  CheckContacts() {
    this.customerSubscription = this.searchtermScriptService
      .getAllCustomers()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (!element.searchTerm) {
            console.log('path' + element.ref.path); //console the path to check
            console.log('id++++++' + element.id); // console cust id
          }
        });
      });
  }
  //check all sales are updated
  CheckSales() {
    this.saleSubscription = this.searchtermScriptService
      .getAllSale()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          //takes one by one sales
          if (element.customerData) {
            if (!element.searchTerm) {
              console.log('path' + element.ref.path); //console the path to check
              console.log('id++++++' + element.id); // console sale id
            }
          }
        });
      });
  }
  //check all estimates are updated
  CheckEstimates() {
    this.estimateSubscription = this.searchtermScriptService
      .getAllEstimates()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (!element.searchTerm) {
            console.log('path' + element.ref.path); //console the path to check
            console.log('id++++++' + element.id); // console doc id
          }
        });
      });
  }
  //check all quotations are updated
  CheckQuotations() {
    this.quotatiomSubscription = this.searchtermScriptService
      .getAllQuotations()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (!element.searchTerm) {
            console.log('path' + element.ref.path); //console the path to check
            console.log('id++++++' + element.id); // console doc id
          }
        });
      });
  }
  //check all invoices are updated
  CheckInvoices() {
    this.invoiceSubscription = this.searchtermScriptService
      .getAllInvoices()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (!element.searchTerm) {
            console.log('path' + element.ref.path); //console the path to check
            console.log('id++++++' + element.id); // console doc id
          }
        });
      });
  }
  // get all estimates and update prefix
  getAllEstimatesPrefix() {
    this.estimateSubscription = this.searchtermScriptService
      .getAllEstimates()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        let count = 0;
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          if (element.docData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error

            if (!element.docData.prefixAndDocNumber) {
              let prefixAndDocNumber = element.docData.docNumber;
              let docPrefix = '';
              console.log('searchTerm' + JSON.stringify(prefixAndDocNumber));
              //update the search term using the db path
              this.searchtermScriptService.onUpdatePrefix(
                dbPath,
                prefixAndDocNumber,
                docPrefix
              );
            }
          }
        });
      });
  }
  // get all estimates and update prefix
  getAllQuotationsPrefix() {
    this.estimateSubscription = this.searchtermScriptService
      .getAllQuotations()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          if (element.docData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error

            if (!element.docData.prefixAndDocNumber) {
              let prefixAndDocNumber = element.docData.docNumber;
              let docPrefix = '';
              console.log('searchTerm' + JSON.stringify(prefixAndDocNumber));
              //update the search term using the db path
              this.searchtermScriptService.onUpdatePrefix(
                dbPath,
                prefixAndDocNumber,
                docPrefix
              );
            }
          }
        });
      });
  }
  // get all estimates and update prefix
  getAllInvoicesPrefix() {
    this.estimateSubscription = this.searchtermScriptService
      .getAllInvoices()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref, // for getting the reference of db path
          } as any;
        });
        console.log('doc length' + doc.length);
        doc.forEach((element) => {
          console.log('path' + element.ref.path); //console the path to check
          let dbPath = element.ref.path;

          if (element.docData) {
            // check wherther th doc contains customer data. In sahred doc there is no customer data so it will cause error

            if (!element.docData.prefixAndDocNumber) {
              let prefixAndDocNumber = element.docData.docNumber;
              let docPrefix = '';
              console.log('searchTerm' + JSON.stringify(prefixAndDocNumber));
              //update the search term using the db path
              this.searchtermScriptService.onUpdatePrefix(
                dbPath,
                prefixAndDocNumber,
                docPrefix
              );
            }
          }
        });
      });
  }
  //check all invoices are updated
  CheckEstimatesPrefix() {
    this.invoiceSubscription = this.searchtermScriptService
      .getAllEstimates()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (element.docData) {
            if (!element.docData.prefixAndDocNumber) {
              console.log('path' + element.ref.path); //console the path to check
              console.log('id++++++' + element.id); // console doc id
            }
          }
        });
      });
  }
  //check all invoices are updated
  CheckQuotationPrefix() {
    this.invoiceSubscription = this.searchtermScriptService
      .getAllQuotations()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (element.docData) {
            if (!element.docData.prefixAndDocNumber) {
              console.log('path' + element.ref.path); //console the path to check
              console.log('id++++++' + element.id); // console doc id
            }
          }
        });
      });
  }
  //check all invoices are updated
  CheckInvoicesPrefix() {
    this.invoiceSubscription = this.searchtermScriptService
      .getAllInvoices()
      .pipe(take(2))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
            ref: e.payload.doc.ref,
          } as any;
        });
        doc.forEach((element) => {
          if (element.docData) {
            if (!element.docData.prefixAndDocNumber) {
              console.log('path' + element.ref.path); //console the path to check
              console.log('id++++++' + element.id); // console doc id
            }
          }
        });
      });
  }

  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }

    if (this.saleSubscription) {
      this.saleSubscription.unsubscribe();
    }

    if (this.estimateSubscription) {
      this.estimateSubscription.unsubscribe();
    }

    if (this.quotatiomSubscription) {
      this.quotatiomSubscription.unsubscribe();
    }

    if (this.invoiceSubscription) {
      this.invoiceSubscription.unsubscribe();
    }
  }
  async getInvoiceAndUpdateSaleAssignedToOwner() {
    let doc = await this.searchtermScriptService.getAllInvoiePromise();
    let docNew = doc.map((e) => {
      return {
        id: e.payload.doc.id,
        ...(e.payload.doc.data() as {}),
        ref: e.payload.doc.ref,
        refId: e.payload.doc.ref.path,
      } as any;
    });
    console.log('doc length == ' + docNew.length);
    for (var val of docNew) {
      if (val.docData?.saleID) {
        let userId = val.refId.split('/')[1];
        console.log('path == ' + val.refId);
        let sale = await this.getSaleRec(userId, val.docData.saleID);
        if (sale) {
          if (sale.assignedTo) {
            console.log('sale assigned to == ' + sale.assignedTo);

            let updated = await this.searchtermScriptService
              .onUpdateDoc(val.refId, sale.assignedTo)
              .then((res) => {
                console.log('updated ');
              });
            console.log('one loop completed');
          }
        }
      }
    }
    console.log('completed');
  }
  async getQuotationAndUpdateSaleAssignedToOwner() {
    let doc = await this.searchtermScriptService.getAllQuotationPromise();
    let docNew = doc.map((e) => {
      return {
        id: e.payload.doc.id,
        ...(e.payload.doc.data() as {}),
        ref: e.payload.doc.ref,
        refId: e.payload.doc.ref.path,
      } as any;
    });
    console.log('doc lenth == ' + docNew.length);
    for (var val of docNew) {
      if (val.docData?.saleID) {
        let userId = val.refId.split('/')[1];
        console.log('path == ' + val.refId);
        let sale = await this.getSaleRec(userId, val.docData.saleID);
        if (sale) {
          if (sale.assignedTo) {
            console.log('sale assigned to == ' + sale.assignedTo);

            let updated = await this.searchtermScriptService
              .onUpdateDoc(val.refId, sale.assignedTo)
              .then((res) => {
                console.log('updated');
              });
            console.log('one loop completed');
          }
        }
      }
    }
    console.log('completed');
  }
  async getEstimateAndUpdateSaleAssignedToOwner() {
    let doc = await this.searchtermScriptService.getAllEstimatePromise();
    let docNew = doc.map((e) => {
      return {
        id: e.payload.doc.id,
        ...(e.payload.doc.data() as {}),
        ref: e.payload.doc.ref,
        refId: e.payload.doc.ref.path,
      } as any;
    });
    console.log('doc lenth == ' + docNew.length);
    for (var val of docNew) {
      if (val.docData?.saleID) {
        let userId = val.refId.split('/')[1];
        console.log('path == ' + val.refId);
        let sale = await this.getSaleRec(userId, val.docData.saleID);
        if (sale) {
          if (sale.assignedTo) {
            console.log('sale assigned to == ' + sale.assignedTo);

            let updated = await this.searchtermScriptService
              .onUpdateDoc(val.refId, sale.assignedTo)
              .then((res) => {
                console.log('upated');
              });
            console.log('one loop completed');
          }
        }
      }
    }
    console.log('completed');
  }
  async getSaleRec(userId, saleID): Promise<Sales> {
    return await this.searchtermScriptService.readSaleRecordPromise(
      userId,
      saleID
    );
  }
  async customerNumberUpdate() {
    let userList = await this.searchtermScriptService.getAllUsers();
    console.log('user length' + userList.length);
    for (var val of userList) {
      let customerList =
        await this.searchtermScriptService.getAllCustomerPromise(val.id);
      await this.searchtermScriptService.updateUserCount(
        val.id,
        customerList.length
      );
      console.log('customer length' + customerList.length);
      console.log('userid' + val.id);
      let num = 0;
      for (var value of customerList) {
        num++;
        await this.searchtermScriptService.updateCustomerCount(
          val.id,
          value.id,
          num
        );
      }
      console.log('one cycle done' + num);
    }
    console.log('completed');
  }
  async saleNumberUpdate() {
    let userList = await this.searchtermScriptService.getAllUsers();
    console.log('user length' + userList.length);
    for (var val of userList) {
      let saleList = await this.searchtermScriptService.getAllSalePromise(
        val.id
      );
      await this.searchtermScriptService.updateUserSaleCount(
        val.id,
        saleList.length
      );
      console.log('sale length' + saleList.length);
      console.log('userid' + val.id);
      let num = 0;
      for (var value of saleList) {
        num++;
        await this.searchtermScriptService.updateSaleCount(
          val.id,
          value.id,
          num
        );
      }
      console.log('one cycle done' + num);
    }
    console.log('completed');
  }

  //Read all customers for a give user from db
  async copyCustomerfromDB() {
    this.customers = [];
    this.customers =
      await this.searchtermScriptService.getAllCustomerUserPromise(
        this.sourceUser
      );
  }

  //Add the customers to new user
  async pasteCustomertoDB() {
    let customerId = '';
    let customer = {};
    this.customerCreated = 0;
    this.customers.forEach(async (cust) => {
      customerId = cust.id;
      delete cust.id;
      customer = cust;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createCustomer(
        this.targetUser,
        customerId,
        customer
      );
      //function to create a customer
      this.customerCreated++;
    });

    //console.log("Customer read from db", this.customers)
  }

  //Read all sales for a give user from db
  async copySalesfromDB() {
    this.sales = [];
    this.sales = await this.searchtermScriptService.getAllSalesUserPromise(
      this.sourceUser
    );
  }

  //Add the customers to new user
  async pasteSalestoDB() {
    let saleId = '';
    let saleData = {};
    this.saleCreated = 0;
    this.sales.forEach(async (sale) => {
      saleId = sale.id;
      delete sale.id;
      saleData = sale;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createSales(
        this.targetUser,
        saleId,
        saleData
      );
      //function to create a customer
      this.saleCreated++;
    });

    //console.log("Customer read from db", this.customers)
  }

  //Read all items from sales and add to new account
  async readSaleItems() {
    this.items = [];
    this.items =
      await this.searchtermScriptService.getAllItemsFromSalePromise();
    console.log('No of items read', this.items.length);
    let itemData = {};
    let itemCount = 0;
    this.items.forEach(async (item) => {
      let userId = item.refId.split('/')[1];
      let saleId = item.refId.split('/')[3];
      let itemId = item.refId.split('/')[5];
      delete item.id;
      delete item.ref;
      delete item.refId;
      itemData = item;
      if (userId == this.sourceUser) {
        console.log(userId, saleId, itemId);
        itemCount++;
        await this.searchtermScriptService.addItemtoSale(
          this.targetUser,
          saleId,
          itemId,
          item
        );
      }
    });
    console.log('No of items added', itemCount);
  }

  //Read all quotes and write to new user

  async copyQuotesfromDB() {
    this.Quotes = [];
    this.Quotes = await this.searchtermScriptService.getAllEstimatesUserPromise(
      this.sourceUser
    );
    let quoteId = '';
    let quotation = {};
    this.quoteCreated = 0;
    this.Quotes.forEach(async (quote) => {
      quoteId = quote.id;
      delete quote.id;
      quotation = quote;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createQuote(
        this.targetUser,
        quoteId,
        quotation
      );
      //function to create a customer
      this.quoteCreated++;
    });
  }
  //Read all tasks and write to new user

  async copyTasksfromDB() {
    this.tasks = [];
    this.tasks = await this.searchtermScriptService.getAllTasksUserPromise(
      this.sourceUser
    );
    let taskId = '';
    let taskData = {};
    this.taskCreated = 0;
    this.tasks.forEach(async (task) => {
      taskId = task.id;
      delete task.id;
      taskData = task;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createTask(
        this.targetUser,
        taskId,
        taskData
      );
      //function to create a customer
      this.taskCreated++;
    });
  }

  //Read all subuser profiles and write to new user

  async copySubusers() {
    this.users = [];
    this.users = await this.searchtermScriptService.getAllSubUserPromise(
      this.sourceUser
    );
    let subUserId = '';
    let subUserData = {};
    this.subUserCreated = 0;
    this.users.forEach(async (user) => {
      subUserId = user.id;
      delete user.id;
      subUserData = user;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createSubUser(
        this.targetUser,
        subUserId,
        subUserData
      );
      //function to create a customer
      this.subUserCreated++;
    });
  }

  //Read all subuser profiles and write to new user

  async copyProducts() {
    this.products = [];
    this.products = await this.searchtermScriptService.getAllProductsPromise(
      this.sourceUser
    );
    console.log('Products loaded', this.products);
    let prodId = '';
    let prodData = {};
    this.prodCreated = 0;
    this.products.forEach(async (prod) => {
      prodId = prod.id;
      delete prod.id;
      prodData = prod;
      //console.log(customerId, customer);
      await this.searchtermScriptService.createProduct(
        this.targetUser,
        prodId,
        prodData
      );
      //function to create a customer
      this.prodCreated++;
    });
  }

  //Add the customers to new user

  //console.log("Customer read from db", this.customers)

  async userProfileUpdate() {
    let userList = await this.searchtermScriptService.getAllUsers();
    console.log('user length' + userList.length);
    for (var val of userList) {
      console.log('user id' + val.id);
      await this.searchtermScriptService.updateUserProfile(
        val.id,
        this.custStatusAge,
        this.saleStatusAge
      );
    }
    console.log('Completed');
  }

  async followupFieldUpdate() {
    let doc = await this.searchtermScriptService.getAllFollowup();
    let docNew = doc.map((e) => {
      return {
        id: e.payload.doc.id,
        ...(e.payload.doc.data() as {}),
        ref: e.payload.doc.ref,
        refId: e.payload.doc.ref.path,
      } as any;
    });
    console.log('doc lenth == ' + docNew.length);
    for (var val of docNew) {
      if (val.followUpDate && val.datePlaced) {
        console.log('doc path == ' + val.refId);
        await this.searchtermScriptService.updateFollowUpField(
          val.refId,
          val.followUpDate,
          val.followUpTime ? val.followUpTime : null,
          val.datePlaced
        );
      }

    }
    console.log('completed');
  }



  async customFieldsContactUpdate(userId) {
    console.log(userId)
    const newCustArray: any = []  //stores new customFieldsContact array
    let user =await this.searchtermScriptService.getSingleUser(userId);
    //loop through the user object
    // userList.forEach(async user => {
      console.log('firstName == ' + user.firstname)
      if (user.customFieldsContact) { //if custmFieldsContact fields exist
        const customFieldsArray = user.customFieldsContact
        console.log("Before custFieldsArray: "+ JSON.stringify(customFieldsArray))
        console.log("Length: "+ customFieldsArray.length)
        let j = 0
        for (let i = 0; i < customFieldsArray.length; i++) {
          //check if the field is Active
          if (customFieldsArray[i].isActive == true) {
            //store it into the new array
            newCustArray[j++] = customFieldsArray[i]
          }
        }
        //get all the customers of this user
        const custArray = await this.searchtermScriptService.getCustWithAddFields(userId);
        if (custArray.length != 0) {
          //loops through each customer
          custArray.forEach(async (customer, indexes, custArray) => {
            //checking if additionalFieldsArr present
            if (customer.additionalFieldsArray) {
              console.log("Customer Name: " + customer.firstName)
              console.log("Before addFieldArray: "+customer.additionalFieldsArray)
              //storing additional fields array in local variable
              let k = 0
              const additionalFields = customer.additionalFieldsArray;
              const newAddArray: any = []
              for (let i = 0; i < additionalFields.length; i++) {
                //check if corresponding customFieldsContact field is active
                if (customFieldsArray[i].isActive == true) {
                  //store it in new array
                  //if(additionalFields.length )
                    newAddArray[k++] = additionalFields[i]
                }
              }
              console.log("After addFieldArray: "+newAddArray)
              //updating the additionalFieldsArray field in customer collection in db
              await this.searchtermScriptService.updateAdditionalFieldsContact(userId, customer.id, newAddArray);
            }
          });
        }

        console.log("After custFieldsArray: "+ JSON.stringify(newCustArray))
        //update customFieldsContact Record after updating all customer records
        await this.searchtermScriptService.updateCustomFieldsContact(userId, newCustArray);
        console.log("completed")
      }
    // })
  }

  async customFieldsSaleUpdate(userId) {
    console.log(userId)
    const newCustArray: any = []  //stores new customFieldsSale array
    let user =await this.searchtermScriptService.getSingleUser(userId);
    //loop through the user object
    // userList.forEach(async user => {
      console.log('firstName == ' + user.firstname)
      if (user.customFieldsSale) { //if custmFieldsContact fields exist
        const customFieldsArray = user.customFieldsSale
        console.log("Before custFieldsArray: "+ JSON.stringify(customFieldsArray))
        console.log("Length: "+ customFieldsArray.length)
        let j = 0
        for (let i = 0; i < customFieldsArray.length; i++) {
          //check if the field is Active
          if (customFieldsArray[i].isActive == true) {
            //store it into the new array
            newCustArray[j++] = customFieldsArray[i]
          }
        }
        //get all the sales of this user
        const saleArray = await this.searchtermScriptService.getSalesWithAddFields(userId);
        if (saleArray.length != 0) {
          //loops through each customer
          saleArray.forEach(async (sale, indexes, saleArray) => {
            //checking if additionalFieldsArr present
            if (sale.additionalFieldsArray) {
              console.log("Sale Name: " + sale.firstName)
              console.log("Before addFieldArray: "+sale.additionalFieldsArray)
              //storing additional fields array in local variable
              let k = 0
              const additionalFields = sale.additionalFieldsArray;
              const newAddArray: any = []
              for (let i = 0; i < additionalFields.length; i++) {
                //check if corresponding customFieldsSale field is active
                if (customFieldsArray[i].isActive == true) {
                  //store it in new array
                  //if(additionalFields.length )
                    newAddArray[k++] = additionalFields[i]
                }
              }
              console.log("After addFieldArray: "+newAddArray)
              //updating the additionalFieldsArray field in sale collection in db
              await this.searchtermScriptService.updateAdditionalFieldsSale(userId, sale.id, newAddArray);
            }
          });
        }

        console.log("After custFieldsArray: "+ JSON.stringify(newCustArray))
        //update customFieldsSale Record after updating all sales records
        await this.searchtermScriptService.updateCustomFieldsSale(userId, newCustArray);
        console.log("completed")
      }
    // })
  }

  async transformContactArray(userId) {
    console.log(userId)
    const custArray = await this.searchtermScriptService.getCustWithAddFields(userId);
    custArray.forEach(async (customer, indexes, custArray) => {
      //checking if additionalFieldsArr present
      if (customer.additionalFieldsArray) {
        console.log("additionalFieldsArray: " + JSON.stringify(customer.additionalFieldsArray))
        //storing additional fields array in local variable
        const additionalFields = customer.additionalFieldsArray;
        let additionalFieldsArr = {}
        for(let i=0; i<additionalFields.length; i++) {
          additionalFieldsArr[i] = {'fieldValue' : additionalFields[i]}
        }

        console.log("additionalFieldsArr: " + JSON.stringify(additionalFieldsArr))
        //updating the additionalFieldsArr field in customer collection in db
        await this.searchtermScriptService.updateAdditionalFieldsArrContact(userId, customer.id, additionalFieldsArr);

      }
    });
    console.log("completed")
  }

  async transformSaleArray(userId) {
    console.log(userId)
    const saleArray = await this.searchtermScriptService.getSalesWithAddFields(userId);
    saleArray.forEach(async (sale, indexes, saleArray) => {
      //checking if additionalFieldsArr present
      if (sale.additionalFieldsArray) {
        console.log("additionalFieldsArray: " + JSON.stringify(sale.additionalFieldsArray))
        //storing additional fields array in local variable
        const additionalFields = sale.additionalFieldsArray;
        let additionalFieldsArr = {}
        for(let i=0; i<additionalFields.length; i++) {
          additionalFieldsArr[i] = {'fieldValue' : additionalFields[i]}
        }

        console.log("additionalFieldsArr: " + JSON.stringify(additionalFieldsArr))
        //updating the additionalFieldsArr field in sales collection in db
        await this.searchtermScriptService.updateAdditionalFieldsArrSale(userId, sale.id, additionalFieldsArr);

      }
    });
    console.log("completed")
  }
  async customFieldUpdate(userId) {
    //let userList = await this.searchtermScriptService.getAllUsers();
    //console.log('user length == ' + userList.length);
    await this.searchtermScriptService.updateServiceFieldUserProfile(
      userId
    );
    console.log('Completed adding new fields to user id', userId);
  }
  //function to add contactOwner in Sales and Services
  async addContactOwner(userId){
    console.log(userId)

    let user = await this.searchtermScriptService.getSingleUser(userId);
    //loop through the user object
    console.log('firstName == ' + user.firstname)

    //get all the sales of this user
    const saleArray = await this.searchtermScriptService.getSalesWithAddFields(userId);
    console.log(saleArray.length)
    if (saleArray.length != 0) {
      //loops through each sale
      saleArray.forEach(async (sale) => {
        //get customer data of the customer tagged
        const customerData = await this.searchtermScriptService.getCustomerData(userId, sale.customerId);
        console.log("Sale "+sale.customerId + "**" + customerData.assignedTo)
        //update sales contactOwner with its tagged customer's assignedTo id
        await this.searchtermScriptService.updateSaleContactOwner(userId, sale.id, customerData.assignedTo)
      })
    }

    //get all the services of this user
    const serviceArray = await this.searchtermScriptService.getService(userId);
    if (serviceArray.length != 0) {
      //loops through each service
      serviceArray.forEach(async (service) => {
        //get customer data of the customer tagged
        const customerData = await this.searchtermScriptService.getCustomerData(userId, service.customerId);
        console.log("Service "+service.customerId + "**" + customerData.assignedTo)
        //update sales contactOwner with its tagged customer's assignedTo id
        await this.searchtermScriptService.updateServiceContactOwner(userId, service.id, customerData.assignedTo)
      })
    }

    console.log("Updating sales and services completed")
  }
  async mergeDateAndTime(userId) {
    console.log("userId = " + userId);
    const followupList = await this.searchtermScriptService.getFollowup(userId);
    console.log("length = "+followupList.length);

    followupList.forEach(async (element,index) => {
      if (element.callStartTime) {
        var time_splitEdit = element.callStartTime.split(':');
        var date = element.callStartDate.toDate();
        console.log("callStartDate =  " + date);
        date.setHours(Number(time_splitEdit ? time_splitEdit[0] : null), Number(time_splitEdit ? time_splitEdit[1] : null), 0);   // Set hours, minutes and seconds
        console.log("callStartTime =  " + element.callStartTime);
        console.log("comibed =  " + date);
        await this.searchtermScriptService.updateFollowupdate(userId, element.id, date)
        console.log("one cycle done = "+index);
      }
    });
  }
  async addReportAndDashboard(userId) {
    let users = []
    users = await this.searchtermScriptService.getAllSubUserPromise(userId);
    await this.updateReportAndDashboar(userId, 'super user')
    console.log("sub users length = " + users.length);
    let index = 0
    for (const subUser of users) {

      console.log("start cycle " + index);
      let user = await this.searchtermScriptService.getSingleUser(subUser.userId);
      let reportSettings = user.ReportSettings;
      let dashboardSettings = user.dashboardSettings;
      await this.searchtermScriptService.addSampleReport(subUser.userId, reportSettings);
      dashboardSettings?.forEach(element => {
        element.reportsArray?.forEach(ele => {
          ele.reportId = ele.reportIndex.toLocaleString();
          delete ele.reportIndex;
        });
      });
      await this.searchtermScriptService.addSampleDashBoardReport(subUser.userId, dashboardSettings);
      console.log("end cycle " + index);
      index++;
    }
    console.log("completed");

  }
  async updateReportAndDashboar(id, index) {

    console.log("start cycle " + index);
    let user = await this.searchtermScriptService.getSingleUser(id);
    let reportSettings = user.ReportSettings;
    let dashboardSettings = user.dashboardSettings;
    await this.searchtermScriptService.addSampleReport(id, reportSettings);
    dashboardSettings?.forEach(element => {
      element.reportsArray?.forEach(ele => {
        ele.reportId = ele.reportIndex.toLocaleString();
        delete ele.reportIndex;
      });
    });
    await this.searchtermScriptService.addSampleDashBoardReport(id, dashboardSettings);
    console.log("end cycle " + index);
  }

  async taskStatusChange(userId) {
    console.log(userId)
    // to create tasStatusOption array under superUSer
    this.searchtermScriptService.taskStatusarray(userId);
    let taskUnderuser = [];

    //get all task under user
    taskUnderuser = await this.searchtermScriptService.getAllTasksUserPromise(userId);
    let taskCount = taskUnderuser.length
    console.log("total task",taskCount)
    // console.log("All task",taskUnderuser)
    let updatedTaskCount = 0;
    taskUnderuser.forEach((ele) => {
      if (ele.status == "OPEN" || ele.status == "COMPLETED") {
        ele.status = `${ele.status[0].toUpperCase()}${ele.status.slice(1).toLowerCase()}`;
        //update modified status value
        this.searchtermScriptService.updateTaskStatus(userId, ele.id, ele.status).then((res) => {
          updatedTaskCount++;
        });
      }
    })
    console.log("Total updated tasks:", updatedTaskCount);
    console.log("Length of taskUnderuser array:", taskCount);
  }
  async addContactNumberInSales(superUserId){
    console.log('superUserId  = '+superUserId);
    
    let allSales = await this.searchtermScriptService.getAllSaleForPipeline(
      superUserId
    );
    console.log('sales length = '+allSales.length);
    
    for (let i = 0; i < allSales.length; i++) {
      if(allSales[i].customerId){
        const customerData = await this.searchtermScriptService.getCustomerData(superUserId, allSales[i].customerId);
        if(customerData){
          let countryCode= customerData.code ? customerData.code : null;
          let contactNumber= customerData.contactNo ? customerData.contactNo : null;
          let altCountryCode= customerData.altContactCode ? customerData.altContactCode : null;
          let altContactNumber= customerData.alternateContactNumber ? customerData.alternateContactNumber : null;
          await this.searchtermScriptService.updateContactNumber(superUserId, allSales[i].id, countryCode,contactNumber,altCountryCode,altContactNumber)    
          console.log("updated num = "+ i +'**'+countryCode + "**" + contactNumber +'***'+altCountryCode+'***'+altContactNumber)
        }else{
          await this.searchtermScriptService.updateContactNumber(superUserId, allSales[i].id, null, null, null, null)    
          console.log("updated num = "+ i +'**'+ null + "**" + null +'***'+ null +'***'+ null )
        }
        
      } else {
        await this.searchtermScriptService.updateContactNumber(superUserId, allSales[i].id, null, null, null, null)    
        console.log("updated num = "+ i +'**'+ null + "**" + null +'***'+ null +'***'+ null )
      }
    }
    console.log('completed');
    
  }
  //add contact number in support
  async addContactNumberInService(superUserId){
    console.log('superUserId  = '+superUserId);
    
    let allServices = await this.searchtermScriptService.getAllServiceForPipeline(
      superUserId
    );
    console.log('services length = '+allServices.length);
    
    for (let i = 0; i < allServices.length; i++) {
      if(allServices[i].customerId){
        const customerData = await this.searchtermScriptService.getCustomerData(superUserId, allServices[i].customerId);
        if(customerData){
          let countryCode= customerData.code ? customerData.code : null;
          let contactNumber= customerData.contactNo ? customerData.contactNo : null;
          let altCountryCode= customerData.altContactCode ? customerData.altContactCode : null;
          let altContactNumber= customerData.alternateContactNumber ? customerData.alternateContactNumber : null;
          await this.searchtermScriptService.updateContactNumberService(superUserId, allServices[i].id, countryCode,contactNumber,altCountryCode,altContactNumber)    
          console.log("updated num = "+ i +'**'+countryCode + "**" + contactNumber +'***'+altCountryCode+'***'+altContactNumber)
        }
        else{
          await this.searchtermScriptService.updateContactNumberService(superUserId, allServices[i].id, null, null, null, null)    
          console.log("updated num = "+ i +'**'+ null + "**" + null +'***'+ null +'***'+ null)
        }
      } else {
        await this.searchtermScriptService.updateContactNumberService(superUserId, allServices[i].id, null, null, null, null)    
        console.log("updated num = "+ i +'**'+ null + "**" + null +'***'+ null +'***'+ null)
      }
    }
    console.log('completed');
  }

  //transform pipeline column in sharedleadCaptureForm collection
  async leadcapturePipeline(userId) {
    console.log("UserId: " + userId)
    let pipelineIds = [];
    let statusIds = [];
    //get pipeline id's from users collection
    await this.getCustomerPipelines(userId);
    if(this.customerPipeline){
      this.customerPipeline.forEach(pipeline => {
        pipelineIds.push(pipeline['pipelineId']);
        let stages = [];
        pipeline.pipelineStages.forEach(stage => {
          stages.push(stage.stageId);
        })
        statusIds.push(stages);
      })
      console.log("Pipeline Ids", pipelineIds);
      console.log("Stage Ids",statusIds);
    
    
      let leadcaptureId;
      //find sharedLeadCaptureForm record with selected userId
      const formField = await this.searchtermScriptService.getFormField(userId);
      if(formField){
        formField.forEach(async (field) => {
          console.log("LeadCaptureId: " + field.id);
          leadcaptureId = field.id;
          
          //get leadCaptureFields array
          let leadCaptureFields = field.leadCaptureFields;
          let defaultPipeline;
          leadCaptureFields.forEach((field, index) => {
            if(field){
              console.log("**** Form"+index+"****");
              Object.values(field).forEach(col => {
                if(col.columnDef === 'pipeline'){
                  console.log("Before pipeline categories", col.categories);
                  col.categories = pipelineIds;
                  console.log("After pipeline categories", col.categories)
                  defaultPipeline = col.defaultValue;
                  console.log("Pipeline defaultValue before change:" + col.defaultValue)
                  //change pipeline value with id
                  col.defaultValue = pipelineIds[defaultPipeline];
                  console.log("Pipeline defaultValue after change:" + col.defaultValue)
                }
                if(col.columnDef === 'status'){
                  console.log("Before status categories", col.categories);
                  col.categories = statusIds[defaultPipeline];
                  console.log("Changed categories", col.categories);
                  console.log("Status default value before change: "+col.defaultValue);
                  //get index of stage name
                  let stageIndex = this.customerPipeline[defaultPipeline].pipelineStages.findIndex(name => name.name === col.defaultValue);
                  col.defaultValue = this.customerPipeline[defaultPipeline].pipelineStages[stageIndex].stageId;
                  console.log("Changed Status: "+col.defaultValue);
                }
              })
            }
          })
          console.log("Formfields after change",leadCaptureFields);
          field.leadCaptureFields = leadCaptureFields;
        });
        
        //remove id before saving in db
        delete formField[0].id;
        console.log("Final Object", formField[0]);
        //update db
        this.searchtermScriptService.updateFormFields(leadcaptureId, formField[0]).then(res => {
          console.log("completed");
        })
        
      } else {
        console.log("No record found");
      }
    } else {
      console.log("No pipeline data available");
    }
  }

  //transform pipeline column in fnForms collection
  async fbPipeline(userId) {
    console.log("UserId: " + userId)
    let pipelineIds = [];
    let statusIds = [];
    //get pipeline id's from users collection
    await this.getCustomerPipelines(userId);
    
    if(this.customerPipeline){
      this.customerPipeline.forEach(pipeline => {
        pipelineIds.push(pipeline['pipelineId']);
        let stages = [];
        pipeline.pipelineStages.forEach(stage => {
          stages.push(stage.stageId);
        })
        statusIds.push(stages);
      })
      console.log("Pipeline Ids", pipelineIds);
      console.log("Stage Ids",statusIds);
    
  
  
  //find all form records with selected userId
  const formFields = await this.searchtermScriptService.getFbFormField(userId);
  if(formFields){
    console.log("No of forms: " + formFields.length)
    formFields.forEach(async (field, index) => {
      console.log("**** Form"+index+"****");
      console.log("FormId: " + field.formId);
      //get form fields array
      let fieldsObj = field.Fields;
      let defaultPipeline;
      
      Object.values(fieldsObj).forEach(col => {
        if(col.columnDef === 'selectedContactPipeline'){
          console.log("Before pipeline categories", col.categories);
          col.categories = pipelineIds;
          console.log("After pipeline categories", col.categories)
          defaultPipeline = col.defaultValue;
          console.log("Pipeline defaultValue before change:" + col.defaultValue)
          //change pipeline value with id
          col.defaultValue = pipelineIds[defaultPipeline];
          console.log("Pipeline defaultValue after change:" + col.defaultValue)
        }
        if(col.columnDef === 'status'){
          console.log("Before status categories", col.categories);
          col.categories = statusIds[defaultPipeline];
          console.log("Changed categories", col.categories);
          console.log("Status default value before change: ", col.defaultValue);
          //get index of stage name
          let stageIndex = col.defaultValue;
          
          col.defaultValue = this.customerPipeline[defaultPipeline].pipelineStages[stageIndex].stageId;
          console.log("Changed Status: "+col.defaultValue);
          
        }
      })
        
      console.log("Formfields after change",fieldsObj);
      
      //update db
      await this.searchtermScriptService.updateFbFormFields(field.formId, fieldsObj).then(res => {
        console.log("Form"+index+" Updated");
        if(index == formFields.length - 1){
          console.log("Completed")
        }
      })
    });
  } else {
    console.log("No record found");
  }
    }
  }

  getCustomerPipelines(userId) {
    return new Promise<void>((resolve) => {
      this.searchtermScriptService
        .getCustomerPipeline(userId)
        .subscribe((customerPipelines) => {
          console.log(customerPipelines);
          this.customerPipeline = customerPipelines.customerPipelines;
          resolve();
        });
    });
  }
  async changeContactNumberType(superUserId:string){
    console.log('superUserId  = '+superUserId);
    
    let allCustomer = await this.searchtermScriptService.getAllCustomersForNumberUpdation(
      superUserId
    );
    console.log('customer length = '+allCustomer.length);
    for (let i = 0; i < allCustomer.length; i++) {
      if(allCustomer[i]?.contactNo || allCustomer[i]?.alternateContactNumber){
        if((typeof(allCustomer[i]?.contactNo) == "number" ) || (typeof(allCustomer[i]?.alternateContactNumber) == "number") ){
          console.log(" customer id "+allCustomer[i].id +' = ' + typeof(allCustomer[i]?.contactNo) +' = ' + typeof(allCustomer[i]?.alternateContactNumber))
          let contactNo = allCustomer[i]?.contactNo ? allCustomer[i].contactNo+'':null;
          let alternateContactNumber = allCustomer[i]?.alternateContactNumber ? allCustomer[i].alternateContactNumber+'':null;
          await this.searchtermScriptService.updateContactNumberType(superUserId, allCustomer[i].id, contactNo, alternateContactNumber)
        }
      }
    }
    console.log("completed")
  }
}
