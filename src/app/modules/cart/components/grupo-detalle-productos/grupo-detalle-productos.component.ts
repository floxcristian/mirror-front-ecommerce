import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-grupo-detalle-productos',
  templateUrl: './grupo-detalle-productos.component.html',
  styleUrls: ['./grupo-detalle-productos.component.scss'],
})
export class GrupoDetalleProductosComponent implements OnInit {
  @Input() grupo_producto: any = [];
  @Input() index: any = 0;
  @Input() length: number = 0;
  products: ProductCart[] = [];
  innerWidth: number;
  suma = 0;
  @Output() eliminarGrupo = new EventEmitter();
  modalRef!: BsModalRef;

  constructor(private modalService: BsModalService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.suma_cantidad();
  }

  ngOnDestroy() {
    this.eliminarGrupo.unsubscribe();
  }

  eliminar(index: any) {
    this.eliminarGrupo.emit(index);
    this.modalRef.hide();
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  suma_cantidad() {
    this.suma = 0;
    this.grupo_producto.forEach((item: any) => {
      this.suma = this.suma + item.precio * item.cantidad;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  closeModal() {
    this.modalRef.hide();
  }
}
