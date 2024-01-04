import { FormGroup } from '@angular/forms';

export class PasswordValidator {
  static validate(registrationFormGroup: FormGroup) {
    const password = registrationFormGroup.controls['password'].value;
    const repeatPassword =
      registrationFormGroup.controls['confirmPassword'].value;
    if (repeatPassword == null || repeatPassword.length <= 0) {
      return null;
    }

    if (repeatPassword !== password) {
      return {
        doesMatchPassword: true,
      };
    }
    return null;
  }
}
