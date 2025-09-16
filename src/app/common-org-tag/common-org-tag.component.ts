import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CommonService } from '../common.service';
import {
  Customer,
  defaultServiceSettings,
  OrganisationModel,
  serviceSettings,
  SubUsers,
} from '../data-models';
import { CommonOrgTagService } from './common-org-tag.service';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-common-org-tag',
  templateUrl: './common-org-tag.component.html',
  styleUrls: ['./common-org-tag.component.scss'],
})
export class CommonOrgTagComponent implements OnInit, OnChanges {
  @Input() contactSelected;
  @Input() companySelected;
  @Output() contSelectedEvent = new EventEmitter<any>();
  @Output() orgIdEvent = new EventEmitter<string>();
  @Output() orgNameEvent = new EventEmitter<string>();
  @Input() inpModule: string = '';
  @Input() scenario: string;
  @Input() orgId: string;
  @Input() customerId: string;
  @Input() compName: string = '';
  @Input() userName: string = '';
  myControl = new FormControl('');
  filteredOptions: Observable<OrganisationModel[]>;
  myControlCust = new FormControl('');

  fieldNameOrganization = 'Organization';
  superUserId = '';
  userId = '';
  contDataAccessRule = '';
  orgDataAccessRule = '';
  organisations: OrganisationModel[] = [];
  orgsFetched: OrganisationModel[] = [];
  orgs: OrganisationModel[] = [];
  subUsers: SubUsers[] = [];
  contacts: Customer[] = [];
  contactsFetched: Customer[] = [];
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;
  contDisplay = false;
  fieldNameContact = 'Contact';

  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() chipDisplay: boolean = true;
  customerList: Customer[] = [];// customer list to display in ui
  customerSubscription: Subscription; // to close customer subscription
  isContactLoading: boolean = false;// to show the loader when customer is loading

  constructor(
    public commonService: CommonService,
    private commonOrgService: CommonOrgTagService,
  ) {

    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.superUserId = allData.userDetails.superUserId;
          this.userId = allData.userId;
          this.subUsers = allData.subUsers;
          this.orgs = allData.organisations;
          if (allData.superUserDetails.serviceSettings) {
            this.serviceSettings = allData.superUserDetails.serviceSettings;
          }
          this.fieldNameContact =
            allData.superUserDetails?.fieldNames?.fieldNameContact;
          this.fieldNameOrganization = allData.superUserDetails?.fieldNames
            ?.fieldNameOrganization
            ? allData.superUserDetails?.fieldNames?.fieldNameOrganization
            : 'Organization';
          this.contDataAccessRule =
            allData.usrProfileData.contactDataAccessRule;
          this.orgDataAccessRule = allData.usrProfileData.orgDataAccessRule;

          if (this.contactSelected == true) {
            //get the contact detail and display as chip
          }
          if (this.companySelected == true) {
            //get the organisation detail and display as chip
          }
          if (this.contactSelected == false || this.companySelected == false) {
          }
        }
      });
  }
  doActions() {
    if (
      this.customerId &&
      this.scenario &&
      (this.scenario === 'edit' ||
        this.scenario === 'createfromCustomer' ||
        this.scenario === 'createfromOrg')
    ) {

      const customerData = this.contacts.find(
        (item) => item.id === this.customerId
      );
      if (customerData && this.contactSelected) {
        this.contSelected(customerData);
      }
    }
  }

  loadOrgData() {


    if (this.orgDataAccessRule === 'All') {
      this.organisations = this.orgs;
      this.doActionsOrg();
    }
    if (this.orgDataAccessRule === 'Own') {
      const uId = this.userId;

      this.organisations = this.orgs.filter(function (e) {
        return e.assignedTo === uId;
      });
      this.doActionsOrg();
    }
    if (this.orgDataAccessRule === 'Team') {
      let queryArrOrg = [];
      queryArrOrg = queryArrOrg.concat(this.userId);
      for (const subuser of this.subUsers) {
        if (subuser.reportsToId === this.userId) {
          queryArrOrg = queryArrOrg.concat(subuser.userId);
        }
      }
      queryArrOrg = queryArrOrg.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any
      this.organisations = this.orgs.filter((el) => {
        return queryArrOrg.some((f) => {
          return f === el.assignedTo;
        });
      });
      this.doActionsOrg();
    }
    if (this.orgDataAccessRule === 'Branch') {
      const branchId = this.subUsers.find(
        (item) => item.userId === this.userId
      )?.branchId;

      this.organisations = this.orgs.filter(function (e) {
        return e.associatedBranch == branchId;
      });
      this.doActionsOrg();
    }
  }
  doActionsOrg() {
    if (this.organisations?.length > 0) {
      if (
        this.scenario &&
        this.orgId &&
        (this.scenario === 'edit' ||
          this.scenario === 'createfromCustomer' ||
          this.scenario === 'createfromOrg')
      ) {

        const compData = this.organisations.find(
          (item) => item.id === this.orgId
        );
        if (compData) {
          this.orgSelected(compData);
        }
      }
      if (
        this.scenario &&
        this.orgId &&
        this.scenario === 'create' &&
        this.inpModule &&
        this.inpModule === 'Contact'
      ) {

        const compData = this.organisations.find(
          (item) => item.id === this.orgId
        );
        if (compData && this.companySelected) {
          this.orgSelected(compData);
        }
      }
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.organisations.slice();
        })
      );

    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.companySelected) {
      this.myControl.reset();
    }
    if (this.contactSelected) {
      this.myControlCust.reset();
    }else{
    this.customerList = [];
    }

  }
  ngOnInit() {
    // customer is not mandatory if called from task or expense module
    if(this.inpModule !== 'task' && this.inpModule !== 'expense'){
      this.myControlCust.setValidators([Validators.required]);
    }

    if (this.inpModule && this.inpModule === 'Contact') {
      this.contDisplay = true;
    } else {
      this.contDisplay = false;
    }
    this.myControlCust.valueChanges.subscribe((data) => {
      if (typeof data === 'string') {
        this.customerValueChanges(data);
      }
    })
  }

  displayFn(user: OrganisationModel): string {
    return user && user.companyName ? user.companyName : '';
  }
  displayFnCust(user: Customer): string {
    return user && user.firstName ? user.firstName : '';
  }

  private _filter(name: string): OrganisationModel[] {
    const filterValue = name.toLowerCase();
    return this.organisations.filter((option) =>
      option.companyName.toLowerCase().includes(filterValue)
    );
  }

  orgSelected(option) {
    this.companySelected = true;

    this.compName = option.companyName;
    this.orgIdEvent.emit(option.id);
    this.orgNameEvent.emit(option.companyName);
  }

  contSelected(option) {
    this.contactSelected = true;
    this.contSelectedEvent.emit(option);
    this.userName = option.secondName
      ? option.firstName + ' ' + option.secondName
      : option.firstName;
    if (
      (this.scenario === 'create' || this.scenario === 'createfromCustomer') &&
      option.orgId !== null &&
      option.orgId !== '' &&
      typeof option.orgId !== 'undefined' &&
      option.companyName !== null &&
      option.companyName !== '' &&
      typeof option.companyName !== 'undefined'
    ) {
      this.companySelected = true;
      this.compName = option.companyName;
      this.orgIdEvent.emit(option.orgId);
      this.orgNameEvent.emit(option.companyName);
    }
  }
  onClear() {
    this.contSelectedEvent.emit(null);
    this.orgIdEvent.emit(null);
    this.myControl.reset();
    this.myControlCust.reset();
  }
  onClearContact() {

    this.myControlCust.reset();
    this.contactSelected = false;
    this.contSelectedEvent.emit(null);
    this.customerList = [];
  }
  onClearCompany() {

    this.myControl.reset();
    this.companySelected = false;
    this.orgIdEvent.emit(null);
    this.orgNameEvent.emit(null);
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.myControl.reset();
    this.myControlCust.reset();
    //close all the subscription
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.customerSubscription?.unsubscribe();
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
              this.doActions();
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
              this.doActions();
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
              this.doActions();
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
              this.doActions();
            })
      } else { }
    } else {
      this.customerList = [];
      this.isContactLoading = false;
    }

  }
}
