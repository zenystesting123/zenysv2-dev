/*--------------------------------------------------------------
Description : Preview the invoice of subscription invoioce added by zenys main account

--------------------------------------------------------------- */
import { PaymentReceipt, Sales } from '../../data-models';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { CustomerData, DocData, UserData } from '../../data-models';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { NetworkCheckService } from '../../networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ZenysmainaccountService } from 'src/app/zenysmainaccount.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.scss'],
})
export class DocPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('printsection', { static: false }) printsection: ElementRef;
  useExistingCss: boolean;
  styleName: string;
  elementsString: string;
  uriArray = [];
  saleId: string;
  custId: string;
  sale: Observable<Sales>;
  customerData: CustomerData; // customer data
  userData: UserData; // user data
  docData: DocData; // document data
  scenario = null; // scenario for document
  itemList; // item details
  docID: string = null; // document id
  color1: string = '#3a9efd'; // document color
  printTemplate: string = 'template1'; // template of preview
  includeLogo: boolean; // check dislay the logo
  includeSignature: boolean; // check display the signature
  isMobilesize: boolean = false; // check if it is mobile size
  fieldNameEstimate: string = 'Estimate'; // set estimate feid name
  fieldNameQuotation: string = 'Quotation'; // set estimate feid name
  networkConnection: boolean; // check for network connection
  documentTypeFeildName: string = 'Invoice'; // if doc title is empty
  zenysMainId: string; // zenys main account id
  protected _onDestroy = new Subject<void>(); //Subject that emits when the component has been destroyed.
  isLoaded: boolean = false;
  constructor(
    private location: Location,
    public networkCheck: NetworkCheckService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private Zenysmain: ZenysmainaccountService,
    public commonService: CommonService,
    private route: ActivatedRoute
  ) {
    route.params.subscribe((val) => {
      //Section 1: Get the information passed on to the module using router link
      this.scenario = this.route.snapshot.paramMap.get('scn'); // ge scenario
      this.docID = this.route.snapshot.paramMap.get('docID'); // get doc id
    });
    // need to check this is required
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
  }
  ngOnInit(): void {
    // subscribe the user details
    this.commonService.userDatas
      .pipe(takeUntil(this._onDestroy))
      .subscribe((allData) => {
        this.isMobilesize = allData.isMobileSize; // get mobile size
        if (allData.authDetails) {
          this.zenysMainId = this.Zenysmain.zenysMainAccountID; // get zenys main account id

          this.Zenysmain.getUser(this.zenysMainId).subscribe(
            (mainUserDetails) => {
              let superUserdata = mainUserDetails;
              // get main user data
              if (mainUserDetails) {
                if (superUserdata.documentColor) {
                  this.color1 = superUserdata.documentColor; // get doument color
                }
                if (superUserdata.printTemplate) {
                  this.printTemplate = superUserdata.printTemplate; // get template
                }
                if (superUserdata.logoStatus) {
                  this.includeLogo = superUserdata.logoStatus; // get logo status
                }
                if (superUserdata.signStatus) {
                  this.includeSignature = superUserdata.signStatus; // get sign status
                }

                // get the  document details from main account with documnt id
                this.Zenysmain.getDocumentDetails(this.zenysMainId, this.docID)
                  .pipe(takeUntil(this._onDestroy))
                  .subscribe((docdata) => {
                    // get all details
                    this.userData = docdata.userData;
                    this.customerData = docdata.customerData;
                    this.docData = docdata.docData;
                    this.docData.docDate = docdata.docData.docDate.toDate();
                    if (docdata.docData.dueDate != null) {
                      this.docData.dueDate = docdata.docData.dueDate.toDate();
                    } else {
                      this.docData.dueDate = docdata.docData.dueDate;
                    }
                    this.itemList = docdata.itemList;
                    this.isLoaded = true;
                    if (!this.docData.taxType) {
                      this.docData.taxType = 'gst';
                    }
                  });
              }
            }
          );
        }
      });

    // need to check this is required
    window.scroll(0, 0);
    this.elementsString =
      document.getElementsByTagName('link')[0].attributes[2].ownerDocument.URL;
    for (let index = 0; index < this.elementsString.length; index++) {
      this.uriArray = this.elementsString.split('/');
      this.saleId = this.uriArray[5];
      this.custId = this.uriArray[8];
    }
  }
  // cick back buttn
  onBack() {
    this.location.back();
  }
  // check the network status
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // download the prevew as pdf
  downloadAsPdf() {
    var element = document.getElementById('printsection');
    var opt = {
      margin: [5, 0, 5, 0],
      filename:
        this.docData.docTitle + ' ' + this.docData.prefixAndDocNumber + '.pdf', // set file name
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
    this._snackBar.open('Successfully Downloaded', '', {
      duration: 2000,
    });
  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    // on destroy
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
