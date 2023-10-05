import { Pipe, PipeTransform } from '@angular/core'

/*
 * Changes the case of the first letter of a world by avoiding the prepositions.
 */
@Pipe({ name: 'titlecase' })
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    // return input;
    if (input == null) {
      return ''
    }

    let words = input.split(' ')
    for (var i = 0; i < words.length; i++) {
      let word = words[i]
      if (this.isPrepositions(word) && i != 0) {
        words[i] = word.toLowerCase() + ' '
      } else if (this.isEverUpperCase(word) && i != 0) {
        words[i] = word.toUpperCase() + ' '
      } else {
        words[i] = this.makeCamelCase(word)
      }
    }
    return words.join(' ')
  }

  private isPrepositions(word: string): boolean {
    const prepositions = ['y', 'de', 'a', 'los', 'el']
    return prepositions.includes(word.toLowerCase())
  }

  private isEverUpperCase(word: string): boolean {
    const EverUpperCase = ['xxl', 'xl', 't/xl', 't/xxl', 't/l', 't/m', 't/s']
    return EverUpperCase.includes(word.toLowerCase())
  }

  private makeCamelCase(word: string): string {
    if (word == '') {
      return word
    } else {
      return word[0].toUpperCase() + word.substr(1).toLowerCase()
    }
  }
}
