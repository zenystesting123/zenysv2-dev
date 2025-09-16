import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData, DbUserData, DocData, LineItemData, ShippingData, UserData } from '../data.model';
import { InvoiceFormService } from '../doc-form/invoice-form.service';
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-preview4s',
  templateUrl: './preview4.component.html',
  styleUrls: ['./preview4.component.scss']
})
export class Preview4Component implements OnInit {


  @ViewChild('printButton') printButton: ElementRef<HTMLElement>;

  useExistingCss: boolean;
  styleName: string;
  itemWidth: string = '30%'; //default width of item column
  Preview1: boolean = true;
  Preview2: boolean = false;
  Preview3: boolean = false;
  Preview4: boolean = false;
  Preview5: boolean = false;
  cess: any;
  igst: any;
  cgst: any;
  sgst: any;

  userData: UserData;
  customerData: CustomerData;
  docData: DocData;
  dbUserData: DbUserData;
  shipData:ShippingData;
  // docType:DocType;
  lineItem: LineItemData = { slno: 0, amount: null, unit: null, amountInclTax: null, item: null, qty: null, rate: null,
    discountRate:0,discountAmount:null,discountedAmount:null,
    cgstRate: null, igstRate: null, sgstRate: null, cessRate: null,vatRate: null, vatAmount: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null ,hsnCode :null};
  itemList = [this.lineItem];

  buttonStatus: boolean = true; // need to check what this is for
  @Input() color1: string = '#3a9efd';
  @Input() color2: string = 'white';
  @Input() docType: string;
  constructor(private router: Router, private route: ActivatedRoute, public service: InvoiceFormService, public toastr: ToastrService) {
    this.userData = service.getValuesUserData();
    console.log(this.userData);
    this.customerData = service.getValuesCustomerData();
    this.docData = service.getValuesDocData();
    this.dbUserData = service.getValuesDbUserData();
    // this.docType=service.getValuesDocType();
    this.itemList = service.getItemList();
this.shipData=service.getshipData();
    route.params.subscribe(val => {
      this.docType = this.route.snapshot.paramMap.get('docType');
      //console.log("Doc type selected is", this.docType)
    })

    //console.log("logging from preview file", this.userData,this.customerData,this.docData,this.itemList);

    //workaround to handle issue with ngxprint module styling access issue in production build
    this.useExistingCss = true;
    // if (environment.production) {
    //       this.useExistingCss = false;
    //       const elements = document.getElementsByTagName('link');
    //       for (let index = 0; index < elements.length; index++) {
    //         if (elements[index].href.startsWith(document.baseURI)) {
    //           this.styleName += elements[index].href + ',';
    //         }
    //       }
    //       this.styleName = this.styleName.slice(0, -1);
    //     }

    if (this.docData.includetax && this.docData.includecess && this.docData.interstate) {
      this.itemWidth = '30%';

    } else if (this.docData.includetax && this.docData.includecess && !this.docData.interstate) {
      this.itemWidth = '40%';
    }
    else if (this.docData.includetax && !this.docData.includecess && !this.docData.interstate) {
      this.itemWidth = '50%';
    }
    else {
      this.itemWidth = '60%';
    }
  }
  preView1() {
    this.Preview1 = true;
    this.Preview2 = false;
    this.Preview3 = false;
    this.Preview4 = false;
    this.Preview5 = false;
  }
  preView2() {
    this.Preview1 = false;
    this.Preview2 = true;
    this.Preview3 = false;
    this.Preview4 = false;
    this.Preview5 = false;
  }
  preView3() {
    this.Preview1 = false;
    this.Preview2 = false;
    this.Preview3 = true;
    this.Preview4 = false;
    this.Preview5 = false;
  }
  preView4() {
    this.Preview1 = false;
    this.Preview2 = false;
    this.Preview3 = false;
    this.Preview4 = true;
    this.Preview5 = false;
    this.toastr.warning('Please sign in to use this template', 'Sign In');
  }
  preView5() {
    this.Preview1 = false;
    this.Preview2 = false;
    this.Preview3 = false;
    this.Preview4 = false;
    this.Preview5 = true;
    this.toastr.warning('Please sign in to use this template', 'Sign In');
  }
  ngOnInit() {

  }

  OnSave() {
    // let data= Object.assign({},this.userData);
    // this.service.create(this.dbUserData);

    // this.firestore.collection('guest').add(data)
    // console.log(data);
  }
  onBack() {
    this.router.navigate(['/home']);
  }
  triggerFalseClick() {
    let el: HTMLElement = this.printButton.nativeElement;
    el.click();
  }
  //   async generatePDF() {

  //     const html = await htmlToPdfmake(
  //       document.getElementById('print-section1').innerHTML
  //       ,{
  //         "tableAutoSize":true
  //       }
  //     );
  //     console.log('html:', html);
  // console.log(this.docData.duedate);
  //     let docDefinition = {
  //       content:html,



  //     };
  //     pdfMake.createPdf(docDefinition).open();


  //   }



}
