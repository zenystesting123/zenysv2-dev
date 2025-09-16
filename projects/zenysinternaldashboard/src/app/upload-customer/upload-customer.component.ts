import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer, StageValues } from 'src/app/data-models';
import { UploadCustomerService } from './upload-customer.service';
import { saveAs } from 'file-saver';
import { Location } from '@angular/common';
import { DashboardCustomerImport } from 'projects/customers/src/app/data-models';
import { Contact } from './upload-customer.model';
export class customerDownloadCSV {
  constructor(

    public customerFirstName: string,
    public customerSecondName: string,
    public companyName: string,
    public customerId: string,
    public status: string,
    public custStatusChangeDate: any,
    public priority: string,
    public address_line_1: string,
    public address_line_2: string,
    public district: string,
    public state: string,
    public country: string,
    public pin: number,
    public taxId: string,
    public code: string,
    public contact_No: string,
    public email: string,
    public dateCreated: string,
    public collectedAmount: number,
    public totalAmountCollected: number,
    public followupFlag: number,
    public saleOngoingValue: number,
    public salePipelineValue: number,
    public onGoingSales: number,
    public sequenceNumber: number,
    public custLeadValue: string,
    public invoiceAmount: number,
    public createdBy: string,
    public assignedTo: string,
    public assignedToName: string,
  ) {

  }
}
@Component({
  selector: 'app-upload-customer',
  templateUrl: './upload-customer.component.html',
  styleUrls: ['./upload-customer.component.scss']
})
export class UploadCustomerComponent implements OnInit {
  superUserId: any;
  showData: boolean = false;
  loadingData: boolean = false;
  csvData: any;
  customersList: Customer[] = []
  customersLength: number = 0;
  fieldListArray: any = [];
  eachLines: any = [];
  stageHistory: any[] = [];//to store stage history array of uploading customers
  fieldsArray: any = [];//to store pushed array value of fields
  customerSeq: number;
  filteredAdditionalField: any = [];
  fullAdditionalBoolean: any = [];
  stageValues: StageValues = {//array defnition to store in stage history
    date: null,
    stageName: null,
    stageNo: null
  };
  dataArray: DashboardCustomerImport = {
    firstName: null,
    secondName: null,
    companyName: null,
    status: null,
    custStatusChangeDate: null,
    priority: null,
    billingaddress1: null,
    billingaddress2: null,
    district: null,
    state: null,
    country: null,
    bpin: null,
    taxId: null,
    code: null,
    contactNo: null,
    email: null,
    dateCreated: null,
    collectedAmount: null,
    totalAmountCollected: null,
    followupFlag: null,
    saleOngoingValue: null,
    salePipelineValue: null,
    onGoingSales: null,
    sequenceNumber: null,
    custLeadValue: null,
    invoiceAmount: null,
    createdBy: null,
    assignedTo: null,
    assignedToName: null,
    searchTerm: {
      companyName: null,
      firstName: null,
      secondName: null
    },
    isCompany: false,
    additionalFieldsArray: []

  }
  fullFieldsArrray: any = [];//to store pushed array value of fields while uploading csv
  csvLine: number;//for storing each line of uploaded csv
  fileReaded: any;//to store whole csv uploaded data
  statusArray: any[];

  superUserIdtobeUploaded = '';
  superUserDetails = null;
  importedData: Array<any> = [];
  customer:any;
  subusers: Array<any> = [];

  importContacts: Contact[] = [];

  constructor(private db: UploadCustomerService,
    private location: Location, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.db.userDetails(this.superUserId).subscribe((val: any) => {
      this.superUserDetails = val;
    })
  }


  // starts here
  public async importDataFromCSVByType(event: any) {
    let fileContent = await this.getTextFromFile(event);
    console.log(fileContent);
    this.importedData = this.uploadCustomer(
      fileContent,
    );

    await this.doActions();
    for (let i = 0; i < this.customer.length; i++) {


      // this.db
      // .saveCustomer(this.superUserId, customer[i])
      // .then((res) => {
      //   console.log(res.id);
      //   this._snackBar.open('Successfully added', '', {
      //     duration: 2000,
      //   });
      // })
      // .catch((e) => {
      //   console.log(e)
      //   this._snackBar.open(
      //     'Failed to add customer',
      //     'error',
      //     {
      //       duration: 2000,
      //     }
      //   );
      // });

    }
  }

  doActions(){
    console.log(this.importedData);
    const assName = this.superUserDetails?.firstname;

    this.customer = this.importedData.map(
      ({
        firstName,
        secondName,
        companyName,
        billingaddress1,
        billingaddress2,
        district,
        state,
        country,
        bpin,
        code,
        contactNo,
        email,
        taxId,
        status,
        priority,
        assignedTo,
        leadSource,
        assignedToName,
        additionalFieldsArray
      }) => ({
        firstName,
        secondName,
        companyName,
        billingaddress1,
        billingaddress2,
        district,
        state,
        country,
        bpin,
        code,
        contactNo,
        email,
        taxId,
        status,
        priority,
        assignedTo,
        leadSource,
        assName
      })
    );

  }

  private async getTextFromFile(event:any){
    const file: File = event.target.files[0];
    let fileContent = await file.text();

    return fileContent;
  }
  uploadCustomer(csvText: string): Array<any>{
    // const propertyNames = csvText.slice(0, csvText.indexOf('\n')).split(',');

    const propertyNames = ['firstName', 'secondName', 'companyName', 'billingaddress1', 'billingaddress2', 'district', 'state', 'country', 'bpin', 'code', 'contactNo', 'email', 'taxId', 'status', 'priority', 'assignedTo', 'leadSource', 'input', 'i/p', 'date1', 'date2', 'i/p\r']
    console.log(propertyNames)
    const dataRows = csvText.slice(csvText.indexOf('\n') + 1).split('\n');

    let dataArray: any[] = [];

    console.log(propertyNames.length);
    console.log(dataRows)

    dataRows.forEach((row) =>{
      let values = row.split(',');
      console.log(values);
      let dataObj: any = new Object();
      for (let index = 0; index < propertyNames.length; index++) {
        const propertyName: string = propertyNames[index];
        console.log(propertyName);
        let value: any = values[index];
        console.log(value);

        if(value === ''){
          value = null;
        }

        dataObj[propertyName] = value;

        // if(typeof obj[propertyName] === 'undefined'){
        //   dataObj[propertyName] = null;
        // }else if(typeof obj[propertyName] === 'boolean'){
        //   dataObj[propertyName] = value.toLowerCase() === 'true'
        // }else if(typeof obj[propertyName] === 'number'){
        //   dataObj[propertyName] = Number(value)
        // }else if(typeof obj[propertyName] === 'string'){
        //   dataObj[propertyName] = value
        // }else if(typeof obj[propertyName] === 'object'){
        //   console.error('object failed')
        // }

      }
      console.log(dataObj)
      dataArray.push(dataObj)

    })
    return dataArray;
  }
  openK() {
    let element: HTMLElement = document.getElementsByClassName('csv-selector-2')[0] as HTMLElement;
    element.click();
  }





  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.db.importFromFile(bstr);

      console.log(data);

      // const header: string[] = Object.getOwnPropertyNames(new Contact());
      const importedData = data.slice(1, -1);

      console.log(importedData);

      // this.importContacts = importedData.map(arr => {
      //   const obj = {};
      //   for (let i = 0; i < header.length; i++) {
      //     const k = header[i];
      //     obj[k] = arr[i];
      //   }
      //   return <Contact>obj;
      // })

    };
    reader.readAsBinaryString(target.files[0]);

  }

  // ends here

  getSales() {
    console.log(this.superUserId)
    this.showData = true;
    this.loadingData = true;
    this.db.userDetails(this.superUserId).subscribe((val: any) => {
      this.fieldListArray = val?.customFieldsContact;
      this.filteredAdditionalField = [];
      this.fullAdditionalBoolean = [];
      this.statusArray = val.custStatus;
      //setting a true or false array based on active fields in additional fields array
      for (let i = 0; i < this.fieldListArray?.length; i++) {
        if (this.fieldListArray[i].isActive) {
          this.fullAdditionalBoolean.push(true)
        }
        else {
          this.fullAdditionalBoolean.push(false)
        }
      }
      for (let i = 0; i < this.fieldListArray?.length; i++) {
        if (this.fieldListArray[i].isActive) {
          this.filteredAdditionalField.push(this.fieldListArray[i]);
        }
      }
      console.log(this.filteredAdditionalField)
    })
    this.db.getCustomer(this.superUserId)
      .subscribe((data) => {
        this.customersList = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        console.log(this.customersList)
        this.customersLength = this.customersList?.length
        this.loadingData = false;
      })
  }
  downloadCsv() {
    this.csvData = [];
    let additionalField;
    if (this.customersList.length) {
      this.customersList.forEach((data) => {
        let stageLength = data.stageHistory?.length - 1;
        let custChangeDate = ""
        if (data?.stageHistory) {
          custChangeDate = data?.stageHistory[stageLength]?.date
        }
        additionalField = data.additionalFieldsArray;

        let arrayofCustomer: customerDownloadCSV = new customerDownloadCSV(

          data.firstName,
          data.secondName,
          data.companyName,
          data.id,
          data.status,
          custChangeDate,
          data.priority,
          data.billingaddress1,
          data.billingaddress2,
          data.district,
          data.state,
          data.country,
          data.bpin,
          data.taxId,
          data.code,
          data.contactNo,
          data.email,
          data.dateCreated,
          data.collectedAmount,
          data.totalAmountCollected,
          data.followUpFlag,
          data.saleOngoingValue,
          data.salePipelineValue,
          data.ongoingSales,
          data.sequenceNumber,
          data.custLeadValue,
          data.invoicedAmount,
          data.createdBy,
          data.assignedTo,
          data.assignedToName
        );
        if (additionalField != undefined && additionalField?.length != 0) {
          for (let i = 0; i < this.fieldListArray?.length; i++) {
            if (this.fieldListArray[i].isActive) {
              // console.log(eval( additionalField[i]))
              arrayofCustomer[eval('this.fieldListArray[i]?.fieldName')] =
                additionalField[i];
            }
          }
        }
        this.csvData.push(arrayofCustomer);
      });
      // console.log(this.csvData)
      const replacer = (key, value) => (value === null ? '' : value);
      const header = Object.keys(this.csvData[0]);
      let csv = this.csvData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      var blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'customerData.csv');
    }
    else {
      this._snackBar.open('No data to download', '', {
        duration: 2000,
      });
    }
  }
  openL() {
    let element: HTMLElement = document.getElementsByClassName('csv-selector')[0] as HTMLElement;
    element.click();
  }
  csvUploadFuntionContact(fileInput: any) {

    this.fileReaded = [];
    //getting uploaded file
    this.fileReaded = fileInput?.target?.files[0];
    var extension = fileInput?.target?.files[0].type
    var name = fileInput?.target?.files[0].name
    var ext = name?.split('.')[1];
    if (!this.fileReaded) {

      this.fileReaded = fileInput[0];
      extension = fileInput[0].type
      name = fileInput[0].name;
      ext = name.split('.')[1];
    }

    if (ext == "csv") {
      this.eachLines = [];
      let reader: FileReader = new FileReader();
      //reading uploaded file as text
      reader.readAsText(this.fileReaded);
      //loading each rows
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        //getting no: of customers in uploaded csv
        this.csvLine = (csv.split("\n").length) - 4;
        //calculating total number of customer after upload in this month
        //if no limit of customer present
        let Data = csv;
        let allData = Data.split(/\r|\r/);
        // console.log(allData)
        allData.forEach((val, indexs) => {
          if (indexs > 0) {
            val.split(/\n/);
            let data = val.split(',')
            if (data) {
              this.eachLines.push(data)
            }
          }
        })

        this.eachLines.pop();
        if (this.eachLines.length != 0) {
          this.eachLines.forEach((data, i) => {
            let index = 0;
            // let custId = data[index++]
            // let custIDArray = custId.split('\n')
            // custId = custIDArray[1]

            this.dataArray.firstName = data[index++]//setting to date as uploaded date
            let newFN = this.dataArray.firstName.split('\n')
            this.dataArray.firstName = newFN[1]
            this.dataArray.secondName = data[index++]//setting to date as uploaded date
            this.dataArray.companyName = data[index++];//default values which is not being uploaded
            let custId = data[index++]
            this.dataArray.status = data[index++];
            let latest_status_date = data[index++];
            this.dataArray.priority = data[index++];
            this.dataArray.billingaddress1 = data[index++]
            this.dataArray.billingaddress2 = data[index++]
            this.dataArray.district = data[index++]
            this.dataArray.state = data[index++]
            this.dataArray.country = data[index++]
            this.dataArray.bpin = data[index++]
            this.dataArray.taxId = data[index++]
            this.dataArray.code = data[index++]
            this.dataArray.contactNo = data[index++]
            this.dataArray.email = data[index++]
            this.dataArray.dateCreated = data[index++]
            this.dataArray.collectedAmount = data[index++]
            this.dataArray.totalAmountCollected = data[index++]
            this.dataArray.followupFlag = data[index++]
            this.dataArray.saleOngoingValue = data[index++]
            this.dataArray.salePipelineValue = data[index++]
            this.dataArray.onGoingSales = data[index++]
            this.dataArray.sequenceNumber = data[index++]
            this.dataArray.custLeadValue = data[index++]
            this.dataArray.invoiceAmount = data[index++]
            this.dataArray.createdBy = data[index++]
            this.dataArray.assignedTo = data[index++]
            this.dataArray.assignedToName = data[index++]
            this.fieldsArray = [];
            let j = 0;

            // looping through additional fields for setting additional field data in csv
            for (let i = 0; i < this.filteredAdditionalField?.length; i++) {
              let currentValue;
              currentValue = data[index++];
              //if no value there in additional field giving array a null input
              if (!currentValue) {
                this.fieldsArray.push(null)
              }
              //if value present value is pushed to existing array
              else {
                this.fieldsArray.push(currentValue)
              }

            }
            this.fullFieldsArrray = [];
            //looping through active array of additional fields
            for (let i = 0; i < this.fullAdditionalBoolean?.length; i++) {
              //IF field is active push value
              if (this.fullAdditionalBoolean[i] == true) {
                this.fullFieldsArrray.push(this.fieldsArray[j])
                //increment value since value is pushed
                j++
              }
              //IF field is not active push value as null
              else {
                this.fullFieldsArrray.push(null)
              }

            }
            this.dataArray.searchTerm.companyName = this.dataArray.companyName
            this.dataArray.searchTerm.firstName = this.dataArray.firstName
            this.dataArray.searchTerm.secondName = this.dataArray.secondName
            //setting additional field values array to dataArray
            this.dataArray.additionalFieldsArray = this.fullFieldsArrray

            //if second name is null in users data
            // if (!this.userSecondName) {
            //   this.userSecondName = " "
            // }
            //if company in csv company check is given as true
            if (this.dataArray.companyName != 'Individual') {
              this.dataArray.isCompany = true;
            }
            //if company name is null in csv
            if (this.dataArray.companyName == 'Individual') {
              this.dataArray.isCompany = false;

            }
            //if second name is null in csv
            if (!this.dataArray.secondName) {
              this.dataArray.secondName = "  ";
            }
            //if no status given in csv setting first status as default
            if (!this.dataArray.status) {
              this.dataArray.status = this.statusArray[0]
            }
            if (this.dataArray.status) {
              let selectedIndex;
              let loopOnce = false;
              //for setting stages history
              for (let i = 0; i < this.statusArray?.length; i++) {
                //getting status in status array by comparing in csv
                if (this.dataArray.status == this.statusArray[i]) {
                  //finding index of status from status array
                  selectedIndex = this.statusArray.findIndex((s) => s === this.statusArray[i]);
                  this.stageValues.date = latest_status_date
                  this.stageValues.stageName = this.statusArray[i]
                  this.stageValues.stageNo = selectedIndex
                  //pusing all datas into hsitory array
                  if (!loopOnce) {
                    this.stageHistory.push(this.stageValues)
                    loopOnce = true
                  }
                }
              }
            }


            let stageHistory = []
            if (this.stageHistory[0]) {
              stageHistory.push(this.stageHistory[0])
            }

            //if priority field is empty in csv
            if (!this.dataArray.priority) {
              this.dataArray.priority = "Medium"
            }
            //for finding the assigned to name
            // if (this.dataArray.assignedTo) {
            //   let length = this.subUsers?.length

            //   for (let i = 0; i < length; i++) {

            //     if (this.subUsers[i].userId == this.dataArray.assignedTo) {

            //       if (!this.subUsers[i].lastname) {
            //         this.subUsers[i].lastname = " ";
            //       }

            //       this.dataArray.assignedToName = this.subUsers[i].firstname + " " + this.subUsers[i].lastname
            //     }
            //   }


            // }
            //if no assigned to id is given
            if (data.length >= 17) {
              if (this.dataArray.firstName) {
                // currentSeqenceNumber=currentSeqenceNumber+1;
                // this.dataArray.sequenceNumber= currentSeqenceNumber
                // currentSeqenceNumber=this.dataArray.sequenceNumber;

                this.db.saveExcel(this.superUserId, custId, this.dataArray, stageHistory)
              }
              else {
                // this.errorWhileUpload = true
                this._snackBar.open("Some invalid datas neglected while uploading", " ", {
                  duration: 3000,
                });
              }
            }
            else {
              // this.errorWhileUpload = true
              this._snackBar.open("Invalid template format please check and retry", " ", {
                duration: 3000,
              });
            }
            //saving each customer in csv using above datas

          });
          // this.fulllayoutservice.updateSequenceNumber(this.superUserId,currentSeqenceNumber)

          // if (!this.errorWhileUpload) {
          this._snackBar.open("Customers added successfully", " ", {
            duration: 2000,
          });
          // }

          fileInput = [];
          return
        }
        else {
          this._snackBar.open("No data found to upload", " ", {
            duration: 2000,
          });
        }


      }
    }
    else {
      this._snackBar.open("CSV formated files are only accepted", " ", {
        duration: 2000,
      });
    }
  }



}
