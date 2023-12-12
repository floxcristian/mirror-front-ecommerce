// Angular
import { Component, OnInit, AfterViewInit } from '@angular/core';
// Rxjs
import { Subscription, first } from 'rxjs';
// Models

// Services
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { DirectionService } from '../../../../shared/services/direction.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { PageHomeService } from '../../services/pageHome.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { CmsService } from '@core/services-v2/cms.service';
import { IPage } from '@core/models-v2/cms/homePage-response.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';

import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
@Component({
  selector: 'app-page-home-template',
  templateUrl: './page-home-template.component.html',
  styleUrls: ['./page-home-template.component.scss'],
})
export class PageHomeTemplateComponent implements OnInit, AfterViewInit {
  preferenciasCliente!: PreferenciasCliente;
  user!: ISession;

  //declarando la variable para ver los tipos
  carga: boolean = true;
  pageHome: IPage[] = [];

  constructor(
    private root: RootService,
    private logisticsService: LogisticsService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly csmService: CmsService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly geolocationStorage: GeolocationStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.geolocationService.stores$
      .pipe(first((stores) => stores.length > 0))
      .subscribe({
        next: () => {
          this.user = this.sessionService.getSession();
          const geo = this.geolocationStorage.get();
          if (geo) {
            if (this.user.documentId !== '0') {
              this.root.getPreferenciasCliente().then((preferencias) => {
                this.preferenciasCliente = preferencias;
                this.cargarPage();
              });
            } else {
              this.cargarPage();
            }
          } else {
            console.log('cargarPage 2');
            this.cargarPage();
          }
        },
      });
  }

  ngAfterViewInit(): void {
    this.geolocationService.selectedStore$.subscribe({
      next: (location) => {
        console.log('location: ', location);
        console.log('cargarPage 3');
        this.cargarPage();
      },
    });

    this.authStateService.session$.subscribe(() => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        console.log('cargarPage 4');
        this.cargarPage();
      });
    });

    this.logisticsService.direccionCliente$.subscribe((r) => {
      this.preferenciasCliente.direccionDespacho = r;
      console.log('cargarPage 5');
      this.cargarPage();
    });
  }

  async cargarPage() {
    this.carga = true;
    const rut = this.user.documentId;
    console.log('getSelectedStore desde PageHomeTemplateComponent');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.code;
    const localidad = this.preferenciasCliente?.direccionDespacho
      ? this.preferenciasCliente.direccionDespacho.city
      : '';
    this.csmService.getHomePage(rut, sucursal, localidad).subscribe({
      next: (res) => {
        this.pageHome = res.data[0].page;
        this.carga = false;
        this.scrollToTop();
      },
      error: (err) => {},
    });
  }

  scrollToTop(): void {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
}
