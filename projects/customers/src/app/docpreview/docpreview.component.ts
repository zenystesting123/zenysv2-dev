import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { BUCKET } from '@angular/fire/storage';
import { PaymentReceipt, Profile, Sales } from './../data-models';
import { EstimatemanagementService } from './../estimatemanagement/estimatemanagement.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as html2pdf from 'html2pdf.js';

// import * as pdfkit from 'pdfkit';

import {
  CustomerData,
  DocData,
  LineItemData,
  UserData,
} from './../data-models';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment'
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkCheckService } from "../networkcheck.service";


@Component({
  selector: 'app-docpreview',
  templateUrl: './docpreview.component.html',
  styleUrls: ['./docpreview.component.scss']
})
export class DocpreviewComponent implements OnInit, OnDestroy {
  userLogo: any = null
  @ViewChild('printsection', { static: false }) printsection: ElementRef
  user1Subscription: Subscription;
  user2Subscription: Subscription;
  userDetails: Observable<Profile>;
  userDetailsAuth: any = null; //user deatails from auth module
  userId: any;
  @Output() editClicked = new EventEmitter();
  @Output() invClicked = new EventEmitter();
  @Output() shareClicked = new EventEmitter();


  paymentList: any;
  collected: number = 0;
  useExistingCss: boolean;
  styleName: string;
  itemWidth: string = '30%'; //default width of item column
  user: Observable<any>;
  docset: Profile[];
  // printTemplate: string;
  prev: any;
  item: [];
  elementsString: string;
  uriArray = [];
  saleId: string;
  custId: string;
  sale: Observable<Sales>;
  superUserId: any;
  @Input() customerData: CustomerData = {
    custID: null,
    pinCode: null,
    district: null,
    state: null,
    country: null,
    gst: null,
    fname1: null,
    sname: null,
    companyName: null,
    addressline1: null,
    addressline2: null,
  }; //Customer data interface
  @Input() userData: UserData = {
    logo: null,
    signature: null,
    signatoryName: null,
    designation: null,
    state: null,
    addressline1: null,
    addressline2: null,
    // district: null,
    gst: null,
    companyName: null,
    pinCode: null,
    country: null,
    contactname: null,
    contactno: null,
    email: null,
    secondName: null
  }; //userData interface

  @Input() docData: DocData = {
    saleID: null,
    saleTitle: null,
    docValidity: null,
    docDate: null,
    dueDate: null,
    sgstValue: 0,
    cgstValue: 0,
    igstValue: 0,
    cessValue: 0,
    vatValue: 0,
    total: 0,
    docNumber: null,
    quoteRef: null,
    estRef: null,
    totalInclTax: 0,
    poRef: null,
    paymentTerm: null,
    docType: null,
    bankDetails: null,
    notes: null,
    currency: null,
    includeTax: null,
    includeCess: null,
    includeUnit: null,
    interState: null,
    docTitle: '',
    amountCollected: 0,
    createdDate: null,
    taxType: 'gst'
  }; //DocData interface

  @Input() scenario = null;
  // docType:DocType;
  dataAccessRule:any;
  userRole:any;
  accountType:any;
  createDate:any;
  balanceDaysFlag:boolean;
  paidFlag:boolean;
  expiryFlag:boolean;
  invoicesInMonth:any=[];
  disableInvoices:boolean=false

  activeSubscriptionDateEnd:any;
  lastFreeDay:any;
  lineItem: LineItemData = {
    slno: 0,
    amount: null,
    amountInclTax: null,
    item: null,
    qty: null,
    unit: null,
    rate: null,
    cgstRate: 0,
    igstRate: 0,
    sgstRate: 0,
    cessRate: 0,
    vatRate: 0,
    vatAmount: null,
    cgstAmount: null,
    igstAmount: null,
    sgstAmount: null,
    cessAmount: null,
    description: null,
  }; //initializing the LineItemData interface
  @Input() itemList = [this.lineItem];
  @Input() docSaved: boolean = false;
  @Input() printTemplate: string
  @Output() generateClickedPreview = new EventEmitter();
  buttonStatus: boolean = true; // need to check what this is for
  public color1: string = '#3a9efd';
  previewMode: boolean = true;
  usersSubcription: Subscription;
  scenarioEdit: string;
  isSmallScreen: boolean = false;
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  panelOpenState1 = true;
  networkConnection: boolean;
  constructor(
    private location: Location,
    private db: EstimatemanagementService,
    private afAuth: AngularFireAuth,
    private router: Router, private ref: ChangeDetectorRef,
    // private salesService: SalesdetailsService,
    private dbs: AngularFirestore, private breakpointObserver: BreakpointObserver, public networkCheck: NetworkCheckService
  ) {
    setTimeout(() => {
      this.ref.detectChanges();
    }, 1000);
    this.useExistingCss = true;
    if (environment.production) {
      this.useExistingCss = false;
      const elements = document.getElementsByTagName('link');
      for (let index = 0; index < elements.length; index++) {
        if (elements[index].href.startsWith(document.baseURI)) {
          this.styleName += elements[index].href + ',';
        }
      }
      this.styleName = this.styleName.slice(0, -1);
    }
    if (
      this.docData.includeTax &&
      this.docData.includeCess &&
      this.docData.includeUnit &&
      this.docData.interState
    ) {
      this.itemWidth = '30%';
    } else if (
      this.docData.includeTax &&
      this.docData.includeCess &&
      this.docData.includeUnit &&
      !this.docData.interState
    ) {
      this.itemWidth = '40%';
    } else if (
      this.docData.includeTax &&
      !this.docData.includeCess &&
      this.docData.includeUnit &&
      !this.docData.interState
    ) {
      this.itemWidth = '50%';
    } else {
      this.itemWidth = '60%';
    }
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isTabletsize = true;
      }
      else {
        this.isTabletsize = false;
      }
    });
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobilesize = true;
      }
      else {
        this.isMobilesize = false;
      }
    });
    // async ()=>console.log(await this.userData.logo)
    // this.userLogo
    // setTimeout(()=>console.log(this.userData.logo),1000)
    setTimeout(() => getBase64ImageFromUrl(this.userData.logo).then((result) => {
      this.userLogo = result
    }).catch(err => { console.log(err) }), 1000)
  } // constructor ends
  ngOnInit(): void {
    console.log("wirt")
    // this.userDetails = this.db.getUsers(this.userId);
    
    console.log(this.printTemplate)


    window.scroll(0, 0);
    this.elementsString = document.getElementsByTagName(
      'link'
    )[0].attributes[2].ownerDocument.URL;
    for (let index = 0; index < this.elementsString.length; index++) {
      this.uriArray = this.elementsString.split('/');
      this.saleId = this.uriArray[5];
      this.custId = this.uriArray[8];
    }

    

  }
  OnSave() {
    // let data= Object.assign({},this.userData);
    //this.service.create(this.dbUserData);
    // this.firestore.collection('guest').add(data)
    // console.log(data);
  }
  onEdit() {
    this.editClicked.emit([
      this.userData,
      this.customerData,
      this.docData,
      this.itemList,
      this.previewMode = false,
      this.scenarioEdit = "edit"
    ]);
    //this.router.navigate(['/pages/home']);
    // if (this.docData.docType == 'Quotation') {
    //   this.router.navigate([
    //     'dash/documentquotationmanagement/',
    //     this.docData.saleID,
    //     'edit',
    //     this.docData.docType,
    //     this.customerData.custID,
    //     this.docData.docNumber,
    //   ]);
    // } else if (this.docData.docType == 'Invoice') {
    //   this.router.navigate([
    //     'dash/documentinvoicemanagement/',
    //     this.docData.saleID,
    //     'edit',
    //     this.docData.docType,
    //     this.customerData.custID,
    //     this.docData.docNumber,
    //   ]);
    // } else {
    //   this.router.navigate([
    //     'dash/documentmanagement/',
    //     this.docData.saleID,
    //     'edit',
    //     this.docData.docType,
    //     this.customerData.custID,
    //     this.docData.docNumber,
    //   ]);
    // }
  }
  onCreateInvoice() {
    if (this.docData.docType == 'Quotation') {
      this.router.navigate([
        'dash/documentinvoicemanagement/',
        this.docData.saleID,
        'inv-quote',
        'Invoice',
        this.customerData.custID,
        this.docData.docNumber,
      ]);
    } else if (this.docData.docType == 'Estimate') {
      this.router.navigate([
        'dash/documentinvoicemanagement/',
        this.docData.saleID,
        'inv-est',
        'Invoice',
        this.customerData.custID,
        this.docData.docNumber,
      ]);
    }
  }
  onCreateQuotation() {
    this.router.navigate([
      'dash/documentquotationmanagement/',
      this.docData.saleID,
      'quote-est',
      'Quotation',
      this.customerData.custID,
      this.docData.docNumber,
    ]);
  }
  onCreateInvoiceMob() {
    if (this.docData.docType == 'Quotation') {
      this.router.navigate([
        'documentinvoicemanagement/',
        this.docData.saleID,
        'inv-quote',
        'Invoice',
        this.customerData.custID,
        this.docData.docNumber,
      ]);
    } else if (this.docData.docType == 'Estimate') {
      this.router.navigate([
        'documentinvoicemanagement/',
        this.docData.saleID,
        'inv-est',
        'Invoice',
        this.customerData.custID,
        this.docData.docNumber,
      ]);
    }
  }
  onCreateQuotationMob() {
    this.router.navigate([
      'documentquotationmanagement/',
      this.docData.saleID,
      'quote-est',
      'Quotation',
      this.customerData.custID,
      this.docData.docNumber,
    ]);
  }
  onBack() {
    this.location.back();
  }
  onEmail() {
    //   let docDefinition = {  
    //     header: 'C#Corner PDF Header',  
    //     content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'  
    //   }
    //   pdfMake.createPdf(docDefinition).open();
    //   var doc=pdfMake.createPdf(docDefinition);
    //   var buffers = [];
    //   const file="save.pdf";
    //   let p = new Promise((resolve, reject) => {
    //     doc.on("end", function() {
    //       resolve(buffers);
    //     });
    //     doc.on("error", function () {
    //       reject();
    //     });
    //   });

    //   doc.pipe(doc.getStream());
    //   doc.on('data', buffers.push.bind(buffers));
    //   doc=pdfMake.createPdf(docDefinition);
    //   var data=docDefinition;
    //   doc.end();
    //   return p.then(function(buffers) {
    //     return this.sendMail(buffers);
    //  });


  }
  // sendMail(buffers){
  //   const pdfData = Buffer.concat(buffers);
  //   this.db1.collection('mail').add({
  //     to:"davis@zenysapp.com",
  //     message:{
  //       subject:'Testing',
  //       text:"Testing the email triggering",
  //       html:"email triggering",
  //       attachments: [
  //         {
  //           filename:"view.pdf",
  //           content:pdfData,

  //         },
  //       ]
  //     },
  //   }) 
  // }
  ngOnDestroy() {
  }
  /*
  generateDocument() {
    this.generateClickedPreview.emit();
    this.toastr.success('New document created!');
  }*/
  onCheckNetwork() {
    return this.networkConnection = this.networkCheck.onNetworkCheck();
  }
  makepdf() {
    //     console.log(this.printsection.nativeElement)
    //     let pdf=new jsPDF('p','pt','a4')
    // pdf.html(this.printsection.nativeElement,{
    //   callback:(pdf)=>{
    //     pdf.save("demo.pdf")
    //   }
    // })
    // try 2 
    const domElement = document.getElementById('printsection')
    html2canvas(domElement, {
      scale: 1.5, useCORS: true, onclone: (document) => {
        // document.getElementById('print-button').style.visibility = 'hidden'
      }
    })
      .then((canvas) => {
        const img = canvas.toDataURL('image/png')
        var imgWidth = 210;
        var pageHeight = 295;
        const pdf = new jsPDF('p', 'mm')
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;
        // const imgProps= pdf.getImageProperties(img);
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(img, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save(this.docData.docTitle + ' ' + this.docData.docNumber + '.pdf')
      })





  }


  newpdf() {
    var element = document.getElementById('printsection');

    var opt = {
      margin: [5, 0, 5, 0],
      filename: this.docData.docTitle + ' ' + this.docData.docNumber + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, dpi: 96, letterRendering: true, useCORS: true },
      jsPDF: {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      }
    };
    //  console.log(element)
    // New Promise-based usage:
    // setTimeout(()=>{
    html2pdf().from(element).set(opt).save();
    // },2000)
  }

  invoicesend() {
    this.invClicked.emit("sendinvoice")
  }

  invoiceshare() {
    this.shareClicked.emit("shareinvoice")
  }

  changeTemplate(x) {
    this.printTemplate = "template" + x
  }





}

async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  })

}
