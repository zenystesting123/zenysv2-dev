
import { ChangeDetectorRef, Component, Directive, Input, NgModule, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CustomerData, DbUserData, DocData, LineItemData, UserData } from '../data.model';

import {  NavigationStart, Router, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InvoiceFormService } from '../doc-form/invoice-form.service';
import { Meta, Title } from '@angular/platform-browser';
import { DocSettingsComponent } from '../doc-settings/doc-settings.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DocSettingsService } from '../doc-settings/doc-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadPopupComponent } from '../download-popup/download-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-quotation-forms',
  templateUrl: './quotation-form.component.html',
  styleUrls: ['./quotation-form.component.scss']
})
export class QuotationFormComponent implements OnInit, OnChanges {

  requiredControl = new FormControl('Initial value', [Validators.required]);
  
  public isMobile: boolean = false;

  public isTablet: boolean = false;
  public isLarge: boolean = false;
  public isXLarge: boolean = false;
  public isTabletLandscape: boolean = false;
  public isTabletPortrait: boolean = false;
  public isSmallScreen: boolean = false;
  userData: UserData; //userData interface object
  customerData: CustomerData; //Customer data interface object
  docData: DocData; //DocData interface object
  dbUserData: DbUserData;//DbUserData interface object
  lineItem: LineItemData = { slno: 0, amount: null, unit: null, amountInclTax: null, item: null, qty: null, rate: null, cgstRate: 0, igstRate: 0, sgstRate: 0, cessRate: 0,
    discountRate:0,discountAmount:null,discountedAmount:null,
    vatRate: 0, vatAmount: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null ,hsnCode:null};//initializing the LineItemData interface
  itemList = [this.lineItem];
  submitted: boolean = false; // for Checking if the required fields are filled before submitting
  isCollapsed = false;
  includetax: boolean = false; //for checking if the tax is selected
  includecess: boolean = false; //for checking if the cess is selected
  interstate: boolean = false; //for checking if the interstate(igst) is selected
  noItem: number = 0;
  Title: string;
  imageChangedEventLogo: any = '';
  imageChangedEventSign: any = '';
  croppedImageSign: any = '';
  croppedImageLogo: any = '';
  closeResult: string;
  lineItemForm: FormGroup;
  headerIsCollapsed: boolean = false;
  itemsIsCollapsed: boolean = false;
  footerIsCollapsed: boolean = false;
  panel1OpenState = true;
  panelOpenState = false;
  showSign = false;
  previewMode: boolean = false;
  @Input() docType: string;
  docTypeCurrent: string;


  //testing
  gstForm: FormGroup;
  values = {
    docTitle: '',
  };
  addItem = false;
  hubSpotChat:any
  constructor(
    private ref: ChangeDetectorRef, 
    public toastr: ToastrService, 
    private titleService: Title, 
    public dialog: MatDialog,
    private route: ActivatedRoute, 
    private router: Router, 
    breakpointObserver: BreakpointObserver, 
    public service: InvoiceFormService,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private _bottomSheet: MatBottomSheet,
    public docSettingsService:DocSettingsService,
    private meta:Meta
    ) {
      this.titleService.setTitle("Free Online Quotation Generator | Zenys");
                    // update meta tags
              this.meta.updateTag({ name: 'description', content: "Zenys Free Quotation Generator lets you create quotations with your business logo. Fill in the fields and download the PDF Quotations with our Quotation Maker." })
              this.meta.updateTag({ name: 'og:title', content: "Online Quotation Generator, Quote Template" })
              this.meta.updateTag({ name: 'og:description', content: "Zenys Free Quotation Generator lets you create quotations with your business logo. Fill in the fields and download the PDF Quotations with our Quotation Maker." })  
              this.meta.updateTag({ name: 'og:url', content:"https://crm.zenys.org/free-tool/create/Quotation"}) 
              this.meta.updateTag({ name: "og:type", content:"website"})
    
    this.createForm();// testing fn
    this.userData = service.getValuesUserData();
    this.customerData = service.getValuesCustomerData();
    this.docData = service.getValuesDocData();
    // this.docData.includetax = true;//tax selector selected by default
    this.dbUserData = service.getValuesDbUserData();
    this.itemList = service.getItemList();

    if (!this.docData.docTitle) {
      this.docData.docTitle = this.docType;
    }
    if (!this.docData.docType) {
      this.docData.docType = this.docType;
    }



    this.lineItemForm = new FormGroup
      ({ itemList: new FormArray([]) });
    this.itemList.forEach(
      (lineItem) =>
        (<FormArray>this.lineItemForm.get('itemList')).push(this.createItemFormGroup(lineItem)));

    // check if mobile view
    //  this.isMobile=breakpointObserver.isMatched('(max-width: 480px)');

    //  this.isTablet=breakpointObserver.isMatched('(max-width: 700px)');
    //  this.isLarge=breakpointObserver.isMatched('(max-width: 1024px)');


    setInterval(() => {
      this.ref.detectChanges()
    }, 500);

    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
      console.log(result.matches);
    });

    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });
    // check if mobile view
    //  this.isMobile=breakpointObserver.isMatched('(max-width: 480px)');

    //  this.isTablet=breakpointObserver.isMatched('(max-width: 700px)');
    //  this.isLarge=breakpointObserver.isMatched('(max-width: 1024px)');


    setInterval(() => {
      this.ref.detectChanges()
    }, 500);

    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });


    breakpointObserver.observe([
      Breakpoints.Large
    ]).subscribe(result => {
      this.isLarge = result.matches;
    });
    breakpointObserver.observe([
      Breakpoints.XLarge
    ]).subscribe(result => {
      this.isXLarge = result.matches;
    });
    route.params.subscribe(val => {
      this.docType = this.route.snapshot.paramMap.get('docType');
      //console.log("Doc type selected is", this.docType)
    })
    console.log(this.docType);

  }

  // ngOnInit(): void { 


  //   this.router.events
  // .subscribe(
  //   (event: NavigationEvent) => {


  //     if(event instanceof NavigationStart) {
  //       this.route.params.subscribe(routeParams => {

  //         // this.docData.docTitle = this.docType;
  //         this.docData.docTitle = this.docType;

  //        });
  //       //console.log(event);

  //     }

  //     else
  //     {
  //     this.docData.docTitle = this.docData.docTitle;

  //     }
  //   });


  // this.Title = this.docData.docTitle;
  //console.log(this.Title);
  //console.log(this.docType);
  // }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.docType) {
      if (changes.docType.currentValue != this.docData.docType) {
        this.docData.docTitle = changes.docType.currentValue;
        // this.docData.docType = this.docType;
        console.log(this.docData.docTitle);
      }
    }

  }


  ngOnInit(): void {

    if (!this.docData.docTitle) {
      this.docData.docTitle = this.docType;
    }
    else {
      this.docData.docTitle = this.docData.docTitle;
    }

    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            this.route.params.subscribe(routeParams => {
              this.docData.docTitle = this.docType;
              this.docData.docTitle = this.docType;
            
            });
            //console.log(event);

          }
        }
      )
  }

  createForm(): void {
    this.gstForm = new FormGroup({
      'docTitle': new FormControl(this.values.docTitle, [
        Validators.required,
        Validators.minLength(2)
      ])
    })
  }
  //formcontroll object for the line item
  createItemFormGroup(lineItem) {
    return new FormGroup({
      item: new FormControl(lineItem.item),
      qty: new FormControl(lineItem.qty),
      unit: new FormControl(lineItem.unit),
      rate: new FormControl(lineItem.rate),
      sgstRate: new FormControl(lineItem.sgstRate),
      cgstRate: new FormControl(lineItem.cgstRate),
      description: new FormControl(lineItem.description),
      igstRate: new FormControl(lineItem.igstRate),
      cessRate: new FormControl(lineItem.cessRate),
      vatRate: new FormControl(lineItem.vatRate),
      discountRate:new FormControl(lineItem.discountRate),
      amount: new FormControl(lineItem.amount)
    });
  }
  addFieldValue() {
    this.noItem += 1;
    var emptyPayOff = { slno: this.noItem, unit: null, amountInclTax: null, amount: null, item: null, qty: null, rate: null, cgstRate: 0, igstRate: 0, sgstRate: 0, cessRate: 0, vatRate: 0,
      discountRate:0,discountAmount:null,discountedAmount:null,
      
      vatAmount: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null ,hsnCode:null};
    this.itemList.push(emptyPayOff);
    (<FormArray>this.lineItemForm.get('itemList')).push(
      this.createItemFormGroup(emptyPayOff));
    this.addItem = true;
    this.docSettingsService.itemsAdded=true;
  }
  OnItemClick(){
    this.docSettingsService.itemsAdded=true;
  }
  //deleting a row of line item
  deleteFieldValue(index: number) {
    this.itemList.splice(index, 1);
    (<FormArray>this.lineItemForm.get('itemList')).removeAt(index);
    this.updateDocheaderAmounts();
  }

  identify(index, item) {
    //console.log("serial no of item", item.slno)
    return item.slno;
  }
  //calculating the row amount
  getAmount(i) {

    let rate = this.itemList[i].rate;
    let dicountPercentage=this.itemList[i].discountRate
    let discountedAmount = rate;
    if (dicountPercentage > 0 && this.docData.includeDiscount) {
      discountedAmount =
        rate * (1 - dicountPercentage / 100);
      let discound = rate - discountedAmount;
      this.itemList[i].discountAmount = discound * this.itemList[i].qty;
    }else{
      this.itemList[i].discountAmount = 0;
      this.itemList[i].discountRate=0;
    }
    let discountedTotalAmount = this.itemList[i].qty * discountedAmount;
    let amount = this.itemList[i].qty * rate


    let amtInclTax = 0;
    let sgst = 0;
    let cgst = 0;
    let igst = 0;
    let cess = 0;
    let vat = 0;

    if (this.docData.includetax == true) {
      if (this.docData.taxType == 'gst') {

        if (this.docData.interstate) {
          igst = discountedTotalAmount * (this.itemList[i].igstRate / 100);
          this.itemList[i].cgstRate = 0;
          this.itemList[i].sgstRate = 0;
        } else {
          cgst = discountedTotalAmount * (this.itemList[i].cgstRate / 100);
          sgst = discountedTotalAmount * (this.itemList[i].sgstRate / 100);
          this.itemList[i].igstRate = 0;
        }
        if (this.docData.includecess) {
          cess = discountedTotalAmount * (this.itemList[i].cessRate / 100);
        }
        else{
          this.itemList[i].cessRate = 0;
        }
      } else {
        this.itemList[i].cessRate = 0;
        this.itemList[i].cgstRate = 0;
        this.itemList[i].sgstRate = 0;
        this.itemList[i].igstRate = 0;
      }

      if (this.docData.taxType == 'vat') {
        vat = discountedTotalAmount * (this.itemList[i].vatRate / 100);
      } else {
        this.itemList[i].vatRate = 0;
      }
    }
    else{
        this.itemList[i].cessRate = 0;
        this.itemList[i].cgstRate = 0;
        this.itemList[i].sgstRate = 0;
        this.itemList[i].igstRate = 0;
        this.itemList[i].vatRate = 0;
        this.docData.interstate=false;
        this.docData.includecess=false;
    }
    amtInclTax = discountedTotalAmount + cess + cgst + sgst + igst + vat;
    this.itemList[i].amountInclTax = amtInclTax;
    this.itemList[i].amount = amount;
    this.itemList[i].cessAmount = cess;
    this.itemList[i].cgstAmount = cgst;
    this.itemList[i].sgstAmount = sgst;
    this.itemList[i].igstAmount = igst;
    this.itemList[i].vatAmount = vat;
    this.itemList[i].discountedAmount = discountedTotalAmount

    this.updateDocheaderAmounts();

    this.itemList[i].amountInclTax =
      Math.round((this.itemList[i].amountInclTax + Number.EPSILON) * 100) / 100;
    return this.itemList[i].amountInclTax;
  }
  TypeError() {
    this.toastr.error('Please fill all the mandatory feilds');
    this.submitted = true;
  }
  //calculating the total amounts
  updateDocheaderAmounts() {
    this.docData.sgstvalue = 0,
      this.docData.cgstvalue = 0,
      this.docData.igstvalue = 0,
      this.docData.cessvalue = 0,
      this.docData.vatvalue = 0,
      this.docData.discountValue = 0,
      this.docData.discountedAmount = 0,
      this.docData.total = 0,
      this.docData.alltotal = 0,
      this.itemList.forEach(element => {
        this.docData.sgstvalue += element.sgstAmount;
        this.docData.cgstvalue += element.cgstAmount;
        this.docData.igstvalue += element.igstAmount;
        this.docData.cessvalue += element.cessAmount;
        this.docData.vatvalue += element.vatAmount;

        this.docData.discountValue += element.discountAmount;
        this.docData.discountedAmount += element.discountedAmount;

        this.docData.total += element.amount;
        this.docData.alltotal += (element.discountedAmount + element.sgstAmount + element.vatAmount+ element.cgstAmount + element.igstAmount + element.cessAmount);
        //this.docData.alltotal =10;
        //console.log(this.docData);
      });
  }
  fileChangeEventLogo(event: any): void {
    this.imageChangedEventLogo = event;
    // this.service.userData.logo=this.imageChangedEventLogo;
    this.service.logoSelected = false;
  }
  fileChangeEventSign(event: any): void {
    this.imageChangedEventSign = event;
    this.service.signSelected = false;
  }
  imageCroppedSign(event: ImageCroppedEvent) {
    this.croppedImageSign = event.base64;
    this.service.userData.signature = this.croppedImageSign;
  }
  imageCroppedLogo(event: ImageCroppedEvent) {
    this.croppedImageLogo = event.base64;
    this.service.userData.logo = this.croppedImageLogo;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  applyLogo() {
    this.service.logoSelected = true;


  }
  applySign() {
    this.service.signSelected = true;

  }
  //open the model for logo
  open(content) {
    let element: HTMLElement = document.getElementsByClassName('logo-selector')[0] as HTMLElement;
    element.click();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }
  //open the model for signature
  opens(content) {
    let element: HTMLElement = document.getElementsByClassName('sign-selector')[0] as HTMLElement;
    element.click();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  itemFormControl = new FormControl('', [
    Validators.required,
  ]);
  item = new FormControl('', [
    Validators.required,
  ]);
  currencyControl = new FormControl('', [
    Validators.required,
  ]);


  matcher = new MyErrorStateMatcher();


  onPrint() {
    //write the values to the service file
    this.service.setValues(this.userData, this.customerData, this.docData, this.dbUserData, this.itemList);
    this.router.navigate(['/preview']);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  openPopUP(action:string) {
    const dialogRef = this.dialog.open(DownloadPopupComponent, {
      width: '250px',
      data: {docType:this.docType,scenario:action}
    });

    dialogRef.afterClosed().subscribe(result => {
      ;
    });
  }
  //Change Title to Invoice
  // OnInvoiceTitle() {
  //   this.docData.docTitle = 'Invoice';

  // }
  //Change Title to Quotation
  // OnQuotationTitle() {
  //   this.docData.docTitle = 'Quotation';

  // }
  //Change Title to Proforma
  // OnProformaTitle() {
  //   this.docData.docTitle = 'Proforma';

  // }
  //Change Title to Estimate
  // OnEstimateTitle() {
  //   this.docData.docTitle = 'Estimate';

  // }
  //Change Title to Invoice
  // showInvoices() {
  //   this.docData.docTitle = "Invoice"
  // }


  setPreviewOn() {
    // set the mode to preview
    this.previewMode = true;
  }

  setPreviewOff() {
    // set the mode to edit
    //console.log("hai");
    this.previewMode = false;

  }

  onPreview() {
    this.router.navigate(['/mobilepreview']);
  }

  onBottomSheet(docData,customerData,userData,dbUserData,scenario){
    this._bottomSheet.open(DocSettingsComponent,{data:{ 
      'docData':docData,
      'customerData':customerData,
      'userData':userData,
      'dbUserData':dbUserData,
        'scenario':scenario}});
  }
  onVat() {
    this.docData.includecess = false;
    this.docData.interstate = false;
  }
  deleteLogo(){
    this.userData.logo=null;
  }
   deleteSignature(){
    this.userData.signature=null;
  }
  TypeErrors() {
    this.submitted=true
    this._snackBar.open('Please Fill All The Mandatory', 'Fields', {
      duration: 2000,
    });
  }
}
