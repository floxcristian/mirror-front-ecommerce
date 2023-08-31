import {
  Component,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-menu-categoria',
  templateUrl: './menu-categoria.component.html',
  styleUrls: ['./menu-categoria.component.scss'],
})
export class MenuCategoriaComponent implements OnInit {
  windowScrolled!: boolean;
  @Output() menu: EventEmitter<any> = new EventEmitter<any>();
  activar: boolean = false;
  constructor() {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 30
    ) {
      this.windowScrolled = false;
    }
  }
  ngOnInit() {}

  clickShow_menu() {
    if (this.activar) this.activar = false;
    else this.activar = true;
    this.menu.emit(this.activar);
  }
}
