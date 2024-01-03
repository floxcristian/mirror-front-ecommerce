// Angular
import { Component, Input } from '@angular/core';
//Models
import { ICollapsableStore } from '../../pages/page-stores/collapsable-store.interface';

@Component({
  selector: 'app-colapse',
  templateUrl: './colapse.component.html',
  styleUrls: ['./colapse.component.scss'],
})
export class ColapseComponent {
  @Input() store!: ICollapsableStore;
  @Input() innerWidth!: number;
}
