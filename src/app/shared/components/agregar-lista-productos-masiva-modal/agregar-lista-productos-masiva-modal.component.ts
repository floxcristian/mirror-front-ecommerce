import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Lista } from '../../interfaces/articuloFavorito';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import { RootService } from '../../services/root.service';
import { isVacio } from '../../utils/utilidades';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-agregar-lista-productos-masiva-modal',
  templateUrl: './agregar-lista-productos-masiva-modal.component.html',
  styleUrls: ['./agregar-lista-productos-masiva-modal.component.scss'],
})
export class AgregarListaProductosMasivaModalComponent implements OnInit {
  listas: Lista[] = [];
  productosCargados: any[] = [];
  productosNoCargados: any[] = [];
  modo: 'lotes' | 'lista' = 'lotes';

  lista!: Lista;
  nombre = '';
  file!: File;

  creandoLista = false;
  seleccionandoLista = false;
  procesandoExcel = false;
  procesado = false;
  cantCaracteres = 0;
  maxCaracteres = 40;
  alertClass!: string;
  mensaje!: string;
  collapsed1State = true;
  collapsed2State = true;

  usuario!: ISession;
  form!: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public ModalRef: BsModalRef,
    private fb: FormBuilder,
    public rootService: RootService,
    private toast: ToastrService,
    private clientsService: ClientsService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession(); //this.rootService.getDataSesionUsuario();
    this.form = this.fb.group({
      file: ['', Validators.required],
    });
    this.seleccionandoLista = this.modo === 'lista' ? true : false;
    this.getListas();
  }

  getListas() {
    this.clientsService
      .getListaArticulosFavoritos(this.usuario.documentId)
      .subscribe((resp: ResponseApi) => {
        if (resp.data.length > 0) {
          if (resp.data[0].listas.length > 0) {
            this.listas = resp.data[0].listas;
          }
        }
      });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
  }

  clickCollapse(item: any) {
    switch (item) {
      case 1:
        if (
          document
            .getElementById('productosOK')
            ?.classList.contains('collapsing')
        ) {
          return;
        }
        this.collapsed1State = !this.collapsed1State;
        this.collapsed2State = true;
        break;
      case 2:
        if (
          document
            .getElementById('productosERROR')
            ?.classList.contains('collapsing')
        ) {
          return;
        }
        this.collapsed2State = !this.collapsed2State;
        this.collapsed1State = true;
        break;
    }
  }

  ingresaNombre() {
    this.cantCaracteres = this.nombre.length;
  }

  procesarArchvo(): void {
    if (this.procesandoExcel) {
      return;
    }
    if (this.creandoLista && (isVacio(this.nombre) || isVacio(this.file))) {
      this.toast.error('Debe ingresar un nombre y un archivo Excel.');
      return;
    }
    if (
      this.seleccionandoLista &&
      (isVacio(this.lista) || isVacio(this.file))
    ) {
      this.toast.error(
        'Debe seleccionar una lista e ingresar un archivo Excel.'
      );
      return;
    }
    if (!this.creandoLista && !this.seleccionandoLista) {
      this.toast.error('Debe crear una lista o seleccionar una existente.');
      return;
    }

    const formData: FormData = new FormData();
    if (this.creandoLista) {
      formData.append('nombre', this.nombre);
    }
    let idLista: string = '';
    if (this.seleccionandoLista) {
      idLista = this.lista._id;
    }

    formData.append('rut', this.usuario.documentId);
    formData.append('file', this.file);

    this.procesandoExcel = true;
    this.clientsService
      .setArticulosFavoritosMasivo(formData, idLista)
      .subscribe((resp: ResponseApi) => {
        if (!resp.error) {
          this.productosCargados = resp.data.productos;
          this.productosNoCargados = resp.data.productosNoEncontrados;

          if (
            this.productosCargados.length > 0 &&
            this.productosNoCargados.length === 0
          ) {
            this.alertClass = 'alert alert-success';
            this.mensaje = 'Se cargaron todos los productos correctamente.';
          }

          if (
            this.productosCargados.length > 0 &&
            this.productosNoCargados.length > 0
          ) {
            this.alertClass = 'alert alert-warning';
            this.mensaje = `Se cargaron ${this.productosCargados.length} de ${
              this.productosCargados.length + this.productosNoCargados.length
            } productos.`;
          }

          if (
            this.productosCargados.length === 0 &&
            this.productosNoCargados.length > 0
          ) {
            this.alertClass = 'alert alert-danger';
            this.mensaje = 'No se cargó ningún producto.';
          }

          this.procesandoExcel = false;
          this.procesado = true;
          this.form.reset();
        } else {
          this.toast.error(resp.msg);
          this.procesandoExcel = false;
          this.form.reset();
        }
      });
  }

  close(flag: boolean) {
    this.event.emit(flag);
    this.ModalRef.hide();
  }
}
