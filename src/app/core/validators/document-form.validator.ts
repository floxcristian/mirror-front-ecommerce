// Angular
import { AbstractControl } from '@angular/forms';
// Env
import { environment } from '@env/environment';

export class DocumentValidator {
  static isValidDocumentId(
    control: AbstractControl
  ): Record<string, boolean> | null {
    const { value: documentId } = control;
    if (!documentId) return null;
    if (environment.country === 'cl') {
      const isValidDocumentId =
        DocumentValidator.isValidChileanDocumentId(documentId);
      return isValidDocumentId ? null : { invalidDocumentId: true };
    } else if (environment.country === 'pe') {
      const isValidDocumentId =
        DocumentValidator.isValidPeruvianDocumentId(documentId);
      return isValidDocumentId ? null : { invalidDocumentId: true };
    }
    return { invalidDocumentId: true };
  }

  private static isValidChileanDocumentId(documentId: string): boolean {
    const regExp = new RegExp(/^([0-9])+\-([kK0-9])+$/);

    if (!documentId.match(regExp)) return false;

    const splittedDocument = documentId.split('-');
    const base = splittedDocument[0];

    // Start::obtener dígito verificador.
    let factor = 2;
    let acumulator = 0;
    let checkDigit: string;
    for (let i = base.length - 1; i >= 0; i--) {
      factor = factor > 7 ? 2 : factor;
      acumulator += parseInt(base[i]) * factor++;
    }
    checkDigit = (11 - (acumulator % 11)).toString();
    if (checkDigit === '11') {
      checkDigit = '0';
    } else if (checkDigit === '10') {
      checkDigit = 'k';
    }
    // End::obtener dígito verificador.

    return checkDigit === splittedDocument[1].toLowerCase();
  }

  private static isValidPeruvianDocumentId(documentId: string): boolean {
    const dni = documentId.replace('-', '').trim().toUpperCase();
    if (!dni || dni.length < 9) return false;
    const multiples = [3, 2, 7, 6, 5, 4, 3, 2];
    const dcontrols = {
      numbers: [6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5],
      letters: ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    };
    const numdni = dni.substring(0, dni.length - 1).split('');
    const dcontrol = dni.substring(dni.length - 1);
    const dsum = numdni.reduce((acc, digit, index) => {
      acc += Number(digit) * multiples[index];
      return acc;
    }, 0);
    const key = 11 - (dsum % 11);
    const index = key === 11 ? 0 : key;
    if (/^\d+$/.test(dni)) {
      return dcontrols.numbers[index] === parseInt(dcontrol, 10);
    }
    return dcontrols.letters[index] === dcontrol;
  }
}
