import { Component, DoCheck, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerData, DbUserData, DocData, LineItemData, UserData } from '../data.model';
import { InvoiceFormService } from '../doc-form/invoice-form.service';
import { Preview1Component } from '../preview1/preview1.component';
import { Preview2Component } from '../preview2/preview2.component';
import { Preview3Component } from '../preview3/preview3.component';
import { Preview4Component } from '../preview4/preview4.component';
// import { environment } from 'environments/environment';
@Component({
  selector: 'app-previews',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnChanges {
  previewMode: boolean;
  @Input() docType: string;
  @ViewChild(Preview1Component)
  private preview1: Preview1Component;
  @ViewChild(Preview2Component)
  private preview2: Preview2Component;
  @ViewChild(Preview3Component)
  private preview3: Preview3Component;
  @ViewChild(Preview4Component)
  private preview4: Preview4Component;
  useExistingCss: boolean;
  styleName: string;
  itemWidth: string = '30%'; //default width of item column
  Preview1: boolean = true;
  Preview2: boolean = false;
  Preview3: boolean = false;
  Preview4: boolean = false;
  // Preview5:boolean=false;

  userData: UserData;
  customerData: CustomerData;
  docData: DocData;
  dbUserData: DbUserData;
  // docType:DocType;
  lineItem: LineItemData = {
    slno: 0, amount: null, unit: null, amountInclTax: null, item: null, qty: null, rate: null, vatRate: null,
    discountRate: 0, discountAmount: null, vatAmount: null, cgstRate: null, igstRate: null, sgstRate: null, cessRate: null, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null,
    discountedAmount: 0,hsnCode :null
  };
  itemList = [this.lineItem];

  buttonStatus: boolean = true; // need to check what this is for
  @Input() color1: string = '#3a9efd';
  @Input() printTemplate: number = 1;
  constructor(private router: Router, public service: InvoiceFormService,
    private route: ActivatedRoute, public toastr: ToastrService,) {
    this.userData = service.getValuesUserData();
    // console.log(this.userData );
    this.customerData = service.getValuesCustomerData();
    this.docData = service.getValuesDocData();
    this.dbUserData = service.getValuesDbUserData();
    // this.docType=service.getValuesDocType();
    this.itemList = service.getItemList();
    route.params.subscribe(val => {
      this.docType = this.route.snapshot.paramMap.get('docType');
      console.log("Doc type selected is", this.docType)
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
    // this.Preview5=false;
  }
  preView2() {
    this.Preview1 = false;
    this.Preview2 = true;
    this.Preview3 = false;
    this.Preview4 = false;
    // this.Preview5=false;
  }
  preView3() {
    this.Preview1 = false;
    this.Preview2 = false;
    this.Preview3 = true;
    this.Preview4 = false;
    // this.Preview5=false;
  }
  preView4() {
    this.Preview1 = false;
    this.Preview2 = false;
    this.Preview3 = false;
    this.Preview4 = true;
    // this.Preview5=false;
    // this.toastr.warning('Please sign in to use this template', 'Sign In');
  }
  preView5() {
    // this.Preview1=false;
    // this.Preview2=false;
    // this.Preview3=false;
    // this.Preview4=false;
    // this.Preview5=true;
    // this.toastr.warning ('Please sign in to use this template', 'Sign In');
  }


  ngOnInit(): void {

    //   this.route.queryParams.subscribe(params => {
    //     this.docData.docTitle = params["docTitle"];


    // });
  }
  navbarOpen = false;
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.docType) {
      if (changes.docType.currentValue != this.docData.docType) {
        this.docData.docTitle = this.docType;
        this.docData.docType = this.docType;
      }
    }
    console.log(changes);
  }

  onBack() {

    this.router.navigate(['/home']);


  }

  nextTemplate() {
    //increment the template counter by 1
    if (this.printTemplate < 4) {
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
    if (this.printTemplate == 4) {
      this.preview4.triggerFalseClick();
    }

  }
  editMode() {
    this.previewMode = false;
    console.log(this.previewMode);
    this.router.navigateByUrl('/create');

  }


}
