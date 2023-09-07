import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
})
export class ShareButtonComponent implements OnInit {
  @Input() producto!: Product;
  @Input() catalogo!: boolean;
  url!: string;
  mensaje!: string;
  asunto!: string;
  body!: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.catalogo
      ? (this.url = this.url =
          encodeURI(
            `${environment.canonical}/inicio/productos/ficha/${this.producto.sku}`
          ))
      : (this.url = encodeURI(`${environment.canonical}${this.router.url}`));

    this.mensaje = encodeURI(
      `Me gustó este producto: ${this.producto.nombre} ${this.url}`
    );
    this.asunto = `Me gustó este producto: ${this.producto.nombre}`;
  }
}
