// Angular
import { Component, EventEmitter, OnInit } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IWishlist } from '@core/services-v2/wishlist/models/wishlist-response.interface';
// Services
import { SessionService } from '@core/services-v2/session/session.service';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { WishlistApiService } from '@core/services-v2/wishlist/wishlist-api.service';
import { WishlistService } from '@core/services-v2/wishlist/wishlist.service';

@Component({
  selector: 'app-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss'],
})
export class WishListModalComponent implements OnInit {
  productSku!: string;

  wishlists!: (IWishlist & { checked?: boolean })[];
  listasEnQueExiste!: IWishlist[];

  creatingWishlist!: boolean;
  nombre = '';

  session!: ISession;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private toast: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly wishlistStorage: WishlistStorageService,
    private readonly wishlistApiService: WishlistApiService,
    private readonly wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();

    this.wishlists = this.formatCheckedWishlists(this.wishlists);
  }

  private getWishlists(): void {
    this.wishlistApiService.getWishlists(this.session.documentId).subscribe({
      next: (wishlists) => {
        this.wishlists = this.formatCheckedWishlists(wishlists);
      },
    });
  }

  private formatCheckedWishlists(wishlists: IWishlist[]) {
    return wishlists.map((wishlist) => {
      const isProductOnList = this.listasEnQueExiste.some(
        (_wishlist) => _wishlist.id === wishlist.id
      );
      return { ...wishlist, checked: isProductOnList };
    });
  }

  ingresaNombre() {
    document.querySelector('.validacion')?.classList.remove('d-block');
    document.querySelector('.validacion')?.classList.add('d-none');
  }

  crearLista() {
    if (!this.nombre.length) {
      document.querySelector('.validacion')?.classList.remove('d-none');
      document.querySelector('.validacion')?.classList.add('d-block');
      return;
    }
    this.wishlistApiService
      .createWishlist({
        documentId: this.session.documentId,
        name: this.nombre,
      })
      .subscribe({
        next: () => {
          this.wishlistService
            .setWishlistOnStorage(this.session.documentId)
            .subscribe({
              next: () => {
                this.refreshListasEnQueExiste();
                this.toast.success(`Se creó la lista: ${this.nombre}`);
                this.getWishlists();
              },
            });
        },
      });
    this.nombre = '';
    this.creatingWishlist = false;
  }

  listaPredeterminada(lista: IWishlist): void {
    this.wishlistApiService
      .setDefaultWishlist(this.session.documentId, lista.id)
      .subscribe({
        next: () => {
          this.getWishlists();
        },
      });
  }

  // agrega o elimina SKU de una lista
  async seleccionaLista(wishlist: IWishlist) {
    const objHTML: any = document.getElementById(`ID-${wishlist.id}`);

    if (objHTML.checked) {
      this.wishlistApiService
        .addProductsToWishlist({
          documentId: this.session.documentId,
          wishlistId: wishlist.id,
          skus: [this.productSku],
        })
        .subscribe({
          next: () => {
            this.wishlistService
              .setWishlistOnStorage(this.session.documentId)
              .subscribe({
                next: () => {
                  this.refreshListasEnQueExiste();
                  this.toast.success(`Se agregó a la lista: ${wishlist.name}`);
                },
              });
          },
        });
    } else {
      this.wishlistApiService
        .deleteProductFromWishlist({
          documentId: this.session.documentId,
          wishlistId: wishlist.id,
          sku: this.productSku,
        })
        .subscribe({
          next: () => {
            this.wishlistService
              .setWishlistOnStorage(this.session.documentId)
              .subscribe({
                next: () => {
                  this.refreshListasEnQueExiste();
                  this.toast.success(
                    `Se eliminó de la lista: ${wishlist.name}`
                  );
                },
              });
          },
        });
    }
  }

  closeModal(): void {
    const listas: NodeListOf<Element> = document.querySelectorAll('.listas');
    let checked = false;
    listas.forEach((e: any) => {
      if (e.checked) {
        checked = true;
      }
    });

    if (checked) {
      this.event.emit(true);
      this.ModalRef.hide();
    } else {
      this.event.emit(false);
      this.ModalRef.hide();
    }
  }

  private refreshListasEnQueExiste(): void {
    this.listasEnQueExiste = [];
    const wishlists = this.wishlistStorage.get();
    if (wishlists?.length) {
      wishlists.forEach((wishlist) => {
        const isProductOnList = wishlist.articles.find(
          (product) => product.sku === this.productSku
        );
        if (isProductOnList) {
          this.listasEnQueExiste.push(wishlist);
        }
      });
    }
  }
}
