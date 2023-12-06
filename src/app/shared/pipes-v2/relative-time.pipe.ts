import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'hace unos segundos';
    } else if (minutes < 60) {
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (days < 30) {
      return `hace ${days} día${days > 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      return `hace ${years} año${years > 1 ? 's' : ''}`;
    }
  }
}
