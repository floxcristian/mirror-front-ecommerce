import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer-catalogo',
  templateUrl: './footer-catalogo.component.html',
  styleUrls: ['./footer-catalogo.component.scss']
})
export class FooterCatalogoComponent implements OnInit {
  @Input() page! : number;
  @Input() longitud! : number;
  @Input()catalogo: any = [];
  @Output() cambiar = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit() {
  }

  cambiarPagina(valor:any) {

    this.cambiar.emit(valor)

  }
}
