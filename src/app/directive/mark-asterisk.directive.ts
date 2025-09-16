import { AfterContentChecked, Directive, Optional } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: 'mat-form-field:has(input:not([required])), mat-form-field:has(textarea:not([required])), mat-form-field:has(mat-select:not([required]))'
})
export class MarkAsteriskDirective implements AfterContentChecked{

  constructor(@Optional() private matFormField: MatFormField) { }

  ngAfterContentChecked() {
    if (this.matFormField) {
      const ctrl = this.matFormField._control;
      if (ctrl instanceof MatInput || ctrl instanceof MatSelect)
        if (ctrl.ngControl)
          if (ctrl.ngControl.control)
            if (ctrl.ngControl.control.validator)
              if (ctrl.ngControl.control.validator({} as AbstractControl))
                ctrl.required = ctrl.ngControl.control.validator({} as AbstractControl).required;
    }
  }

}
