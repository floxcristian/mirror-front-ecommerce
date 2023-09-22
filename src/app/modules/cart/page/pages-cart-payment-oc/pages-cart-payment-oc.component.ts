import {
  Component,
  OnInit,
  Inject,
  Input,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
} from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { FormControl } from '@angular/forms';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Banner } from '../../../../shared/interfaces/banner';
import { HostListener } from '@angular/core';
import { DirectionService } from '../../../../shared/services/direction.service';
// import { WINDOW } from '@ng-toolkit/universal';
import { environment } from '../../../../../environments/environment';
import { isVacio } from '../../../../shared/utils/utilidades';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../../../shared/services/clients.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';

interface Item {
  ProductCart: ProductCart;
  quantity: number;
  quantityControl: FormControl;
}
@Component({
  selector: 'app-pages-cart-payment-oc',
  templateUrl: './pages-cart-payment-oc.component.html',
  styleUrls: ['./pages-cart-payment-oc.component.scss'],
})
export class PagesCartPaymentOcComponent implements OnInit {
  @ViewChild('modalRefuse', { static: false }) modalRefuse!: TemplateRef<any>;
  modalRefuseRef!: BsModalRef;

  cartSession: any = null;
  items: any = [];
  propietario = true;
  loadingPage = false;
  shippingType = null;
  fechas: any = [];
  fecha_entrega: any = [];
  productCart: any;
  producto_grupo: any;
  productoDisponible: any;
  fecha_actual = moment().startOf('day').toISOString();
  saveTimer: any;
  direccion: any;
  innerWidth: number;
  banners: Banner[] = [];
  verificar_oc = false;
  loadingText = '';
  showresumen = false;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;
  @Input() id: any;
  user: any;
  usuario: any;
  sinStock: boolean = false;
  isB2B!: boolean;
  addingToCart = false;
  total: any = {};
  credito = false;
  shippingDaysStore: any = [];
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      680: { items: 3 },
      500: { items: 2 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };
  usuarioTemp!: boolean;
  obsRefuse = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  constructor(
    public root: RootService,
    public cart: CartService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private clienteService: ClientsService,
    private logisticaService: LogisticsService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private direction: DirectionService, // @Inject(WINDOW) private window: Window
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['cart_id'] ? params['cart_id'] : params['cart-id'];
    });
    this.user = this.localS.get('usuario');

    let consulta: any = await this.cart.cargar_carro_oc(this.id).toPromise();
    this.cartSession = consulta.data.carro;
    this.total = consulta.data.total;
    await this.verificar_usuario();

    this.productCart = this.cartSession.productos;
    this.shippingType = this.cartSession.despacho.tipo;
    await this.getDireccion();
    this.cartSession.productos.map((producto: any) => {
      //asignando producto al carro
      producto.quantity = producto.cantidad;
      this.items.push(producto);
    });
    this.cartSession.grupos.forEach((item: any) => {
      this.fecha_entrega.push(item.despacho.fechaEntrega);
    });
    this.verificar_fechas();
  }

  async getDireccion() {
    let data = {
      rut: this.cartSession.cliente.rutCliente,
    };
    if (this.cartSession.despacho.tipo === 'STD') {
      let cliente: any = await this.clienteService
        .getDataClient(data)
        .toPromise();
      this.direccion = cliente.data[0].direcciones.filter(
        (item: any) => item.recid == this.cartSession.despacho.recidDireccion
      );
    } else {
      let consulta: any = await this.logisticaService
        .obtenerTiendasOmni()
        .toPromise();
      let tiendas: any = consulta.data;
      this.direccion = tiendas.filter(
        (item: any) => item.codigo == this.cartSession.codigoSucursal
      );
    }
  }

  async verificar_usuario() {
    if (!this.user.login_temp) {
      let consulta: any = await this.cart
        .verificar_supervisor(this.user.rut)
        .toPromise();
      this.usuario = consulta.data.filter(
        (item: any) => item.username == this.user.username
      );
      if (this.usuario.length == 0) {
        this.propietario = false;
        return;
      }

      if (this.usuario[0].credito) {
        if (
          this.total.total >= this.usuario[0].credito.de &&
          (this.total.total < this.usuario[0].credito.hasta ||
            this.usuario[0].credito.hasta === -1)
        ) {
          this.credito = false;
        } else {
          this.credito = true;
        }
      } else {
        this.credito = true;
      }
    } else {
      this.localS.set('ruta', ['/', 'carro-compra', `confirmar-orden-oc`]);
      this.localS.set('queryParams', { cart_id: this.id });
      this.usuarioTemp = true;
    }
  }

  async validaLogin($event: any) {
    console.log($event);
    if ($event) {
      this.usuarioTemp = !$event;
      this.user = this.localS.get('usuario');
      await this.verificar_usuario();
    }
  }

  async aceptar_compra() {
    let formOv = {
      user_role: this.user.user_role,
      id: this.cartSession._id,
      file: this.cartSession.ordenCompra.file,
      centroCosto: this.cartSession.ordenCompra.centroCosto,
      folio: this.cartSession.ordenCompra.folio,
      monto: this.cartSession.ordenCompra.monto,
      credito: true,
    };

    let consulta: any = await this.cart.subeOrdenDeCompra(formOv).toPromise();
    this.verificar_oc = true;
  }

  async confirmar(event: any) {
    this.verificar_oc = event;
    if (this.verificar_oc) await this.confirmar_compra();
  }

  async confirmar_compra() {
    this.loadingText = 'Generando orden de compra...';

    // genera la orden de compra
    const data = {
      id: this.cartSession._id,
      usuario: this.user.username,
      rutCliente: this.user.rut,
      tipo: 2,
      formaPago: 'OC',
      web: 1,
      proveedorPago: 'Orden de compra',
    };

    this.loadingPage = true;
    //modificar pasos

    let r: any = await this.cart.generaOrdenDeCompra(data).toPromise();

    this.loadingPage = false;

    let cart_id = this.cartSession._id;
    if (r.error) {
      this.toast.error(r.msg);
      return;
    }

    if (!r.error) {
      let params = {
        site_id: 'OC',
        external_reference: cart_id,
        status: 'approved',
      };

      this.router.navigate(['/', 'carro-compra', 'gracias-por-tu-compra'], {
        queryParams: { ...params },
      });
    }
  }

  agregar_lista(event: any) {
    this.productoDisponible = event;
  }

  addList() {
    this.addingToCart = true;

    this.cart.addLista(this.productoDisponible).subscribe((resp) => {
      this.addingToCart = false;
      if (!resp.error) {
        this.toast.success('producto añadido para solicitar nueva compra');
      }
    });
  }
  verificarOc(event: any) {
    this.sinStock = event;
  }

  verificar_fechas() {
    this.cartSession.grupos.forEach((item: any) => {});
  }

  Ver_fecha(event: any) {
    this.fechas = event;
    console.log(this.fechas);
  }
  setSeleccionarEnvio(event: any, i: any) {
    this.cartSession.grupos[i].despacho.fechaEntrega = event.fecha;
    this.fecha_entrega[i] = event.fecha;
  }

  refuseOrder() {
    this.modalRefuseRef = this.modalService.show(this.modalRefuse);
  }

  confirmRefuseOrder() {
    const data = {
      id: this.cartSession._id,
      observacion: this.obsRefuse,
    };

    this.loadingPage = true;
    this.cart.refuseOrder(data).subscribe(
      (r: ResponseApi) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);
          return;
        }

        this.toast.success('Solicitud rechazada correctamente');
        this.modalRefuseRef.hide();
        this.router.navigate(['/', 'inicio']);
      },
      (e) => {
        this.toast.error('Ha ocurrido un error al rechazar la orden de venta');
      }
    );
  }
}
