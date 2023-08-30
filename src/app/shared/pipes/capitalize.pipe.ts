import { Pipe, PipeTransform } from '@angular/core';
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizeFirst
 *  value | capitalizeFirst:true <-- All words are capitalized
 * Example:
 *  // value.name = jhon doe
 *  {{ value.name | capitalizeFirst  }}
 *  formats to: Jhon doe
 * {{ value.name | capitalizeFirst: true }}
 * formats to: Jhon Doe
 */
@Pipe({
  name: 'capitalizeFirst',
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string | undefined, allWords: boolean = false): string {
    if (value === null) {
      return 'Not assigned';
    } else {
      return allWords
        ? this.capitalizeAllWords(value || '')
        : this.capitalizeFirstWord(value || '');
    }
  }

  capitalizeFirstWord(value: string): string {
    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  capitalizeAllWords(value: string): string {
    return value
      .split(' ')
      .map((v) => this.capitalizeFirstWord(v))
      .join(' ');
  }
}
