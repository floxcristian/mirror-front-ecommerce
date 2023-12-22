import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
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
  @Output() fechas: EventEmitter<IShoppingCartTripDate[][]> =
    new EventEmitter();
  products: IShoppingCartProduct[] = [];

  shippingNotSupported: IShoppingCartProduct[] = [];
  itemSubscription!: Subscription;
  shippingTypeSubs!: Subscription;
  shippinGroup: any = {};
  productosCarro: IShoppingCartProduct[] = [];
  @Output() productosDisponible: EventEmitter<IShoppingCartProduct[]> =
    new EventEmitter();
  productosSinCumplir: any = [];
  @Input() shippingType = 'retiro';
  @Input() cart!: IShoppingCart;
  shippingTypeTitle = '';
  totals: any = [];

  constructor(
    public router: Router,
    private readonly toastr: ToastrService,
    // Services V2
    private readonly cartService: CartService,
    private readonly customerAddressService: CustomerAddressApiService,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  async ngOnInit() {
    await this.total;
    await this.productCart;

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

    const tripDatesSubOrder: IShoppingCartTripDate[][] = [];
    shoppingCart.groups?.forEach((g) => tripDatesSubOrder.push(g.tripDates)) ??
      [];
    this.fechas.emit(tripDatesSubOrder);

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
}
