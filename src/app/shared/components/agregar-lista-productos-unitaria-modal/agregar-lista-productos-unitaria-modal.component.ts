import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Lista } from '../../interfaces/articuloFavorito';
import { ArticuloLista } from '../../interfaces/articuloLista';
import { Articulo } from '../../interfaces/articulos.response';
import { Usuario } from '../../interfaces/login';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import { RootService } from '../../services/root.service';

@Component({
  selector: 'app-agregar-lista-productos-unitaria-modal',
  templateUrl: './agregar-lista-productos-unitaria-modal.component.html',
  styleUrls: ['./agregar-lista-productos-unitaria-modal.component.scss'],
})
export class AgregarListaProductosUnitariaModalComponent implements OnInit {
  listas: Lista[] = [];
  skus: ArticuloLista[] = [];
  modo: 'lotes' | 'lista' = 'lotes';

  lista!: Lista;
  nombre = '';

  creandoLista = false;
  seleccionandoLista = false;
  guardando = false;
  cantCaracteres = 0;
  maxCaracteres = 40;

  usuario!: Usuario;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private toastr: ToastrService,
    private clientsService: ClientsService,
    public rootService: RootService
  ) {}

  ngOnInit() {
    this.usuario = this.rootService.getDataSesionUsuario();
    this.seleccionandoLista = this.modo === 'lista' ? true : false;
    this.getListas();
  }

  getListas() {
    this.clientsService
      .getListaArticulosFavoritos(this.usuario.rut || '0')
      .subscribe((resp: ResponseApi) => {
        if (resp.data.length > 0) {
          if (resp.data[0].listas.length > 0) {
            this.listas = resp.data[0].listas;
          }
        }
      });
  }

  ingresaNombre() {
    this.cantCaracteres = this.nombre.length;
  }

  onFiltrosCambiados(articulo: any) {
    if (!this.skus.map((e) => e.sku).includes(articulo.sku)) {
      this.skus.push({
        image: articulo.image,
        sku: articulo.sku,
        nombre: articulo.nombre,
      });
    } else {
      this.toastr.error(
        `Artículo SKU: ${articulo.sku} ya se encuentra agregado.`
      );
    }
  }

  eliminarArticulo(idx: any) {
    this.skus.splice(idx, 1);
  }

  guardar(): void {
    if (this.guardando) {
      return;
    }
    if (!this.creandoLista && !this.seleccionandoLista) {
      this.toastr.error('Debe crear una lista o seleccionar una existente.');
      return;
    }

    const request: any = {};
    if (this.creandoLista) {
      request.nombre = this.nombre;
    }
    let idLista: string = '';
    if (this.seleccionandoLista) {
      idLista = this.lista._id;
    }

    request.rut = this.usuario.rut;
    request.skus = this.skus.map((s) => s.sku);

    this.guardando = true;
    this.clientsService
      .setArticulosFavoritosUnitario(request, idLista)
      .subscribe((resp: ResponseApi) => {
        if (!resp.error) {
          this.toastr.success('Lista creada correctamente');
          this.close(true);
          this.guardando = false;
        } else {
          this.toastr.error(resp.msg);
          this.guardando = false;
        }
      });
  }

  close(flag: boolean) {
    this.event.emit(flag);
    this.ModalRef.hide();
  }
}
