import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-colapse',
  templateUrl: './colapse.component.html',
  styleUrls: ['./colapse.component.scss'],
})
export class ColapseComponent implements OnInit {
  @Input() tienda: any
  @Input() innerWidth!: number
  constructor() {}

  ngOnInit() {}
}
