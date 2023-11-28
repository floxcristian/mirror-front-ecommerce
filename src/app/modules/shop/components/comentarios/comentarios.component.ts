import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddCommentModalComponent } from '../../../../shared/components/add-comment-modal/add-comment-modal.component';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import {
  ComentarioArticulo,
  ResumenComentario,
} from '../../../../shared/interfaces/comentariosArticulo';
import { Product } from '../../../..//shared/interfaces/product';
import { ResponseApi } from '../../../..//shared/interfaces/response-api';
import { CatalogoService } from '../../../..//shared/services/catalogo.service';

import { calculaTiempo } from '../../../..//shared/utils/utilidades';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnChanges {
  @Input() producto!: Product | undefined;
  rating = 0;
  starWidth = 25;
  anchoPintado = 0;

  total = 0;
  resumen: ResumenComentario[] = [];
  comentarios: ComentarioArticulo[] = [];
  comentariosOriginal: ComentarioArticulo[] = [];
  slice = false;
  Math = Math;

  orden = 'recientes';

  constructor(
    private modalService: BsModalService,
    private catalogoService: CatalogoService,
    private toastrService: ToastrService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.cargaTodo();
  }

  cargaResumen() {
    if (this.producto) {
      this.catalogoService
        .getResumenComentarios(this.producto.sku)
        .subscribe((resp: ResponseApi) => {
          if (!resp.error) {
            this.rating = 0;
            this.total = resp.data.total;
            this.resumen = resp.data.resumen;

            this.resumen = this.resumen.map((c) => {
              c.porcentaje =
                this.total > 0 ? (c.cantidad * 100) / this.total : 0;
              this.rating =
                this.total > 0
                  ? this.rating + (c.estrellas * c.cantidad) / this.total
                  : 0;
              return c;
            });
            this.rating = Number(this.rating.toFixed(1));
            this.pintaEstrellas(this.rating);
          } else {
            this.toastrService.error(resp.msg);
          }
        });
    }
  }

  cargaDetalle() {
    if (this.producto) {
      this.catalogoService
        .getDetalleComentarios(this.producto.sku, this.orden)
        .subscribe((resp: ResponseApi) => {
          if (!resp.error) {
            this.comentarios = resp.data;
            this.comentarios = this.comentarios.map((c) => {
              const calculo: any = calculaTiempo(c.createdAt || '');

              c.tiempo = calculo.tiempo;
              c.unidadTiempo = calculo.unidad;

              return c;
            });
            this.comentariosOriginal = JSON.parse(
              JSON.stringify(this.comentarios)
            );
            this.slice = false;
            this.sliceToggle();
          } else {
            this.toastrService.error(resp.msg);
          }
        });
    }
  }

  cargaTodo() {
    this.cargaResumen();
    this.cargaDetalle();
  }

  pintaEstrellas(rating: number) {
    const width = Math.max(0, Math.min(5, rating)) * this.starWidth;

    this.anchoPintado = width;
  }

  escribirComentario() {
    const usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();

    if (usuario.userRole !== 'temp') {
      const initialState = {
        producto: this.producto,
      };
      const bsModalRef: BsModalRef = this.modalService.show(
        AddCommentModalComponent,
        { initialState, class: 'modal-comentario' }
      );
      bsModalRef.content.event.subscribe(async (res: any) => {
        if (res !== '') {
          this.toastrService.success('Comentario publicado correctamente.');
          this.cargaResumen();
          this.cargaDetalle();
        }
      });
    } else {
      const initialState: DataModal = {
        titulo: 'Información',
        mensaje: `Para poder publicar un comentario por favor identifícate iniciando sesión.<br>Si eres nuevo regístrate <a href="/sitio/registro-usuario">aquí</a>.`,
        tipoIcon: TipoIcon.INFO,
        tipoModal: TipoModal.OK,
        textoBotonSI: 'OK',
      };
      this.modalService.show(ModalComponent, { initialState });
    }
  }

  sliceToggle() {
    this.slice = !this.slice;
    if (this.slice) {
      this.comentarios = this.comentariosOriginal.slice(0, 4);
    } else {
      this.comentarios = this.comentariosOriginal;
    }
  }
}
