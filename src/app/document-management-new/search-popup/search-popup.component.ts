/*---------------------------------------------------
Description : Customer,organization and sale serach and select
Input : superUserId,userId,custID,orgID,saleID,contDataAccessRule,orgDataAccessRule,saleDataAccessRule,fieldNameContact,fieldNameSale,fieldNameOrganization,subUsers,superUserBranchId,
Output: select org,customer and sale details

Based ondata accessrule get org and scustomer . based on customer selected and data access rule of sale get sales under the customer
---------------------------------------------------- */
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CommonOrgTagService } from 'src/app/common-org-tag/common-org-tag.service';
import { Customer, OrganisationModel, Sales, SubUsers } from 'src/app/data-models';
import { SearchPopupService } from './search-popup.service'

export interface DialogData {
  superUserId: string;
  userId: string;
  custID: string;
  orgID: string;
  saleID: string;
  contDataAccessRule: string;
  orgDataAccessRule: string;
  saleDataAccessRule: string;
  fieldNameContact: string;
  fieldNameSale: string;
  fieldNameOrganization: string;
  subUsers: SubUsers[];
  superUserBranchId: string
}
@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit, OnDestroy {
  orgControl = new FormControl('');
  orgList: OrganisationModel[] = []
  filteredOrg: Observable<OrganisationModel[]>;

  customerControl = new FormControl('');
  customerList: Customer[] = [];// customer list to display in ui
  customerSubscription: Subscription; // to close customer subscription
  isContactLoading: boolean = false;// to show the loader when customer is loading

  saleControl = new FormControl('');
  salesList: Sales[] = []
  filteredSale: Observable<Sales[]>;

  protected _onDestroy = new Subject<void>(); //Subject that emits when the component has been destroyed.
  orgSelected: boolean = false
  contactSelected: boolean = false
  saleSelected: boolean = false
  selctedOrg: OrganisationModel
  selctedCustomer: Customer
  selctedSale: Sales

  @Input() superUserId: string;
  @Input() userId: string;
  @Input() custID: string;
  @Input() orgID: string;
  @Input() saleID: string;
  @Input() contDataAccessRule: string;
  @Input() orgDataAccessRule: string;
  @Input() saleDataAccessRule: string;
  @Input() fieldNameContact: string;
  @Input() fieldNameSale: string;
  @Input() fieldNameOrganization: string;
  @Input() subUsers: SubUsers[];
  @Input() superUserBranchId: string
  @Output() orgSelect = new EventEmitter(); // document saved cllicked
  @Output() saleSelect = new EventEmitter(); // document saved cllicked
  @Output() customerSelect = new EventEmitter(); // document saved cllicked
    /** Subject that emits when the component has been destroyed. */
    private onDestroy$: Subject<void> = new Subject<void>();
  @Input() onlyCustomerSearch: boolean=false; // for displaying customer search only
  constructor(
    public searchPopupService: SearchPopupService,
    public commonService: CommonService,
    public commonOrgService:CommonOrgTagService
  ) { }


  ngOnInit(): void {
    if (!this.orgID && !this.onlyCustomerSearch) {
      this.searchPopupService.getOrgsFromDb(this.superUserId, this.userId, this._onDestroy, this.orgDataAccessRule, this.subUsers, this.superUserBranchId)
    }
    if (this.custID) {
      this.searchPopupService.getSalesFromDb(this.superUserId, this.userId, this._onDestroy, this.saleDataAccessRule, this.subUsers, this.superUserBranchId, this.custID)
    } else {
      if (this.orgID) {
        this.searchPopupService.isLoading = false;
      }
      if(this.onlyCustomerSearch){
        this.searchPopupService.isLoading = false;
      }
    }
    
    this.searchPopupService.orgs.subscribe((data) => {
      this.orgList = data;
      this._filterOrg(this.customerControl.value)
    })


    this.searchPopupService.sales.subscribe((data) => {
      this.salesList = data;
      this._filterSale(this.customerControl.value)
    })

    this.filteredOrg = this.orgControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterOrg(value || '')),
    );
   
    this.filteredSale = this.saleControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSale(value || '')),
    );
    // geting value changes for customer search to get customer list
    this.customerControl.valueChanges.subscribe((data) => {
      if (typeof data === 'string') {
        this.customerValueChanges(data);
      }
    })
  }
  private _filterOrg(value: string): OrganisationModel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.orgList.filter(option => option.companyName.toLowerCase().includes(filterValue));
    }
  }
  private _filterSale(value: string): Sales[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.salesList.filter(option => option.saleTitle.toLowerCase().includes(filterValue));
    }
  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    // on destroy
    this._onDestroy.next();
    this._onDestroy.complete();
    this.customerControl.reset();
    this.customerSubscription?.unsubscribe();
  }
  // on cutsomer select and emit customer details
  onCustomerSelection(option) {
    this.contactSelected = true;
    this.custID = option.id;
    this.selctedCustomer = option;
    this.saleID = null;
    this.selctedSale = null;
    this.saleControl.reset();
    this.saleSelected = false;
    if (!this.saleID) {
      this.searchPopupService.getSalesFromDb(this.superUserId, this.userId, this._onDestroy, this.saleDataAccessRule, this.subUsers, this.superUserBranchId, this.custID)
    }
    this.customerSelect.emit([
      this.selctedCustomer
    ])
  }
  // on cutsomer only select and emit customer details
  onCustomerOnlySelection(option) {
    this.customerSelect.emit([
      option
    ]);// emit customer details
    this.customerControl.reset();// reset customer input
    this.customerList = [];// reset customer list
  }
  // on org select and emit org details
  onOrgSelection(value) {
    this.orgID = value.option.value.id;
    this.orgSelected = true;
    this.selctedOrg = value.option.value;
    this.orgSelect.emit([
      this.selctedOrg
    ])
  }
  // on sael select and emit sale details
  onSaleSelection(value) {
    this.saleID = value.option.value.id;
    this.saleSelected = true;
    this.selctedSale = value.option.value;
    this.saleSelect.emit([
      this.selctedSale
    ])
  }
  // clear customer and sale details when customer selected is removed and emit customer details and emit customer details
  onClearCustomer() {
    this.custID = null;
    this.selctedCustomer = null;
    this.customerControl.reset();
    this.contactSelected = false;
    this.saleID = null;
    this.selctedSale = null;
    this.saleControl.reset();
    this.saleSelected = false;
    this.customerSelect.emit([
      this.selctedCustomer
    ])
    this.customerList = [];// clear customer list
  }
  // clear org details when org is removed and emit org details
  onClearOrg() {
    this.orgID = null;
    this.selctedOrg = null;
    this.orgControl.reset();
    this.orgSelected = false;
    this.orgSelect.emit([
      this.selctedOrg
    ])
  }
  // clear sale details when sale is removed and emit sale details
  onClearSale() {
    this.saleID = null;
    this.selctedSale = null;
    this.saleControl.reset();
    this.saleSelected = false;
    this.saleSelect.emit([
      this.selctedSale
    ])
  }
  displayFnCust(user: Customer): string {
    return user && user.firstName ? user.firstName : '';
  }
  async customerValueChanges(data) {
    this.customerSubscription?.unsubscribe();// unsubscribe the subscriptiion
    if (data.length > 2) {
      this.isContactLoading = true;
      let queryData = data.toLowerCase();// lowercase the query data
      // based on access rule query the customer
      if (this.contDataAccessRule === 'All') {
        this.customerSubscription =
          this.commonOrgService
            .getCustomersList(this.superUserId, null, 'All', null, queryData)
            .subscribe(([delay, data]) => {
              let cusList = []
              cusList = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Customer;
              });
              const ids = cusList.map(o => o.id)
              this.customerList = cusList.filter(({ id }, index) => !ids.includes(id, index + 1))
              this.isContactLoading = false;
            })
      }
      else if (this.contDataAccessRule === 'Own') {
        this.customerSubscription =
          this.commonOrgService
            .getCustomersList(this.superUserId, this.userId, 'Own', null, queryData)
            .subscribe(([delay, data]) => {
              let cusList = []
              cusList = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Customer;
              });
              const ids = cusList.map(o => o.id)
              this.customerList = cusList.filter(({ id }, index) => !ids.includes(id, index + 1))
              this.isContactLoading = false;
            })
      }
      else if (this.contDataAccessRule === 'Team') {
        let queryArr = [];
        queryArr = queryArr.concat(this.userId);
        for (const subuser of this.subUsers) {
          if (subuser.reportsToId === this.userId) {
            queryArr = queryArr.concat(subuser.userId);
          }
        }
        queryArr = queryArr.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any
        this.customerSubscription =
          this.commonOrgService
            .getCustomersList(this.superUserId, null, 'Team', queryArr, queryData)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([delay, data]) => {
              let cusList = []
              cusList = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Customer;
              });
              const ids = cusList.map(o => o.id)
              this.customerList = cusList.filter(({ id }, index) => !ids.includes(id, index + 1))
              this.isContactLoading = false;
            })
      }
      else if (this.contDataAccessRule === 'Branch') {
        const branchId = this.subUsers.find(
          (item) => item.userId === this.userId
        )?.branchId;
        this.customerSubscription =
          this.commonOrgService
            .getCustomersList(this.superUserId, branchId, 'Branch', null, queryData)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([delay, data]) => {
              let cusList = []
              cusList = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Customer;
              });
              const ids = cusList.map(o => o.id)
              this.customerList = cusList.filter(({ id }, index) => !ids.includes(id, index + 1))
              this.isContactLoading = false;
            })
      } else { }
    } else {
      this.customerList = [];
      this.isContactLoading = false;
    }

  }

}
