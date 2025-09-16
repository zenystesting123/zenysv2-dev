import { DashboardSaleImport, Sales, StageValues } from 'projects/customers/src/app/data-models';
import { UploadSaleService } from './upload-sale.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { Location } from '@angular/common';
export class saleDownloadCSV {
  constructor(

    public saleTitle: string,
    public id: string,
    public customerId: string,
    public firstName: string,
    public secondName: string,
    public companyName: string,
    public searchOrg: string,
    public salesStage: string,
    public saleChangeDate: string,
    public priority: string,
    public description: string,
    public sequenceNumber: number,
    public EstimatedValue: number,
    public expenseAmount: number,
    public collectedAmount: number,
    public invoicedAmount: number,
    public collectionMode: string,
    public createdDate: string,
    public startDate: string,
    public expCompletionDate: string,
    public assignedTo: string,
    public assignedToName: string,

  ) {

  }
}

@Component({
  selector: 'app-upload-sale',
  templateUrl: './upload-sale.component.html',
  styleUrls: ['./upload-sale.component.scss']
})
export class UploadSaleComponent implements OnInit {
  superUserId: any;
  showData: boolean = false;
  loadingData: boolean = false;
  csvData: any;
  salesList: Sales[] = []
  saleLength: number = 0;
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
  statusArray: any[];
  dataArray: DashboardSaleImport = {
    saleTitle: null,
    saleId: null,
    customerId: null,
    firstName: null,
    secondName: null,
    companyName: null,
    searchOrg: null,
    salesStage: null,
    priority: null,
    description: null,
    sequenceNumber: null,
    estimatedValue: null,
    expenseAmount: null,
    collectedAmount: null,
    collectionMode: null,
    createdDate: null,
    startDate: null,
    expCompletionDate: null,
    invoicedAmount: null,
    assignedTo: null,
    assignedToName: null,
    additionalFieldsArray: [],
    searchTerm: {
      companyName: null,
      firstName: null,
      secondName: null
    },

  }
  fullFieldsArrray: any = [];//to store pushed array value of fields while uploading csv
  csvLine: number;//for storing each line of uploaded csv
  fileReaded: any;//to store whole csv uploaded data
  constructor(private db: UploadSaleService,
    private location: Location, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  getSales() {

    this.showData = true;
    this.loadingData = true;
    this.db.userDetails(this.superUserId).subscribe((val: any) => {
      this.fieldListArray = val?.customFieldsSale
      this.filteredAdditionalField = [];
      this.fullAdditionalBoolean = [];
      this.statusArray = val.saleStatus;
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

    })
    this.db.getSales(this.superUserId)
      .subscribe((data) => {
        this.salesList = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        console.log(this.salesList)
        this.saleLength = this.salesList?.length
        this.loadingData = false;
      })
  }
  downloadCsv() {
    this.csvData = [];
    let additionalField;
    if (this.salesList.length) {
      this.salesList.forEach((data) => {
        let stageLength = data.stageHistory?.length - 1;
        let saleChangeDate = ""
        saleChangeDate = data.stageHistory[stageLength]?.date
        additionalField = data.additionalFieldsArray;

        let arrayofSales: saleDownloadCSV = new saleDownloadCSV(

          data.saleTitle,
          data.id,
          data.customerId,
          data.firstName,
          data.secondName,
          data.companyName,
          data.searchOrg,
          data.salesStage,
          saleChangeDate,
          data.priority,
          data.description,
          data.sequenceNumber,
          data.EstimatedValue,
          data.expenseAmount,
          data.collectedAmount,
          data.invoicedAmount,
          data.collectionMode,
          data.createdDate,
          data.startDate.toDate().toLocaleString(),
          data.expCompletionDate.toDate().toLocaleString(),
          data.assignedTo,
          data.assignedToName
        );
        if (additionalField != undefined && additionalField?.length != 0) {
          for (let i = 0; i < this.fieldListArray?.length; i++) {
            if (this.fieldListArray[i].isActive) {
              // console.log(eval('this.fieldListArray[i].fieldName'), additionalField[i])
              arrayofSales[eval('this.fieldListArray[i].fieldName')] =
                additionalField[i];
                console.log(additionalField[i])
              // console.log(arrayofSales[eval('this.fieldListArray[i].fieldName')])
            }
          }
        }
        console.log(arrayofSales)

        this.csvData.push(arrayofSales);
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
      saveAs(blob, 'saleData.csv');
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
  csvUploadFuntionSales(fileInput: any) {

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

            this.dataArray.saleTitle = data[index++]//setting to date as uploaded date
            let newFN = this.dataArray.saleTitle.split('\n')
            this.dataArray.saleTitle = newFN[1]
            let saleId = data[index++]
            this.dataArray.customerId = data[index++];
            this.dataArray.firstName = data[index++];
            this.dataArray.secondName = data[index++]
            this.dataArray.companyName = data[index++]
            this.dataArray.searchOrg = data[index++]
            this.dataArray.salesStage = data[index++]
            let stage_Change_date = this.numberExponentToLarge(data[index++])
            // let stage_Change_date = data[index++]
            this.dataArray.priority = data[index++]
            this.dataArray.description = data[index++]
            this.dataArray.sequenceNumber = data[index++]
            this.dataArray.estimatedValue = data[index++]
            this.dataArray.expenseAmount = data[index++]
            this.dataArray.collectedAmount = data[index++]
            this.dataArray.invoicedAmount = data[index++]
            this.dataArray.collectionMode = data[index++]
            let createDate = this.numberExponentToLarge(data[index++])
            this.dataArray.createdDate = +createDate
            this.dataArray.startDate = new Date(data[index++])
            let date1 = data[index++]
            this.dataArray.expCompletionDate = new Date(data[index++])
            let date2 = data[index++]
            this.dataArray.assignedTo = data[index++]
            this.dataArray.assignedToName = data[index++]
            this.fieldsArray = [];
            let j = 0;

            // looping through additional fields for setting additional field data in csv
            for (let i = 0; i < this.filteredAdditionalField?.length; i++) {
              let currentValue: string;
              currentValue = data[index++];
              let date: boolean = currentValue?.includes("seconds")
              if (date) {
                // let dateFormat1 = currentValue.split(":")
                // let dateFormat2 = dateFormat1[1].split("\'")
                // let timestamp = +dateFormat2[0].replace(/\D/g, '')
                // let dateForm = new Date(timestamp);
                
                // currentValue = dateForm.getFullYear() + '-' + (dateForm.getMonth() + 1) + '-' + dateForm.getDate()
                // console.log(dateForm, timestamp)
                let append = data[index++]
              }
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
            this.dataArray.searchTerm.companyName = this.dataArray.companyName.toLowerCase(),
              this.dataArray.searchTerm.firstName = this.dataArray.firstName.toLowerCase(),
              this.dataArray.searchTerm.secondName = this.dataArray.secondName.toLowerCase(),
              //setting additional field values array to dataArray
              this.dataArray.additionalFieldsArray = this.fullFieldsArrray


            //if no status given in csv setting first status as default
            if (!this.dataArray.salesStage) {
              this.dataArray.salesStage = this.statusArray[0]
            }
            if (this.dataArray.salesStage) {
              let selectedIndex;
              let loopOnce = false;
              //for setting stages history
              for (let i = 0; i < this.statusArray?.length; i++) {
                //getting status in status array by comparing in csv
                if (this.dataArray.salesStage == this.statusArray[i]) {
                  //finding index of status from status array
                  selectedIndex = this.statusArray.findIndex((s) => s === this.statusArray[i]);
                  this.stageValues.date = +stage_Change_date
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
            console.log(this.dataArray)
            if (data.length >= 17) {
              if (this.dataArray.saleTitle) {
                // currentSeqenceNumber=currentSeqenceNumber+1;
                // this.dataArray.sequenceNumber= currentSeqenceNumber
                // currentSeqenceNumber=this.dataArray.sequenceNumber;

                this.db.saveExcelSales(this.superUserId, saleId, this.dataArray, stageHistory)
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
          this._snackBar.open("Sales added successfully", " ", {
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
  numberExponentToLarge(numIn) {
    numIn += "";                                            // To cater to numric entries
    var sign = "";                                           // To remember the number sign
    numIn.charAt(0) == "-" && (numIn = numIn.substring(1), sign = "-"); // remove - sign & remember it
    var str = numIn.split(/[eE]/g);                        // Split numberic string at e or E
    if (str.length < 2) return sign + numIn;                   // Not an Exponent Number? Exit with orginal Num back
    var power = str[1];                                    // Get Exponent (Power) (could be + or -)
    if (power == 0 || power == -0) return sign + str[0];       // If 0 exponents (i.e. 0|-0|+0) then That's any easy one

    var deciSp = 1.1.toLocaleString().substring(1, 2);  // Get Deciaml Separator
    str = str[0].split(deciSp);                        // Split the Base Number into LH and RH at the decimal point
    var baseRH = str[1] || "",                         // RH Base part. Make sure we have a RH fraction else ""
      baseLH = str[0];                               // LH base part.

    if (power > 0) {   // ------- Positive Exponents (Process the RH Base Part)
      if (power > baseRH.length) baseRH += "0".repeat(power - baseRH.length); // Pad with "0" at RH
      baseRH = baseRH.slice(0, power) + deciSp + baseRH.slice(power);      // Insert decSep at the correct place into RH base
      if (baseRH.charAt(baseRH.length - 1) == deciSp) baseRH = baseRH.slice(0, -1); // If decSep at RH end? => remove it

    } else {         // ------- Negative Exponents (Process the LH Base Part)
      let num = Math.abs(power) - baseLH.length;                               // Delta necessary 0's
      if (num > 0) baseLH = "0".repeat(num) + baseLH;                       // Pad with "0" at LH
      baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power);     // Insert "." at the correct place into LH base
      if (baseLH.charAt(0) == deciSp) baseLH = "0" + baseLH;                // If decSep at LH most? => add "0"
    }
    return sign + baseLH + baseRH;                                          // Return the long number (with sign)
  }

}
