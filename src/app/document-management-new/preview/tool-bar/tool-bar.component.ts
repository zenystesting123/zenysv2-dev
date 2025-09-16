/*--------------------------------
Description : preview toolbar
-------------------------------- */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PreviewService } from '../preview.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CancelDocumentComponent } from 'src/app/document-management-new/cancel-document/cancel-document.component';
import { MatDialog } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';
import { InvoicesService } from '../../invoice-management/invoices.service';
import { Currencies } from 'src/app/currencies';
import { SharedocpopupComponent } from 'src/app/document-management-new/sharedocpopup/sharedocpopup.component';
import { RazorService } from '../../razor.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { messageTemplateModel, shareAttOrDocLink } from 'src/app/data-models';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  invoiceWaTemp: messageTemplateModel[] = []; //to hold the fetrched invoice whatsapp message templates
  superUserData: any;
  custData: any;
  selectedAltCode: string;
  alternateContactNumber: string;

  constructor(
    private location: Location,
    public previewService: PreviewService,
    public networkCheck: NetworkCheckService,
    private service: InvoicesService,
    public rzrserv: RazorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private analytics: AngularFireAnalytics,
    public dialog: MatDialog,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.previewService.getSuperUserData();
    this.invoiceWaTemp = this.previewService.invoiceWaTemp;
  }
  onBack() {
    this.location.back();
  }
  // check the network status
  onCheckNetwork() {
    return this.networkCheck.onNetworkCheck();
  }
  approveDoc() {
    this.previewService.approveDocument();
    // success message
    this._snackBar.open('Succesfully Approved', '', {
      duration: 2000,
    });
  }
  downloadAsPdf() {
    var element = document.getElementById('printsection');
    var opt = {
      margin: [5, 0, 5, 0],
      filename:
        this.previewService.docData.docTitle +
        ' ' +
        this.previewService.docData.prefixAndDocNumber +
        '.pdf', // set file name
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, dpi: 96, letterRendering: true, useCORS: true },
      jsPDF: {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
    };
    html2pdf().from(element).set(opt).save();
    if (this.previewService.docData.docType == 'Estimate') {
      this.analytics.logEvent('btn_dwld_est_web');
    } else if (this.previewService.docData.docType == 'Quotation') {
      this.analytics.logEvent('btn_dwld_quote_web');
    } else {
      this.analytics.logEvent('btn_dwld_inv_web');
    }
    this._snackBar.open('Successfully Downloaded', '', {
      duration: 2000,
    });
  }
  onCreateQuotation() {
    // pass scenario as 'quote-est
    this.router.navigate([
      'dash/document/documentquotationmanagement/',
      this.previewService.docData.saleID
        ? this.previewService.docData.saleID
        : 'none',
      'quotefromest',
      'Quotation',
      this.previewService.customerData.custID
        ? this.previewService.customerData.custID
        : 'none',
      this.previewService.customerData.orgID
        ? this.previewService.customerData.orgID
        : 'none',
      this.previewService.docID,
    ]);
  }
  onCreateInvoice() {
    // if doc type is quotation pass scenario as 'invfromquote'
    if (this.previewService.docData.docType == 'Quotation') {
      this.router.navigate([
        'dash/document/documentinvoicemanagement/',
        this.previewService.docData.saleID
          ? this.previewService.docData.saleID
          : 'none',
        'invfromquote',
        'Invoice',
        this.previewService.customerData.custID
          ? this.previewService.customerData.custID
          : 'none',
        this.previewService.customerData.orgID
          ? this.previewService.customerData.orgID
          : 'none',
        this.previewService.docID,
      ]);
    }
    //if doc type is estimate pass scenario as 'invfromest'
    else if (this.previewService.docData.docType == 'Estimate') {
      this.router.navigate([
        'dash/document/documentinvoicemanagement/',
        this.previewService.docData.saleID
          ? this.previewService.docData.saleID
          : 'none',
        'invfromest',
        'Invoice',
        this.previewService.customerData.custID
          ? this.previewService.customerData.custID
          : 'none',
        this.previewService.customerData.orgID
          ? this.previewService.customerData.orgID
          : 'none',
        this.previewService.docID,
      ]);
    }
  }
  onEdit() {
    // pass userata,customerdata,docdata,itemlits,and previewmode as false and scenario edit
    if (this.previewService.docData.docType == 'Invoice') {
      this.router.navigate([
        'dash/document/documentinvoicemanagement/',
        this.previewService.docData.saleID
          ? this.previewService.docData.saleID
          : 'none',
        'edit',
        this.previewService.docData.docType,
        this.previewService.customerData.custID
          ? this.previewService.customerData.custID
          : 'none',
        this.previewService.customerData.orgID
          ? this.previewService.customerData.orgID
          : 'none',
        this.previewService.docID,
      ]);
    } else if (this.previewService.docData.docType == 'Estimate') {
      this.router.navigate([
        'dash/document/documentmanagement/',
        this.previewService.docData.saleID
          ? this.previewService.docData.saleID
          : 'none',
        'edit',
        this.previewService.docData.docType,
        this.previewService.customerData.custID
          ? this.previewService.customerData.custID
          : 'none',
        this.previewService.customerData.orgID
          ? this.previewService.customerData.orgID
          : 'none',
        this.previewService.docID,
      ]);
    } else if (this.previewService.docData.docType == 'Quotation') {
      this.router.navigate([
        'dash/document/documentquotationmanagement/',
        this.previewService.docData.saleID
          ? this.previewService.docData.saleID
          : 'none',
        'edit',
        this.previewService.docData.docType,
        this.previewService.customerData.custID
          ? this.previewService.customerData.custID
          : 'none',
        this.previewService.customerData.orgID
          ? this.previewService.customerData.orgID
          : 'none',
        this.previewService.docID,
      ]);
    }
  }
  invoicesend() {
    console.log(this.previewService.rzrAccountId);
    console.log(this.previewService.payLinkMode);
    console.log(this.previewService.stripeAccountId);

    if (
      this.previewService.rzrAccountId ||
      this.previewService.stripeAccountId
    ) {
      this.service
        .getCustdetails(
          this.previewService.superUserId,
          this.previewService.customerData.custID
        )
        .subscribe((res) => {
          this.makepaylink(
            res.data().contactNo
              ? res.data().code + '' + res.data().contactNo
              : '',
            res.data().email
          );
        });
    } else {
      this._snackBar.open(
        'Register your account details with Zenys for creating payment link',
        null,
        { duration: 4000 }
      );
    }
  }

  makepaylink(contactNo, email) {
    //previous implementation when razorpay route was used instead of submerchant
    if (this.previewService.rzrAccountId && !this.previewService.payLinkMode) {
      if (this.previewService.docData.currency == 'INR') {
        var basicunit = Currencies.getCurencies().filter(
          (cur) => cur.isoCode == this.previewService.docData.currency
        )[0].basicUnit;
        var dat = {
          amount: this.previewService.docData.totalInclTax * basicunit,
          name:
            this.previewService.customerData.fname1 +
            ' ' +
            this.previewService.customerData.sname,
          contact: contactNo,
          email: email,
          currency: this.previewService.docData.currency,
          account_id: this.previewService.rzrAccountId,
        };
        // console.log(dat);
        this.rzrserv.makepaylink(dat).subscribe(
          (res: any) => {
            console.log(res);
            this.service.sendEmail({
              to: email,
              template: {
                name: 'payLink',
                data: {
                  userName: this.previewService.userData.companyName
                    ? this.previewService.userData.companyName
                    : this.previewService.userData.contactname,
                  customerName:
                    this.previewService.customerData.fname1 +
                    ' ' +
                    this.previewService.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            this.service
              .savepaymentLink(
                {
                  ...res,
                  paidFlag: false,
                  userId: this.previewService.userId,
                  superUserId: this.previewService.superUserId,
                  docNo: this.previewService.docID,
                  customerId: this.previewService.customerData.custID,
                  saleId: this.previewService.docData.saleID,
                  saleTitle: this.previewService.docData.saleTitle,
                  companyName: this.previewService.customerData.companyName,
                  customerName:
                    this.previewService.customerData.fname1 +
                    (this.previewService.customerData.sname
                      ? this.previewService.customerData.sname
                      : ''),
                },
                res.id
              )
              .then((data) => {
                this.service
                  .updateDocafterLinkcreation(
                    this.previewService.userId,
                    this.previewService.docID,
                    res,
                    this.previewService.docID
                  )
                  .then((data2) => {
                    console.log(data2);
                  });
              });
          },
          (err) => {
            console.log(err);
          }
        );
        return null;
      } else {
        this._snackBar.open(
          'Payment links for tranfer linked accounts can only be created for Indian Currency',
          null,
          { duration: 4000 }
        );
      }
    } else if (
      this.previewService.rzrAccountId &&
      this.previewService.payLinkMode == 'RazorpayPartner'
    ) {
      var basicunit = Currencies.getCurencies().filter(
        (cur) => cur.isoCode == this.previewService.docData.currency
      )[0].basicUnit;
      var dat = {
        amount: this.previewService.docData.totalInclTax * basicunit,
        name:
          this.previewService.customerData.fname1 +
          ' ' +
          this.previewService.customerData.sname,
        contact: contactNo,
        email: email,
        currency: this.previewService.docData.currency,
        account_id: this.previewService.rzrAccountId,
      };
      console.log(dat);
      this.rzrserv.makepaylinkSubMerchant(dat).subscribe(
        (res: any) => {
          console.log(res);
          if (res.short_url) {
            var urlobj = { short_url: res.short_url };
            this.previewService.paymentLink = urlobj;
            this.service.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.previewService.userData.companyName
                    ? this.previewService.userData.companyName
                    : this.previewService.userData.contactname,
                  customerName:
                    this.previewService.customerData.fname1 +
                    ' ' +
                    this.previewService.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            const paymentLinkData = {
              ...res,
              paidFlag: false,
              userId: this.previewService.userId,
              superUserId: this.previewService.superUserId,
              docNo: this.previewService.docID,
              customerId: this.previewService.customerData.custID,
              saleId: this.previewService.docData.saleID,
              saleTitle: this.previewService.docData.saleTitle,
              companyName: this.previewService.customerData.companyName,
              customerName: this.previewService.customerData.fname1,
              customerSecondName: this.previewService.customerData.sname
                ? this.previewService.customerData.sname
                : '',
              type: this.previewService.docID,
            };
            if (this.previewService.docData.prefixAndDocNumber) {
              paymentLinkData.docprefixAndDocNumber =
                this.previewService.docData.prefixAndDocNumber;
            }
            this.service
              .savepaymentLink(paymentLinkData, res.id)
              .then((data) => {
                this.service
                  .updateDocafterLinkcreation(
                    this.previewService.userId,
                    this.previewService.docID,
                    res,
                    this.previewService.docID
                  )
                  .then((data2) => {
                    console.log(data2);
                  });
              });
          } else if (!!!res.short_url) {
            this._snackBar.open(
              'Payment links cannot be created for this amount. You can contact Razorpay Customer care to know the maximum amount that can be used to create payment link in your account. ',
              null,
              { duration: 6000 }
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
      return null;
    } else if (
      this.previewService.stripeAccountId &&
      this.previewService.payLinkMode == 'StripeConnect'
    ) {
      this.service
        .makeShortUrl(
          this.previewService.superUserId,
          this.previewService.docID,
          this.previewService.docID
        )
        .then(
          (data) => {
            this.service
              .getShortUrl(
                this.previewService.superUserId,
                this.previewService.docID,
                this.previewService.docID
              )
              .subscribe((data: any) => {
                if (!!data.shortUrl) {
                  var urlobj = { short_url: data.shortUrl };
                  this.previewService.paymentLink = urlobj;
                  this.service.sendEmail({
                    to: email,
                    template: {
                      name: 'Paylink',
                      data: {
                        userName: this.previewService.userData.companyName
                          ? this.previewService.userData.companyName
                          : this.previewService.userData.contactname,
                        customerName:
                          this.previewService.customerData.fname1 +
                          ' ' +
                          this.previewService.customerData.sname,
                        paymentLink: data.shortUrl,
                      },
                    },
                  });
                  this.service
                    .updateDocafterLinkcreation(
                      this.previewService.userId,
                      this.previewService.docID,
                      { short_url: data.shortUrl },
                      this.previewService.docID
                    )
                    .then((data2) => {
                      console.log(data2);
                    });
                }
              });
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  invoiceshare() {
    if (this.previewService.docType == 'Invoice') {
      const dialogRef = this.dialog.open(SharedocpopupComponent, {
        width: '250px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result) {
          this.invoicesend();
          this.shareDocument();
        }
        if (!result) {
          this.shareDocument();
        }
      });
    } else {
      this.shareDocument();
    }
  }
  shareDocument() {
    this.service
      .getCustdetails(
        this.previewService.superUserId,
        this.previewService.customerData.custID
      )
      .subscribe((res) => {
        let doc;
        if (this.previewService.docType == 'Quotation') {
          doc = 'Quotations';
        } else if (this.previewService.docType == 'Estimate') {
          doc = 'Estimates';
        } else if (this.previewService.docType == 'Invoice') {
          doc = 'Invoices';
        } else {
        }
        if (res.data()?.email) {
          this.service
            .getsharedwithid(this.previewService.docData.saleID)
            .subscribe((res2) => {
              var data: any = {};
              if (res2.data()) {
                this.service
                  .addinvoicetoshare(
                    this.previewService.docData.saleID,
                    this.previewService.docID,
                    doc
                  )
                  .then(() => {
                    this.service.sendEmail({
                      to: res.data().email,
                      template: {
                        name: 'sharedDoc',
                        data: {
                          userName: this.previewService.userData.contactname,
                          link: shareAttOrDocLink,
                        },
                      },
                      // html:"A document have been send to you by "+this.previewService.userData.companyName=="N/A"?this.previewService.userData.contactname:this.previewService.userData.companyName+". Click the link <a href=''>Click here</a> "
                    });
                    this.service
                      .togglesharestatus(
                        this.previewService.superUserId,
                        this.previewService.docID,
                        true,
                        doc
                      )
                      .then(() => {
                        // this.shareStatus = true;
                      });
                  });
              } else {
                // console.log("false")
                this.service
                  .initshareinvoice({
                    saleID: this.previewService.docData.saleID,
                    userId: this.previewService.superUserId,
                    customerEmail: res.data().email,
                    shareDate: Date.now(),
                  })
                  .then(() => {
                    this.service
                      .addinvoicetoshare(
                        this.previewService.docData.saleID,
                        this.previewService.docID,
                        doc
                      )
                      .then(() => {
                        this.service.sendEmail({
                          to: res.data().email,
                          template: {
                            name: 'sharedDoc',
                            data: {
                              userName:
                                this.previewService.userData.contactname,
                                link: shareAttOrDocLink,
                            },
                          },
                        });
                        this.service
                          .togglesharestatus(
                            this.previewService.superUserId,
                            this.previewService.docID,
                            true,
                            doc
                          )
                          .then(() => {
                            // this.shareStatus = true;
                          });
                      });
                  });
              }
              // console.log(data)
            });
        } else
          this._snackBar.open('The customer should have an email ID ', '', {
            duration: 2000,
          });
      });
    this._snackBar.open('Shared ', this.previewService.docData.docType, {
      duration: 2000,
    });
  }
  onSendEvent() {
    if (this.previewService.docData.docType == 'Estimate') {
      this.analytics.logEvent('btn_dwld_est_web');
    } else if (this.previewService.docData.docType == 'Quotation') {
      this.analytics.logEvent('btn_dwld_quote_web');
    } else if (this.previewService.docData.docType == 'Invoice') {
      this.analytics.logEvent('btn_dwld_inv_web');
    } else {
    }
  }
  onCancelDocument() {
    // open camcekl popup and pass doc id, doc type and super user id
    const dialogRef = this.dialog.open(CancelDocumentComponent, {
      width: '400px',
      data: {
        docId: this.previewService.docID,
        docType: this.previewService.docData.docType,
        superUserId: this.previewService.superUserId,
        userId: this.previewService.userId,
        userName: this.previewService.userName,
        changeLog: this.previewService.changeLog

      },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(() => {
        dialogSubmitSubscription.unsubscribe();
      });
  }

  // to send whatsapp message
  async onWhatsAppContact() {
    //first fetch whatsapp contact templates
    await this.getAllInvoiceWaTemp();
  }
  // Db fetch all templates related to whatsapp and contact
  getAllInvoiceWaTemp() {
    return new Promise<void>((resolve) => {
      this.previewService
        .getAllInvoiceWaTemp(this.previewService.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.invoiceWaTemp = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as messageTemplateModel;
          });
          resolve();
        });
    });
  }
  // if a template is selected to send whatspp message
  selectTemplate(selectedTempl) {
    let ass = null;
    var contact;
    var invoice;
    var sale;
    this.superUserData = this.previewService.superUserData;
    invoice = this.previewService.invoice;

    if(invoice.customerData.custID) {
      //fetch the customer data if a contact tagged to invoice
      this.previewService
        .getContactDetails(
          this.previewService.superUserId,
          invoice.customerData.custID
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((contactData) => {
          contact = contactData;

              if(contact){
                //fetch the sale data if a sale is tagged to invoice
                this.previewService
                  .getSaleDetails(
                    this.previewService.superUserId,
                    invoice.docData.saleID
                  )
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((saleData) => {
                    sale = saleData;

                    //get assigned person's details
                    if (this.previewService.subUsers?.length > 0) {
                      ass = this.previewService.subUsers?.find(
                        (subuser) => subuser.userId === contact.assignedTo
                      );
                    }
                    //remove + sign from code
                    const code = contact.code?.replace('+', '');
                    //variable to store assigned person's details
                    var assignedTo = {
                      firstname: '',
                      lastname: '',
                      email: '',
                      phone: '',
                    };
                    //if no assignedTo available, use superuser as assigned person
                    if (ass === null || typeof ass === 'undefined') {

                      assignedTo.firstname = this.superUserData.firstname;
                      assignedTo.lastname = this.superUserData.lastname
                        ? this.superUserData.lastname
                        : '';
                      assignedTo.email = this.superUserData.email
                        ? this.superUserData.email
                        : 'Email not provided';
                      assignedTo.phone = this.superUserData.phone
                        ? `${this.superUserData.countryCode}${this.superUserData.phone}`
                        : 'Contact Number not provided';
                    } else {
                      //assigning to assignedTo
                      assignedTo.firstname = ass.firstname;
                      assignedTo.lastname = ass.lastname ? ass.lastname : '';
                      assignedTo.email = ass.email
                        ? ass.email
                        : 'Email not provided';
                      assignedTo.phone = ass.contactNo
                        ? `${ass.code}${ass.contactNo}`
                        : 'Contact Number not provided';
                    }
                    // if no template selected, open whatsapp window
                    if (selectedTempl === 'noTemplate') {

                        window.open(
                          `https://web.whatsapp.com/send?phone=${code}${contact.contactNo}`,
                          '',
                          'width=800,height=600'
                        );

                    } else {
                    //if template is selected, and contact is tagged, replace template field values
                    if (!!contact) {
                      var str: any = selectedTempl.body
                        .replace(
                          /\#\[invoice.Date\]/g,
                          this.convertDate(invoice.docData.docDate)
                        )
                        .replace(
                          /\#\[invoice.Doc Prefix\]/g,
                          invoice.docData.docPrefix ? invoice.docData.docPrefix : ''
                        )
                        .replace(
                          /\#\[invoice.Doc No\]/g,
                          invoice.docData.docNumber ? invoice.docData.docNumber : ''
                        )
                        .replace(
                          /\#\[invoice.Due Date\]/g,
                          this.convertDate(invoice.docData.dueDate)
                        )
                        .replace(
                          /\#\[invoice.Currency\]/g,
                          invoice.docData.currency ? invoice.docData.currency : ''
                        )
                        .replace(
                          /\#\[invoice.Bank Details\]/g,
                          invoice.docData.bankDetails ? invoice.docData.bankDetails : ''
                        )
                        .replace(
                          /\#\[invoice.Amount Including Tax\]/g,
                          invoice.docData.totalInclTax ? invoice.docData.totalInclTax : ''
                        )
                        .replace(
                          /\#\[invoice.Sale\]/g,
                          invoice.docData.saleTitle ? invoice.docData.saleTitle : ''
                        )
                        .replace(
                          /\#\[invoice.Customer\]/g,
                          contact.firstName +
                            ' ' +
                            (contact.secondName ? contact.secondName : '')
                        )
                        .replace(
                          /\#\[invoice.Notes\]/g,
                          invoice.docData.notes ? invoice.docData.notes : ''
                        )
                        .replace(
                          /\#\[invoice.Amount Collected\]/g,
                          invoice.collectedAmount ? invoice.collectedAmount : ''
                        )
                        .replace(
                          /\#\[invoice.Doc URL\]/g,
                          invoice.sharedDocId ? invoice.sharedDocId : ''
                        )
                        .replace(
                          /\#\[sale.Sale Title\]/g,
                          sale?.saleTitle ? sale?.saleTitle : ''
                        )
                        .replace(
                          /\#\[sale.Estimated Value\]/g,
                          sale?.estimatedValue ? sale?.estimatedValue : ''
                        )
                        .replace(
                          /\#\[sale.Start Date\]/g,
                          sale?.startDate ? this.convertDate(sale?.startDate) : ''
                        )
                        .replace(
                          /\#\[sale.Expected Completion Date\]/g,
                          sale?.expCompletionDate ? this.convertDate(sale?.expCompletionDate) : ''
                        )
                        .replace(
                          /\#\[sale.Stage\]/g,
                          sale?.salesStage ? this.commonService.getStatusName('sales', sale.selectedSalePipeline,sale.salesStage) : ''
                        )
                        .replace(/\#\[sale.Priority\]/g, sale?.priority ? sale?.priority : '')
                        .replace(/\#\[sale.Assigned To\]/g, sale?.assignedToName ? sale?.assignedToName : '')
                        .replace(
                          /\#\[sale.Description\]/g,
                          sale?.description ? sale?.description : 'Sale Description not provided'
                        )
                        .replace(
                          /\#\[contact.Company Name\]/g,
                          contact.companyName ? contact.companyName : ''
                        )
                        .replace(/\#\[contact.First Name\]/g, contact.firstName)
                        .replace(
                          /\#\[contact.Second Name\]/g,
                          contact.secondName ? contact.secondName : ''
                        )
                        .replace(
                          /\#\[contact.Contact No\]/g,
                          contact.contactNumber ? contact.contactNumber : 'Contact Number not provided'
                        )
                        .replace(
                          /\#\[contact.Email\]/g,
                          contact.email ? contact.email : 'Email not provided'
                        )
                        .replace(/\#\[contact.Priority\]/g, contact.priority)
                        .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline, contact.status))
                        .replace(
                          /\#\[contact.Assigned To\]/g,
                          contact.assignedToName
                        )
                        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                        .replace(
                          /\#\[user.Last Name\]/g,
                          assignedTo.lastname ? assignedTo.lastname : ''
                        )
                        .replace(
                          /\#\[user.Contact No\]/g,
                          assignedTo.phone ? assignedTo.phone : 'Contact Number not provided'
                        )
                        .replace(
                          /\#\[user.Email\]/g,
                          assignedTo.email ? assignedTo.email : ''
                        );
                      //replace additional fields value for contact
                      if (this.superUserData.customFieldsContact) {

                        let teststring = str;
                        for (
                          let i = 0;
                          i < this.superUserData.customFieldsContact.length;
                          i++
                        ) {
                          var str1 =
                            '\\#\\[contact.' +
                            this.superUserData.customFieldsContact[i].fieldName +
                            '\\]';
                          var re = new RegExp(str1, 'g');
                          teststring = teststring.replace(
                            re,
                            contact.additionalFieldsArr
                              ? contact.additionalFieldsArr[i + '']?.fieldValue
                                ? this.superUserData.customFieldsContact[i]
                                    .fieldType == 'date'
                                  ? typeof contact.additionalFieldsArr[i + '']
                                      .fieldValue == 'object'
                                    ? this.convertDate(
                                        contact.additionalFieldsArr[i + '']
                                          .fieldValue
                                      )
                                    : 'Date not provided'
                                  : this.superUserData.customFieldsContact[i].fieldType ==
                                    'date_time'
                                  ? this.convertDateTime(
                                      contact.additionalFieldsArr[i + ''].fieldValue
                                    )
                                  : contact.additionalFieldsArr[i + '']?.fieldValue
                                : 'Value not provided'
                              : 'Value not provided'
                          );
                        }
                        str = teststring;
                      }
                      //replace additional fields value for sale
                      if (this.superUserData.customFieldsSale) {

                        let teststring = str;
                        for (
                          let i = 0;
                          i < this.superUserData.customFieldsSale.length;
                          i++
                        ) {
                          var str1 =
                            '\\#\\[sale.' +
                            this.superUserData.customFieldsSale[i].fieldName +
                            '\\]';
                          var re = new RegExp(str1, 'g');
                          teststring = teststring.replace(
                            re,
                            sale?.additionalFieldsArr
                              ? sale?.additionalFieldsArr[i + '']?.fieldValue
                                ? this.superUserData.customFieldsSale[i].fieldType == 'date'
                                  ? typeof sale?.additionalFieldsArr[i + ''].fieldValue == 'object'
                                    ? this.convertDate(
                                        sale?.additionalFieldsArr[i + ''].fieldValue
                                      )
                                    : 'Date not provided'
                                  : this.superUserData.customFieldsSale[i].fieldType ==
                                    'date_time'
                                  ? this.convertDateTime(
                                    sale.additionalFieldsArr[i + ''].fieldValue
                                    )
                                  : sale?.additionalFieldsArr[i + '']?.fieldValue
                                : 'Value not provided'
                              : 'Value not provided'
                          );
                        }
                        str = teststring;
                      }
                      //replace additional fields value for invoice
                      if (this.superUserData.customFieldsInvoices) {

                        let teststring = str;
                        for (
                          let i = 0;
                          i < this.superUserData.customFieldsInvoices.length;
                          i++
                        ) {
                          var str1 =
                            '\\#\\[invoice.' +
                            this.superUserData.customFieldsInvoices[i].fieldName +
                            '\\]';
                          var re = new RegExp(str1, 'g');
                          teststring = teststring.replace(
                            re,
                            invoice?.additionalFieldsArr
                              ? invoice?.additionalFieldsArr[i + '']?.fieldValue
                                ? this.superUserData.customFieldsInvoices[i].fieldType == 'date'
                                  ? typeof invoice?.additionalFieldsArr[i + ''].fieldValue == 'object'
                                    ? this.convertDate(
                                      invoice?.additionalFieldsArr[i + ''].fieldValue
                                      )
                                    : 'Date not provided'
                                  : this.superUserData.customFieldsInvoices[i].fieldType ==
                                    'date_time'
                                  ? this.convertDateTime(
                                    invoice.additionalFieldsArr[i + ''].fieldValue
                                    )
                                  : invoice?.additionalFieldsArr[i + '']?.fieldValue
                                : 'Value not provided'
                              : 'Value not provided'
                          );
                        }
                        str = teststring;
                      }
                      //convert html string
                      const convStr = this.convertToPlain(str);
                      const convStr1 = encodeURIComponent(convStr);
                      if (convStr1) {
                        window.open(
                          `https://web.whatsapp.com/send?phone=${code}${contact.contactNo}&text=${convStr1}`,
                          '',
                          'width=800,height=600'
                        );
                      }
                    }
                    }
                  }
                );
              }
      });
    }
  }
  // function to retrieve message body saved as html string
  convertToPlain(htmlString) {

    let html = htmlString.replace(/<\/div>/g, "</div>\n");
    html = html.replace(/<\/p>/g, "</p>\n");

    // Create a new div element
    var tempDivElement = document.createElement('div');

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || '';
  }
  // to convert date and time from timestamp to string
  convertDateTime(date) {
    if (date && typeof date === 'object') {
      const n = date.toDate();
      let d = n.toLocaleString('en-GB');
      return d;
    } else {
      return 'Invalid date/date not provided';
    }
  }
  // to convert dates in additional field in message body
  convertDate(date) {
    if (date) {
      var d = new Date(!!date.toDate ? date.toDate() : date);
      var month;
      var day;
      var year;
      (month = '' + (d.getMonth() + 1)),
        (day = '' + d.getDate()),
        (year = d.getFullYear());

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [day, month, year].join('-');
    }
  }

  // ondestroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
