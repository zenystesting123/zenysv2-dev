import { Component, OnInit } from '@angular/core';
import { ScriptsService } from './scripts.service';


@Component({
  selector: 'app-script-runner',
  templateUrl: './script-runner.component.html',
  styleUrls: ['./script-runner.component.scss']
})
export class ScriptRunnerComponent implements OnInit {
  customers: any;
  searchtermScriptService: any;
  noOfCustomer: any;

  constructor(
    private scriptsservice:ScriptsService
  ) { }

  ngOnInit(): void {
  }
  // delete(){
  //   this.scriptsservice.delete()
  // }
  script1(){
    this.scriptsservice.script1()
  }
  script2(){
    this.scriptsservice.script2()
  }
  getAllMaincustomers(){
    this.scriptsservice.getAllCustomersinMainAccount()
  }
  getAllUsers(){
    this.scriptsservice.getAllusers()
  }
  removeContacts(){
    //read the customers by date range
    this.scriptsservice.deleteContacts();

  }

  async readCustomerfromDB(){
    this.customers = await this.searchtermScriptService.getAllCustomerUserPromise();
    this.noOfCustomer = this.customers.length();
    let customerId = '';
    let customer ={};
    //this.customers.forEach(async cust=>{
      //customerId = cust.id;
     //delete cust.id;
     //customer = cust;
      //console.log(customerId, customer);
      //await this.searchtermScriptService.createCustomer(customerId, customer)
      //function to create a customer
    //})

    //console.log("Customer read from db", this.customers)



  }
}
