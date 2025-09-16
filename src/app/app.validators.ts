import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class AppCustomDirective implements Validators{

   static fromDateValidator(fdValue: FormControl) {
    const date = fdValue.value;
    const regexPattern = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    const isValid = regexPattern.test(date);

    if(isValid){
      return { requiredFromDate: true }
    }else{
      return {};
    }

  }
  static whiteSpaceOnly(fdValue: FormControl) {
    const word = fdValue.value;
    if(/^\s+$/.test(word)){
      return {onlySpace: true};
    }else{
      return {}
    }

  }
}
