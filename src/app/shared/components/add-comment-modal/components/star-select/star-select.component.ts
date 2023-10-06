import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-select',
  templateUrl: './star-select.component.html',
  styleUrls: ['./star-select.component.scss'],
})
export class StarSelectComponent implements OnInit {
  @Output() valoracion: EventEmitter<number> = new EventEmitter();

  stars = [
    {
      id: 1,
      class: 'star-gray star-hover star',
    },
    {
      id: 2,
      class: 'star-gray star-hover star',
    },
    {
      id: 3,
      class: 'star-gray star-hover star',
    },
    {
      id: 4,
      class: 'star-gray star-hover star',
    },
    {
      id: 5,
      class: 'star-gray star-hover star',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  selectStar(value: any): void {
    this.stars.filter((star) => {
      if (star.id <= value) {
        star.class = 'star-gold star';
      } else {
        star.class = 'star-gray star';
      }
      return star;
    });

    this.valoracion.emit(value);
  }
}
