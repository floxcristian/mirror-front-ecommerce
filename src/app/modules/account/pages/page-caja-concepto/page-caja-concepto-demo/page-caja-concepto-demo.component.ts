import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-caja-concepto-demo',
  templateUrl: './page-caja-concepto-demo.component.html',
  styleUrls: ['./page-caja-concepto-demo.component.scss'],
})
export class PageCajaConceptoDemoComponent implements OnInit {
  @Input() caja_concepto: any = {};
  constructor() {}

  ngOnInit() {}
}
