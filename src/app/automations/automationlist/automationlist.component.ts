// *********************************************************************************
// Description: List of all automations
// Inputs:
// Outputs:
// ***********************************************************************************

import { Component, HostListener, OnInit } from '@angular/core';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { AutomationService } from '../automation.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { take } from 'rxjs/operators';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserAccessDetails, contactSettings, customFieldNamesData, defaultContactSettings, defaultSaleSettings, saleSettings } from 'src/app/data-models';
import * as saveAs from 'file-saver';
// import { }
@Component({
  selector: 'app-automationlist',
  templateUrl: './automationlist.component.html',
  styleUrls: ['./automationlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AutomationlistComponent implements OnInit {
  userPlan: any; // users current plan
  loader: boolean; // booelan value for loader
  columnsToDisplay = ['title', 'trigger', 'operation', 'action']; //table coloumn
  columnsToDisplay2 = ['title', 'trigger', 'operation', 'action', 'active']; //table coloum

  automationDatasource: any; // array of all automations
  expandedElement: any; //Used for table expansion
  dataSource: any; //dataSource for table

  networkConnection: boolean; // network check
  subUsers: any; // array of all subUsers
  superUserData: any; // superuserdetails

  //Subscriptions
  automationsSubscription: Subscription;
  userDataSubscriptions: Subscription;

  usrProfileData: UserAccessDetails = null; //to check restriction on settings
  disableSettingsView = false; //settings view is disabled
  stageAutomations: any[]; // stage atoations
  valueList: any = {
    contact: [],
    sale: [],
    service:[]
  }
  pipelineStatus: any = {
    contact: [],
    sale: []
  }
  automationList: { Id: string; }[]; // automations
  //customisation setting
  fieldNameContact: string = customFieldNamesData.data.fieldNameContact;
  fieldNameService: string = customFieldNamesData.data.fieldNameService;
  fieldNameSale: string = customFieldNamesData.data.fieldNameSale;
  fieldNameTask: string = customFieldNamesData.data.fieldNameTask;
  fieldNameCollection: string = customFieldNamesData.data.fieldNameCollection;
  fieldNameExpense: string = customFieldNamesData.data.fieldNameExpense;
  fieldNameEstimate: string = customFieldNamesData.data.fieldNameEstimate;
  fieldNameFollowUp: string = customFieldNamesData.data.fieldNameFollowup;
  fieldNameQuatation: string = customFieldNamesData.data.fieldNameQuotation;
  fieldNameOrganization: string = customFieldNamesData.data.fieldNameOrganization;
  fieldNameMeeting: string = customFieldNamesData.data.fieldNameMeeting;
  fieldNameInvoice: string = customFieldNamesData.data.fieldNameInvoice;
  fieldNameItemsCategory: string = customFieldNamesData.data.fieldNameItemsCategory;
  fieldNameItems: string = customFieldNamesData.data.fieldNameItems;
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;

  constructor(
    public dialog: MatDialog,
    private automationServ: AutomationService,
    public common: CommonService,
    private networkCheck: NetworkCheckService,
    private location: Location,
    private router: Router,

  ) {
    this.userPlan = this.common.userPlan;
    if (this.userPlan.automation) {
      this.loader = true;
    } else this.loader = false;
    // subscribing for all the automations
    this.automationsSubscription = this.automationServ
      .getAllAutomations()
      .subscribe((data) => {
        this.automationList = data;
        this.userDataSubscriptions = this.common.userDatas.subscribe(
          (data1: any) => {
            this.userPlan = data1.userPla;
            this.superUserData = data1.superUserDetails;
            if (this.superUserData.fieldNames) {
              this.fieldNameContact = this.superUserData.fieldNames.fieldNameContact ? this.superUserData.fieldNames.fieldNameContact : customFieldNamesData.data.fieldNameContact;
              this.fieldNameSale = this.superUserData.fieldNames.fieldNameSale ? this.superUserData.fieldNames.fieldNameSale : customFieldNamesData.data.fieldNameSale;
              this.fieldNameService = this.superUserData.fieldNames.fieldNameService ? this.superUserData.fieldNames.fieldNameService : customFieldNamesData.data.fieldNameService;
              this.fieldNameTask = this.superUserData.fieldNames.fieldNameTask ? this.superUserData.fieldNames.fieldNameTask : customFieldNamesData.data.fieldNameTask;
              this.fieldNameCollection = this.superUserData.fieldNames.fieldNameCollection ? this.superUserData.fieldNames.fieldNameCollection : customFieldNamesData.data.fieldNameCollection;
              this.fieldNameEstimate = this.superUserData.fieldNames.fieldNameEstimate ? this.superUserData.fieldNames.fieldNameEstimate : customFieldNamesData.data.fieldNameEstimate;
              this.fieldNameExpense = this.superUserData.fieldNames.fieldNameExpense ? this.superUserData.fieldNames.fieldNameExpense : customFieldNamesData.data.fieldNameExpense;
              this.fieldNameFollowUp = this.superUserData.fieldNames.fieldNameFollowup ? this.superUserData.fieldNames.fieldNameFollowup : customFieldNamesData.data.fieldNameFollowup;
              this.fieldNameQuatation = this.superUserData.fieldNames.fieldNameQuotation ? this.superUserData.fieldNames.fieldNameQuotation : customFieldNamesData.data.fieldNameQuotation;
              this.fieldNameOrganization = this.superUserData.fieldNames.fieldNameOrganization ? this.superUserData.fieldNames.fieldNameOrganization : customFieldNamesData.data.fieldNameOrganization;
              this.fieldNameInvoice = this.superUserData.fieldNames.fieldNameInvoice ? this.superUserData.fieldNames.fieldNameInvoice : customFieldNamesData.data.fieldNameInvoice;
              this.fieldNameItems = this.superUserData.fieldNames.fieldNameItems ? this.superUserData.fieldNames.fieldNameItems : customFieldNamesData.data.fieldNameItems;
              this.fieldNameItemsCategory = this.superUserData.fieldNames.fieldNameItemsCategory ? this.superUserData.fieldNames.fieldNameItemsCategory : customFieldNamesData.data.fieldNameItemsCategory;
            }
            //customisable field starts here
            if (
              data1.superUserDetails.saleSettings &&
              typeof data1.superUserDetails.saleSettings !== 'undefined' &&
              data1.superUserDetails.saleSettings !== null
            ) {
              this.saleSettings = data1.superUserDetails.saleSettings;
            }
            if (
              typeof data1.superUserDetails.contactSettings === 'undefined' ||
              data1.superUserDetails.contactSettings === null
            ) {
              this.contactSettings = this.contactSettings;
            } else {
              this.contactSettings = data1.superUserDetails.contactSettings;
            }
            this.valueList.contact = []
            this.valueList.sale = []
            this.valueList.service =[]
            
            this.common.getAllPipelineNames('customers').forEach((ele, i) => {
              this.valueList.contact.push({ name:ele.pipelineName, pipelineId: ele.pipelineId})
            })
            this.common.getAllPipelineNames('sales').forEach((ele, i) => {
              this.valueList.sale.push({ name:ele.pipelineName, pipelineId: ele.pipelineId})
            })
            this.common.getAllPipelineNames('services').forEach((ele, i) => {
              this.valueList.service.push({ name:ele.pipelineName, pipelineId: ele.pipelineId})
            })
            
            //changes made here
            for (let index = 0; index < data1.salePipelines.length; index++) {
              this.pipelineStatus.sale[index] = data1.salePipelines[index].pipelineStages
            }
            for (let index = 0; index < data1.customerPipelines.length; index++) {
              this.pipelineStatus.contact[index] = data1.customerPipelines[index].pipelineStages
            }
            // to check if settings is restricted
            this.usrProfileData = data1.usrProfileData;
            if (this.usrProfileData) {
              // disable Settings view
              if (this.usrProfileData.isCheckedSett == false) {
                this.disableSettingsView = true;
              } else {
                if (this.usrProfileData.settView == false) {
                  this.disableSettingsView = true;
                } else {
                  this.disableSettingsView = false;
                }
              }
            }

            this.subUsers = [];
            this.subUsers.push({
              name:
                this.superUserData.firstname +
                ' ' +
                (this.superUserData.lastname
                  ? this.superUserData.lastname
                  : ''),
              Id: this.superUserData.superUserId,
            });
            data1.subUsers.forEach((element) => {
              // assignedToName.push(element.firstname+' '+(element.lastname?element.lastname:''))
              this.subUsers.push({
                name:
                  element.firstname +
                  ' ' +
                  (element.lastname ? element.lastname : ''),
                Id: element.userId,
              });
            });

            // this.allAutomations=data

            this.automationDatasource = data
              .filter((ele: any) => {
                if (!!ele.type) return ele.type != 'stageTransition';
                else return true;
              })
              .map((element: any) => {
                return {
                  title: element.name,
                  trigger: element.form1.trigger.name,
                  operation: element.form1.operation.name,
                  action: element.form1.action.name,
                  ...element,
                };
              });
            //if plan is silver, include only contact and sale values 
            if (this.common.subscribedPlan == 'leadManagement') {
              this.automationDatasource = this.automationDatasource.filter(value => value.trigger == this.fieldNameContact || value.trigger == this.fieldNameFollowUp)
            }
            //if plan is silver, include only contact and sales docs values 
            if (this.common.subscribedPlan == 'invoicing') {
              this.automationDatasource = this.automationDatasource.filter(value => value.trigger == this.fieldNameContact || value.trigger == this.fieldNameEstimate || value.trigger == this.fieldNameQuatation || value.trigger == this.fieldNameInvoice)
            }
            //replacing moduleNames from settings
            this.automationDatasource.forEach((ele) => {
              if (ele.form1.trigger.value == "contact") {
                ele.trigger = this.fieldNameContact;
                ele.form1.trigger.name = this.fieldNameContact;
              } else if (ele.form1.trigger.value == "sale") {
                ele.trigger = this.fieldNameSale;
                ele.form1.trigger.name = this.fieldNameSale;
              }
              else if (ele.form1.trigger.value == "estimate") {
                ele.trigger = this.fieldNameEstimate;
                ele.form1.trigger.name = this.fieldNameEstimate;
              }
              else if (ele.form1.trigger.value == "quotation") {
                ele.trigger  = this.fieldNameQuatation;
                ele.form1.trigger.name = this.fieldNameQuatation;
              }
              else if (ele.form1.trigger.value == "invoice") {
                ele.trigger = this.fieldNameInvoice;
                ele.form1.trigger.name = this.fieldNameInvoice;
              }
              else if (ele.form1.trigger.value == "collection") {
                ele.trigger  = this.fieldNameCollection;
                ele.form1.trigger.name = this.fieldNameCollection;
              }
              else if (ele.form1.trigger.value == "followup") {
                ele.trigger = this.fieldNameFollowUp;
                ele.form1.trigger.name = this.fieldNameFollowUp;

              }
              else if (ele.form1.trigger.value == "service") {
                ele.trigger = this.fieldNameService;
                ele.form1.trigger.name = this.fieldNameService;
              }
            })
            this.automationDatasource.forEach((ele) => {
              if (ele.form1.action.value == "createTask") {
                ele.action= `Create ${this.fieldNameTask}`;
                ele.form1.action.name = `Create ${this.fieldNameTask}`
              } 
              else if (ele.form1.action.value == "createfollowupTask") {
                ele.action= `Create ${this.fieldNameFollowUp}`
                ele.form1.action.name = `Create ${this.fieldNameFollowUp}`
              }
              else if (ele.form1.action == "service") {
                ele.action= `Create ${this.fieldNameService}`
                ele.form1.action.name = `Create ${this.fieldNameService}`

              }
            })
            this.dataSource = new MatTableDataSource<any>(
              this.automationDatasource
            );

            this.stageAutomations = data.filter((ele: any) => { 
              if (!!ele.type) return ele.type == 'stageTransition';
              else return false;
            });
            // console.log("stageAutomations",this.stageAutomations)
          }
        );
      });
  }
  ngOnInit(): void { }
  getStatusCardValue(stageAuto){
      if(stageAuto.form1.action.value === 'sale'){
       return  this.saleSettings.salesStage.displayName?this.saleSettings.salesStage.displayName:defaultSaleSettings.CONST_VALUE.salesStage.displayName;
      }
      if(stageAuto.form1.action.value === 'contact'){
       return  this.contactSettings.status.displayName?this.contactSettings.status.displayName:defaultContactSettings.CONST_VALUE.status.displayName;
      }
  }
  
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  exportTojson() {
    // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
    let exportData = this.automationList;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }), 'automations.json'
    );
  }

  // function to show the name of the sub User from sub user Id
  showvalue(condition: any, docType: any) {
    if (condition.field.value == 'assignedTo') {
      var user = this.subUsers.filter((item) => item.Id == condition.value);
      return user[0]?.name;
    };
    if (condition.field.value == "selectedContactPipeline" || condition.field.value == "selectedSalePipeline" || condition.field.value === "selectedServPipeline") {
      //changes made here
      if (condition.condition.name == "is changed") {
        return ''
      } else {
        let pipelineModule = '';
        if (condition.field.value == "selectedContactPipeline") {
          pipelineModule = "customers"
        } else if (condition.field.value == "selectedSalePipeline") {
          pipelineModule = "sales"
        }
        else if (condition.field.value === "selectedServPipeline") {
          pipelineModule = "services"
        }
        return this.common.getPipelineNames(`${pipelineModule}`,condition.value)
      }
    }

    else {

      if (condition.condition.name == "is changed") {
        return ''
      } else if(condition.field.value == "status" || condition.field.value == "servicesStage" || condition.field.value == "salesStage" ){
        let statusModule = '';
        if (docType == "contact") {
          statusModule = "customers"
        }else if(docType == "service"){
          statusModule = "services"
        }else if(docType == 'sale'){
          statusModule = "sales"
        }
       
        return this.common.getStatusNameWithStatusId(statusModule,condition.value)
      } 
      else {
        return condition.value
      }
    }
  }
  //stageTransition
showPipelineName(id,module){
  let moduleVal
  if (module == "contact") {
    moduleVal = "customers"
  }else if(module == "service"){
    moduleVal = "services"
  }else if(module == 'sale'){
    moduleVal = "sales"
  }
  // console.log("this.common.getPipelineNames(id,module)",this.common.getPipelineNames(id,moduleVal))
 return this.common.getPipelineNames(moduleVal,id)
}
showStatus(module,id){
  let moduleVal
  if (module == "contact") {
    moduleVal = "customers"
  }else if(module == "service"){
    moduleVal = "services"
  }else if(module == 'sale'){
    moduleVal = "sales"
  }
  return this.common.getStatusNameWithStatusId(moduleVal,id)
}
  onBack() {
    this.location.back();
  }

  addAutomation() {
    this.router.navigate(['/dash/automations/create/0']);
  }
  addstageAutomation() {
    this.router.navigate(['/dash/stageautomations/create/0']);
  }
  editAutomation(Id) {
    this.router.navigate(['/dash/automations', 'edit', Id]);
  }
  editStageAutomations(Id) {
    this.router.navigate(['/dash/stageautomations', 'edit', Id]);
  }
  deleteAutomation(Id) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '350px',
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result == 'Yes') {
          this.automationServ.deleteAutomation(Id);
        }
      });
  }
  toggleActive(event, Id) {

    this.automationServ.updateAutomationDoc2(Id, { active: event.checked })

  }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.automationsSubscription.unsubscribe();
    if (!!this.userDataSubscriptions) this.userDataSubscriptions.unsubscribe();
  }
}
