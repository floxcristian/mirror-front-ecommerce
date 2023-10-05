import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item'

@Component({
  selector: 'app-mobile-links',
  templateUrl: './mobile-links.component.html',
  styleUrls: ['./mobile-links.component.scss'],
})
export class MobileLinksComponent {
  @Input() links: MobileMenuItem[] | undefined = []
  @Input() level = 0
  @Input() titulo = ''

  @Output() itemClick: EventEmitter<MobileMenuItem> = new EventEmitter()

  constructor() {}

  onItemClick(item: MobileMenuItem): void {
    this.itemClick.emit(item)
  }
}
