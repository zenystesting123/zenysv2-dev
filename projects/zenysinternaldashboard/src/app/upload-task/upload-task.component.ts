
import { DashboardTaskImport, Task } from './../../../../customers/src/app/data-models';
import { Component, OnInit } from '@angular/core';
import { UploadTaskService } from './upload-task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
export class taskDownloadCSV {
  constructor(
     public title: string,
     public id: string,
     public customerId: string,
     public firstName: string,
     public secondName: string,
     public companyName: string,
     public saleId:string,
     public saleTitle:string,
     public priority: string,
     public status: string,
     public description: string,
     public dueDate: any,
     public createdBy: string,
     public dateCreated:number,
     public assignedTo: string,
     public assignedToName: string,
  ) {

  }
}

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  superUserId: any;
  showData: boolean = false;
  loadingData: boolean = false;
  csvData: any;
  csvLine: number;//for storing each line of uploaded csv
  fileReaded: any;//to store whole csv uploaded data
  taskList: Task[] = []
  taskLength: number = 0;

  dataArray: DashboardTaskImport = {
    title:null,
    customerId: null,
    name: null,
    lastName: null,
    company: null,
    saleId:null,
    saleTitle:null,
    priority: null,
    status: null,
    description: null,
    dueDate: null,
    createdBy: null,
    date:null,
    assignedTo: null,
    assignedToName: null,


  }
  eachLines: any = [];
  stageHistory: any[] = [];//to store stage history array of uploading customers
  fieldsArray: any = [];//to store pushed array value of fields
  constructor(private db: UploadTaskService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  getTasks() {
    console.log(this.superUserId)
    this.showData = true;
    this.loadingData = true;
    // this.db.userDetails(this.superUserId).subscribe((val: any) => {

    // })
    this.db.getTask(this.superUserId)
      .subscribe((data) => {
        this.taskList = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Task;
        });
        console.log(this.taskList)
        this.taskLength = this.taskList?.length
        this.loadingData = false;
      })
  }
  downloadCsv(){
    this.csvData = [];

    if (this.taskList.length) {
      this.taskList.forEach((data) => {
        let arrayOfTasks: taskDownloadCSV = new taskDownloadCSV(

          data.title,
          data.id,
          data.customerId,
          data.name,
          data.lastName,
          data.company,
          data.saleId,
          data.saleTitle,
          data.priority,
          data.status,
          data.description,
          data.dueDate.toDate().toLocaleString(),
          data.createdBy,
          data.date,
          data.assignedTo,
          data.assignedToName
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
      saveAs(blob, 'tasksData.csv');
    }
    else {
      this._snackBar.open('No data to download', '', {
        duration: 2000,
      });
    }
  }
  openUpload() {
    let element: HTMLElement = document.getElementsByClassName('csv-selector')[0] as HTMLElement;
    element.click();
  }
  csvUploadFuntionTasks(fileInput: any) {

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

            this.dataArray.title = data[index++]//setting to date as uploaded date
            let newFN = this.dataArray.title.split('\n')
            this.dataArray.title = newFN[1]
            let taskId = data[index++]
            this.dataArray.customerId = data[index++];
            this.dataArray.name = data[index++];
            this.dataArray.lastName = data[index++]
            this.dataArray.company = data[index++]
            this.dataArray.saleId = data[index++]
            this.dataArray.saleTitle = data[index++]
            this.dataArray.priority = data[index++]
            this.dataArray.status=data[index++]
            this.dataArray.description = data[index++]
            this.dataArray.dueDate = new Date(data[index++])
            let dueTime= data[index++]
            this.dataArray.createdBy = data[index++]
            let createDate= this.numberExponentToLarge(data[index++])
            this.dataArray.date = +createDate;
            this.dataArray.assignedTo = data[index++]
            this.dataArray.assignedToName = data[index++]
            if (data.length >= 15) {
              if (this.dataArray.dueDate) {
                // currentSeqenceNumber=currentSeqenceNumber+1;
                // this.dataArray.sequenceNumber= currentSeqenceNumber
                // currentSeqenceNumber=this.dataArray.sequenceNumber;

                this.db.saveExcelTask(this.superUserId, taskId, this.dataArray)
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
   
}
