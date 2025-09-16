/*------------------------------------------------------------------------
Description : Search company name Customer first name and second name in customer list, sales list and documents

---------------------------------------------------------------- */

import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { Location } from '@angular/common';
import {
  Customer,
  defaultContactSettings,
  defaultSaleSettings,
  defaultServiceSettings,
  OrganisationModel,
  Profile,
  Sales,
  Service,
  SubUsers,
  UserAccessDetails,
} from '../data-models';
import { ToolBarSearchService } from './tool-bar-search.service';
@Component({
  selector: 'app-tool-bar-search',
  templateUrl: './tool-bar-search.component.html',
  styleUrls: ['./tool-bar-search.component.scss'],
})
export class ToolBarSearchComponent implements OnInit, OnDestroy {
  routes: any; // for storing search term
  userData: Profile; // user details
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.

  customersFirstName: Customer[]; // array of customers having search term quals first name
  customersFirstNameLength: number; // ength of customers having search term quals first name
  customersCompanyName: Customer[]; // array of customers having search term quals company name
  customersCompanyNameLength: number; //length of customers having search term quals company name
  customersSecondName: Customer[]; // array of customers having search term quals second name
  customersSecondNameLength: number; //length of customers having search term quals second name
  customersSurname: Customer[]; // array of customers having search term quals surname
  customersSurnameLength: number; //length of customers having search term quals surname

  salesFirstName: Sales[]; // array of sales having search term quals first name
  salesFirstNameLength: number; // length of sales having search term quals first name
  salesCompanyName: Sales[]; // array of sales having search term quals company name
  salesCompanyNameLength: number; // length of sales having search term quals company name
  salesSecondName: Sales[]; // array of sales having search term quals second name
  salesSecondNameLength: number; // length of sales having search term quals second name
  salesSurname: Sales[]; // array of sales having search term quals surname
  salesSurnameLength: number; // length of sales having search term quals surname

  servicesFirstName: Service[]; // array of service having search term quals first name
  servicesFirstNameLength: number; // length of service having search term quals first name
  servicesCompanyName: Service[]; // array of service having search term quals company name
  servicesCompanyNameLength: number; // length of service having search term quals company name
  servicesSecondName: Service[]; // array of service having search term quals second name
  servicesSecondNameLength: number; // length of service having search term quals second name
  servicesSurname: Service[]; // array of service having search term quals surname
  servicesSurnameLength: number; // length of service having search term quals surname
  userId: string; // current user id
  userDetails: Profile; // current user details
  fieldNameContact: string = 'Contact'; // for storing contact feild name
  fieldNameSales: string = 'Sales'; // for storing sale feild name
  fieldNameEstimate: string = 'Estimate'; // for storing estimate feild name
  fieldNameQuotation: string = 'Quotation'; // for storing quotation feild name
  fieldNameInvoice: string = 'Invoice'; // for storing invoice feild name
  fieldNameService: string = 'Support';
  fieldNameOrganization:string='Organization'
  searchSelected: string; // for storing search selected
  contactWithContactNumber: Customer[]; // array of customers with number
  contactWithAltContactNumber: Customer[]; // array of customers with altnumber
  contactWithEmail: Customer[]; // array of customers with email
  contactWithContactNumberLength: number; // length of contact with contact number
  contactWithAltContactNumberLength: number; // length of contact with contact altnumber
  contactWithEmailLength: number; // length of contact with contact number
  subUsers: SubUsers[];
  usrProfileData: UserAccessDetails; // user profile access details
  disableViewContact: boolean = false; // disble view contact
  disableViewOrg: boolean = false; // disble view org
  disableSaleView: boolean = false; // disable sales view
  disableServiceView: boolean = false; // disable sales view
  orgWithContactNumber: OrganisationModel[]; // array of org with number
  orgWithContactNumberLength: number; // length of org with contact number
  orgWithEmail: OrganisationModel[]; // array of org with email
  orgWithEmailLength: number; // length of org with email number
  orgCompanyName: OrganisationModel[]; // array of customers having search term quals company name
  orgCompanyNameLength: number; //length of customers having search term quals company name
  contactStatusName: { displayName: string; display: boolean; mandatory: boolean; };
  saleStageName: { displayName: string; display: boolean; mandatory: boolean; };
  serviceStageName: { displayName: string; display: boolean; mandatory: boolean; };
  customerLoaded:boolean =true;
  saleLoaded:boolean =true;
  serviceLoaded:boolean =true;
  orgLoaded:boolean =true;
  constructor(
    private route: ActivatedRoute,
    private toolBarSearchService: ToolBarSearchService,
    public commonService: CommonService,
    private location: Location,
  ) {
    // subscribe user details
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.userId = data.authDetails.uid; // bind user id
        this.userDetails = data.userDetails; // bind user details
        let superUserData = data.superUserDetails; // get super user data
        if (superUserData.fieldNames) {
          this.fieldNameContact = superUserData.fieldNames.fieldNameContact; // get feild name of contact from super user
          this.fieldNameSales = superUserData.fieldNames.fieldNameSale; // get feild name of sale from super user
          this.fieldNameEstimate = superUserData.fieldNames.fieldNameEstimate; // get feild name of estimate from super user
          this.fieldNameQuotation = superUserData.fieldNames.fieldNameQuotation; // get feild name of quotation from super user
          this.fieldNameInvoice = superUserData.fieldNames.fieldNameInvoice; // get feild name of invoice from super user
          if (superUserData?.fieldNames?.fieldNameService) {
            this.fieldNameService = superUserData.fieldNames.fieldNameService;
          }
          if (superUserData?.fieldNames?.fieldNameOrganization) {
            this.fieldNameOrganization = superUserData.fieldNames.fieldNameOrganization;
          }
        }
        if (
          typeof data.superUserDetails.contactSettings === 'undefined' ||
          data.superUserDetails.contactSettings === null
        ) {
          // this.settingsConfigured = false;
          this.contactStatusName = defaultContactSettings.CONST_VALUE.status;
        } else {
          // this.settingsConfigured = true;
          this.contactStatusName = data.superUserDetails.contactSettings.status;
        }
        if (
          typeof data.superUserDetails.saleSettings === 'undefined' ||
          data.superUserDetails.saleSettings === null
        ) {
          // this.settingsConfigured = false;
          this.saleStageName = defaultSaleSettings.CONST_VALUE.salesStage;
        } else {
          // this.settingsConfigured = true;
          this.saleStageName = data.superUserDetails.saleSettings.salesStage;
        }
        if (
          typeof data.superUserDetails.serviceSettings === 'undefined' ||
          data.superUserDetails.serviceSettings === null
        ) {
          // this.settingsConfigured = false;
          this.serviceStageName = defaultServiceSettings.CONST_VALUE.servicesStage;
        } else {
          // this.settingsConfigured = true;
          this.serviceStageName = data.superUserDetails.serviceSettings.servicesStage;
        }

        this.subUsers = data.subUsers;
        // profile settings access checks
        this.usrProfileData = data.usrProfileData;

        if (this.usrProfileData) {
          // contact access check for contact
          if (this.usrProfileData.isCheckedCont == false) {
            // if the check box is false
            this.disableViewContact = true; // disable view contact
          } else {
            if (this.usrProfileData.contactsView == false) {
              // if disable view contact
              this.disableViewContact = true; // disable view contact
            }
          }
          if (this.usrProfileData.isCheckedOrg == false) {
            // if the check box is false
            this.disableViewOrg = true; // disable view contact
          } else {
            if (this.usrProfileData.orgsView == false) {
              // if disable view org
              this.disableViewOrg= true; // disable view org
            }
          }
          // disable Sale create and view
          if (this.usrProfileData.isCheckedSale == false) {
            // if the check box is false
            this.disableSaleView = true; // disable view sale
          } else {
            if (this.usrProfileData.salesView == false) {
              // if disable view sales
              this.disableSaleView = true; // disable view sale
            }
          }
          // disable service create and view
          if (this.usrProfileData.isCheckedService == false) {
            // if the check box is false
            this.disableServiceView = true; // disable view service
          } else {
            if (this.usrProfileData.servicesView == false) {
              // if disable view service
              this.disableServiceView = true; // disable view service
            }
          }

        }
        route.params.subscribe((val) => {
          // subscribe routes
          this.routes = this.route.snapshot.paramMap.get('searchTerm');
          // this.routes = this.routes.toLowerCase();
          this.searchSelected =
            this.route.snapshot.paramMap.get('searchSelected');
          //MK - 31st July 2022 - Changing the search to fetch all the data irrespective of data access rule
          if (
            this.searchSelected == 'Name' ||
            this.searchSelected == 'Company Name'
          ) {
            if(!this.disableViewOrg){
              this.getOrg();
            }

            if (!this.disableViewContact) {
              this.getCustomers(); // get customers
            }
            if (!this.disableSaleView) {
              this.getSales(); // get sales
            }
            if (!this.disableServiceView) {
              this.getServices();//getservice
            }


          } else if (this.searchSelected == 'Contact Number') {
            if (!this.disableViewContact) {
              this.getCustomersWithNumber();
            }
            if(!this.disableViewOrg){
              this.getOrgWithNumber();
            }

          } else if (this.searchSelected == 'Email') {
            if (!this.disableViewContact) {
              this.getCustomersWithEmail();
            }
            if(!this.disableViewOrg){
              this.getOrgWithEmail();
            }

          } else {
          }

        });
      });
  }

  ngOnInit(): void { }
  getCustomers() {
    this.customerLoaded = false;
    this.routes = this.routes.toLowerCase();
    //Get the serch results with first name
    this.toolBarSearchService
      .getCustomers(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.customersFirstName = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        this.customersFirstNameLength = this.customersFirstName.length;
        //get the results with second name
        this.toolBarSearchService
          .getCustomersSecondName(this.userDetails.superUserId, this.routes)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.customersSecondName = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Customer;
            });
            this.customersSecondNameLength = this.customersSecondName.length;

            this.toolBarSearchService
              .getCustomersSurname(this.userDetails.superUserId, this.routes)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.customersSurname = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Customer;
                });
                this.customersSurnameLength = this.customersSurname.length;

                //get the results with company name
                this.toolBarSearchService
                  .getCustomersCompanyName(
                    this.userDetails.superUserId,
                    this.routes
                  )
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.customersCompanyName = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as Customer;
                    });
                    this.customersCompanyNameLength =
                      this.customersCompanyName.length;
                    this.customerLoaded = true;
                  });
              })
          });
      });
  }
  getSales() {
    this.saleLoaded = false;
    this.routes = this.routes.toLowerCase();
    //Get the serch results with first name
    this.toolBarSearchService
      .getSales(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.salesFirstName = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        this.salesFirstNameLength = this.salesFirstName.length;
        //get the results with second name
        this.toolBarSearchService
          .getSalesSecondName(this.userDetails.superUserId, this.routes)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.salesSecondName = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Sales;
            });
            this.salesSecondNameLength = this.salesSecondName.length;

            //get the results with surname
            this.toolBarSearchService
              .getSalesSurname(this.userDetails.superUserId, this.routes)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.salesSurname = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Sales;
                });
                this.salesSurnameLength = this.salesSurname.length;
                //get the results with company name
                this.toolBarSearchService
                  .getSaleCompanyName(this.userDetails.superUserId, this.routes)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.salesCompanyName = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as Sales;
                    });
                    this.salesCompanyNameLength = this.salesCompanyName.length;
                    this.saleLoaded = true;
                  });
              })
          });
      });
  }
  getServices() {
    this.serviceLoaded = false;
    this.routes = this.routes.toLowerCase();
    //Get the serch results with first name
    this.toolBarSearchService
      .getServices(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.servicesFirstName = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Service;
        });
        this.servicesFirstNameLength = this.servicesFirstName.length;
        //get the results with second name
        this.toolBarSearchService
          .getServicesSecondName(this.userDetails.superUserId, this.routes)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.servicesSecondName = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Service;
            });
            this.servicesSecondNameLength = this.servicesSecondName.length;

            //get the results with second name
            this.toolBarSearchService
              .getServicesSurname(this.userDetails.superUserId, this.routes)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.servicesSurname = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Service;
                });
                this.servicesSurnameLength = this.servicesSurname.length;
                //get the results with company name
                this.toolBarSearchService
                  .getServicesCompanyName(this.userDetails.superUserId, this.routes)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.servicesCompanyName = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as Service;
                    });
                    this.servicesCompanyNameLength = this.servicesCompanyName.length;
                    this.serviceLoaded = true;
                  });
              });
          });
      });
  }


  getCustomersWithNumber() {
    this.customerLoaded = false;
    //Get the serch results with first name
    this.toolBarSearchService
      .getCustomersWithNumber(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.contactWithContactNumber = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        this.contactWithContactNumberLength =
          this.contactWithContactNumber.length;
        this.toolBarSearchService
          .getCustomersWithAltNumber(this.userDetails.superUserId, this.routes)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.contactWithAltContactNumber = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Customer;
            });
            this.contactWithAltContactNumberLength =
              this.contactWithAltContactNumber.length;
            this.customerLoaded = true;
          });
      });
  }
  getCustomersWithEmail() {
    this.customerLoaded = false;
    // this.routes = Number(this.routes)
    //Get the serch results with first name
    this.toolBarSearchService
      .getCustomersWithEmail(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.contactWithEmail = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });

        this.contactWithEmailLength = this.contactWithEmail.length;
        this.customerLoaded = true;
      });
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // ondestroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  //funtion to  go back to previous page
  onBack() {
    this.location.back();
  }
  getOrgWithNumber() {
    this.orgLoaded = false;
    //Get the serch results with first name
    this.toolBarSearchService
      .getOrgWithNumber(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.orgWithContactNumber = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as OrganisationModel;
        });
        this.orgWithContactNumberLength =
          this.orgWithContactNumber.length;

        this.orgLoaded = true;
      });
  }
  getOrgWithEmail() {
    this.orgLoaded = false;
    this.toolBarSearchService
      .getOrgWithEmail(this.userDetails.superUserId, this.routes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.orgWithEmail = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as OrganisationModel;
        });

        this.orgWithEmailLength = this.orgWithEmail.length;
        this.orgLoaded = true;
      });
  }
  getOrg() {
    this.orgLoaded = false;
    this.routes = this.routes.toLowerCase();
    //get the results with company name
    this.toolBarSearchService
      .getOrgCompanyName(
        this.userDetails.superUserId,
        this.routes
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.orgCompanyName = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as OrganisationModel;
        });
        this.orgCompanyNameLength =
          this.orgCompanyName.length;
        this.orgLoaded = true;
      });
  }
}
