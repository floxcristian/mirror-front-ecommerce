import { FormGroup } from '@angular/forms';

export class PasswordValidator {
  static validate(registrationFormGroup: FormGroup) {
    const password = registrationFormGroup.controls['pwd'].value;
    const repeatPassword = registrationFormGroup.controls['confirmPwd'].value;
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
