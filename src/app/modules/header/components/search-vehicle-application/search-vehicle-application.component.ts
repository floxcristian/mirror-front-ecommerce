import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-vehicle-application',
  templateUrl: './search-vehicle-application.component.html',
  styleUrls: ['./search-vehicle-application.component.scss'],
})
export class SearchVehicleApplicationComponent implements OnInit {
  anios: any[] = [];
  actual = 2019;

  constructor() {
    // simulamos los años
    for (let index = 0; index < 20; index++) {
      this.anios.push({ nombre: this.actual, id: this.actual });
      this.actual--;
    }
  }

  ngOnInit() {}
}
