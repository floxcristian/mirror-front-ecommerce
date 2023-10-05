import { Component, Input, OnInit } from '@angular/core'
import { NestedLink } from '../../../../shared/interfaces/nested-link'

@Component({
  selector: 'app-header-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() layout: 'classic' | 'topbar' = 'classic'
  @Input() items: NestedLink[] = []

  constructor() {}

  ngOnInit() {}
}
