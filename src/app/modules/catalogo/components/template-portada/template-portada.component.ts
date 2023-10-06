import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template-portada',
  templateUrl: './template-portada.component.html',
  styleUrls: ['./template-portada.component.scss'],
})
export class TemplatePortadaComponent implements OnInit {
  @Input() objeto: any;
  @Input() innerWidth!: number;
  constructor() {}

  ngOnInit(): void {}
}
