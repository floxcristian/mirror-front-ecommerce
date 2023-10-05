import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-fechas-promesas',
  templateUrl: './fechas-promesas.component.html',
  styleUrls: ['./fechas-promesas.component.scss'],
})
export class FechasPromesasComponent implements OnInit {
  @Input() promesas: any[] = []
  constructor() {}

  ngOnInit() {}
}
