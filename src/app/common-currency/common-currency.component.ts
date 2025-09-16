import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Currencies, Currency } from '../currencies';

@Component({
  selector: 'app-common-currency',
  templateUrl: './common-currency.component.html',
  styleUrls: ['./common-currency.component.scss']
})
export class CommonCurrencyComponent implements OnInit {
  myControl = new FormControl('');
  options: Currency[] = Currencies.getCurencies();;
  filteredOptions: Observable<Currency[]>;
  @Output() currEvent = new EventEmitter<string>();
  @Input() dispName: string;
  @Input() currency: string;

  constructor() { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.currencyName;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
    if(this.currency){
      const data = this.options.filter((data) => data.isoCode === this.currency);
      let tempArr = [...data];
      this.myControl.setValue(tempArr[0]);
    }
  }

  displayFn(user: Currency): string {
    return user && user.currencyName ? user.currencyName : '';
  }

  private _filter(name: string): Currency[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.currencyName.toLowerCase().includes(filterValue));
  }
  currSelected(option){
    this.currEvent.emit(option.isoCode);
  }
  onClear(){
    this.myControl.reset();
    this.currEvent.emit(null);
  }
}
