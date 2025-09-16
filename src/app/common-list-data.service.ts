import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from './common.service';
import { Customer, Sales } from './data-models';

@Injectable({
  providedIn: 'root'
})
export class CommonListDataService {
  customerList: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);// customer list
  cusomerListDataLoaded: boolean = false; // check for fetching customer data frm db
  customerViewId: number = 0;// customer view selected id
  customerDefaultView: string = 'grid'; //decides if view grid/ table for customer
  customerView: string = 'grid'; //decides if view grid/ table for customer
  saleList: BehaviorSubject<Sales[]> = new BehaviorSubject<Sales[]>([]);// sale list
  saleListDataLoaded: boolean = false;// check for fetching sale data frm db
  saleViewId: number = 0; // sale view selected id
  saleDefaultView: string = 'grid'; //decides if view grid/ table for sale
  saleView: string = 'grid'; //decides if view grid/ table for sale
  customerSubscription:Subscription;// for closing customer subscription
  saleSubscription:Subscription;// for closing sale subscription
  supportViewId: number = 0; // support view selected id
  supportDefaultView: string = 'grid'; //decides if view grid/ table for support
  supportView: string = 'grid'; //decides if view grid/ table for support
  pipelineCustomerSelection:string = '';// pipeline selected for customer
  selectedCustPipeline:any;
  selectedServicePipeline:any;
  selectedSalePipeline: any;
  pipelineSaleSelection:string = '';// pipeline selected for sale
  pipelineServiceSelection:string = '';// pipeline selected for service
  constructor(private commonService: CommonService) { }
  getCustomerList(superUserId, queryData, userIdArray, contactDataAccessRule, userId, userList, sortField, sortOrder, viewSettingSelected) {
    this.customerSubscription = this.commonService
      .readPrimaryData(
        superUserId,
        'customers',
        queryData,
        userIdArray
      )
      .subscribe((data) => {
        let dataRead = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        //If the primary query is based on createdBy field, then apply data access rule based on createdBy
        if (queryData.queryField == "createdBy") {
          //Else if the primary query is not based on createdBy field, then apply data access rule based on assigned to
          if (contactDataAccessRule == 'Team' || contactDataAccessRule == 'Own') {
            if (userIdArray) {
              dataRead = dataRead.filter((element) =>
                userIdArray.includes(element.createdBy)
              );
            } else {
              [userIdArray, userList] =
                this.commonService.createUserlist(
                  contactDataAccessRule,
                  userId
                );
              dataRead = dataRead.filter((element) =>
                userIdArray.includes(element.createdBy)
              );
            }
          } else if (contactDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(userId)
            dataRead = dataRead.filter(element =>
              element.associatedBranch === branchId
            );

          }
        } else {
          //Else if the primary query is not based on createdBy field, then apply data access rule based on assigned to
          if (contactDataAccessRule == 'Team' || contactDataAccessRule == 'Own') {
            if (userIdArray) {
              dataRead = dataRead.filter((element) =>
                userIdArray.includes(element.assignedTo)
              );
            } else {
              [userIdArray, userList] =
                this.commonService.createUserlist(
                  contactDataAccessRule,
                  userId
                );
              dataRead = dataRead.filter((element) =>
                userIdArray.includes(element.assignedTo)
              );
            }
          } else if (contactDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(userId)
            dataRead = dataRead.filter(element =>
              element.associatedBranch === branchId
            );

          }
        }
        dataRead = this.commonService.sortData(
          dataRead,
          sortField,
          sortOrder
        );
        // check if filter is present
        if (viewSettingSelected.filters.length > 0) {
          let filterData = viewSettingSelected.filters;
          filterData.forEach((element) => {
            let filterQuery = this.commonService.getQueryData(element);
            dataRead = dataRead.filter((record) =>
              this.commonService.filterData(record, filterQuery)
            );
          });
        }
        this.cusomerListDataLoaded = true;
        this.customerList.next(dataRead as Customer[]);
      })
  }
  getCustomerListListener() {
    return this.customerList.asObservable();
  }
  getSaleListListener() {
    return this.saleList.asObservable();
  }
  getSaleList(superUserId, queryData, userIdArray,saleDataAccessRule,userId,subUsers, sortField,sortOrder,viewSettingSelected) {
   this.saleSubscription = this.commonService
      .readPrimaryData(superUserId, 'sales', queryData, userIdArray)
      .subscribe((data) => {
        let filteredSale = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        //If the primary query is based on createdBy field, then apply data access rule based on createdBy
        if (queryData.queryField == "createdBy") {
          if (
            saleDataAccessRule == 'Team' ||
            saleDataAccessRule == 'Own'
          ) {
            if (userIdArray) {
              filteredSale = filteredSale.filter((element) =>
                userIdArray.includes(element.createdBy)
              );
            } else {
              [userIdArray, subUsers] =
                this.commonService.createUserlist(
                  saleDataAccessRule,
                  userId
                );
              filteredSale = filteredSale.filter((element) =>
                userIdArray.includes(element.createdBy)
              );
            }
          } else if (saleDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(userId);
            filteredSale = filteredSale.filter(
              (element) => element.associatedBranch === branchId
            );
          }
        } else {
          //Filter records based on data access rule
          if (
            saleDataAccessRule == 'Team' ||
            saleDataAccessRule == 'Own'
          ) {
            if (userIdArray) {
              filteredSale = filteredSale.filter((element) =>
                userIdArray.includes(element.assignedTo)
              );
            } else {
              [userIdArray, subUsers] =
                this.commonService.createUserlist(
                  saleDataAccessRule,
                  userId
                );
              filteredSale = filteredSale.filter((element) =>
                userIdArray.includes(element.assignedTo)
              );
            }
          } else if (saleDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(userId);
            filteredSale = filteredSale.filter(
              (element) => element.associatedBranch === branchId
            );
          }

        }

        filteredSale = this.commonService.sortData(
          filteredSale,
          sortField,
          sortOrder
        );

        // check if filter is present
        if (viewSettingSelected.filters.length > 0) {
          let filterData = viewSettingSelected.filters;
          filterData.forEach((element) => {
            let querFiled = element.queryField;
            let filterQuery = this.commonService.getQueryData(element);
            filteredSale = filteredSale.filter((record) =>
              this.commonService.filterData(record, filterQuery)
            );
          });
        }
        this.saleListDataLoaded = true;
        this.saleList.next(filteredSale as Sales[]);

      })
  }

}
