import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.scss'],
})
export class ImagenComponent implements OnInit {
  @Input() collapsed!: boolean;

  constructor() {}

  ngOnInit() {}

  getStyles() {
    if (!this.collapsed) {
      const obj = {
        bottom: '0px',
        left: '20px',
      };
      return obj;
    } else {
      const obj = {
        bottom: '0px',
        left: '50px',
      };
      return obj;
    }
  }
}
