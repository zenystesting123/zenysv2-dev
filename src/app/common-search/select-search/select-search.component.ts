import { Component, ElementRef, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubUsers } from 'src/app/data-models';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent implements OnInit {
  myControl = new FormControl('');
  filteredOptions: Observable<SubUsers[]>;
   allSubUsers: any[] = [];
  searchTerm:string
  placeHolderText:string;
  @Output() submitClicked = new EventEmitter<string>();
  private readonly _matDialogRef: MatDialogRef<SelectSearchComponent>;
  private readonly triggerElementRef: ElementRef;
  constructor(_matDialogRef: MatDialogRef<SelectSearchComponent>,
              @Inject(MAT_DIALOG_DATA) data: { trigger: ElementRef,placeHolderText:string,allSubUsers:any },) {
    this._matDialogRef = _matDialogRef;
    this.triggerElementRef = data.trigger;
    this.placeHolderText=data.placeHolderText
    this.allSubUsers=data.allSubUsers
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.firstname)),
      map((firstname) =>
        firstname ? this._filter(firstname) : this.allSubUsers.slice()
      )
    );
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left-50}px`, top: `${120 }px` };
    matDialogConfig.width = '250px';
    matDialogConfig.height = '300px';
    this._matDialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this._matDialogRef.updatePosition(matDialogConfig.position);
   
  }
  private _filter(value: string): SubUsers[] {
    const filterValue = value.toLowerCase();
    return this.allSubUsers.filter((selctList) =>
      selctList.firstname.toLowerCase().includes(filterValue)
    );
  }
  select(userId:string) {
      this.submitClicked.emit(userId);
      this._matDialogRef.close()
  }
  clear(){
    this.myControl.setValue('')
  }
}
