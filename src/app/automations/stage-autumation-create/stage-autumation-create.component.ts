import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { AutomationService } from '../automation.service';
import { Location } from '@angular/common';
import { contactSettings, defaultContactSettings, defaultSaleSettings, modules, saleSettings } from 'src/app/data-models';

@Component({
  selector: 'app-stage-autumation-create',
  templateUrl: './stage-autumation-create.component.html',
  styleUrls: ['./stage-autumation-create.component.scss']
})
export class StageAutumationCreateComponent implements OnInit {
  sateactions:any
  stageActions:any // all actions 
  stageTransitionTriggers:any // all trigger values for stage automation
  userPlan: any; // users current subscribed plan
  routeSubscription: any; // route subsciption
  automationId: string; //automation id
  mode: string; // mode
  contactstatus: any; // contact stages
  salesStages: any; // sale stages
  firstFormGroup: FormGroup;
  loadComplete: boolean=false; //boolean value to check if loading is complete
  createClicked:boolean=false;
  userDataSubscriptions: any; //subsciption to userDatas
  valueList:any={
    contact:[],
    sale:[]
  }

  pipelineStatus:any={
    contact:[],
    sale:[]
  }
  //fieldnames
  fieldNameContact: string; 
  fieldNameSale: string;
  fieldNameQuotation: any;
  fieldNameEstimate: any;
  fieldNameInvoice: any;
  fieldNameCollection: any;
  //customisation settings
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;

  saleStageCustomName: string; // custom name for sale stage
  fieldNameService: any; // service field name
  newTriggerValue: { name: string; queryArray: string[]; } = {name:'',queryArray:['','']};
  customerPipeline: any; // customer pipeline
  salePipeline: any // sale pipeline
  // statusFieldName: string;
  constructor(private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private db: AutomationService,
    public networkCheck: NetworkCheckService,
    private location: Location,
    public commonService: CommonService

    ) {
      // this.sateactions=["hrll","hguhgugug"]
      // this.stageActions=[
      //   {name:"Contact status",value:"contact"},
      //   {name:"Sale stage",value:"sale"},]
      //userData subscription
        this.userDataSubscriptions = this.common.userDatas.subscribe((data)=>{
          if(data.superUserDetails.fieldNames){
          this.fieldNameContact = data.superUserDetails.fieldNames.fieldNameContact?data.superUserDetails.fieldNames.fieldNameContact:"Contact";
          this.fieldNameSale =  data.superUserDetails.fieldNames.fieldNameSale?data.superUserDetails.fieldNames.fieldNameSale:"Sale";
          this.fieldNameService =  data.superUserDetails.fieldNames.fieldNameService?data.superUserDetails.fieldNames.fieldNameService:"Service";
          this.fieldNameEstimate =  data.superUserDetails.fieldNames.fieldNameEstimate?data.superUserDetails.fieldNames.fieldNameEstimate:"Estimate";
          this.fieldNameQuotation =  data.superUserDetails.fieldNames.fieldNameQuotation?data.superUserDetails.fieldNames.fieldNameQuotation:"Quotation";
          this.fieldNameInvoice =  data.superUserDetails.fieldNames.fieldNameInvoice?data.superUserDetails.fieldNames.fieldNameInvoice:"Invoice";
          this.fieldNameCollection =  data.superUserDetails.fieldNames.fieldNameCollection?data.superUserDetails.fieldNames.fieldNameCollection:"Collection";
          }
          //customisable field starts here
          if (
            typeof data.superUserDetails.saleSettings === 'undefined' ||
            data.superUserDetails.saleSettings === null
          ) {
            this.saleStageCustomName = defaultSaleSettings.CONST_VALUE.salesStage.displayName;
          } else {
            this.saleSettings = data.superUserDetails.saleSettings;
            if (data.superUserDetails.saleSettings) {
              this.commonService.checkCustomField(
                defaultSaleSettings.CONST_VALUE,
                data.superUserDetails.saleSettings
              );
            }
            this.saleStageCustomName = this.saleSettings.salesStage.displayName;
          }
          if (
            typeof data.superUserDetails.contactSettings === 'undefined' ||
            data.superUserDetails.contactSettings === null
          ) {
            this.contactSettings = this.contactSettings;
          } else {
            this.contactSettings = data.superUserDetails.contactSettings;
          }
          // pipeline for contact and sale module
          this.customerPipeline = data.customerPipelines;
          this.salePipeline = data.salePipelines;

          this.valueList.contact=[]
          this.valueList.sale=[]
          //add pipline name and id to valuelist for all modules 
          data.customerPipelines.forEach((ele, i) => {
            this.valueList.contact.push({ name: ele.pipelineName, value: ele.pipelineId })
          })

          data.salePipelines.forEach((ele, i) => {
            this.valueList.sale.push({ name: ele.pipelineName, value: ele.pipelineId })
          })
        

          for (let index = 0; index < data.customerPipelines.length; index++) {
            this.pipelineStatus.contact[index] =  data.customerPipelines[index].pipelineStages
           }
          for (let index = 0; index < data.salePipelines.length; index++) {
            this.pipelineStatus.sale[index] =  data.salePipelines[index].pipelineStages
           }

        })
        //stage actions
        this.stageActions=[
          {name:`${this.fieldNameContact} ${this.contactSettings.status.displayName ? this.contactSettings.status.displayName : defaultContactSettings.CONST_VALUE.status.displayName}`,value:"contact"},
          {name:`${this.fieldNameSale} ${this.saleSettings.salesStage.displayName ? this.saleSettings.salesStage.displayName : defaultSaleSettings.CONST_VALUE.salesStage.displayName} `,value:"sale"},]
          // stage transmission triggers
    this.stageTransitionTriggers={
      contact:[
        {name:`${this.fieldNameSale} is created`,queryArray:["sale","create"],},
        {name:`${this.saleSettings.salesStage.displayName} in`,queryArray:["sale","edit"],} ,
        {name:`${this.fieldNameEstimate} is created`,queryArray:["estimate","create"],} ,
        {name:`${this.fieldNameQuotation} is created`,queryArray:["quotation","create"],} ,
        {name:`${this.fieldNameInvoice} is created`,queryArray:["invoice","create"],} ,
        {name:`${this.fieldNameCollection} is recieved`,queryArray:["collection","create"],} ,
      ],
      sale:[
        {name:`${this.fieldNameEstimate} is created`,queryArray:["estimate","create"],} ,
        {name:`${this.fieldNameQuotation} is created`,queryArray:["quotation","create"],} ,
        {name:`${this.fieldNameInvoice} is created`,queryArray:["invoice","create"],} ,
        {name:`${this.fieldNameCollection} is recieved`,queryArray:["collection","create"],} ,
      ]
    }

      this.userPlan=this.common.userPlan
      this.routeSubscription=route.params.subscribe((val) => {
        this.automationId = this.route.snapshot.paramMap.get('id');
        this.mode = this.route.snapshot.paramMap.get('mode');
      });
      this.firstFormGroup = this._formBuilder.group({
        name: ['', Validators.required],
        action: ['', Validators.required],
        pipeline:['',Validators.required],
        valueChangeFrom: ['', Validators.required],
        valueChangeTo: ['', Validators.required],
        trigger: ['', Validators.required],
        conditionPipeline:[''],
        condition: [''],

      });
      // sale stage in trigger
      this.firstFormGroup.controls.trigger.valueChanges.subscribe((value) => {
        if (value.queryArray.includes("sale") && value.queryArray.includes("edit")) {
          this.newTriggerValue = { name: `${this.saleSettings.salesStage.displayName} in`, queryArray: ['sale', 'edit'] };
          this.firstFormGroup.controls.trigger.setValue(this.newTriggerValue, { emitEvent: false });
          
          this.firstFormGroup.controls.conditionPipeline.setValidators(Validators.required);
          this.firstFormGroup.controls.conditionPipeline.updateValueAndValidity();
      
          this.firstFormGroup.controls.condition.setValidators(Validators.required);
          this.firstFormGroup.controls.condition.updateValueAndValidity();
        } else {
          this.firstFormGroup.controls.conditionPipeline.clearValidators();
          this.firstFormGroup.controls.conditionPipeline.setValue(null)
          this.firstFormGroup.controls.conditionPipeline.updateValueAndValidity();
      
          this.firstFormGroup.controls.condition.clearValidators();
          this.firstFormGroup.controls.condition.setValue(null)
          this.firstFormGroup.controls.condition.updateValueAndValidity();
        }
      });
      
      if(this.mode=="edit"){
        this.db.getAutomationDoc(this.automationId).subscribe((data:any)=>{
          if(data.form1.action.value === "contact"){
            data.form1.action.name = `${this.fieldNameContact} ${this.contactSettings.status.displayName ? this.contactSettings.status.displayName : defaultContactSettings.CONST_VALUE.status.displayName}`;
            for (const trigger of this.stageTransitionTriggers.contact) {
              if (trigger.queryArray.every((q) => data.form1.trigger.queryArray.includes(q))) {
                data.form1.trigger.name = trigger.name;
                break;
              }
            }
          } else if(data.form1.action.value === "sale"){
            data.form1.action.name = `${this.fieldNameSale} ${this.saleSettings.salesStage.displayName ? this.saleSettings.salesStage.displayName : defaultSaleSettings.CONST_VALUE.salesStage.displayName} `;
            for (const trigger of this.stageTransitionTriggers.sale) {
              if (trigger.queryArray.every((q) => data.form1.trigger.queryArray.includes(q))) {
                data.form1.trigger.name = trigger.name;
                break;
              }
            }
        }
        
          let moduleName;
          if (data.form1.action.value === "contact") {
            moduleName = "customers"
          } else if (data.form1.action.value === "sale") {
            moduleName = "sales"
          }
          this.getStatusArray(data.form1.pipeline, moduleName)
          if (data.form1.conditionPipeline) {
            this.getStatusArray(data.form1.conditionPipeline, "sales")
          }
       
          this.firstFormGroup.setValue({
            name: data.name,
            action: data.form1.action,
            pipeline:data.form1.pipeline,
            valueChangeFrom: data.form1.valueChangeFrom,
            valueChangeTo: data.form1.valueChangeTo,
            trigger: data.form1.trigger,
            conditionPipeline:data.form1.conditionPipeline,
            condition: data.form1.condition,
          });
          

      this.loadComplete = true;
        })
      }
    }

  ngOnInit(): void {
    if (this.mode == 'create') {
      this.loadComplete = true;
    }
  }
//fn used for saving stage autom to db
  StageData(){
    const data={pipeline:this.firstFormGroup.value.pipeline,fromValue:this.firstFormGroup.value.valueChangeFrom,toValue:this.firstFormGroup.value.valueChangeTo,docType:this.firstFormGroup.value.action.value,}
    var smsData = {
      active:true,
      name: this.firstFormGroup.value.name,
      do: 'updateStage',
      condition: this.firstFormGroup.value.trigger.name==`${this.saleStageCustomName} in`?'(oldsale.salesStage!=sale.salesStage)&&(sale.salesStage=="'+this.firstFormGroup.value.condition+  '")&&(sale.selectedSalePipeline=="'+this.firstFormGroup.value.conditionPipeline+'")':"true",
      queryArray: this.firstFormGroup.value.trigger.queryArray,
      editTrigger:this.firstFormGroup.value.trigger.queryArray.includes("edit"),
      createTrigger:this.firstFormGroup.value.trigger.queryArray.includes("create"),
          data: data,
          conditionPipeline:this.firstFormGroup.value.conditionPipeline,
      form1: this.firstFormGroup.value,
      type:"stageTransition",
    };
    // console.log("Stage DATA",smsData)
    if (this.mode == 'create') {
      this.db
        .saveAutomation(this.common.superUserData.superUserId, smsData)
        .then((data) => {
          this._snackBar.open('Automation created ', '', { duration: 2000 });
          this.router.navigate(['/dash/automation-list']);

        });
    }
    if (this.mode == 'edit') {
      this.db.updateAutomationDoc(this.automationId, smsData).then((data) => {
        this._snackBar.open('Automation edited ', '', { duration: 2000 });
        this.router.navigate(['/dash/automation-list']);
      });
    }

  }
 
  compareFn(x: any, y: any) {
    return x && y ? x.name === y.name : x === y;
  }
  compareFn2(x: any, y: any) {
    return x && y ? x=== y : x === y;
  }
  onBack() {
    this.location.back();
  }
  // to get status array on selection for resp pipeline
  consoler(event,module) {
    let moduleName;
    if (module === "contact") {
      moduleName = "customers"
    } else if (module === "sale") {
      moduleName = "sales"
    }
    this.getStatusArray(event?.value, moduleName)

  }
  showStageIn(event){
    this.getStatusArray(event?.value, "sales")
  }
  //to get status array
  getStatusArray(pipelineId, module) {
    let pipelineArray
    if (module === modules.customers) {
      pipelineArray = this.customerPipeline;
    } else if (module === modules.sales) {
      pipelineArray = this.salePipeline;
    }
    
    var result = pipelineArray?.filter((obj) => {
      return obj.pipelineId === pipelineId;
    });

    if (module === "customers") {
      this.pipelineStatus.contact = result[0]?.pipelineStages.map(({ name, stageId }) => ({
        name,
        stageId,
      }));
    } else if (module === "sales") {
      this.pipelineStatus.sale = result[0]?.pipelineStages.map(({ name, stageId }) => ({
        name,
        stageId,
      }));
    }
  }
}
