import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() imagen!: string;
  @Input() titulo!: string;
  @Input() linea1!: string;
  @Input() linea2!: string;

  constructor() {}

  ngOnInit() {}
}
