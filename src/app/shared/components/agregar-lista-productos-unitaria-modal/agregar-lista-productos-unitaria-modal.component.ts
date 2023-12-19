// Angular
import { Component, EventEmitter, OnInit } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IWishlist } from '@core/services-v2/whishlist/models/whishlist-response.interface';
import { ISelectedProduct } from './selected-product.interface';
// Services
import { SessionService } from '@core/states-v2/session.service';
import { WishlistApiService } from '@core/services-v2/whishlist/whishlist-api.service';
import { Articulo } from '@shared/interfaces/articulos.response';

@Component({
  selector: 'app-agregar-lista-productos-unitaria-modal',
  templateUrl: './agregar-lista-productos-unitaria-modal.component.html',
  styleUrls: ['./agregar-lista-productos-unitaria-modal.component.scss'],
})
export class AgregarListaProductosUnitariaModalComponent implements OnInit {
  listas: IWishlist[] = [];
  selectedProducts: ISelectedProduct[] = [];
  modo: 'lotes' | 'lista' = 'lotes';

  lista!: IWishlist;
  nombre = '';

  creandoLista = false;
  seleccionandoLista = false;
  guardando = false;
  cantCaracteres = 0;
  maxCaracteres = 40;

  usuario!: ISession;

  event: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly wishlistApiService: WishlistApiService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession();
    this.seleccionandoLista = this.modo === 'lista';
    this.getWishlists();
  }

  /**
   * Obtener las listas de deseos.
   */
  getWishlists(): void {
    this.wishlistApiService.getWishlists(this.usuario.documentId).subscribe({
      next: (wishlists) => {
        this.listas = wishlists;
      },
    });
  }

  ingresaNombre(): void {
    this.cantCaracteres = this.nombre.length;
  }

  onFiltrosCambiados(articulo: any): void {
    const currentSelectedSkus = this.selectedProducts.map(
      (product) => product.sku
    );
    if (!currentSelectedSkus.includes(articulo.sku)) {
      this.selectedProducts.push({
        image: articulo.image,
        sku: articulo.sku,
        name: articulo.nombre,
      });
    } else {
      this.toastr.error(
        `Artículo SKU <strong>${articulo.sku}</strong> ya se encuentra agregado.`
      );
    }
  }

  eliminarArticulo(productIndex: number): void {
    this.selectedProducts.splice(productIndex, 1);
  }

  guardar(): void {
    if (this.guardando) {
      return;
    }
    if (!this.creandoLista && !this.seleccionandoLista) {
      this.toastr.error('Debe crear una lista o seleccionar una existente.');
      return;
    }
    const skus = this.selectedProducts.map((product) => product.sku);

    this.guardando = true;
    if (this.seleccionandoLista) {
      this.updateWishlist(skus);
    } else {
      this.createWishlist(this.nombre, skus);
    }
  }

  createWishlist(name: string, skus: string[]) {
    this.wishlistApiService
      .createWishlist({ name, skus, documentId: this.usuario.documentId })
      .subscribe({
        next: () => {
          this.toastr.success(`Lista creada correctamente.`);
          this.close(true);
          this.guardando = false;
        },
        error: () => {
          this.toastr.error(`Ha ocurrido un error al crear la lista.`);
          this.guardando = false;
        },
      });
  }

  updateWishlist(skus: string[]) {
    this.wishlistApiService
      .addProductsToWishlist({
        skus,
        documentId: this.usuario.documentId,
        wishlistId: this.lista.id,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`Lista actualizada correctamente.`);
          this.close(true);
          this.guardando = false;
        },
        error: () => {
          this.toastr.error(`Ha ocurrido un error al actualizar la lista.`);
          this.guardando = false;
        },
      });
  }

  close(hasChanges: boolean): void {
    this.event.emit(hasChanges);
    this.ModalRef.hide();
  }
}
