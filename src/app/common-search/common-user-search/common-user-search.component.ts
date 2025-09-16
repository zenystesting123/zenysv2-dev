import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { SubUsers } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
@Component({
  selector: 'app-common-user-search',
  templateUrl: './common-user-search.component.html',
  styleUrls: ['./common-user-search.component.scss'],
})
export class CommonUserSearchComponent implements OnInit, OnChanges {
  myControl = new FormControl('');
  filteredOptions: Observable<SubUsers[]>;
  @Input() allSubUsers: SubUsers[] = [];
  @Input() assignedToName: string;
  @Input() assignedTo: string;
  @Input() disableReAssign: boolean;
  @Output() assignedToEvent = new EventEmitter<string>();
  @Output() assignedToNameEvent = new EventEmitter<string>();
  @Output() userEmitEvent = new EventEmitter<any>(); // emit user details
  @Input() useremailSearch: boolean = false; // for displying user search only
  filteredSubUsers: SubUsers[] = [];
  constructor(
    public networkCheck: NetworkCheckService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.filteredSubUsers = this.allSubUsers.filter(function (e) {
      return e.status != 'suspended';
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.firstname)),
      map((firstname) =>
        firstname ? this._filter(firstname) : this.filteredSubUsers.slice()
      )
    );
    if (this.assignedTo) {
      let data;
      data = this.filteredSubUsers.filter(
        (data) => data.userId === this.assignedTo
      );
      this.myControl.setValue(data[0]);
    } else {
      this.myControl.setValue(null);
    }
  }
  private _filter(value: string): SubUsers[] {
    const filterValue = value.toLowerCase();
    return this.filteredSubUsers.filter((selctList) =>
      selctList.firstname.toLowerCase().includes(filterValue)
    );
  }
  select(selectedData) {
    let isData = this.checkInData(selectedData); // check if data selected or nor
    if (isData) {
      // if data selected
      this.assignedTo = selectedData.userId;
      this.assignedToName = this.commonService.getAssignedToName(
        selectedData.userId
      );
      this.assignedToEvent.emit(this.assignedTo);
      this.assignedToNameEvent.emit(this.assignedToName);
    }
  }
  // check whether the data is selcted or not
  checkInData(selectedData) {
    if (selectedData) return !!this.filteredSubUsers.includes(selectedData);
  }
  // display data selected
  displayData(data: SubUsers): string {
    return data && data.firstname;
  }
  onClearAssignedTo() {
    this.assignedTo = null;
    this.assignedToName = null;
    this.assignedToEvent.emit(this.assignedTo);
    this.assignedToNameEvent.emit(this.assignedToName);
    this.myControl.reset();
  }
  // select user for calendar
  selectUsers(selectedData) {
    let isData = this.checkInData(selectedData); // check if data selected or nor
    if (isData) {
      this.userEmitEvent.emit(selectedData);
    }
    this.myControl.reset(); //reset input
  }
}
