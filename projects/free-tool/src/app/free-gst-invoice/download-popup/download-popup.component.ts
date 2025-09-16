import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, ElementRef, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData, DbUserData, DocData, LineItemData, ShippingData, UserData } from '../data.model';
import { InvoiceFormService } from '../doc-form/invoice-form.service';
import { Meta } from '@angular/platform-browser';
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Preview2Component } from '../preview2/preview2.component';
import { Preview3Component } from '../preview3/preview3.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import * as html2pdf from 'html2pdf.js';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

var options = {
  year: "numeric",
  month: "2-digit",
  day: "numeric"
};
@Component({
  selector: 'app-download-popup',
  templateUrl: './download-popup.component.html',
  styleUrls: ['./download-popup.component.scss']
})

export class DownloadPopupComponent implements OnInit {
  previewOn:boolean=false;
  @ViewChild('printsection',{static:false}) printsection:ElementRef
  @ViewChild(DownloadPopupComponent)
  private preview1: DownloadPopupComponent;
  @ViewChild(Preview2Component)
  private preview2: Preview2Component;
  @ViewChild(Preview3Component)
  private preview3: Preview3Component;
  cess: any;
  igst: any;
  cgst: any;
  sgst: any;
  tot: any;
  i: number = 0;

  @ViewChild('printButton') printButton: ElementRef<HTMLElement>;

  @ViewChild('content') content: ElementRef<HTMLElement>;


  useExistingCss: boolean;
  styleName: string;
  itemWidth: string = '30%'; //default width of item column
  Preview1: boolean = true;
  Preview2: boolean = false;
  Preview3: boolean = false;
  Preview4: boolean = false;
  Preview5: boolean = false;
  @Input() printTemplate: number = 1;
  userData: UserData;
  customerData: CustomerData;
  docData: DocData;
  dbUserData: DbUserData;
  shipData: ShippingData;
  @Input() isDownload:boolean;
  // @ViewChild('printsection',{static:false}) DownloadPopupComponent:ElementRef
  docType:string;
  lineItem: LineItemData = { slno: 0, amount: null, unit: null, amountInclTax: null, item: null, qty: null, rate: null, discountedAmount:null,cgstRate: null,vatRate: null, vatAmount: null, discountRate:0,discountAmount:null, igstRate: null, sgstRate: null, cessRate: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null ,hsnCode:null};
  itemList = [this.lineItem];
  isSmallScreen: boolean = false;
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  scenario:string;
  buttonStatus: boolean = true; // need to check what this is for
  @Input() color1: string = '#2A6AF6';
  

  constructor(private readonly meta: Meta, private route: ActivatedRoute,
     public dialogRef: MatDialogRef<DownloadPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,private analytics: AngularFireAnalytics,
    private ref: ChangeDetectorRef, private breakpointObserver: BreakpointObserver, private router: Router, public service: InvoiceFormService, public toastr: ToastrService) {
      analytics.logEvent('custom_event', { 'something':'nothing' });
     this.docType=data.docType;
      this.scenario=data.scenario;

    setInterval(() => {
      this.ref.detectChanges()


    }, 500);


    //check the breakpoints
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

    this.meta.removeTag('name="viewport"');
    this.meta.addTag({ name: 'viewport', content: 'width=500' })


    this.shipData = service.getshipData();
    console.log(this.shipData);
    this.userData = service.getValuesUserData();

    this.customerData = service.getValuesCustomerData();
    this.docData = service.getValuesDocData();

    this.dbUserData = service.getValuesDbUserData();
    // this.docType=service.getValuesDocType();
    this.itemList = service.getItemList();
    //console.log(this.itemList);


    // console.log(this.tot);
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
  }// constructor ends

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

  nextTemplate() {
    //increment the template counter by 1
    if (this.printTemplate < 3) {
      this.printTemplate++;
    }
  }

  prevTemplate() {
    //decrement the template counter by 1
    if (this.printTemplate > 1) {
      this.printTemplate--;
    }
  }

  print() {

    if (this.printTemplate == 1) {
      this.preview1.triggerFalseClick();

    }
    if (this.printTemplate == 2) {
      this.preview2.triggerFalseClick();
    }
    if (this.printTemplate == 3) {
      this.preview3.triggerFalseClick();
    }

  }



  async generatePDF() {
    //console.log(this.docType);
    let docDefinition = {
      content: [

        {
          text: this.docData.docTitle.toLocaleUpperCase(),
          fontSize: 24,
          bold: true,
          alignment: 'left',
          color: this.color1,
          margin: [0, 15, 0, 15]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, lineColor: this.color1 }] },
        {
          text: " ",
          margin: [0, 5, 0, 0],
        },
        {
          columns: [
            [
              {
                width: 100,
                height: 100,
                image: this.userData.logo
              },
            ],
            [],
            [
              this.getBillby(),
            ],
          ],
        },

        //this.getData(this.item.item),
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },


        {
          columns: [


            [

              this.getBillto(),
            ],

            [
              this.getSec(),


            ],


          ],
          columnGap: 120
        },
        //{canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1  }]},
        {
          text: " ",
          margin: [0, 10, 0, 10],
        },

        this.getData(),
        {
          text: " ",
          margin: [0, 10, 0, 10],
        },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },

        {
          columns: [
            [
              {

                margin: [0, 20, 0, 0],
                text: "Bank Details", bold: true
              },
              {
                text: this.docData.bankdetails,
              },
            ],
            [
              this.getDatas(),
            ],


          ],
          columnGap: 120

        },



        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },

        {
          text: " ",
          margin: [0, 5, 0, 5],

        },
        this.getNotes(),
        {
          columns: [
            [

            ],
            [
              this.getSign(),
            ],


          ],
          columnGap: 120

        },



        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1, lineColor: this.color1 }] },

        this.getQuery(),

      ],
      styles: {
        sectionHeader0: {
          //bold: true,
          //decoration: 'underline',
          fontSize: 12,
          // margin: [0, 15,0, 0] ,
          alignment: 'left',
        },
        sectionHeader1: {
          //bold: true,
          //decoration: 'underline',
          fontSize: 12,
          margin: [0, 15, 0, 0],
          alignment: 'left',
        },
        sectionHeader2: {

          fontSize: 12,
          margin: [0, 15, 0, 10]
        },
        sectionHeader02: {
          //decoration: 'underline',
          fontSize: 12,
          margin: [0, 15, 0, 0]
        },
        invoice: {
          //bold: true,
          //decoration: 'underline',
          alignment: 'left',
          margin: [0, 15, 0, 0]
        },
        invoice1: {
          //bold: true,
          //decoration: 'underline',
          alignment: 'left',
          margin: [0, 4, 0, 0]
        },
        lineSpacing: {
          margin: [0, 0, 0, 6] //change number 6 to increase nspace
        },
        table: {
          padding: '100px',
          //tableAutoSize:true,

          // tableAutoSize:false,
          // tableWidths:15,
          //width:'100%',
          //color:"black",
          // background:"red",
          //fillColor:"red",


          //max-width: 1500px;
          // min-width: 1200px;
          // color: #3a9efd !important;
          // background: #3a9efd !important;
          // width: 1200px !important;

        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }



      },



    };
    // pdfMake.createPdf(docDefinition).open();



    // if(action==='download'){
    //   pdfMake.createPdf(docDefinition).download();
    // }else if(action === 'print'){
    //   pdfMake.createPdf(docDefinition).print();      
    // }else{
    //   pdfMake.createPdf(docDefinition).open();      
    // }

  }

  getSec() {
    if (this.docType == 'Invoice') {
      return {

        columns: [

          [
            {
              style: 'invoice',
              text: ["Invoice No: ", this.docData.invoiceno],
            },
            {
              style: 'invoice1',
              text: ["Invoice Date: ", this.docData.date.toLocaleDateString("en")]
            },
            {
              style: 'invoice1',
              text: ["Due Date: ", this.docData.duedate.toLocaleDateString("en")],
            },

            {
              style: 'invoice1',
              text: ["Quotation Ref: ", this.docData.quatationreference]
            },
            {
              style: 'invoice1',
              text: ["P.O. Ref: ", this.docData.purchaseorder]
            },
            {
              style: 'invoice1',
              text: ["Payment Terms: ", this.docData.paymentterm]
            }


          ]
        ]
      };


    }
    if (this.docType == 'Quotation') {
      return {

        columns: [

          [
            {
              style: 'invoice',

              text: ["Quotation No: ", this.docData.invoiceno]
            },
            {
              style: 'invoice1',

              text: ["Quotation Date: ", this.docData.date.toLocaleDateString("en")]
            },

            {
              style: 'invoice1',
              text: ["Valid Till: ", this.docData.docValidity.toLocaleDateString("en")],
            },




          ]
        ]
      };


    }
    if (this.docType == 'Estimate') {
      return {

        columns: [

          [
            {
              style: 'invoice',

              text: ["Estimate No: ", this.docData.invoiceno]
            },
            {
              style: 'invoice1',

              text: ["Estimate Date: ", this.docData.date.toLocaleDateString()]
            },

            {
              style: 'invoice1',
              text: ["Valid Till: ", this.docData.docValidity.toLocaleDateString("en")],
            },




          ]
        ]
      };


    }

    return null;
  }
  getData() {


    //for (let i = 0; i < this.itemList.length; i++) {
    // console.log(this.itemList);
    // var cess = this.itemList.map(a => a.cessRate);
    // var igst = this.itemList.map(a => a.igstRate);
    // var cgst = this.itemList.map(a => a.cgstRate);
    // var sgst = this.itemList.map(a => a.sgstRate);

    console.log(this.docData.includetax);
    console.log(this.docData.interstate);
    console.log(this.docData.includecess);
    if (this.docData.includetax && !this.docData.interstate && !this.docData.includecess) {

      return {
        // layout: {

        //   hLineWidth: function (i, node) {
        //     return (i === 0 || i === node.table.body.length) ? 2 : 1;
        //   },
        //   vLineWidth: function (i, node) {
        //     return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        //   },
        //   hLineColor: function (i, node) {
        //     return 'black';
        //   },
        //   vLineColor: function (i, node) {
        //     return 'black';
        //   },
        //   hLineStyle: function (i, node) {
        //     if (i === 0 || i === node.table.body.length) {
        //       return null;
        //     }
        //     return {line: {length: 10, space: 4}};
        //   },
        //   vLineStyle: function (i, node) {
        //     if (i === 0 || i === node.table.widths.length) {
        //       return null;
        //     }
        //     return {dash: {length: 4}};
        //   },

        //   // fillColor: function (i, node) { return null; }
        // },


        table: {
          headerRows: 1,
          widths: ['4%', '28%', '11%', '10%', '10%', '11%', '11%', '15%'],

          body: [

            ['No', 'Item & Description', 'Qty',
              'Unit', 'Rate', 'SGST%', 'CGST%', 'Amount'],

            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.sgstRate + "%", p.cgstRate + "%", p.amount.toFixed(2)]
              )

            })

          ],


          // paddingLeft: function(i, node) { return 4; },
          // paddingcenter: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 5; },
          // paddingBottom: function(i, node) { return 5; },          
        },
        layout: 'lightHorizontalLines',

      };
    }


    if (this.docData.includetax && !this.docData.interstate && this.docData.includecess) {
      return {


        table: {
          headerRows: 1,

          widths: ['4%', '26%', '8%', '9%', '8%', '10%', '11%', '10%', '14%'],

          body: [
            ['No', 'Item & Description', 'Qty', 'Unit', 'Rate', 'SGST%', 'CGST%', 'CESS%', 'Amount'],
            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.sgstRate + "%", p.cgstRate + "%", p.cessRate + "%", p.amount.toFixed(2)]
              )

            })


          ]

        },
        layout: 'lightHorizontalLines',

      };

    }

    if (this.docData.includetax && this.docData.interstate && !this.docData.includecess) {
      return {


        table: {
          headerRows: 1,

          widths: ['6%', '35%', '11%', '11%', '11%', '11%', '25%'],

          body: [
            ['No', 'Item & Description', 'Qty', 'Unit', 'Rate', 'IGST%', 'Amount'],

            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.igstRate + "%", p.amount.toFixed(2)]
              )

            })
          ]
        },

        layout: 'lightHorizontalLines',
      };

    }

    if (!this.docData.includetax && !this.docData.interstate && !this.docData.includecess) {
      return {


        table: {
          headerRows: 1,
          alignment: 'center',
          widths: ['6%', '*', '12%', '12%', '12%', '15%'],

          body: [
            ['No', 'Item & Description', 'Qty', 'Unit', 'Rate', 'Amount'],
            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.amount.toFixed(2)]
              )

            })
          ]
        },

        layout: 'lightHorizontalLines',
      };

    }
    if (this.docData.includecess && this.docData.includetax && this.docData.interstate) {
      return {


        table: {
          headerRows: 1,
          alignment: 'center',
          widths: ['4%', '25%', '11%', '10%', '10%', '12%', '12%', '16%'],

          body: [
            ['No', 'Item & Description', 'Qty', 'Unit', 'Rate', 'IGST%', 'CESS%', 'Amount'],
            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.igstRate + "%", p.cessRate + "%", p.amount.toFixed(2)]
              )

            })
          ]

        },
        layout: 'lightHorizontalLines',

      };

    }
    if (!this.docData.includetax && this.docData.includecess) {
      return {


        table: {
          headerRows: 1,

          widths: ['6%', '35%', '11%', '11%', '11%', '11%', '25%'],

          body: [
            ['No', 'Item & Description', 'Qty', 'Unit', 'Rate', 'CESS%', 'Amount'],

            ...this.itemList.map(p => {
              return ([p.slno + 1, [p.item, { text: p.description, color: 'grey', fontsize: 11 }], p.qty, p.unit, p.rate, p.cessRate + "%", p.amount.toFixed(2)]
              )

            })
          ]
        },

        layout: 'lightHorizontalLines',
      };

    }



    //}



    return null;
  }

  getDatas() {

    if (!this.docData.includetax && !this.docData.interstate && !this.docData.includecess) {
      return {
        columns: [
          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },
          ],


        ],

      };


    }
    if (this.docData.includetax && !this.docData.interstate && !this.docData.includecess) {
      return {
        columns: [

          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" SGST Amount:", this.docData.currency, " ", this.docData.sgstvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" CGST Amount:", this.docData.currency, " ", this.docData.cgstvalue.toFixed(2)],
            },

            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: ["Total including Taxes:", this.docData.currency, " ", this.docData.alltotal.toFixed(2)],
            }
          ],


        ],

      };


    }
    if (this.docData.includetax && !this.docData.interstate && this.docData.includecess) {
      return {
        columns: [

          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" SGST Amount:", this.docData.currency, " ", this.docData.sgstvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" CGST Amount:", this.docData.currency, " ", this.docData.cgstvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" CESS Amount:", this.docData.currency, " ", this.docData.cessvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: ["Total including Taxes:", this.docData.currency, " ", this.docData.alltotal.toFixed(2)],
            }
          ],


        ],
      };

    }
    if (this.docData.includetax && this.docData.interstate && !this.docData.includecess) {
      return {

        columns: [

          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" IGST Amount:", this.docData.currency, " ", this.docData.igstvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: ["Total including Taxes:", this.docData.currency, " ", this.docData.alltotal.toFixed(2)],
            }
          ],


        ],

      };

    }
    if (this.docData.includetax && this.docData.interstate && this.docData.includecess) {
      return {

        columns: [

          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" IGST Amount:", this.docData.currency, " ", this.docData.igstvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" CESS Amount:", this.docData.currency, " ", this.docData.cessvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: ["Total including Taxes:", this.docData.currency, " ", this.docData.alltotal.toFixed(2)],
            }
          ],


        ],

      };

    }
    if (!this.docData.includetax && !this.docData.interstate && this.docData.includecess) {
      return {

        columns: [

          [
            {
              margin: [0, 15, 0, 0],
              alignment: 'center',
              text: ["Total Amount:", this.docData.currency, " ", this.docData.total.toFixed(2)],

            },

            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: [" CESS Amount:", this.docData.currency, " ", this.docData.cessvalue.toFixed(2)],
            },
            {
              margin: [0, 4, 0, 0],
              alignment: 'center',
              text: ["Total including Taxes:", this.docData.currency, " ", this.docData.alltotal.toFixed(2)],
            }
          ],


        ],

      };

    }


    return null;
  }
  getBillby() {

    if (this.userData.yourgst) {
      return {

        columns: [
          [{


            style: 'sectionHeader1',
            text: this.userData.yourcompanyname,

            bold: true,
            // alignment: 'left',
            //decoration: 'underline',
          },
          {
            text: this.userData.youraddressline,
            style: 'sectionHeader0',
            // alignment: 'left',
            //decoration: 'underline',
            // color: 'skyblue',
            // margin: [0, 15, 0, 15]

          },

          {
            text: ["GST No:", this.userData.yourgst],
            style: 'sectionHeader0',
            //alignment: 'left',
            //decoration: 'underline',

            // margin: [0, 15, 0, 15]

          },
          ],
          [

          ],

        ]
      }
    };
    if (!this.userData.yourgst) {
      return {

        columns: [
          [{


            style: 'sectionHeader1',
            text: this.userData.yourcompanyname,

            bold: true,
            // alignment: 'left',
            //decoration: 'underline',
          },
          {
            text: this.userData.youraddressline,
            style: 'sectionHeader0',
            // alignment: 'left',
            //decoration: 'underline',
            // color: 'skyblue',
            // margin: [0, 15, 0, 15]

          },


          ],
          [

          ],

        ]
      }
    };
    return null;
  }
  getBillto() {

    if (this.customerData.billgst) {
      return {

        columns: [
          [{
            text: 'Bill to',

            style: 'sectionHeader2'
          },
          {
            text: this.customerData.billcompanyname, bold: true
          },
          { text: this.customerData.billaddressline, },
          { text: ["GST No:", this.customerData.billgst], }
          ],


        ]
      }
    };
    if (!this.customerData.billgst) {
      return {

        columns: [
          [{
            text: 'Bill to',

            style: 'sectionHeader2'
          },
          {
            text: this.customerData.billcompanyname, bold: true
          },
          { text: this.customerData.billaddressline, },

          ],


        ]
      }
    };
    return null;
  }
  getNotes() {

    if (this.docData.notes) {
      return {

        columns: [
          [

            {

              text: "Notes", bold: true
            },
            {
              text: this.docData.notes,
            },
          ],
          [

          ],

        ]
      }
    };
    return null;
  }
  getSign() {

    if (this.userData.signature) {
      return {

        columns: [
          [{
            width: 80,
            height: 70,
            image: this.userData.signature
          },

          {

            text: this.userData.signatoryname
          },
          {
            text: this.userData.designation,
          },
          ],
          [

          ],

        ]
      }
    };
    return null;
  }
  getQuery() {
    if (this.dbUserData.contactname || this.dbUserData.contactno || this.dbUserData.email) {
      return {


        columns: [
          [

            {
              margin: [0, 10, 0, 15],
              color: this.color1,
              text: [" In case of any queries, please contact  ", this.dbUserData.contactname, " at ", this.dbUserData.contactno, " or drop us an email at", this.dbUserData.email]

            },
          ],


        ]

      }
    };
    return null;

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  sendGAEvent(event){
    this.analytics.logEvent(event);
  }
  makepdfMobile(event){
    this.analytics.logEvent(event);
    var element = document.getElementById('printsection');
  
    var opt = {
      margin:       [5,0,5,0],
      filename:     this.docData.docTitle+' '+this.docData.invoiceno+'.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 , dpi:192, letterRendering:true, useCORS:true},
      jsPDF:        { orientation: 'p',
                      unit: 'mm',
                      format: 'a4',
                      putOnlyUsedFonts:true,
                      floatPrecision: 16 }
    };
    html2pdf().from(element).set(opt).save();  
    
    
this.dialogRef.close();
    
  }

}