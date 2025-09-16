import { UploadProductService } from './upload-product.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductModel } from 'src/app/data-models';
import { saveAs } from 'file-saver';
import { DashboardProductImport } from 'projects/customers/src/app/data-models';
export class productDownloadCSV {
  constructor(
     public prodName: string,
     public prodDes: string,
     public hsnCode:string,
     public id: string,
     public availabilty: boolean,
     public unit: string,
     public unitPrice:number,
     public currency: string,
     public discount:number,
     public taxType:string,
     public vatRate: number,
     public sgst: number,
     public igst: number,
     public cgst: number,
     public dateCreated:number
  ) {

  }
}
@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss']
})
export class UploadProductComponent implements OnInit {

  superUserId: any;
  showData: boolean = false;
  loadingData: boolean = false;
  csvData: any;
  csvLine: number;//for storing each line of uploaded csv
  fileReaded: any;//to store whole csv uploaded data
  productsList: ProductModel[] = []
  productLength: number = 0;
  fieldListArray: any = [];
  filteredAdditionalField: any = [];
  fullAdditionalBoolean: any = [];
  eachLines: any = [];
  dataArray: DashboardProductImport = {
    prodName: null,
    prodDes: null,
    hsnCode:null,
    availabilty: null,
    unit: null,
    unitPrice:null,
    currency: null,
    discount:null,
    taxType:null,
    vatRate: null,
    sgst: null,
    igst: null,
    cgst: null,
    dateCreated:null
  }
  constructor(private db: UploadProductService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  getTasks() {
    console.log(this.superUserId)
    this.showData = true;
    this.loadingData = true;
    this.db.userDetails(this.superUserId).subscribe((val: any) => {
      this.fieldListArray = val?.customFieldsContact;
      this.filteredAdditionalField = [];
      this.fullAdditionalBoolean = [];
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
    this.db.getProducts(this.superUserId)
      .subscribe((data) => {
        this.productsList = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as ProductModel;
        });
        console.log(this.productsList)
        this.productLength = this.productsList?.length
        this.loadingData = false;
      })
  }
  downloadCsv(){
    this.csvData = [];

    if (this.productsList.length) {
      this.productsList.forEach((data) => {
        let arrayOfTasks: productDownloadCSV = new productDownloadCSV(

          data.prodName,
          data.prodDes,
          data.hsnCode,
          data.id,
          data.availability,
          data.unit,
          data.unitPrice,
          data.currency,
          data.discount,
          data.taxType,
          data.vatRate,
          data.sgst,
          data.igst,
          data.cgst,
          data.dateCreated,

        );
        this.csvData.push(arrayOfTasks);
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
      saveAs(blob, 'productsData.csv');
    }
    else {
      this._snackBar.open('No data to download', '', {
        duration: 2000,
      });
    }
  }
  csvUploadFuntionProducts(fileInput: any) {

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

            this.dataArray.prodName = data[index++]//setting to date as uploaded date
            let newFN = this.dataArray.prodName.split('\n')
            this.dataArray.prodName = newFN[1]

            this.dataArray.prodDes = data[index++];
            this.dataArray.hsnCode = data[index++];
             let prodId = data[index++]
            this.dataArray.availabilty = data[index++]
            this.dataArray.unit = data[index++]
            this.dataArray.unitPrice = data[index++]
            this.dataArray.currency = data[index++]
            this.dataArray.discount = data[index++]
            this.dataArray.taxType=data[index++]
            this.dataArray.vatRate = data[index++]
            this.dataArray.sgst =  data[index++]
            this.dataArray.igst = data[index++]
            this.dataArray.cgst = data[index++]
            let createDate= this.numberExponentToLarge(data[index++])
            this.dataArray.dateCreated =+createDate

            console.log(this.dataArray)
            if (data.length >= 14) {
              if (this.dataArray.prodName) {

                // this.db.saveExcelProd(this.superUserId, prodId, this.dataArray)
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
          this._snackBar.open("Tasks added successfully", " ", {
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
    numIn +="";                                            // To cater to numric entries
    var sign="";                                           // To remember the number sign
    numIn.charAt(0)=="-" && (numIn =numIn.substring(1),sign ="-"); // remove - sign & remember it
    var str = numIn.split(/[eE]/g);                        // Split numberic string at e or E
    if (str.length<2) return sign+numIn;                   // Not an Exponent Number? Exit with orginal Num back
    var power = str[1];                                    // Get Exponent (Power) (could be + or -)
    if (power ==0 || power ==-0) return sign+str[0];       // If 0 exponents (i.e. 0|-0|+0) then That's any easy one

    var deciSp = 1.1.toLocaleString().substring(1,2);  // Get Deciaml Separator
    str = str[0].split(deciSp);                        // Split the Base Number into LH and RH at the decimal point
    var baseRH = str[1] || "",                         // RH Base part. Make sure we have a RH fraction else ""
        baseLH = str[0];                               // LH base part.

     if (power>0) {   // ------- Positive Exponents (Process the RH Base Part)
        if (power> baseRH.length) baseRH +="0".repeat(power-baseRH.length); // Pad with "0" at RH
        baseRH = baseRH.slice(0,power) + deciSp + baseRH.slice(power);      // Insert decSep at the correct place into RH base
        if (baseRH.charAt(baseRH.length-1) ==deciSp) baseRH =baseRH.slice(0,-1); // If decSep at RH end? => remove it

     } else {         // ------- Negative Exponents (Process the LH Base Part)
       let num= Math.abs(power) - baseLH.length;                               // Delta necessary 0's
        if (num>0) baseLH = "0".repeat(num) + baseLH;                       // Pad with "0" at LH
        baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power);     // Insert "." at the correct place into LH base
        if (baseLH.charAt(0) == deciSp) baseLH="0" + baseLH;                // If decSep at LH most? => add "0"
     }
    return sign + baseLH + baseRH;                                          // Return the long number (with sign)
    }
  openUpload() {
    let element: HTMLElement = document.getElementsByClassName('csv-selector')[0] as HTMLElement;
    element.click();
  }

}
