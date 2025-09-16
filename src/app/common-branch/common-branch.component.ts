import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Branch } from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';

@Component({
  selector: 'app-common-branch',
  templateUrl: './common-branch.component.html',
  styleUrls: ['./common-branch.component.scss']
})
export class CommonBranchComponent implements OnInit {
  myControl = new FormControl('');
  filteredOptions: Observable<Branch[]>;
  @Input() branches: Branch[];
  @Input() associatedBranch: string;
  @Input() allSubUsers: [];
  @Input() disableEdit = false;
  @Output() branchEvent = new EventEmitter<string>();
  associatedBranchName = 'NA';

  constructor(
    public networkCheck: NetworkCheckService
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void{

    if(this.associatedBranch && this.associatedBranch !== 'NA' && this.branches?.length > 0){
      this.associatedBranchName = this.branches.find(item => item.id === this.associatedBranch)?.name;
    }else{
      this.associatedBranchName = 'NA'
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.branches.slice();
      }),
    );
  }
  displayFn(branch: Branch): string {
    return branch && branch.name ? branch.name : '';
  }

  private _filter(name: string): Branch[] {
    const filterValue = name.toLowerCase();

    return this.branches.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  select(selectedData) {

    this.branchEvent.emit(selectedData.id);
  }


  onClearBranch(){
    this.associatedBranch = null;
    this.associatedBranchName = null;
    this.branchEvent.emit(this.associatedBranch);
    this.myControl.reset();
  }
}
