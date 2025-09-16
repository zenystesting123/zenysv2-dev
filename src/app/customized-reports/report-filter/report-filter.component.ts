import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, NgModelGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Branch, FollowupDirection, modules, OpeatorCheck, ProductModel, selectedFilterFields, SubUsers } from 'src/app/data-models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { CommonService } from 'src/app/common.service';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
interface selectField {
  name: string;
  field: string;
  type: string;
}

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgModelGroup}]
})



export class ReportFilterComponent implements OnInit, OnDestroy, OnChanges{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selctListCtrl = new FormControl();
  filteredselctListsStatus: Observable<any[]>;
  filteredselctListsStage: Observable<any[]>;
  filteredselctListsPipeline: Observable<Pipelines[]>;
  filteredselctListsUser: Observable<any[]>;
  filteredselctListsProduct: Observable<any[]>;
  filteredselctListsCustLeadValue: Observable<any[]>;
  filteredselctListsCategory: Observable<any[]>;
  filteredselctListsBranch: Observable<Branch[]>;// for associated branch search option
  selctListsStatus: string[] = [];
  @ViewChild('selctListInput') selctListInput: ElementRef<HTMLInputElement>;
  @ViewChild('selctListInputFilter')
  selctListInputFilter: ElementRef<HTMLInputElement>;
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() module: string = '';
  @Input() groupByOptionsPrimary: selectField[] = [
    { name: 'Created date', field: 'dateCreated', type: 'date' },
    { name: 'Assigned to', field: 'assignedTo', type: 'option' },
    { name: 'Created by', field: 'createdBy', type: 'option' },
    { name: 'Status', field: 'status', type: 'option' },
    { name: 'Priority', field: 'priority', type: 'option' },
  ];
  @Input() groupByOptions: selectField[] = [
    { name: 'Created date', field: 'dateCreated', type: 'date' },
    { name: 'Assigned to', field: 'assignedTo', type: 'option' },
    { name: 'Created by', field: 'createdBy', type: 'option' },
    { name: 'Status', field: 'status', type: 'option' },
    { name: 'Priority', field: 'priority', type: 'option' },
  ];
  lineItemForm: FormGroup; // form group for line item
  lineItem: selectedFilterFields = {
    queryName: null,
    queryField: null,
    queryType: null,
    operator: null,
    comparisonValue: [],
    selectionArray: [],
    fieldType: null,
    ind:null
  }; //initializing the LineItemData interface
  @Input() primaryQueryItem: selectedFilterFields = {
    queryName: null,
    queryField: null,
    queryType: null,
    operator: null,
    comparisonValue: [],
    selectionArray: [],
    fieldType: null,
    ind:null
  };
  @Input() itemList = [this.lineItem]; // item list input
  selectedDataForDate: string[] = [
    'Today',
    'Tomorrow',
    'Yesterday',
    'This Week',
    'This Month',
    'During',
    'Before Date',
    'After Date',
    'Before Date Today',
    'Before Date Tomorrow',
    'Before Date Yesterday',
    'Before Date This Week',
    'Before Date This Month',
    'After Date Today',
    'After Date Tomorrow',
    'After Date Yesterday',
    'After Date This Week',
    'After Date This Month',
  ];

  booleanOptions: boolean[] = [
    true,
    false,
  ];


  selectedDataForValue: OpeatorCheck[] = [
    { operator: '==', operatorText: 'Equal to' },
    { operator: '!=', operatorText: 'Not equal to' },
    { operator: '>', operatorText: 'Greater than' },
    { operator: '<', operatorText: 'Less than' },
    { operator: '>=', operatorText: 'Greater than or equal to' },
    { operator: '<=', operatorText: 'Less than or equal to' },
  ];
  selectedDataForCategory: OpeatorCheck[] = [
    { operator: 'in', operatorText: 'Equal to' },
    { operator: 'not-in', operatorText: 'Not equal to' },
  ];
  @Input() superUserId: string;
  @Input() superUserFullName: string;
  @Input() statusArray: string[] = [];
  @Input() addnlFieldsArray: any[] = [];
  @Input() pipelineArray: Pipelines[] = [];
  priorityArray: string[] = ['Low', 'Medium', 'High'];
  priorityArrayTask: string[] = ['LOW', 'MEDIUM', 'HIGH'];
  @Input() prodCategoryArray: string[] = [];
  @Input() prodArray:ProductModel[]=[]
  @Input() allSubUsers: any[] = [];
  @Input() outcomeArray: string[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  @Input() directionArray: string[] = FollowupDirection.DATA;// followup direction
  @Input() leadCaptureArray:string[]=[];
  @Input() branches:Branch[]=[]; // get branches as input
  @Output() isChild1FormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() fieldNameNotes: string = 'Note';//customisable note field name
  @Input() fieldNameFollowup: string = 'FollowUp'; //customisable FollowUp field name
  constructor(public commonService: CommonService,private snackBar: MatSnackBar,) {
    this.primaryQueryItem.comparisonValue = [];
    this.lineItemForm = new FormGroup({
      // initialize line item form
      itemList: new FormArray([]),
    });
  }
  ngOnInit(): void {
    //to remove branch from cardFields if branch is not enabled
    if(!this.commonService.userPlan.branchEnabled){
      this.groupByOptionsPrimary = this.groupByOptionsPrimary.filter(val => val.field !== 'associatedBranch')
    }
    
    // if (this.module == 'products'){
    //   //remove productId and product category from the primary query option
    //   this.groupByOptions = this.groupByOptionsPrimary.map((obj) => ({
    //     ...obj,    }));
    //     this.groupByOptionsPrimary.forEach( (item, index) => {
    //       if(item.field === 'prodCategory'  ) this.groupByOptionsPrimary.splice(index,1);
    //     });

    //     this.groupByOptionsPrimary.forEach( (item, index) => {
    //       if(item.field === 'productId'  ) this.groupByOptionsPrimary.splice(index,1);
    //     });

    // }
    if(this.module == 'tasks'){
      this.priorityArray = this.priorityArrayTask;


    }
    this.lineItemForm.statusChanges.subscribe(value => {
      if(value === 'VALID') {
        this.isChild1FormValid.emit(true);
      }else if(value !== 'VALID'){
        this.isChild1FormValid.emit(false);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    // for changing the header by custom field name
    this.groupByOptionsPrimary.forEach((ele) => {
      if (ele?.field == 'lastNoteDate') {
        ele.name = 'Last '+this.fieldNameNotes+' Date';
      }
      else if (ele?.field == 'nextFollowupDate') {
        ele.name = 'Next '+this.fieldNameFollowup+' Date';
      }
      else if (ele?.field == 'previousFollowupDate') {
        ele.name = 'Previous '+this.fieldNameFollowup+' Date';
      }
    })
    
   
    if (this.primaryQueryItem.queryField == 'assignedTo') {
      // for getting assigned to name by assigned to id
      this.primaryQueryItem.selectionArray = []
      this.primaryQueryItem.comparisonValue.forEach(element => {
        this.primaryQueryItem.selectionArray.push(this.commonService.getAssignedToName(element))
      });
    } else if (this.primaryQueryItem.queryField == 'selectedContactPipeline' ||
      this.primaryQueryItem.queryField == 'selectedSalePipeline' ||
      this.primaryQueryItem.queryField == 'selectedServPipeline') {
      // for getting pipeline name by pipeline id
      this.primaryQueryItem.selectionArray = []
      this.primaryQueryItem.comparisonValue.forEach(element => {
        this.primaryQueryItem.selectionArray.push(this.commonService.getPipelineNames(this.module, element))
      });
    }
    else if ((this.primaryQueryItem.queryField == 'status' && this.module == modules.customers) ||
      (this.primaryQueryItem.queryField == 'salesStage' && (this.module == modules.sales || this.module == modules.products)) ||
      (this.primaryQueryItem.queryField == 'servicesStage' && this.module == modules.services)) {
      // for getting pipeline name by pipeline id
      this.primaryQueryItem.selectionArray = []
      this.primaryQueryItem.comparisonValue.forEach(element => {
        this.primaryQueryItem.selectionArray.push(this.commonService.getStageNameAndPipeLineName(this.pipelineArray, element))
      });
    }

    this.itemList.forEach((element, index) => {
      if (element.queryField == 'assignedTo') {
        this.itemList[index].selectionArray = [];
        this.itemList[index].comparisonValue.forEach(ele => {
          this.itemList[index].selectionArray.push(this.commonService.getAssignedToName(ele))
        });
      } else if (element.queryField == 'selectedContactPipeline' || element.queryField == 'selectedSalePipeline'
        || element.queryField == 'selectedServPipeline') {
        this.itemList[index].selectionArray = [];
        this.itemList[index].comparisonValue.forEach(ele => {
          this.itemList[index].selectionArray.push(this.commonService.getPipelineNames(this.module, ele))
        });
      }
      else if ((element.queryField == 'status' && this.module == modules.customers) ||
        (element.queryField == 'salesStage' && (this.module == modules.sales || this.module == modules.products))
        || (element.queryField == 'servicesStage' && this.module == modules.services)) {
        this.itemList[index].selectionArray = [];
        this.itemList[index].comparisonValue.forEach(ele => {
            this.itemList[index].selectionArray.push(this.commonService.getStageNameAndPipeLineName(this.pipelineArray, ele))        
        });
      }
    });
    if (
      (this.primaryQueryItem.queryType == 'date' ||
        this.primaryQueryItem.queryType == 'timestamp') &&
     (this.primaryQueryItem.operator == 'During' || this.primaryQueryItem.operator == 'After Date' || this.primaryQueryItem.operator == 'Before Date') 
    ) {
      if (this.primaryQueryItem.selectionArray[0] && this.primaryQueryItem.selectionArray[0].seconds) {
          let tempDate1 =  new Date(this.primaryQueryItem.selectionArray[0].seconds*1000);
          this.primaryQueryItem.selectionArray[0] = tempDate1;
       

         //this.primaryQueryItem.selectionArray[0]?.toDate();
         //new Date(this.primaryQueryItem.selectionArray[0]);
      }
      if (this.primaryQueryItem.selectionArray[1] && this.primaryQueryItem.selectionArray[1].seconds) {
          let tempDate2 =  new Date(this.primaryQueryItem.selectionArray[1].seconds*1000);
          this.primaryQueryItem.selectionArray[1] = tempDate2;
          //this.primaryQueryItem.selectionArray[1]?.toDate();
          //new Date(this.primaryQueryItem.selectionArray[1]);
      }
    }
    
    if (
      this.primaryQueryItem.queryField == 'status' &&
      (this.module !="customers")
    ) {
      this.filteredselctListsStatus = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStatus(selctList) : this.statusArray.slice()
        )
      );

    } else  if (
      (this.primaryQueryItem.queryField == 'status' && this.module =="customers") ||
      (this.primaryQueryItem.queryField == 'salesStage' && (this.module =="sales"|| this.module ==modules.products)) ||
      (this.primaryQueryItem.queryField == 'servicesStage' && this.module =="services") 

    ) {
      this.filteredselctListsStage = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStage(selctList) : this._filterStage('')
        )
      );

    } else if (
      this.primaryQueryItem.queryField == 'selectedContactPipeline' ||
      this.primaryQueryItem.queryField == 'selectedSalePipeline' ||
      this.primaryQueryItem.queryField == 'selectedServPipeline'
    ) {
      this.filteredselctListsPipeline = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterPipeline(selctList) : this.pipelineArray.slice()
        )
      );

    }
    else if (
      this.primaryQueryItem.queryField == 'prodCategory'
    ) {
      this.filteredselctListsCategory = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCategory(selctList) : this.prodCategoryArray.slice()
        )
      );

    }
    else if (
      this.primaryQueryItem.queryField == 'assignedTo' ||
      this.primaryQueryItem.queryField == 'createdBy' ||
      this.primaryQueryItem.queryField == 'createdById'
    ) {
      this.filteredselctListsUser = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterUser(selctList) : this.allSubUsers.slice()
        )
      );
    }
    else if (
      this.primaryQueryItem.queryField == 'productId'
    ) {
      this.filteredselctListsProduct = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterProduct(selctList) : this.prodArray.slice()
        )
      );
    }
    else if (
      this.primaryQueryItem.queryField == 'custLeadValue'
    ) {
      this.filteredselctListsCustLeadValue = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustLeadValue(selctList) : this.leadCaptureArray.slice()
        )
      );
    }
    else if (
      this.primaryQueryItem.queryField == 'associatedBranch'
    ) {
         //associated branch for primary query value changes
      this.filteredselctListsBranch = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustBranch(selctList) : this.branches.slice()
        )
      );
    }
    

    // this.itemList = [this.lineItem];
    this.lineItemForm = new FormGroup({
      // initialize line item form
      itemList: new FormArray([]),
    });
    this.itemList.forEach((lineItem, index) => {
      if (
        (lineItem.queryType == 'date' || lineItem.queryType == 'timestamp') &&
        lineItem.operator == 'During' ||lineItem.operator == 'After Date' || lineItem.operator == 'Before Date'
      ) {
        if (lineItem.selectionArray[0] && lineItem.selectionArray[0].seconds) {
          let temp = new Date(lineItem.selectionArray[0].seconds*1000);
          lineItem.selectionArray[0] = temp;
        }
        if (lineItem.selectionArray[1] && lineItem.selectionArray[1].seconds) {
          let temp = new Date(lineItem.selectionArray[1].seconds*1000);
          lineItem.selectionArray[1] = temp;
        }
      }

      (<FormArray>this.lineItemForm.get('itemList')).push(
        this.createItemFormGroup(lineItem)
      );
      if (
        lineItem.queryField == 'status' &&(this.module !="customers")
      ) {
        this.filteredselctListsStatus = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterStatus(selctList) : this.statusArray.slice()
          )
        );
      }else if (
        (lineItem.queryField == 'status' && this.module =="customers") ||
        (lineItem.queryField == 'salesStage'&& (this.module =="sales" || this.module ==modules.products)) ||
       (lineItem.queryField == 'servicesStage' && this.module =="services")
      ) {
        this.filteredselctListsStage = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterStage(selctList) : this._filterStage('')
          )
        );
      }else if (
        lineItem.queryField == 'selectedContactPipeline' ||
        lineItem.queryField == 'selectedSalePipeline' ||
        lineItem.queryField == 'selectedServPipeline'
      ) {
        this.filteredselctListsPipeline = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterPipeline(selctList) : this.pipelineArray.slice()
          )
        );
      }
      else if (
        lineItem.queryField == 'prodCategory'
      ) {
        this.filteredselctListsCategory = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterCategory(selctList) : this.prodCategoryArray.slice()
          )
        );
      }
      else if (
        lineItem.queryField == 'assignedTo' ||
        lineItem.queryField == 'createdBy' ||
        lineItem.queryField == 'createdById'
      ) {
        this.filteredselctListsUser = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterUser(selctList) : this.allSubUsers.slice()
          )
        );
      }
      else if (
        lineItem.queryField == 'productId'
      ) {
        this.filteredselctListsProduct = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterProduct(selctList) : this.prodArray.slice()
          )
        );
      }
      else if (
        lineItem.queryField == 'custLeadValue'
      ) {
        this.filteredselctListsCustLeadValue = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterCustLeadValue(selctList) : this.leadCaptureArray.slice()
          )
        );
      }
      else if (
        lineItem.queryField == 'associatedBranch'
      ) {
        //associated branch for secondary query value changes
        this.filteredselctListsBranch = this.lineItemForm.controls.itemList[
          'controls'
        ][index].controls.comparisonValue.valueChanges.pipe(
          startWith(''),
          map((selctList: string | null) =>
            selctList ? this._filterCustBranch(selctList) : this.branches.slice()
          )
        );
      }
    });
  }
  onFieldSelectPrimary(data, index, lineControls) {
    //console.log(data)
    this.itemList[index].queryField = data.field;
    this.itemList[index].queryType = data.type;
    this.itemList[index].comparisonValue = [];
    this.itemList[index].selectionArray = [];
    this.itemList[index].operator = null;
    this.itemList[index].fieldType = data.fieldType;
    this.itemList[index].ind = data.ind;
    if (data.field == 'status' &&(this.module !="customers")) {
      this.filteredselctListsStatus = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStatus(selctList) : this.statusArray.slice()
        )
      );
    }
    else if ((data.field == 'status' && this.module =="customers") || (data.field == 'salesStage' && (this.module =="sales" || this.module ==modules.products))  
    || (data.field == 'servicesStage' && this.module =="services")) {
      this.filteredselctListsStage = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStage(selctList) : this._filterStage('')
        )
      );
    }
   else if (data.field == 'prodCategory') {
      this.filteredselctListsCategory = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCategory(selctList) : this.prodCategoryArray.slice()
        )
      );
    }
       else if (data.fieldType == 'Additional' && data.type == 'option') {
      this.filteredselctListsStatus = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterAddnlFieldsArray(selctList,data.ind) : this.addnlFieldsArray[data.ind].categories.slice()
        )
      );
    }
    else if (data.field == 'selectedContactPipeline' || data.field == 'selectedSalePipeline' || data.field == 'selectedServPipeline') {
      this.filteredselctListsPipeline = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterPipeline(selctList) : this.pipelineArray.slice()
        )
      );
    }
    else if (data.field == 'assignedTo' || data.field == 'createdBy' || data.field == 'createdById') {
      this.filteredselctListsUser = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterUser(selctList) : this.allSubUsers.slice()
        )
      );
    }
    else if (data.field == 'productId') {
      this.filteredselctListsProduct = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterProduct(selctList) : this.prodArray.slice()
        )
      );
    }
    else if (data.field == 'custLeadValue') {
      this.filteredselctListsCustLeadValue = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustLeadValue(selctList) : this.leadCaptureArray.slice()
        )
      );
    }
    else if (data.field == 'associatedBranch') {
      //associated branch for primary query select value changes
      this.filteredselctListsBranch = lineControls.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustBranch(selctList) : this.branches.slice()
        )
      );
    }
    else {
    }
  }
  onFieldSelectFilter(data) {
    this.primaryQueryItem.queryField = data.field;
    this.primaryQueryItem.queryType = data.type;
    this.primaryQueryItem.fieldType = data.fieldType;
    this.primaryQueryItem.ind = data.ind;

    if (data.field == 'status' && (this.module !="customers")) {
      this.filteredselctListsStatus = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStatus(selctList) : this.statusArray.slice()
        )
      );
    }else if ((data.field == 'status' && this.module =="customers") || (data.field == 'salesStage' && (this.module =="sales" || this.module ==modules.products))  
    || (data.field == 'servicesStage' && this.module =="services")) {
      this.filteredselctListsStage = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterStage(selctList) : this._filterStage('')
        )
      );
    }  else if (data.field == 'selectedContactPipeline' || data.field == 'selectedSalePipeline' || data.field == 'selectedServPipeline') {
      this.filteredselctListsPipeline = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterPipeline(selctList) : this.pipelineArray.slice()
        )
      );
    }
    else if (data.field == 'prodCategory') {
      this.filteredselctListsCategory = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCategory(selctList) : this.prodCategoryArray.slice()
        )
      );
    }
    else if (data.field == 'assignedTo' || data.field == 'createdBy' || data.field == 'createdById') {
      this.filteredselctListsUser = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterUser(selctList) : this.allSubUsers.slice()
        )
      );
    }
    else if (data.field == 'productId') {
      this.filteredselctListsProduct = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterProduct(selctList) : this.prodArray.slice()
        )
      );
    }
    else if (data.field == 'custLeadValue') {
      this.filteredselctListsCustLeadValue = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustLeadValue(selctList) : this.leadCaptureArray.slice()
        )
      );
    } else if (data.field == 'associatedBranch') {
      //associated branch for secondary query value changes
      this.filteredselctListsBranch = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterCustBranch(selctList) : this.branches.slice()
        )
      );
    } else if (data.fieldType == 'Additional' || data.type == 'option') {
      this.filteredselctListsStatus = this.selctListCtrl.valueChanges.pipe(
        startWith(''),
        map((selctList: string | null) =>
          selctList ? this._filterAddnlFieldsArray(selctList,data.ind) : this.addnlFieldsArray[data.ind].categories.slice()
        )
      );
    }
    this.primaryQueryItem.selectionArray = [];
    this.range.value.start = null;
    this.range.value.end = null;
    this.primaryQueryItem.comparisonValue = [];
    this.primaryQueryItem.operator = null;
  }
  createItemFormGroup(lineItem) {
    return new FormGroup({
      queryName: new FormControl(lineItem.queryName),
      queryField: new FormControl(lineItem.queryField),
      queryType: new FormControl(lineItem.queryType),
      operator: new FormControl(lineItem.operator),
      comparisonValue: new FormControl(lineItem.comparisonValue),
      selectionArray: new FormControl(lineItem.selectionArray),
    });
  }
  //adding a row of lineitem
  addFieldValue() {
    var emptyPayOff = {
      queryName: null,
      queryField: null,
      queryType: null,
      operator: null,
      comparisonValue: [],
      selectionArray: [],
      fieldType: null,
      ind:null
    };
    // push newly added item
    this.itemList.push(emptyPayOff);
    (<FormArray>this.lineItemForm.get('itemList')).push(
      this.createItemFormGroup(emptyPayOff)
    );
  }
  //deleting a row of line item
  deleteFieldValue(index: number) {
    this.itemList.splice(index, 1);
    (<FormArray>this.lineItemForm.get('itemList')).removeAt(index);
  }

  @HostListener('window:beforeunload')
  // on destroy
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  addPrimary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our selctList
    if (value) {
      this.selctListsStatus.push(value);
    }
    this.selctListCtrl.setValue(null);
  }

  addFilter(event: MatChipInputEvent, lineControls, indexValue): void {

    const value = (event.value || '').trim();
    // Add our selctList
    if (value) {
      this.itemList[indexValue].selectionArray.push(value);
    }
    lineControls.setValue(null);
  }

  removePrimary(selctList: string): void {
    const index = this.primaryQueryItem.selectionArray.indexOf(selctList);
    if (index >= 0) {
      this.primaryQueryItem.selectionArray.splice(index, 1);
      this.primaryQueryItem.comparisonValue.splice(index, 1);
    }
  }
  removeFilter(selctList: string, indexValue): void {
    const index = this.itemList[indexValue].selectionArray.indexOf(selctList);
    if (index >= 0) {
      this.itemList[indexValue].comparisonValue.splice(index, 1);
      this.itemList[indexValue].selectionArray.splice(index, 1);
    }
  }

  selectedPrimary(event: MatAutocompleteSelectedEvent): void {
    if(this.primaryQueryItem.comparisonValue.length < 10){
      this.primaryQueryItem.selectionArray.push(event.option.viewValue);
      this.primaryQueryItem.comparisonValue.push(event.option.value);
      this.selctListInput.nativeElement.value = '';
      this.selctListCtrl.setValue(null);
    }else{
      this.selctListInput.nativeElement.value = '';
      this.selctListCtrl.setValue(null);
      this.snackBar.open('You can choose up to 10 values only for this field', '', { duration: 2000 });
    }
  }
  selectedFilter(
    event: MatAutocompleteSelectedEvent,
    indexValue,
    lineControls
  ): void {
    this.itemList[indexValue].comparisonValue.push(event.option.value);
    this.itemList[indexValue].selectionArray.push(event.option.viewValue);
    this.selctListInputFilter.nativeElement.value = '';
    lineControls.setValue(null);
  }

  private _filterStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.statusArray.filter((selctList) =>
      selctList.toLowerCase().includes(filterValue)
    );
  }
  private _filterStage(value: string): string[] { 
    let allstatusArray=[]
    const filterValue = value.toLowerCase();
    this.pipelineArray.forEach(element => {
      element.pipelineStages.forEach(ele => {
        if(ele.name.toLowerCase().includes(filterValue)){
          let pipelineName=element.pipelineName
          allstatusArray.push({...ele,pipelineName})
        }
      });
   });
    return allstatusArray
  }
  private _filterPipeline(value: string): Pipelines[] {
    let filterValue
    if(typeof value !='number'){
      filterValue = value?.toLowerCase();
    }
    
    return this.pipelineArray.filter((selctList) =>
      selctList.pipelineName.toLowerCase().includes(filterValue)
    );
  }
  private _filterCategory(value: string): string[] {
    let filterValue = value.toLowerCase();
    return this.prodCategoryArray.filter((selctList) =>
      selctList.toLowerCase().includes(filterValue)
    );
  }
  private _filterAddnlFieldsArray(value: string, ind:number): string[] {
    const filterValue = value.toLowerCase();
    return this.addnlFieldsArray[ind].categories.filter((selctList) =>
      selctList.toLowerCase().includes(filterValue)
    );
  }
  private _filterUser(value: string): SubUsers[] {
    const filterValue = value.toLowerCase();
    return this.allSubUsers.filter((selctList) =>
      selctList.firstname.toLowerCase().includes(filterValue)
    );
  }
  private _filterProduct(value: string): ProductModel[] {
    const filterValue = value.toLowerCase();
    return this.prodArray.filter((selctList) =>
      selctList.prodName.toLowerCase().includes(filterValue)
    );
  }
  private _filterCustLeadValue(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.leadCaptureArray.filter((selctList) =>
      selctList.toLowerCase().includes(filterValue)
    );
  }
  // filter associated branch by name
  private _filterCustBranch(value: string): Branch[] {
    const filterValue = value.toLowerCase();
    return this.branches.filter((selctList) =>
      selctList.name.toLowerCase().includes(filterValue)
    );
  }

  valueChangedPrimary(event) {
    this.primaryQueryItem.comparisonValue = [];
    this.primaryQueryItem.comparisonValue.push(event);
  }
  valueChangedFilter(event, indexValue) {
    if (event != this.itemList[indexValue].comparisonValue) {
      this.itemList[indexValue].comparisonValue = [];
      this.itemList[indexValue].selectionArray = [];
      this.itemList[indexValue].comparisonValue.push(event);
      this.itemList[indexValue].selectionArray.push(event);
    }
  }
  onDateChangeStart(event, index) {
    let start = event.value?.getTime();
    this.itemList[index].comparisonValue[0] = start;
    this.itemList[index].selectionArray[0] = event.value;
    this.itemList[index].comparisonValue[1] = null;
    this.itemList[index].selectionArray[1] = null;
  }
  onDateChange(event, index) {
    let start = event.value?.getTime();
    this.itemList[index].comparisonValue[0] = start;
    this.itemList[index].selectionArray[0] = event.value;
  }
  onDateChangeEnd(event, index) {
    let end = event.value?.getTime();
    this.itemList[index].comparisonValue[1] = end;
    this.itemList[index].selectionArray[1] = event.value;
  }
  onDateChangeStartPrimary(event) {
    let start = event.value?.getTime();
    this.primaryQueryItem.comparisonValue[0] = start;
    this.primaryQueryItem.selectionArray[0] = event.value;
    this.primaryQueryItem.selectionArray[1] = null;
    this.primaryQueryItem.comparisonValue[1] = null;
  }
  onDateChangePrimary(event) {
    let start = event.value?.getTime();
    this.primaryQueryItem.comparisonValue[0] = start;
    this.primaryQueryItem.selectionArray[0] = event.value;

  }
  onDateChangeEndPrimary(event) {
    let end = event.value?.getTime();
    this.primaryQueryItem.comparisonValue[1] = end;
    this.primaryQueryItem.selectionArray[1] = event.value;
  }
  onOption(data, index) {
    if(data == true || data == false){
      this.itemList[index].comparisonValue = [data];
      this.itemList[index].selectionArray = [];
    }
    else {
      this.itemList[index].comparisonValue = [];
      this.itemList[index].selectionArray = [];
    }
  }
  onOptionPrimary(){
    this.primaryQueryItem.comparisonValue = [];
    this.primaryQueryItem.selectionArray = [];
  }

  selectedPrimaryBoolean(value:boolean): void {

    this.primaryQueryItem.comparisonValue[0]= value;

  }

}


