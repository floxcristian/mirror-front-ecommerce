import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BusquedasRecientesModalComponent } from '../../../../../header/components/search-vin-b2b/components/barra-busqueda/components/busquedas-recientes-modal/busquedas-recientes-modal.component';
import { AddFlotaModalComponent } from '../../../../../../shared/components/add-flota-modal/add-flota-modal.component';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../../../shared/components/modal/modal.component';
import { DropdownDirective } from '../../../../../../shared/directives/dropdown.directive';
import {
  Flota,
  MarcaModeloAnio,
} from '../../../../../../shared/interfaces/flota';
import { Usuario } from '../../../../../../shared/interfaces/login';
import { ResponseApi } from '../../../../../../shared/interfaces/response-api';
import {
  BuscadorService,
  BusquedaData,
} from '../../../../../../shared/services/buscador.service';
import { ClientsService } from '../../../../../../shared/services/clients.service';
import { ProductsService } from '../../../../../../shared/services/products.service';
import { RootService } from '../../../../../../shared/services/root.service';
import { isVacio } from '../../../../../../shared/utils/utilidades';

@Component({
  selector: 'app-mobile-barra-busqueda',
  templateUrl: './mobile-barra-busqueda.component.html',
  styleUrls: ['./mobile-barra-busqueda.component.scss'],
})
export class MobileBarraBusquedaComponent implements OnInit {
  @ViewChild(DropdownDirective, { static: false })
  dropdown!: DropdownDirective;

  filtro!: Flota | undefined;
  marcaModeloAnio!: MarcaModeloAnio | undefined;
  textToSearch = '';
  filtroFlota!: string;

  usuario!: Usuario;
  busquedas: Flota[] = [];
  flota: Flota[] = [];
  flotaFiltrada: Flota[] = [];
  textoFiltro!: string;

  destroy$: Subject<boolean> = new Subject<boolean>();
  private buscadorExternoRef!: Subscription;

  categorias: any[] = [];
  // public marcas = [];
  productosEncontrados = [];
  searchControl!: FormControl;
  searchControl1!: FormControl;
  // public linkBusquedaProductos = '#';
  buscando = true;
  cargando = true;
  debounce = 1000;

  isVacio = isVacio;

  constructor(
    private toastr: ToastrService,
    private root: RootService,
    private productsService: ProductsService,
    private modalService: BsModalService,
    private clientsService: ClientsService,
    private buscadorService: BuscadorService,
    private router: Router,
    public modalRef: BsModalRef
  ) {}

  async ngOnInit() {
    this.creaTextoFiltro();
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query: any) => {
        if (query.trim() !== '') {
          this.textToSearch = query;
          this.buscarSelect();
        } else {
          this.categorias = [];
          this.productosEncontrados = [];
        }
      });

    this.searchControl1 = new FormControl('');
    this.searchControl1.valueChanges.subscribe((query: any) => {
      if (!isVacio(query)) {
        this.filtrarFlota(query);
      } else {
        this.filtrarFlota('');
      }
    });

    this.usuario = this.root.getDataSesionUsuario();
    await this.getDataDropDown();

    this.buscadorExternoRef = this.buscadorService.buscadorExterno$.subscribe(
      (data: BusquedaData) => {
        data.word = this.textToSearch;
        this.buscadorService.buscar(data);
      }
    );

    const url = this.router.parseUrl(this.router.url);

    if (url.root.children['primary'].segments.length >= 2) {
      if (
        url.root.children['primary'].segments[0].path === 'inicio' &&
        url.root.children['primary'].segments[1].path === 'productos'
      ) {
        if (url.root.children['primary'].segments[2].path === 'todos') {
          this.textToSearch = '';
        } else {
          if (url.root.children['primary'].segments[2].path !== 'ficha') {
            this.textToSearch = url.root.children['primary'].segments[2].path;
          } else {
            this.textToSearch = '';
          }
        }
      }
    }
    if (!isVacio(url.queryParams)) {
      if (!isVacio(url.queryParams['chassis'])) {
        const f = this.flota.find(
          (e: any) => e.vehiculo.chasis === url.queryParams['chassis']
        );
        const b = this.busquedas.find(
          (e: any) => e.vehiculo.chasis === url.queryParams['chassis']
        );

        if (!isVacio(f)) {
          this.seleccionaFiltro(f || null);
        } else if (!isVacio(b)) {
          this.seleccionaFiltro(b || null);
        } else {
          this.seleccionaFiltro(null);
        }
      } else {
        if (!isVacio(url.queryParams['marca'])) {
          const data: MarcaModeloAnio = {
            marca: url.queryParams['marca'],
            modelo: url.queryParams['modelo'],
            anio: url.queryParams['anio'],
          };
          this.marcaModeloAnio = data;
          this.creaTextoFiltro();
        }
      }
    }
  }

  filtrarFlota(texto: string) {
    if (!isVacio(texto.trim())) {
      this.flotaFiltrada = [];
      this.flotaFiltrada = this.flota.filter(
        (f) =>
          f.alias?.toLowerCase().includes(texto.toLowerCase()) ||
          f.vehiculo?.chasis.toLowerCase().includes(texto.toLowerCase()) ||
          f.vehiculo?.marca.toLowerCase().includes(texto.toLowerCase()) ||
          f.vehiculo?.tipo.toLowerCase().includes(texto.toLowerCase()) ||
          f.vehiculo?.anio
            .toString()
            .toLowerCase()
            .includes(texto.toLowerCase())
      );
    } else {
      this.flotaFiltrada = this.flota;
    }
  }

  verMas() {
    const initialState = {
      busquedasRecientes: this.busquedas,
    };
    this.modalService.show(BusquedasRecientesModalComponent, {
      initialState,
      class: 'modal-lg mx-md-auto',
    });
  }

  ngOnDestroy(): void {
    if (!isVacio(this.buscadorExternoRef)) {
      this.buscadorExternoRef.unsubscribe();
    }
  }

  /* busqueda en el dropdown de la barra principal de busqueda */
  buscarSelect() {
    if (
      isVacio(this.textToSearch) &&
      (isVacio(this.filtro) || isVacio(this.marcaModeloAnio))
    ) {
      return;
    }
    if (this.textToSearch.length < 4) return;
    const request = {
      chassis: !isVacio(this.filtro) ? this.filtro?.vehiculo?.chasis : '',
      word: this.textToSearch !== '' ? this.textToSearch : '',
    };

    if (!isVacio(this.filtro)) {
      this.productsService
        .buscaPorVimNum(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (r: any) => {
            this.dropdown.open();

            this.categorias = r.categorias;
            // this.marcas = r.marcas;
            this.productosEncontrados = r.articulos;

            if (this.productosEncontrados.length === 0) {
              this.buscando = false;
            }

            // se arma link de categorias dentro del dropdown
            this.categorias.map((item) => {
              item.url = [
                '/',
                'inicio',
                'productos',
                this.textToSearch,
                'categoria',
                item.slug,
              ];
              item.queryParams = {};
              item.queryParams = this.armaQueryParams(item.queryParams);

              if (typeof item.name === 'undefined') {
                item.name = 'Sin categorias';
              }
            });
          },
          (error) => {
            this.toastr.error('Error de conexión con el servidor de Elastic');
            console.error('Error de conexión con el servidor de Elastic');
          }
        );
    } else {
      this.productsService
        .buscaListadoProducto(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (r: any) => {
            this.dropdown.open();

            this.categorias = r.categorias;
            // this.marcas = r.marcas;
            this.productosEncontrados = r.articulos;

            if (this.productosEncontrados.length === 0) {
              this.buscando = false;
            }

            // se arma link de categorias dentro del dropdown
            this.categorias.map((item) => {
              item.url = [
                '/',
                'inicio',
                'productos',
                this.textToSearch,
                'categoria',
                item.slug,
              ];
              item.queryParams = {};
              item.queryParams = this.armaQueryParams(item.queryParams);

              if (typeof item.name === 'undefined') {
                item.name = 'Sin categorias';
              }
            });
          },
          (error) => {
            this.toastr.error('Error de conexión con el servidor de Elastic');
            console.error('Error de conexión con el servidor de Elastic');
          }
        );
    }
  }

  /* Boton 'Lupa' - busca por word + chassis y numeroParte y redirecciona */
  buscar() {
    if (
      isVacio(this.textToSearch.trim()) &&
      isVacio(this.filtro) &&
      isVacio(this.marcaModeloAnio)
    ) {
      this.toastr.info(
        'Debe ingresar un texto para buscar o seleccionar un filtro.',
        'Información'
      );
      return;
    }
    const search = this.textToSearch.replace('/', '%2F');

    const data: BusquedaData = {
      filtro: this.filtro,
      marcaModeloAnio: this.marcaModeloAnio,
      word: search,
    };

    this.buscadorService.buscar(data);
  }

  seleccionaFiltro(filtro: Flota | null) {
    if (filtro === null) {
      this.filtro = undefined;
      this.marcaModeloAnio = undefined;
      this.buscadorService.filtrosExternosVisibles(true);
      this.buscadorService.setFiltro(false);
    } else {
      this.filtro = filtro;
      this.marcaModeloAnio = undefined;
      this.buscadorService.filtrosExternosVisibles(false);
      this.buscadorService.setFiltro(true);
    }

    this.creaTextoFiltro();
  }

  async getDataDropDown() {
    this.cargando = true;
    const busquedas: ResponseApi = (await this.clientsService
      .getBusquedasVin(this.usuario.rut || '')
      .toPromise()) as ResponseApi;
    const flota: ResponseApi = (await this.clientsService
      .getFlota(this.usuario.rut || '')
      .toPromise()) as ResponseApi;

    this.busquedas = busquedas.data;
    this.flota = flota.data;
    this.filtrarFlota('');

    this.cargando = false;
  }

  creaTextoFiltro() {
    if (!isVacio(this.marcaModeloAnio)) {
      this.textoFiltro = `${this.marcaModeloAnio?.marca} / ${this.marcaModeloAnio?.modelo} / ${this.marcaModeloAnio?.anio}`;
    } else {
      if (isVacio(this.filtro)) {
        this.textoFiltro = 'Seleccione Vehículo';
      } else {
        if (!isVacio(this.filtro?.alias)) {
          const alias =
            this.filtro?.alias?.charAt(0).toUpperCase() ||
            '' + this.filtro?.alias?.slice(1) ||
            '';
          this.textoFiltro = `${alias}<br><small>${this.filtro?.vehiculo?.marca} / ${this.filtro?.vehiculo?.tipo} / ${this.filtro?.vehiculo?.anio}</small>`;
        } else {
          this.textoFiltro = `${this.filtro?.vehiculo?.marca} / ${this.filtro?.vehiculo?.tipo} / ${this.filtro?.vehiculo?.anio}<br><small>${this.filtro?.vehiculo?.chasis}</small>`;
        }
      }
    }
  }

  agregarVinFlota(busqueda: Flota) {
    const initialState = {
      vin: busqueda?.vehiculo?.chasis,
      closeToOk: false,
    };
    const bsModalRef: BsModalRef = this.modalService.show(
      AddFlotaModalComponent,
      { initialState, class: 'mx-md-auto' }
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const request: any = {
          idFlota: busqueda._id,
          alias: res,
        };
        const respuesta: any = await this.clientsService
          .setFlota(request)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('VIN guardado exitosamente.');
          this.busquedas.splice(this.busquedas.indexOf(busqueda), 1);
          if (!isVacio(this.filtro)) {
            if (this.filtro?._id === busqueda._id) {
              if (this.filtro) {
                this.filtro.alias = res;
              }
              this.creaTextoFiltro();
            }
          }
          bsModalRef.hide();
          this.getDataDropDown();
        }
      }
    });
  }

  eliminarVinBusqueda(busqueda: Flota) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> el VIN ${busqueda?.vehiculo?.chasis} de las busquedas recientes?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      class: 'mx-md-auto',
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteBusquedaVin(busqueda)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('VIN eliminado exitosamente.');
          this.busquedas.splice(this.busquedas.indexOf(busqueda), 1);
          if (!isVacio(this.filtro)) {
            if (this.filtro?._id === busqueda._id) {
              this.clearFiltro();
            }
          }
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }

  clearFiltro() {
    this.seleccionaFiltro(null);
    this.textToSearch = '';
    this.filtroFlota = '';
    this.router.navigate(['inicio']);
  }

  reset() {
    this.buscando = true;
  }

  armaQueryParams(queryParams: any) {
    if (!isVacio(this.filtro)) {
      queryParams = {
        ...queryParams,
        ...{ chassis: this.filtro?.vehiculo?.chasis },
      };
    }
    if (!isVacio(this.marcaModeloAnio)) {
      queryParams = {
        ...queryParams,
        ...{ marca: this.marcaModeloAnio?.marca },
      };
      queryParams = {
        ...queryParams,
        ...{ modelo: this.marcaModeloAnio?.modelo },
      };
      queryParams = {
        ...queryParams,
        ...{ anio: this.marcaModeloAnio?.anio },
      };
    }

    return queryParams;
  }
}
