/**********************************************************************************
Description: Component-confirmation popup- for updating the sale status, both in web and mobile
Inputs: Data from customer details - userid, users sale stage array, particular sales id,
        sales current stage, new to be updated stage, current stage history
Outputs:
**********************************************************************************/
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { CommonService } from '../common.service';
import {
  prodmodel,
  ProductInSaleModel,
  ProductModel,
  StageHistoryModel,
  StageValues,
} from '../data-models';
import { ChangesalestatService } from './changesalestat.service';
import { NetworkCheckService } from '../networkcheck.service';

@Component({
  selector: 'app-changesalestatdialog',
  templateUrl: './changesalestatdialog.component.html',
  styleUrls: ['./changesalestatdialog.component.scss'],
})
export class ChangesalestatdialogComponent implements OnInit {
  userId: string = ''; //logged in user id
  saleId: string = ''; //particular sale is
  status: string = ''; //to be updated status
  date: any = null; //to track record of stage history

  stageHistories: StageHistoryModel[] = []; //stage history array
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  }; //stage history model
  saleStatus = []; //sale stages of logged in user
  currentStage: string = null; //current stage, this has to be changed
  currentHistory: StageHistoryModel[] = null; //current history, if updating this is also has to be pushed
  fieldNameSale: string = 'Sale'; //customisable field names
  fieldNameItems = 'Products and Service';

  prodArray = [];
  productArray = [];
  products: ProductModel[] = []; //all products fetched in create sale to show in autocomplete
  selectedProduct: any = null;
  myControlProd = new FormControl();
  filteredOptionsProd: Observable<ProductModel[]>;
  addProdOption = false;
  // products fields
  productName: string;
  unitPrice: number;
  discount: number;
  quantity: number = 1;
  prod = new prodmodel();
  showFormOpt = false;
  showProd = false;
  orderWonCheck = false;
  tobeDeleteArray = [];
  prodArrayCopyForCancel = [];
  isMobilesize = false;
  productEstValue = 0;
  saleEstValue = 0;
  inPipeline = false;
  won = false;
  lost = false;
  changeLogParams: any;
  rejectionReasonArr: string[] = []; //reason for rejection options stored as an array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
  rejectionReasonValue = ''; //variable to hold selected reason for rejection
  disableReAssign = false; //button disable if reassigning/edit is disabled for logged in user
  rejectionReasonMandatory = false; //if reason for rejection is mandatory in settings
  rejectionReasonDisplay = false; //whetehr reason for rejection field display or not
  statusName = ''; //name of the status corresponding to this stageId
  pipelineId = 0; //corresponding pipeline
  statusFieldName = 'Stage'

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ChangesalestatdialogComponent>,
    private service: ChangesalestatService,
    private _snackBar: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService
  ) {
    // checkScreenSize
    this.isMobilesize = this.commonService.isMobilesize;

    // injecting data from sales-details is assigning to local variables
    this.userId = data.userId; //superuser id
    this.saleId = data.saleId; //sale id for which updation should be done
    this.status = data.status; //new status
    this.saleStatus = data.saleStatus; //stage array under super user profile
    this.currentStage = data.currentStage; //prior sale status to be updated
    this.currentHistory = data.currentHistory; //current stage history
    this.fieldNameSale = data.fieldNameSale; //Sale field name
    this.fieldNameItems = data.fieldNameItems;
    this.orderWonCheck = data.orderWonCheck;
    this.saleEstValue = data.estValue;
    this.productEstValue = data.estValue;
    this.productArray = data.products;
    this.changeLogParams = data.changeLogParams;
    this.statusName = data.statusName; //assigning to local variable
    this.pipelineId = data.pipelineId;
    this.statusFieldName = data.statusFieldName;

    const rejArr = data.rejectionReasonArr?.filter((n) => n);

    // assigning to local variables
    if (!!rejArr && rejArr.length > 0) {
      this.rejectionReasonArr = rejArr;
      this.rejectionReasonArrPresent = true;
    } else {
      this.rejectionReasonArr[0] = 'No options are available';
      this.rejectionReasonArrPresent = false;
    }

    this.disableReAssign = data.disableReAssign;
    this.rejectionReasonMandatory = data.rejectionReasonMandatory;
    this.rejectionReasonDisplay = data.rejectionReasonDisplay;

    this.prodArray = data.products?.map(
      ({ id, productId, quantity, discount, unitPrice, prodName }) => ({
        id,
        productId,
        quantity,
        discount,
        unitPrice,
        prodName,
      })
    );
    this.prodArrayCopyForCancel = this.prodArray;

    // products section  starts here
    //  we need all products to fetch from DB
    if (this.status === this.saleStatus[this.saleStatus.length - 2].stageId) {
      this.showProd = true;
      if (data.userId) {
        this.service.getProducts(data.userId).subscribe((products) => {
          this.products = products.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as ProductModel;
          });

          this.filteredOptionsProd = this.myControlProd.valueChanges.pipe(
            startWith(''),

            map((value) => (typeof value === 'string' ? value : value.fname1)),
            map((fname1) =>
              fname1 ? this._filterProd(fname1) : this.products.slice()
            )
          );
        });
      }
    }
    // products section ends here
  }

  ngOnInit(): void {}

  //find the discounted rate
  getDiscountedRate(unitPrice: number, discount: number) {
    let discountVal = (unitPrice * discount) / 100;
    let discountedRate = unitPrice - discountVal;
    return discountedRate;
  }

  //stage updating fn
  onSubmit() {
    const updatedProductArray = this.prodArray;
    //If the sale status is changed, then update the sale status and stage history in database
    if (this.status != this.currentStage) {
      let datePlaced = new Date().getTime(); //Get TimeStamp
      let statusArray = this.saleStatus;
      let currentHistory = this.currentHistory;

      //Corresponding to the new stage applied, identify the index number of the new stage in sale stage array in user profile settings and update the stage history array and stage name in db
      this.stageValues.date = datePlaced;
      this.stageValues.stageId = this.status;
      this.stageValues.pipelineId = this.pipelineId;
      currentHistory.push(this.stageValues);
      this.stageHistories = currentHistory;

      let prevObj;
      let currObj;
      if (this.status === statusArray[statusArray.length - 1].stageId) {
        this.lost = true;
        this.won = false;
        this.inPipeline = false;
        prevObj = { salesStage: this.changeLogParams.prevSalesStage, rejectionReasonVal: '' };
        currObj = { salesStage: this.changeLogParams.curSalesStage, rejectionReasonVal: this.rejectionReasonValue  };
      } else if (this.status === statusArray[statusArray.length - 2].stageId) {
        this.lost = false;
        this.won = true;
        this.inPipeline = false;
        prevObj = { salesStage: this.changeLogParams.prevSalesStage };
        currObj = { salesStage: this.changeLogParams.curSalesStage };
      } else {
        this.lost = false;
        this.won = false;
        this.inPipeline = true;
        prevObj = { salesStage: this.changeLogParams.prevSalesStage };
        currObj = { salesStage: this.changeLogParams.curSalesStage };
      }

      this.service.updateSaleStatus(
        this.userId,
        this.saleId,
        this.status,
        this.stageHistories,
        datePlaced,
        this.inPipeline,
        this.won,
        this.lost,
        this.status === statusArray[statusArray.length - 1].stageId ? this.rejectionReasonValue : '',
        ChangeLogComponent.saveLog(
          this.changeLogParams.constructorName,
          this.changeLogParams.userId,
          this.changeLogParams.userName,
          prevObj, currObj,
          this.changeLogParams.changeLog
        )
      );
    }
    if (this.showProd === true && this.orderWonCheck === true) {
      let itemsArray = <ProductInSaleModel>{};

      updatedProductArray.forEach((doc, index) => {
        for (let i = 0; i < this.products.length; i++) {
          if (doc.productId === this.products[i].id) {
            itemsArray[index] = {
              prodName: this.products[i].prodName,
              hsnCode: this.products[i].hsnCode ? this.products[i].hsnCode : '',
              prodDes: this.products[i].prodDes,
              currency: this.products[i].currency,
              unitPrice: doc.unitPrice,
              unit: this.products[i].unit,
              quantity: doc.quantity,
              discount: doc.discount,
              cgst: this.products[i].cgst,
              sgst: this.products[i].sgst,
              igst: this.products[i].igst,
              vatRate: this.products[i].vatRate,
              taxType: this.products[i].taxType,
              productId: this.products[i].id,
              prodCategory: this.products[i].prodCategory
                ? this.products[i].prodCategory
                : '',
              additionalFieldsArr: this.products[i].additionalFieldsArr
                ? this.products[i].additionalFieldsArr
                : null,
            };
          }
        }
      });
      this.service.updateItemField(this.userId, this.saleId, itemsArray); //save to DB

      // update estimated value in sale
      if (this.productEstValue !== this.saleEstValue) {
        this.service.updateSaleEstValue(
          this.userId,
          this.saleId,
          this.productEstValue
        );
      }
    }
    this.dialogRef.close(true); // close the dialogue
    this._snackBar.open(this.fieldNameSale + ' ' + 'status updated!', '', {
      duration: 500,
    });
  }
  onCancel() {
    this.prodArray = this.prodArrayCopyForCancel;

    this.dialogRef.close(); // close the dialogue
  }
  showForm() {
    this.showFormOpt = true;
  }
  productSelected() {
    if (this.selectedProduct !== null) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.selectedProduct.prodName === this.products[i].prodName) {
          this.addProdOption = true;
          this.prod = {
            id: 'id',
            productId: this.selectedProduct.id,
            prodName: this.selectedProduct.prodName,
            quantity: 1,
            discount: this.selectedProduct.discount,
            unitPrice: this.selectedProduct.unitPrice,
            prodCategory: this.selectedProduct.prodCategory,
          };
        }
      }
    } else {
      this.addProdOption = false;
    }
  }
  removeForm(index, obj) {
    this.prodArray.splice(index, 1);
    this.tobeDeleteArray.push(obj.id);
    this.updateEstValue();
    // this.service.deleteProduct(this.userId, this.saleId, obj.id);
  }
  addProduct() {
    // check if product is selected
    this.prodArray.push(this.prod);
    this.selectedProduct = '';
    this.addProdOption = false;
    this.updateEstValue();
  }
  clearSelection() {
    this.selectedProduct = '';
    this.addProdOption = false;
  }
  private _filterProd(value) {
    const filterValue = value.toLowerCase();
    return this.products.filter((option) =>
      option.prodName.toLowerCase().includes(filterValue)
    );
  }

  // autoComplete display function
  displayFnProduct(subject) {
    return subject ? subject.prodName : undefined;
  }
  updateEstValue() {
    this.productEstValue = 0; //ensure 0 before adding up
    for (let i = 0; i < this.prodArray.length; i++) {
      this.productEstValue +=
        this.prodArray[i].unitPrice *
        (1 - this.prodArray[i].discount / 100) *
        this.prodArray[i].quantity;
    }
  }
}
