import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData, DbUserData, DocData, LineItemData, ShippingData, UserData } from '../data.model';
import { InvoiceFormService } from '../doc-form/invoice-form.service';
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

var options = {
  year: "numeric",
  month: "2-digit",
  day: "numeric"
};


@Component({
  selector: 'app-preview2s',
  templateUrl: './preview2.component.html',
  styleUrls: ['./preview2.component.scss']
})
export class Preview2Component implements OnInit {

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
  shipData: ShippingData;
  // docType:DocType;
  lineItem: LineItemData = { slno: 0, amount: null, unit: null, amountInclTax: null, item: null, qty: null, rate: null, cgstRate: null,
    discountRate:0,discountAmount:null,discountedAmount:null,
    vatRate: null, vatAmount: null, igstRate: null, sgstRate: null, cessRate: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null ,hsnCode :null};
  itemList = [this.lineItem];

  buttonStatus: boolean = true; // need to check what this is for
  @Input() color1: string = '#3a9efd';
  @Input() docType: string;
  constructor(private router: Router, private route: ActivatedRoute, public service: InvoiceFormService, public toastr: ToastrService) {
    this.userData = service.getValuesUserData();
    console.log(this.userData);
    this.customerData = service.getValuesCustomerData();
    this.docData = service.getValuesDocData();
    this.dbUserData = service.getValuesDbUserData();
    // this.docType=service.getValuesDocType();
    this.itemList = service.getItemList();
    this.shipData = service.getshipData();
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

  async generatePDF() {

    let docDefinition = {
      //content:html,
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

            [
              this.getBillby(),
            ],
            [
              this.getSec(),


            ],

          ],
        },


        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },


        {
          columns: [


            [
              this.getBillto(),
            ],


          ],

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
        table: {

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
    if (this.docData.docTitle == 'Invoice') {
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
    if (this.docData.docTitle == 'Quotation') {
      return {

        columns: [

          [
            {
              style: 'invoice',

              text: [this.docData.docTitle, " No: ", this.docData.invoiceno]
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
    if (this.docData.docTitle == 'Estimate') {
      return {

        columns: [

          [
            {
              style: 'invoice',

              text: [this.docData.docTitle, " No: ", this.docData.invoiceno]
            },
            {
              style: 'invoice1',

              text: ["Estimate Date: ", this.docData.date.toLocaleDateString("en")]
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
    if (this.dbUserData.contactname) {
      return {


        columns: [
          [

            {
              margin: [0, 20, 0, 15],
              color: this.color1,
              text: [" In case of any queries, please contact  ", this.dbUserData.contactname, " at ", this.dbUserData.contactno, " or drop us an email at", this.dbUserData.email]

            },
          ],


        ]

      }
    };
    return null;

  }



}
