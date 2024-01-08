import { Component, OnInit, Input } from '@angular/core';
import { IBody } from '@core/models-v2/catalog/catalog-response.interface';

@Component({
  selector: 'app-template-portada',
  templateUrl: './template-portada.component.html',
  styleUrls: ['./template-portada.component.scss'],
})
export class TemplatePortadaComponent implements OnInit {
  @Input() objeto!: IBody;
  @Input() innerWidth!: number;
  constructor() {}

  ngOnInit(): void {}
}
