import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validatorSenhaForte(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regexSenhaForte = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
      const valid = regexSenhaForte.test(control.value);
      return !valid ? { strongPassword: true } : null;
    };
}
export const confirmPasswordValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
  
    return password && confirmPassword && password === confirmPassword ? null : { notSame: true };
};