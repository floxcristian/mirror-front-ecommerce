import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {
  IShoppingCart,
  IShoppingCartProduct,
  IShoppingCartTripDate,
} from '@core/models-v2/cart/shopping-cart.interface';
import { DeliveryModeType } from '@core/enums/delivery-mode.enum';
import { CartService } from '@core/services-v2/cart.service';
import { GetLogisticPromiseRequest } from '@core/models-v2/requests/cart/logistic-promise-request';
import { ToastrService } from 'ngx-toastr';
import { GetLogisticPromiseResponse } from '@core/models-v2/responses/logistic-promise-responses';
import { CustomerAddressApiService } from '@core/services-v2/customer-address/customer-address-api.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { ITotals } from '@core/models-v2/cart/totals.interface';
import { ShippingService } from '@shared/interfaces/address';
import * as moment from 'moment';

interface IAddressDestination {
  address: string;
  destination: string;
}

@Component({
  selector: 'app-detalle-carro-productos-oc',
  templateUrl: './detalle-carro-productos-oc.component.html',
  styleUrls: ['./detalle-carro-productos-oc.component.scss'],
})
export class DetalleCarroProductosOcComponent implements OnInit {
  @Input() show = true;
  @Input() productCart!: IShoppingCartProduct[];
  @Input() CartSession!: IShoppingCart;
  @Input() total!: ITotals;
  @Input() seeProducts = true;
  @Input() seePrices = true;
  @Output() sinStock: EventEmitter<any> = new EventEmitter();
  @Output() fechas: EventEmitter<ShippingService[][]> = new EventEmitter();
  products: IShoppingCartProduct[] = [];

  shippingNotSupported: IShoppingCartProduct[] = [];
  productosCarro: IShoppingCartProduct[] = [];
  @Output() productosDisponible: EventEmitter<IShoppingCartProduct[]> =
    new EventEmitter();
  productosSinCumplir: any = [];
  @Input() shippingType = 'retiro';
  @Input() cart!: IShoppingCart;

  constructor(
    public router: Router,
    private readonly toastr: ToastrService,
    // Services V2
    private readonly cartService: CartService,
    private readonly customerAddressService: CustomerAddressApiService,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  async ngOnInit() {
    this.products = this.productCart;
    await this.calculateLogisticPromise();
  }

  async calculateLogisticPromise() {
    const deliveryMode =
      this.cart.shipment?.deliveryMode ?? DeliveryModeType.PICKUP;
    const addressId = this.cart.shipment?.addressId ?? '';
    const { address, destination } = await this.getAddressAndDestination(
      deliveryMode,
      addressId
    );

    const request: GetLogisticPromiseRequest = {
      shoppingCartId: this.cart._id!.toString(),
      user: this.cart.user,
      deliveryMode: deliveryMode,
      addressId: addressId,
      address: address,
      destination: destination,
    };

    this.cartService.logisticPromise(request).subscribe({
      next: (response) => {
        this.handleLogisticPromiseResponse(response);
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('No se pudo calcular la promesa logística');
      },
    });
  }

  private handleLogisticPromiseResponse(response: GetLogisticPromiseResponse) {
    const shoppingCart = response.shoppingCart;
    this.cart = shoppingCart;

    const dia_despacho: ShippingService[][] = [];
    shoppingCart.groups?.forEach((g) => {
      const dia_despacho_grupo: ShippingService[] = [];
      g.tripDates.forEach((item: IShoppingCartTripDate, index) => {
        let isSabado = this.valFindeSemana(item.requestedDate.toString());
        const obj: ShippingService = {
          index: index,
          id: g.id,
          diasdemora: item.businessDays,
          fecha: item.requestedDate,
          fechaPicking: item.pickingDate,
          origen: g.warehouse,
          precio: item.price,
          proveedor: item.carrier.description,
          tipoenvio: g.shipment.deliveryMode,
          tipopedido: g.shipment.deliveryMode,
          isSabado: isSabado,
        };

        dia_despacho_grupo.push(obj);
      });
      dia_despacho.push(dia_despacho_grupo);
    }) ?? [];

    this.fechas.emit(dia_despacho);

    this.productosCarro = [...shoppingCart.products];
    this.productosCarro = this.productosCarro.filter(
      (x) => !x.deliveryConflict
    );
    this.products = [...this.productosCarro];
    this.productosDisponible.emit(this.products);
    this.productosSinCumplir = this.productosCarro.filter(
      (x) => x.deliveryConflict
    );

    this.shippingNotSupported = [...this.productosSinCumplir];
    if (this.shippingNotSupported.length > 0) {
      this.sinStock.emit(true);
    } else this.sinStock.emit(false);
  }

  async getAddressAndDestination(
    deliveryMode: string,
    addressId: string
  ): Promise<IAddressDestination> {
    const documentId = this.cart.customer?.documentId ?? '';
    if (deliveryMode === DeliveryModeType.DELIVERY) {
      const addresses = await firstValueFrom(
        this.customerAddressService.getDeliveryAddresses(documentId)
      );
      if (addresses.length) {
        let addressInfo = addresses.find((item) => item.id == addressId);
        addressInfo = addressInfo ? addressInfo : addresses[0];

        const address = addressInfo.address;
        const destination = `${addressInfo.city
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')}|${
          addressInfo.regionCode ? addressInfo.regionCode : ''
        }`;

        return { address, destination };
      }
    } else {
      const stores = await firstValueFrom(
        this.geolocationApiService.getStores()
      );
      let addressInfo = stores.find(
        (item) => item.code == this.cart.branchCode
      );

      addressInfo = addressInfo ? addressInfo : stores[0];
      const address = addressInfo.address;
      const destination = addressInfo.code + '|' + addressInfo.regionCode;

      return { address, destination };
    }
    return { address: '', destination: '' };
  }

  valFindeSemana(fecha: string) {
    let isSabado = false;

    let dia =
      fecha && fecha.length > 0
        ? moment(fecha).locale('es').format('dddd')
        : null;
    isSabado = dia && dia === 'sábado' ? true : false;

    return isSabado;
  }
}
