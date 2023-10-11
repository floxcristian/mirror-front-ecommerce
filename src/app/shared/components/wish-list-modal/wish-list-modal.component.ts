import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ArticuloFavorito, Lista } from '../../interfaces/articuloFavorito';
import { Usuario } from '../../interfaces/login';
import { Product } from '../../interfaces/product';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import { RootService } from '../../services/root.service';
import { isVacio } from '../../utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

export interface DataWishListModal {
  producto: Product;
  listas: Lista[];
  listasEnQueExiste: Lista[];
}

@Component({
  selector: 'app-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss'],
})
export class WishListModalComponent implements OnInit {
  producto!: Product;
  listas!: Lista[];
  listasEnQueExiste!: Lista[];

  creandoLista = false;
  nombre = '';

  cantCaracteres = 0;
  maxCaracteres = 40;

  usuario!: Usuario;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private rootService: RootService,
    private toast: ToastrService,
    private localS: LocalStorageService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.usuario = this.rootService.getDataSesionUsuario();

    this.listas = this.listas.map((l) => {
      l.checked = !isVacio(this.listasEnQueExiste.find((e) => e._id === l._id))
        ? true
        : false;
      return l;
    });
  }

  getListas() {
    this.clientsService
      .getListaArticulosFavoritos(this.usuario.rut || '')
      .subscribe((resp: ResponseApi) => {
        if (resp.data.length > 0) {
          if (resp.data[0].listas.length > 0) {
            this.listas = resp.data[0].listas;

            this.listas = this.listas.map((l) => {
              l.checked = !isVacio(
                this.listasEnQueExiste.find((e) => e._id === l._id)
              )
                ? true
                : false;
              return l;
            });
          }
        }
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

    this.clientsService
      .setListaArticulosFavoritos(this.nombre, this.usuario.rut || '')
      .subscribe(async (resp: ResponseApi) => {
        if (!resp.error) {
          // se agrega la lista en el LocalStorage
          await this.clientsService.cargaFavoritosLocalStorage(
            this.usuario.rut || ''
          );

          this.refreshListasEnQueExiste();
          this.toast.success(`Se creó la lista: ${this.nombre}`);
          this.getListas();
        }
      });
    this.nombre = '';
    this.creandoLista = false;
  }

  listaPredeterminada(lista: Lista) {
    this.clientsService
      .predeterminadaListaArticulosFavoritos(this.usuario.rut || '', lista._id)
      .subscribe((resp: ResponseApi) => {
        if (!resp.error) {
          this.getListas();
        }
      });
  }

  // agrega o elimina SKU de una lista
  async seleccionaLista(lista: Lista) {
    const objHTML: any = document.getElementById('ID-' + lista._id);

    if (objHTML.checked) {
      const resp: ResponseApi = (await this.clientsService
        .setArticulosFavoritos(
          this.producto.sku,
          this.usuario.rut || '',
          lista._id
        )
        .toPromise()) as ResponseApi;
      if (!resp.error) {
        // se agrega sku en la lista del LocalStorage
        await this.clientsService.cargaFavoritosLocalStorage(
          this.usuario.rut || ''
        );

        this.refreshListasEnQueExiste();
        this.toast.success(`Se agregó a la lista: ${lista.nombre}`);
      }
    } else {
      const resp: ResponseApi = (await this.clientsService
        .deleteArticulosFavoritos(
          this.producto.sku,
          this.usuario.rut || '',
          lista._id
        )
        .toPromise()) as ResponseApi;
      if (!resp.error) {
        // se elimina sku de la lista en LocalStorage
        await this.clientsService.cargaFavoritosLocalStorage(
          this.usuario.rut || ''
        );

        this.refreshListasEnQueExiste();
        this.toast.success(`Se eliminó de la lista: ${lista.nombre}`);
      }
    }
  }

  close() {
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

  refreshListasEnQueExiste() {
    this.listasEnQueExiste = [];
    const favoritos: ArticuloFavorito = this.localS.get('favoritos') as any;
    if (!isVacio(favoritos)) {
      favoritos.listas.forEach((lista) => {
        if (!isVacio(lista.skus.find((sku) => sku === this.producto.sku))) {
          this.listasEnQueExiste.push(lista);
        }
      });
    }
  }
}
