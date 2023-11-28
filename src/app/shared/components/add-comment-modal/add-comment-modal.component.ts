import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ComentarioArticulo } from '../../interfaces/comentariosArticulo';
import { Product } from '../../interfaces/product';
import { ResponseApi } from '../../interfaces/response-api';
import { CatalogoService } from '../../services/catalogo.service';
import { isVacio } from '../../utils/utilidades';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-add-comment-modal',
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['./add-comment-modal.component.scss'],
})
export class AddCommentModalComponent implements OnInit {
  @Input() producto!: Product;
  usuario!: ISession;
  urlImg = '';

  valoracion!: number;
  titulo!: string;
  comentario!: string;
  recomienda!: string;
  nombre!: string;
  correo!: string;

  camposDisabled = false;
  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private catalogoService: CatalogoService,
    private toastrService: ToastrService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    if (this.producto.images[0]['150'].length === 0) {
      this.urlImg = '../../../assets/images/products/no-image-listado-2.jpg';
    } else {
      this.urlImg = this.producto.images[0]['150'][0];
    }

    this.usuario = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    if (this.usuario.userRole !== 'temp') {
      this.nombre = `${(this.usuario.firstName || '').split(' ')[0]} ${
        (this.usuario.lastName || '').split(' ')[0]
      }`;
      this.correo = this.usuario.email || '';
      this.camposDisabled = true;
    }
  }

  publicarComentario() {
    const request: ComentarioArticulo = {
      sku: this.producto.sku,
      calificacion: this.valoracion,
      titulo: this.titulo,
      comentario: this.comentario,
      recomienda: isVacio(this.recomienda)
        ? null
        : this.recomienda === 'SI'
        ? true
        : false,
      nombre: this.nombre,
      correo: this.correo,
      username: this.usuario.username,
    };

    this.catalogoService
      .guardarComentarioArticulo(request)
      .subscribe((resp: ResponseApi) => {
        if (!resp.error) {
          this.event.emit(true);
          this.ModalRef.hide();
        } else {
          this.toastrService.error(resp.msg);
        }
      });
  }

  setValoracion(valoracion: number) {
    this.valoracion = valoracion;
  }

  camposObligatorios() {
    return (
      !isVacio(this.valoracion) &&
      !isVacio(this.nombre) &&
      !isVacio(this.correo)
    );
  }
}
