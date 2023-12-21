// Angular
import { Component, EventEmitter, OnInit } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { IWishlist } from '@core/services-v2/whishlist/models/whishlist-response.interface';
// Services
import { isVacio } from '../../utils/utilidades';
import { SessionService } from '@core/states-v2/session.service';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { WishlistApiService } from '@core/services-v2/whishlist/whishlist-api.service';
import { WishlistService } from '@core/services-v2/whishlist/wishlist.service';

@Component({
  selector: 'app-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss'],
})
export class WishListModalComponent implements OnInit {
  producto!: IArticleResponse;
  listas!: (IWishlist & { checked?: boolean })[];
  listasEnQueExiste!: IWishlist[];

  creandoLista = false;
  nombre = '';

  cantCaracteres = 0;
  maxCaracteres = 40;

  usuario!: ISession;

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
    this.usuario = this.sessionService.getSession();

    this.listas = this.listas.map((l) => {
      l.checked = !isVacio(
        this.listasEnQueExiste.find((wishlist) => wishlist.id === l.id)
      )
        ? true
        : false;
      return l;
    });
  }

  getListas() {
    this.wishlistApiService.getWishlists(this.usuario.documentId).subscribe({
      next: (wishlists) => {
        this.listas = wishlists.map((wishlist) => {
          const isProductOnList = this.listasEnQueExiste.some(
            (_wishlist) => _wishlist.id === wishlist.id
          );
          return { ...wishlist, checked: isProductOnList };
        });
      },
    });
  }

  ingresaNombre() {
    this.cantCaracteres = this.nombre.length;
    document.querySelector('.validacion')?.classList.remove('d-block');
    document.querySelector('.validacion')?.classList.add('d-none');
  }

  crearLista() {
    if (this.nombre.length === 0) {
      document.querySelector('.validacion')?.classList.remove('d-none');
      document.querySelector('.validacion')?.classList.add('d-block');
      return;
    }
    this.wishlistApiService
      .createWishlist({
        documentId: this.usuario.documentId,
        name: this.nombre,
      })
      .subscribe({
        next: () => {
          this.wishlistService
            .setWishlistOnStorage(this.usuario.documentId)
            .subscribe({
              next: () => {
                this.refreshListasEnQueExiste();
                this.toast.success(`Se creó la lista: ${this.nombre}`);
                this.getListas();
              },
            });
        },
      });
    this.nombre = '';
    this.creandoLista = false;
  }

  listaPredeterminada(lista: IWishlist) {
    this.wishlistApiService
      .setDefaultWishlist(this.usuario.documentId, lista.id)
      .subscribe({
        next: () => {
          this.getListas();
        },
      });
  }

  // agrega o elimina SKU de una lista
  async seleccionaLista(wishlist: IWishlist) {
    const objHTML: any = document.getElementById(`ID-${wishlist.id}`);

    if (objHTML.checked) {
      this.wishlistApiService
        .addProductsToWishlist({
          documentId: this.usuario.documentId,
          wishlistId: wishlist.id,
          skus: [this.producto.sku],
        })
        .subscribe({
          next: () => {
            this.wishlistService
              .setWishlistOnStorage(this.usuario.documentId)
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
          documentId: this.usuario.documentId,
          wishlistId: wishlist.id,
          sku: this.producto.sku,
        })
        .subscribe({
          next: () => {
            this.wishlistService
              .setWishlistOnStorage(this.usuario.documentId)
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
          (product) => product.sku === this.producto.sku
        );
        if (isProductOnList) {
          this.listasEnQueExiste.push(wishlist);
        }
      });
    }
  }
}
