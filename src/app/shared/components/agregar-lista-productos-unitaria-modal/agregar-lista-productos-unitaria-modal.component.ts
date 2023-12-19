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

@Component({
  selector: 'app-agregar-lista-productos-unitaria-modal',
  templateUrl: './agregar-lista-productos-unitaria-modal.component.html',
  styleUrls: ['./agregar-lista-productos-unitaria-modal.component.scss'],
})
export class AgregarListaProductosUnitariaModalComponent implements OnInit {
  session!: ISession;
  wishlists: IWishlist[] = [];
  isLoading!: boolean;

  selectedProducts: ISelectedProduct[] = [];
  modo: 'lotes' | 'lista' = 'lotes';

  /**
   * Usar reactive forms para estas 2 variables.
   */
  selectedWishlist!: IWishlist;
  nombre = '';

  creandoLista = false;
  seleccionandoLista = false;

  cantCaracteres = 0;
  maxCaracteres = 40;

  event: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly wishlistApiService: WishlistApiService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.seleccionandoLista = this.modo === 'lista';
    this.getWishlists();
  }

  /**
   * Obtener las listas de deseos del cliente.
   */
  getWishlists(): void {
    this.wishlistApiService.getWishlists(this.session.documentId).subscribe({
      next: (wishlists) => (this.wishlists = wishlists),
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

  /**
   * Deseleccionar producto de la lista.
   * @param productIndex
   */
  unselectProduct(productIndex: number): void {
    this.selectedProducts.splice(productIndex, 1);
  }

  guardar(): void {
    if (this.isLoading) {
      return;
    }
    if (!this.creandoLista && !this.seleccionandoLista) {
      this.toastr.error('Debe crear una lista o seleccionar una existente.');
      return;
    }
    const skus = this.selectedProducts.map((product) => product.sku);

    this.isLoading = true;
    if (this.seleccionandoLista) {
      this.updateWishlist(skus);
    } else {
      this.createWishlist(this.nombre, skus);
    }
  }

  /**
   * Crear una lista de deseos con los nuevos skus.
   * @param name
   * @param skus
   */
  private createWishlist(name: string, skus: string[]): void {
    this.wishlistApiService
      .createWishlist({ name, skus, documentId: this.session.documentId })
      .subscribe({
        next: () => {
          this.toastr.success(`Lista creada correctamente.`);
          this.close(true);
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error(`Ha ocurrido un error al crear la lista.`);
          this.isLoading = false;
        },
      });
  }

  /**
   * Añadir skus a una lista de deseos ya existente.
   * @param skus
   */
  private updateWishlist(skus: string[]): void {
    this.wishlistApiService
      .addProductsToWishlist({
        skus,
        documentId: this.session.documentId,
        wishlistId: this.selectedWishlist.id,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`Lista actualizada correctamente.`);
          this.close(true);
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error(`Ha ocurrido un error al actualizar la lista.`);
          this.isLoading = false;
        },
      });
  }

  close(hasChanges: boolean): void {
    this.event.emit(hasChanges);
    this.ModalRef.hide();
  }
}
