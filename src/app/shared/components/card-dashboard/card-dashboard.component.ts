import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss'],
})
export class CardDashboardComponent implements OnInit {
  @Input() title: any
  @Input() subtitle: any
  @Input() value: any
  @Input() iconClass: any
  @Input() iconContainerClass: any

  constructor() {}

  ngOnInit() {}
}
