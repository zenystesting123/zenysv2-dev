import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  validators: ValidatorFn[];
  errorMessages: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  // Standard validation rules
  static readonly VALIDATION_RULES = {
    required: Validators.required,
    email: Validators.email,
    minLength: (length: number) => Validators.minLength(length),
    maxLength: (length: number) => Validators.maxLength(length),
    pattern: (pattern: RegExp) => Validators.pattern(pattern)
  };

  // Standard error messages
  static readonly ERROR_MESSAGES = {
    required: 'This field is required',
    email: 'Please provide a valid email address',
    minlength: 'Minimum {requiredLength} characters required',
    maxlength: 'Maximum {requiredLength} characters allowed',
    pattern: 'Please provide a valid format'
  };

  /**
   * Create a form group with standardized validation
   */
  createFormGroup(fieldConfigs: FormFieldConfig[]): FormGroup {
    const formControls: { [key: string]: AbstractControl } = {};

    fieldConfigs.forEach(config => {
      formControls[config.name] = new FormControl('', config.validators);
    });

    return new FormGroup(formControls);
  }

  /**
   * Get error message for a specific field and error type
   */
  getErrorMessage(control: AbstractControl, fieldConfig: FormFieldConfig): string {
    if (!control.errors || !control.touched) {
      return '';
    }

    const errorKey = Object.keys(control.errors)[0];
    const error = control.errors[errorKey];

    // Check if custom error message exists
    if (fieldConfig.errorMessages[errorKey]) {
      return this.interpolateErrorMessage(fieldConfig.errorMessages[errorKey], error);
    }

    // Use standard error message
    if (FormValidationService.ERROR_MESSAGES[errorKey]) {
      return this.interpolateErrorMessage(FormValidationService.ERROR_MESSAGES[errorKey], error);
    }

    return 'Invalid input';
  }

  /**
   * Interpolate error message with error details
   */
  private interpolateErrorMessage(message: string, error: any): string {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return error[key] || match;
    });
  }

  /**
   * Check if form is valid and show errors
   */
  validateForm(form: FormGroup): boolean {
    if (form.valid) {
      return true;
    }

    // Mark all fields as touched to show validation errors
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });

    return false;
  }

  /**
   * Reset form and clear validation errors
   */
  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  /**
   * Get standard login form configuration
   */
  getLoginFormConfig(): FormFieldConfig[] {
    return [
      {
        name: 'email',
        validators: [
          FormValidationService.VALIDATION_RULES.required,
          FormValidationService.VALIDATION_RULES.email
        ],
        errorMessages: {
          required: 'Email is required',
          email: 'Provide a valid email address'
        }
      },
      {
        name: 'password',
        validators: [
          FormValidationService.VALIDATION_RULES.required,
          FormValidationService.VALIDATION_RULES.minLength(6)
        ],
        errorMessages: {
          required: 'Password is required',
          minlength: 'Minimum 6 characters required'
        }
      }
    ];
  }

  /**
   * Get standard signup form configuration
   */
  getSignupFormConfig(): FormFieldConfig[] {
    return [
      {
        name: 'email',
        validators: [
          FormValidationService.VALIDATION_RULES.required,
          FormValidationService.VALIDATION_RULES.email
        ],
        errorMessages: {
          required: 'Email is required',
          email: 'Provide a valid email address'
        }
      },
      {
        name: 'password',
        validators: [
          FormValidationService.VALIDATION_RULES.required,
          FormValidationService.VALIDATION_RULES.minLength(6)
        ],
        errorMessages: {
          required: 'Password is required',
          minlength: 'Minimum 6 characters required'
        }
      }
    ];
  }

  /**
   * Get password reset form configuration
   */
  getPasswordResetFormConfig(): FormFieldConfig[] {
    return [
      {
        name: 'email',
        validators: [
          FormValidationService.VALIDATION_RULES.required,
          FormValidationService.VALIDATION_RULES.email
        ],
        errorMessages: {
          required: 'Email is required',
          email: 'Provide a valid email address'
        }
      }
    ];
  }
}













