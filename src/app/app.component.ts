import { Component } from '@angular/core';
import { LocalStorageService } from './core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front-ecommerce';
  constructor(private localstorage: LocalStorageService) {
    this.localstorage.setItem('clave1', 'Hola');
    this.localstorage.setItem('clave2', '2');

    //this.localstorage.setItem('clave3', { name: 'Cris' });
  }
}
