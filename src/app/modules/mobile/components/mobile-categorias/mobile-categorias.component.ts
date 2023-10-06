import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';

@Component({
  selector: 'app-mobile-categorias',
  templateUrl: './mobile-categorias.component.html',
  styleUrls: ['./mobile-categorias.component.scss'],
})
export class MobileCategoriasComponent {
  @Input() links: any[] = [];
  @Input() level = 0;
  @Input() titulo = '';

  @Output() itemClick: EventEmitter<MobileMenuItem> = new EventEmitter();

  constructor() {}

  onItemClick(item: MobileMenuItem): void {
    this.itemClick.emit(item);
  }
}
