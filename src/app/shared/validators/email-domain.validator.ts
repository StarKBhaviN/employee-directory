import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenEmailDomainValidator(domain: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const email = control.value as string;
    if (email.endsWith(`@${domain}`)) {
      return { forbiddenDomain: { value: domain } };
    }
    return null;
  };
}
