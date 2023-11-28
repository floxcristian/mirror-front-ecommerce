import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { TrackingService } from '../../../../shared/services/tracking.service';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-page-compras',
  templateUrl: './page-compras.component.html',
  styleUrls: ['./page-compras.component.scss'],
})
export class PageComprasComponent implements OnInit {
  constructor(
    public root: RootService,
    private _TrackingService: TrackingService,
    private cart: CartService,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  currentPage: number = 1;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = false;
  totalItems = 0;
  addingToCart = false;
  search = '';
  n_Ov = '';
  data: any = [];
  maxlength = 5;
  loadData = false;
  page = 1;

  async ngOnInit() {
    await this.resultado_busqueda();
  }

  async resultado_busqueda() {
    this.loadData = true;

    this.data = [];
    const usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    let user: any = {
      rut: usuario.documentId,
    };
    let params = {
      data_order: 'asc',
      data_sort: 'OrdenSeguimiento',
      draw: 1,
      length: this.maxlength,
      order: [{ column: 0, dir: 'asc' }],
      rut: usuario.documentId,
      search: { value: this.search, regex: false },
      start: this.page - 1,
    };

    let consulta: any = await this._TrackingService
      .getClienteOv(params)
      .toPromise();
    this.data = consulta.data;
    this.totalItems = consulta.largo[0].count;
    this.data.map((item: any) => (item.expand = false));

    if (this.data.length >= 3) {
      for (let i = 0; i < 3; i++) {
        this.data[i].expand = true;
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].expand = true;
      }
    }
    this.loadData = false;
  }

  async pageChanged(event: any) {
    this.page = event.page;
    await this.resultado_busqueda();
  }

  async buscar() {
    this.page = 1;
    await this.resultado_busqueda();
  }

  async expand(index: any) {
    this.data[index].expand = !this.data[index].expand;
  }

  addToCart(index: any) {
    console.log(index);
    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.addLista(this.data[index].productos).subscribe((resp) => {
      this.addingToCart = false;
      if (!resp.error) {
        this.toastr.success(`El pedido fue agregado al carro correctamente.`);
      }
    });
  }

  addCart(item: any) {
    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.add(item, 1).subscribe((resp) => {
      {
        this.addingToCart = false;
        if (!resp.error) {
          this.toastr.success(
            `Productos "${item.sku}" agregado al carro correctamente.`
          );
        }
      }
    });
  }

  searchCantProduct(sku: string, index: number) {
    let producto = this.data[index].InfoVenta.find((x: any) => x.Sku === sku);
    return producto.CantidadSolicitada;
  }

  searchPriceProduct(sku: string, index: number) {
    let producto = this.data[index].InfoVenta.find((x: any) => x.Sku === sku);
    return producto.Precio;
  }
}
