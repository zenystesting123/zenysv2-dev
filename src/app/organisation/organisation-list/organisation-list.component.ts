import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { CommonService } from 'src/app/common.service';
import {
  Attachments,
  Branch,
  Customer,
  CustomerNotes,
  defaultorganisationSettings,
  DisplayColumn,
  FollowUps,
  Invoice,
  OrganisationModel,
  organisationSettings,
  orgViewSettingsDef,
  PaymentReceipt,
  Sales,
  Service,
  subUsers,
  Task,
  UserAccessDetails,
} from 'src/app/data-models';
import { OrgTableColumns } from 'src/app/model/custom-report.model';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { OrganisationListService } from './organisation-list.service';
import * as firebase from 'firebase';
import { SelectSearchComponent } from 'src/app/common-search/select-search/select-search.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { OrgTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.scss'],
})
export class OrganisationListComponent implements OnInit {
  progressBarStatus: boolean = false;
  viewId: number = 0; //View selected for displaying the data
  viewSettingArray: any = orgViewSettingsDef.DATA; //org view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  userId = ''; //logged in users id
  columnsDispaly = [];
  displayName: string = 'displayOrgColumns';
  tableName: string = 'Organization';
  tableDefaultData = OrgTableColumns;
  displayColumnsSaved: DisplayColumn[] = [];
  OrgTableDataArray: MatTableDataSource<OrganisationModel>; //mat-table datasource
  sortField: any;
  sortOrder: any;
  sortOrderSet: boolean = false;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  orgSubscription: Subscription;
  superUserId = '';
  // displayFields: any;
  dataRead: any[];
  dataReadTableData: any[];
  userList: any;
  userIdArray: any;
  userProfileData: UserAccessDetails = null;
  orgData: OrganisationModel[] = [];
  // table data is stored in other variables for filtering and reset
  filterArrayOrgs: MatTableDataSource<OrganisationModel>;
  filterArray: MatTableDataSource<OrganisationModel>;
  resetDateArray: MatTableDataSource<OrganisationModel>;
  organisationsArray: MatTableDataSource<OrganisationModel>;
  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any;
  secondaryFilterValue: any;
  orgLoaded = false;
  selection = new SelectionModel<OrganisationModel>(true, []);
  accountType = '';
  orgSettings: organisationSettings = defaultorganisationSettings.CONST_VALUE;
  customFieldOrg: any[] = [];
  noOrganisations = 0;
  cardFields: any[];
  displayFields: any;
  dataAccessRule = 'Own';
  userDetailsAll: any;
  allUsersId: any;
  branches: Branch[] = [];
  userName = '';
  changeLog: any;
  fieldNames = {};
  customers: Customer[] = [];
  sales: Sales[] = [];
  supports: Service[] = [];
  tasks: Task[] = [];
  calls: FollowUps[] = [];
  estimates: Invoice[] = [];
  quots: Invoice[] = [];
  invs: Invoice[] = [];
  colls: PaymentReceipt[] = [];
  exps: PaymentReceipt[] = [];
  atts: Attachments[] = [];
  notes: CustomerNotes[] = [];
  disableView: boolean = false; //disable sale view based on access control permission
  disableAdd: boolean = false; //disable create sale based on access control permission
  disableDownload = false; //disabel download table
  disableEdit = false;
  disableReAssign = false;
  disableDelete = false;

  attachmentSize: number;
  fieldNameOrganization = 'Organization';
  fieldNameFollowup: string = 'FollowUp';//setting default value for followup
  fieldNameContactNotes: string = 'Note'; //setting default value for note
  // Subject that emits when the component has been destroyed.
  private onDestroy$: Subject<void> = new Subject<void>();
  allSubUsers: any[] = [];
  subusersToDisplay = [];
  alertPopupStatus:boolean=false;// to open the alert dialoge once
  constructor(
    public commonService: CommonService,
    public dialog: MatDialog,
    public orgListService: OrganisationListService,
    private snack: MatSnackBar,
    private viewServiceService: ViewServiceService
  ) {}

  ngOnInit(): void {
    this.OrgTableDataArray = new MatTableDataSource([]);
    this.organisationsArray = new MatTableDataSource([]);
    this.filterArray = new MatTableDataSource([]);
    this.filterArrayOrgs = new MatTableDataSource([]);
    this.resetDateArray = new MatTableDataSource([]);

    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          this.branches = allData.branches;
          this.superUserId = allData.userDetails.superUserId;
          this.fieldNames = allData.superUserDetails.fieldNames;
          if(allData.superUserDetails?.fieldNames?.fieldNameOrganization){
            this.fieldNameOrganization = allData.superUserDetails.fieldNames.fieldNameOrganization
          }
          this.userProfileData = allData.usrProfileData;
          this.accountType = allData.userDetails.accountType;
          this.dataAccessRule = this.userProfileData.orgDataAccessRule;
          this.attachmentSize = allData.superUserDetails.totalAttachmentsSize;
          this.customFieldOrg =
            allData.superUserDetails.customFieldsOrganisation;
            this.fieldNameFollowup =allData.superUserDetails.fieldNames?.fieldNameFollowup?allData.superUserDetails.fieldNames?.fieldNameFollowup:'FollowUp';
            this.fieldNameContactNotes =
              allData.superUserDetails.fieldNames?.fieldNameContactNotes ? allData.superUserDetails.fieldNames?.fieldNameContactNotes:'Note';
          [this.allUsersId, this.userDetailsAll] =
            this.commonService.createUserlist('All', 'any'); //create list of all subusers
            this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
            this.subusersToDisplay = this.allSubUsers;
            this.subusersToDisplay = this.subusersToDisplay.filter(function (e) {
              return e.status != 'suspended';
            });
          [this.userIdsArray, this.userNamesArray] =
            this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

          if (this.userProfileData) {
            // disable addSale and sale view
            if (this.userProfileData.isCheckedOrg == false) {
              this.disableAdd = true;
              this.disableView = true;
              this.disableEdit = true;
              this.disableDownload = true;
              this.disableReAssign = true;
              this.disableDelete = true;

            } else {
              if (this.userProfileData.orgsCreate == false) {
                this.disableAdd = true;
              }
              if (this.userProfileData.orgsView == false) {
                this.disableView = true;
              }
              if (this.userProfileData.orgsEdit == false) {
                this.disableEdit = true;
              }
              if (this.userProfileData.orgsDownload == false) {
                this.disableDownload = true;
              }
              if (this.userProfileData.orgReAssign == false) {
                this.disableReAssign = true;
              }
              if (this.userProfileData.orgsDelete == false) {
                this.disableDelete = true;
              }
            }
          }

          if (allData.userDetails.orgViewSettings) {
            this.viewSettingArray = JSON.parse(
              JSON.stringify(allData.userDetails.orgViewSettings)
            ); //View setting array for org list
            this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
          }

          //customisation field
          if (
            allData.superUserDetails.organisationSettings &&
            typeof allData.superUserDetails.organisationSettings !==
              'undefined' &&
            allData.superUserDetails.organisationSettings !== null
          ) {
            this.orgSettings = allData.superUserDetails.organisationSettings;
          }

          if (allData.userDetails.displayOrgColumns) {
            this.displayColumnsSaved = allData.userDetails.displayOrgColumns;
          }

          if (this.displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = this.displayColumnsSaved;
            // remove select column if settings already saved in DB
            var ind = this.columnsDispaly.findIndex(p => p.columnDef == "select");
            if (ind > -1) {
              this.columnsDispaly.splice(ind, 1);
            }
          } else {
            //if plan is invoicing, get default table config from custom-report-invoicing model
            if(allData.superUserDetails.plan == 'invoicing'){
              this.columnsDispaly = OrgTableColumnsInvPlan;
              this.tableDefaultData = OrgTableColumnsInvPlan;
            } else {
              //if plan is not invoicing, get default table config from custom-report model
              this.columnsDispaly = OrgTableColumns;
            }
          }

          [this.userIdArray, this.userList] = this.commonService.createUserlist(
            this.userProfileData.orgDataAccessRule,
            this.userId
          );
          this.userList = this.userList.filter(function (e) {
            return e.status != 'suspended';
          });
          [this.cardFields, this.displayFields] =
            this.commonService.getCardFields('Organisation',this.fieldNameContactNotes,this.fieldNameFollowup);

          this.getViewData();
        }
      });
  }
  // reset date function
  resetDate() {
    this.selection.clear();//clear select of table
    this.secondaryFilterSet = false;
    this.OrgTableDataArray.data = this.resetDateArray.data;
    this.orgData = this.resetDateArray.data;
    this.organisationsArray.data = this.resetDateArray.data;
  }
  onDeleteOrg(selected: OrganisationModel[]) {

    const dialogRef = this.dialog.open(ChildOrgList, {
      width: '300px',
      data: {
        fieldNames: this.fieldNames,
        scenario: 'delete',
        disableClose: true,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result === 'delete') {
            this.progressBarStatus = false;
            selected.forEach(async (element) => {
              //
              await this.getAllCustomers(element.id);
              if (this.customers) {
                this.customers.forEach((ele) => {
                  this.orgListService.onUpdateCustomer(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              await this.getAllSales(element.id);
              if (this.sales) {
                this.sales.forEach((ele) => {
                  this.orgListService.onUpdateSale(this.superUserId, ele.id);
                });
              }
              await this.getAllServices(element.id);
              if (this.supports) {
                this.supports.forEach((ele) => {
                  this.orgListService.onUpdateSupport(this.superUserId, ele.id);
                });
              }
              await this.getAllTasks(element.id);
              if (this.tasks) {
                this.tasks.forEach((ele) => {
                  this.orgListService.onUpdateTask(this.superUserId, ele.id);
                });
              }
              await this.getAllFollowUps(element.id);
              if (this.calls) {
                this.calls.forEach((ele) => {
                  this.orgListService.onUpdateFoll(this.superUserId, ele.id);
                });
              }
              // est
              await this.getAllEstimates(element.id);
              if (this.estimates) {
                this.estimates.forEach((ele) => {
                  this.orgListService.onUpdateEstimateOrg(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              // quot
              await this.getAllQuots(element.id);
              if (this.quots) {
                this.quots.forEach((ele) => {
                  this.orgListService.onUpdateQuotationOrg(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              // inv
              await this.getAllInvs(element.id);
              if (this.invs) {
                this.invs.forEach((ele) => {
                  this.orgListService.onUpdateInvoiceOrg(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              // coll
              await this.getAllColls(element.id);
              if (this.colls) {
                this.colls.forEach((ele) => {
                  this.orgListService.onUpdatePaymentOrg(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              // exp
              await this.getAllExps(element.id);
              if (this.exps) {
                this.exps.forEach((ele) => {
                  this.orgListService.onUpdateExpenseOrg(
                    this.superUserId,
                    ele.id
                  );
                });
              }
              // att
              await this.getAllAtts(element.id);
              if (this.atts) {
                this.atts.forEach((att) => {
                  // update size in superuser profile
                  let newSize = this.attachmentSize - att.size;
                  this.orgListService.updateSize(this.superUserId, newSize);
                  // delete in storage coll
                  const storageRef = firebase.default.storage().ref();
                  const desertRef = storageRef.child(att.path);
                  desertRef.delete();
                  // delete in att collection under org collection
                  this.orgListService.deleteAtt(
                    this.superUserId,
                    element.id,
                    att.id
                  );
                });
              }
              // notes
              await this.getAllNotes(element.id);
              if (this.notes) {
                this.notes.forEach((notes) => {
                  this.orgListService.deleteNotes(
                    this.superUserId,
                    element.id,
                    notes.id
                  );
                });
              }
              this.orgListService.deleteOrg(this.superUserId, element.id);
            });
            selected.length = 0;
            this.selection = new SelectionModel<OrganisationModel>(true, []);
            this.progressBarStatus = true;
            // mat snack bar
            this.snack.open('Selected Organisations deleted', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {

    let assignedToName = firstName + ' ' + (secondName ? secondName : '');
    if (this.selection.selected.length > 0) {
      this.selection.clear(); //clear select of table
    }
    const dialogRef = this.dialog.open(ChildOrgList, {
      width: '300px',
      data: {
        fieldNames: this.fieldNames,
        assignedToName: assignedToName,
        scenario: 're-assign',
        disableClose: true,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result === 're-assign') {
            this.progressBarStatus = false;
            selected.forEach((element) => {
              if(element.assignedTo != subUserId){
                if (element.changeLog) {
                  const changeLogArray: any = Object.values(element.changeLog);
                  this.changeLog = changeLogArray.sort(
                    (objA, objB) =>
                      Number(objB.dateModified) - Number(objA.dateModified)
                  );
                }

                let prevVal = {
                  assignedTo: element.assignedTo,
                  assignedToName: element.assignedToName,
                  ...(this.branches.length > 0 && {
                    associatedBranch: this.branches.find(
                      (item) => item.id === element.associatedBranch
                    )?.name
                      ? this.branches.find(
                          (item) => item.id === element.associatedBranch
                        )?.name
                      : 'None',
                  }),
                };
                let curVal = {
                  assignedTo: subUserId,
                  assignedToName: assignedToName,
                  ...(this.branches.length > 0 && {
                    associatedBranch: this.branches.find(
                      (item) => item.id === branchId
                    )?.name
                      ? this.branches.find((item) => item.id === branchId)?.name
                      : 'None',
                  }),
                };
                // changeLog must be add
                this.orgListService.updateAssignedTo(
                  this.superUserId,
                  element.id,
                  subUserId,
                  assignedToName,
                  branchId,
                  ChangeLogComponent.saveLog(
                    this.constructor.name,
                    this.userId,
                    this.userName,
                    prevVal,
                    curVal,
                    this.changeLog
                  )
                );
              }
            });
            selected.length = 0;
            this.selection = new SelectionModel<OrganisationModel>(true, []);
            this.progressBarStatus = true;
            // mat snack bar
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  getAllCustomers(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAllCustomer(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.customers = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Customer;
          });
          resolve();
        });
    });
  }
  getAllSales(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAllSale(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          resolve();
        });
    });
  }
  getAllServices(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAllService(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.supports = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          resolve();
        });
    });
  }
  getAllTasks(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAllTasks(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.tasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          resolve();
        });
    });
  }
  getAllFollowUps(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAllFollowUps(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.calls = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          resolve();
        });
    });
  }
  // est
  getAllEstimates(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getEstimate(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.estimates = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve();
        });
    });
  }
  // quot
  getAllQuots(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getQuotations(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.quots = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve();
        });
    });
  }
  // inv
  getAllInvs(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getInvoices(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.invs = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve();
        });
    });
  }
  // coll
  getAllColls(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getPaymentReceipt(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.colls = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          resolve();
        });
    });
  }
  // exp
  getAllExps(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getExp(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.exps = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          resolve();
        });
    });
  }
  // att
  getAllAtts(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .getAttachments(this.superUserId, orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.atts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          resolve();
        });
    });
  }
  // notes
  getAllNotes(orgId) {
    return new Promise<void>((resolve) => {
      this.orgListService
        .readNote(orgId, this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.notes = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as CustomerNotes;
          });
          resolve();
        });
    });
  }
  getViewData() {
    this.progressBarStatus=false;
    // open a popup if deleted additional field is used in custom view query
    if(this.viewSettingSelected.primaryQuery.queryField=='additionalFieldsArr'
      && !this.customFieldOrg[this.viewSettingSelected.primaryQuery.ind].isActive){
        if(!this.alertPopupStatus){
          this.dialog.open(StatusPopupComponent, {
            disableClose: true,
            data: {
              type: 'Addtional_field_custom_view',
            },
          });
        }
        this.alertPopupStatus = true;
    }
    else if(this.viewSettingSelected.sortField.fieldType=='Additional'
    && !this.customFieldOrg[this.viewSettingSelected.sortField.ind].isActive){
      if(!this.alertPopupStatus){
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;

    }
    else{
      this.viewSettingSelected.filters?.forEach(element => {
        if(element.queryField=='additionalFieldsArr'
        && !this.customFieldOrg[element.ind].isActive){
          if(!this.alertPopupStatus){
            this.dialog.open(StatusPopupComponent, {
              disableClose: true,
              data: {
                type: 'Addtional_field_custom_view',
              },
            });
          }
          this.alertPopupStatus = true;
      }
      });
    }

    // get the data from specific format
    let queryData = this.commonService.getQueryData(
      this.viewSettingSelected.primaryQuery
    );


    this.sortField = this.viewSettingSelected.sortField;
    this.sortOrder = this.viewSettingSelected.sortOrder;
    if (queryData) {
      if (this.orgSubscription && !this.orgSubscription.closed) {
        this.orgSubscription.unsubscribe();
      }

      this.orgSubscription = this.commonService
        .readPrimaryData(
          this.superUserId,
          'Organisations',
          queryData,
          this.userIdArray
        )
        .subscribe((data) => {
          this.dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });


          //apply data access rule
          /* if (this.userIdArray) {
            this.dataRead = this.dataRead.filter((element) =>
              this.userIdArray.includes(element.assignedTo)
            );
          } else {
            [this.userIdArray, this.userList] =
              this.commonService.createUserlist(
                this.userProfileData.orgDataAccessRule,
                this.userId
              );
            this.dataRead = this.dataRead.filter((element) =>
              this.userIdArray.includes(element.assignedTo)
            );
          }*/
          //Filter the data read based on data access rule
          if (
            this.userProfileData.orgDataAccessRule == 'Team' ||
            this.userProfileData.orgDataAccessRule == 'Own'
          ) {
            if (this.userIdArray) {
              this.dataRead = this.dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(
                  this.userProfileData.orgDataAccessRule,
                  this.userId
                );
              this.dataRead = this.dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.userProfileData.orgDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            this.dataRead = this.dataRead.filter(
              (element) => element.associatedBranch === branchId
            );
          }



          //this.noOfRecords = this.dataRead.length; //
          //Filter he data read according to the data access rule of the user);
          /*this.dataRead = this.dataRead.filter((element) =>
                    this.userIdArray.includes(element.assignedTo)
                  );*/
          this.dataRead = this.commonService.sortData(
            this.dataRead,
            this.sortField,
            this.sortOrder
          );



          this.dataReadTableData = this.dataRead;

          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let querFiled = element.queryField;
              let filterQuery = this.commonService.getQueryData(element);
              this.dataRead = this.dataRead.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );

            });
          }

          // this.organisationsArray.paginator = this.paginator;
          // this.organisationsArray.sort = this.sort;

          this.orgData = this.dataRead;
          this.organisationsArray.data =
            this.filterArray.data =
            this.dataRead =
            this.resetDateArray.data =
            this.OrgTableDataArray.data =
            this.filterArrayOrgs.data =
              this.dataRead;



          //If any filter was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
          if (this.secondaryFilterSet == true) {
            this.secondaryFilter(
              this.secondaryFilterField,
              this.secondaryFilterValue
            );
          }
          //If any custom sorting by field was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

          if (this.sortOrderSet == true) {
            this.setSortOrder(this.sortOrder);
          }


          this.noOrganisations = this.OrgTableDataArray?.data?.length; //have to confirm
          this.orgLoaded = true;
          this.progressBarStatus = true;
        });
    }else{
      this.progressBarStatus=true;
    }
  }

  secondaryFilter(field, value) {

    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.dataRead.filter((record) => {
      return record[this.secondaryFilterField] === this.secondaryFilterValue;
    });
    this.orgData = filteredData;
    this.OrgTableDataArray.data = filteredData;
  }

  //function to sort card data when sort order is changed
  setSortOrder(order) {
    this.sortOrderSet = true;
    this.sortOrder = order;
    this.orgData = this.commonService.sortData(
      this.orgData,
      this.sortField,
      this.sortOrder
    );
  }

  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['Organisation', this.viewId, mode, this.cardFields],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      // Receive data from dialog component
      // If new view has been added, then read the new view and load data
      if (res.response == 'Add') {
        this.viewId = this.viewSettingArray.length - 1;
        this.viewSettingSelected = this.viewSettingArray[this.viewId];
        this.getViewData();
        this.selection.clear();//clear select of table
      } else{
        this.selection.clear();//clear select of table
        this.viewSettingSelected = this.viewSettingArray[this.viewId];
      }
    });
  }
  //delete view
  deleteView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName: this.viewSettingArray[this.viewId].viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(this.viewId, 1);
        if (this.viewId > 0) {
          this.viewId = this.viewId - 1;
        }
        this.selection.clear(); //clear select of table
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'Organisation').then(res=>{
          this.snack.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
  viewChanged(viewIndex) {
    this.viewId = viewIndex;
    this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
    this.alertPopupStatus=false;// popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
    this.selection.clear();//clear select of table
  }
  // ondestroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


  onShowDialog(evt: MouseEvent,scenario): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SelectSearchComponent, {
      panelClass: "dialog-side-panel",
      data: { trigger: target,
        placeHolderText:'Users',
        allSubUsers:this.allSubUsers }
    });
    // on submit clicked
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(
        (userId: string) => {
          dialogSubmitSubscription.unsubscribe();
          if(userId){
            this.selection.clear();//clear select of table
            this.secondaryFilter(scenario,userId)
          }
        })
  }













}
@Component({
  selector: 'child-org-list',
  templateUrl: 'child-org-list.html',
  styleUrls: ['./organisation-list.component.scss'],
})
export class ChildOrgList {
  spinner = false;
  reAssign = 're-assign';
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<ChildOrgList>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
