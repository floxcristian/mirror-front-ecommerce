import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResumenComentario } from '../../interfaces/comentariosArticulo';
import { Product } from '../../interfaces/product';
import { ResponseApi } from '../../interfaces/response-api';
import { CatalogoService } from '../../services/catalogo.service';
import { AddCommentModalComponent } from '../add-comment-modal/add-comment-modal.component';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../modal/modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';

@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.scss'],
})
export class ProductRatingComponent implements OnChanges {
  // @Input() producto!: IArticleResponse;
  @Input() producto!: any;
  @Output() comentarioGuardado: EventEmitter<boolean> = new EventEmitter();
  @Output() leerComentarios: EventEmitter<boolean> = new EventEmitter();

  rating = 0;
  starWidth = 20;
  anchoPintado = 0;

  total = 0;
  resumen: ResumenComentario[] = [];

  constructor(
    private modalService: BsModalService,
    private catalogoService: CatalogoService,
    private toastrService: ToastrService,
    public router: Router,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.cargaResumen();
  }

  cargaResumen() {
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
          this.comentarioGuardado.emit(true);
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
}
