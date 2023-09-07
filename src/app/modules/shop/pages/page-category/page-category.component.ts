import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, ProductCategory } from '../../../../shared/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductFilter,
  ProductFilterCategory,
  ProductFilterCheckbox,
  ProductFilterCheckboxFlota
} from '../../../../shared/interfaces/product-filter';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { Category } from '../../../../shared/interfaces/category';
import { Usuario } from '../../../../shared/interfaces/login';
import { ElasticSearch } from '../../../../shared/interfaces/search';
import { LoginService } from '../../../../shared/services/login.service';
import { CapitalizeFirstPipe } from '../../../../shared/pipes/capitalize.pipe';
import { sort } from 'fast-sort';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { CartService } from '../../../../shared/services/cart.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../../../shared/services/seo.service';
import { CanonicalService } from '../../../../shared/services/canonical.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { isVacio } from '../../../../shared/utils/utilidades';

import { LogisticsService } from '../../../../shared/services/logistics.service';
import { Subscription } from 'rxjs';
import { Flota } from '../../../../shared/interfaces/flota';
import { ClientsService } from '../../../../shared/services/clients.service';
import { BuscadorService } from '../../../../shared/services/buscador.service';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-grid',
  templateUrl: './page-category.component.html',
  styleUrls: ['./page-category.component.scss'],
})
export class PageCategoryComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  ultimosProductos!: Product[];
  filters: ProductFilter[] = [];
  // filtersCache: ProductFilter[] = [];
  filterCategories: Category[] = [];
  // filtrosBusquedaProducto = [];
  filterQuery: any;
  filterQueryVehicle: any;
  removableFilters: any = [];
  removableFiltersFlota: any = [];
  removableCategory: any = [];
  columns: 3 | 4 | 5 = 3;
  viewMode: 'grid' | 'grid-with-features' | 'list' = 'grid';
  sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
  filtroCatalogo: any;
  breadcrumbs:any[] = [];
  productosTemp = [];
  // Paginacion
  totalPaginas = 0;
  PagDesde = 0;
  PagHasta = 0;
  PagTotalRegistros = 0;
  productosPorPagina = 12;
  cargandoCatalogo = true;
  cargandoProductos = false;
  currentPage = 1;

  // Filtro
  categories: Category[] = [];
  productoCategoria!: Product;
  parametrosBusqueda!: ElasticSearch;
  textToSearch = '';
  levelCategories: ProductCategory[] = [];
  level = 0;
  // filtros vehiculo
  chassis: string[] = [];
  anio = '';
  marca = '';
  modelo = '';
  filtrosFlota!: Flota[];
  filtrosBusquedas!: Flota[];
  isB2B: boolean;

  despachoCliente!: Subscription;

  filtersVehicle = [
    'chassis',
    'anio',
    'marca',
    'modelo'
  ];

  paramsCategory = {
    firstCategory: '',
    secondCategory: '',
    thirdCategory: ''
  };

  filtersIgnored = ['CERTIFICADO PDF', 'JEFE DE LINEA', 'TIPO PRECIO', 'TIPO ESTADO'];

  visibleFilter = false;
  filtrosOculto = true;
  filtrosVehiculoVisibles = false;
  scrollPosition!: number;
  innerWidth: number;

  origen!: any[];
  usuario: Usuario;
  preferenciaCliente!: PreferenciasCliente;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private root: RootService,
    private localS: LocalStorageService,
    private loginService: LoginService,
    private capitalize: CapitalizeFirstPipe,
    private cartService: CartService,
    private geoLocationService: GeoLocationService,
    private logistic: LogisticsService,
    private titleService: Title,
    private seoService: SeoService,
    private canonicalService: CanonicalService,
    private clientsService: ClientsService,
    private buscadorService: BuscadorService
  ) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1025) {
      this.productosPorPagina = 12;
    } else {
      this.productosPorPagina = 25;
    }
    this.usuario = this.root.getDataSesionUsuario();
    this.isB2B = this.usuario.user_role === 'supervisor' || this.usuario.user_role === 'comprador';
    if (this.isB2B) {
      this.preferenciaCliente = this.localS.get('preferenciasCliente');
    }
  }

  ngOnDestroy(): void {
    if (!this.buscadorService.isFiltroSeleccionado()) {
      this.buscadorService.filtrosVisibles(true);
    }
    this.despachoCliente.unsubscribe();
  }

  async ngOnInit() {
    this.usuario = this.root.getDataSesionUsuario();
    this.route.data.subscribe(data => {
      this.columns = 'columns' in data ? data['columns'] : this.columns;
      this.viewMode = 'viewMode' in data ? data['viewMode'] : this.viewMode;
      this.sidebarPosition = 'sidebarPosition' in data ? data['sidebarPosition'] : this.sidebarPosition;
    });

    this.buscadorService.buscadorFiltrosExternosVisibles$.subscribe((data: boolean) => {
      this.filtrosVehiculoVisibles = data;
    });

    this.filtrosFlota = ((await this.clientsService.getFlota(this.usuario.rut || '0').toPromise()) as ResponseApi).data;
    this.filtrosBusquedas = ((await this.clientsService.getBusquedasVin(this.usuario.rut || '0').toPromise()) as ResponseApi).data;

    let metadataCount = 0;
    this.route.queryParams.subscribe(query => {
      // Seteamos el origen del buscador
      this.setOrigenes();

      // Se cargan los queryParams entrantes
      this.marca = query['marca'] ? query['marca'] : '';
      this.modelo = query['modelo'] ? query['modelo'] : '';
      this.anio = query['anio'] ? query['anio'] : '';
      if (!isVacio(query['chassis'])) {
        if (Array.isArray(query['chassis'])) {
          query['chassis'].forEach(element => {
            this.chassis.push(element);
          });
        } else {
          this.chassis.push(query['chassis']);
        }
      }

      // control del componente filtros
      if (isVacio(this.chassis) && isVacio(this.marca) && isVacio(this.modelo) && isVacio(this.anio)) {
        if (this.buscadorService.isFiltroSeleccionado()) {
          this.filtrosVehiculoVisibles = false;
        } else {
          this.filtrosVehiculoVisibles = true;
        }
      } else {
        this.filtrosVehiculoVisibles = false;
      }
      this.buscadorService.filtrosVisibles(false);

      //this.route.queryParams.subscribe();
      // Verificamos si viene la pagina en un queryparams. sino la reseteamos a la pagina 1.
      if (query['_value']?.hasOwnProperty('page')) {
        this.currentPage = query['_value']['page'];
      } else {
        this.currentPage = 1;
      }

      // 01. Marca
      if (query['_value'].hasOwnProperty('filter_MARCA')) {
        const marca = query['_value']['filter_MARCA'];
        const meta = {
          title: marca,
          description: 'Productos marca "title"',
          keywords: 'repuestos ' + marca
        };
        this.seoService.generarMetaTag(meta);
        metadataCount++;
      }

      this.reinicaFiltros();
      this.filterQuery = this.getFiltersQuery(query);
      this.filterQueryVehicle = this.getFiltersQuery(query, 'vehiculo');

      if (
        typeof this.parametrosBusqueda !== 'undefined' &&
        (this.parametrosBusqueda.word === this.route.snapshot.paramMap.get('busqueda') ||
          this.route.snapshot.paramMap.get('busqueda') === 'todos')
      ) {
        const params: any = this.cleanFilterSearchParams(this.parametrosBusqueda);

        this.removableFilters = this.filterQuery;
        this.removableFiltersFlota = this.filterQueryVehicle;

        this.parametrosBusqueda = { ...params, ...this.filterQuery, ...this.filterQueryVehicle };
        this.parametrosBusqueda.page = this.currentPage;
        this.cargarCatalogoProductos(this.parametrosBusqueda, '');
      }
    });

    this.route.params.subscribe(params => {
      this.reinicaFiltros();
      if (params['busqueda'] && params['metodo'] && params['metodo'] === 'categoria') {
        // 02. Categoria

        this.textToSearch = params['busqueda'] === 'todos' ? '' : params['busqueda'];

        let category = params['nombre'];
        this.paramsCategory.firstCategory = category;

        if (params['secondCategory']) {
          category = params['secondCategory'];
          this.paramsCategory.secondCategory = params['secondCategory'];
        }
        if (params['thirdCategory']) {
          category = params['thirdCategory'];
          this.paramsCategory.thirdCategory = params['thirdCategory'];
        }

        let parametros = {};
        const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
        const sucursal = tiendaSeleccionada?.codigo;
        if (this.isB2B) {
          parametros = {
            categoria: category,
            word: this.textToSearch,
            localidad: this.preferenciaCliente.direccionDespacho?.comuna.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            sucursal: sucursal,
            pageSize: this.productosPorPagina,
            rut: this.usuario.rut
          };
        } else {
          parametros = {
            categoria: category,
            word: this.textToSearch,
            sucursal: sucursal,
            pageSize: this.productosPorPagina,
            rut: this.usuario.rut
          };
        }

        this.setBreadcrumbs();
        this.removableFilters = this.filterQuery;
        this.removableFiltersFlota = this.filterQueryVehicle;
        this.parametrosBusqueda = { ...parametros, ...this.filterQuery, ...this.filterQueryVehicle };
        this.parametrosBusqueda.page = this.currentPage;

        this.cargarCatalogoProductos(this.parametrosBusqueda, this.textToSearch + ' ' + category);

        // SEO

        this.getDetalleSeoCategoria(category);
      } else {
        // 03. Búsqueda

        if (params['busqueda']) {
          this.textToSearch = params['busqueda'] === 'todos' ? '' : params['busqueda'];
          let parametros = {};
          const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
          if (this.isB2B) {
            parametros = {
              categoria: '',
              word: this.textToSearch,
              localidad: this.preferenciaCliente.direccionDespacho?.comuna.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
              sucursal: tiendaSeleccionada?.codigo,
              pageSize: this.productosPorPagina,
              rut: this.usuario.rut
            };
          } else {
            parametros = {
              categoria: '',
              word: this.textToSearch,
              pageSize: this.productosPorPagina,
              sucursal: tiendaSeleccionada?.codigo,
              rut: this.usuario.rut
            };
          }
          this.removableFilters = this.filterQuery;
          this.removableFiltersFlota = this.filterQueryVehicle;
          this.parametrosBusqueda = { ...parametros, ...this.filterQuery, ...this.filterQueryVehicle };
          this.parametrosBusqueda.page = this.currentPage;

          this.cargarCatalogoProductos(this.parametrosBusqueda, this.textToSearch);

          // SEO
          if (metadataCount === 0) {
            if (this.textToSearch.trim() !== '') {
              this.titleService.setTitle('Resultados Búsqueda de ' + this.textToSearch);
            } else {
              this.titleService.setTitle('Resultados de Búsqueda - implementos.cl');
            }
            if (isPlatformBrowser(this.platformId)) {
              this.canonicalService.setCanonicalURL(location.href);
            }
            if (isPlatformServer(this.platformId)) {
              this.canonicalService.setCanonicalURL(environment.canonical + this.router.url);
            }
            const kwds = this.textToSearch.replace(/(\b(\w{1,3})\b(\s|$))/g, '');

            const meta = {
              title: this.textToSearch,
              description: this.textToSearch,
              keywords: kwds
            };
            this.seoService.generarMetaTag(meta);
            metadataCount++;
          }
        }
      }
    });

    // cuando se inicia sesion
    this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      this.reinicaFiltros();
      this.parametrosBusqueda.rut = usuario.rut || '0';
      this.cargarCatalogoProductos(this.parametrosBusqueda, '');
    });

    // cuando cambiamos sucursal
    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.reinicaFiltros();
      this.parametrosBusqueda.sucursal = r.tiendaSelecciona?.codigo || '';
      this.cargarCatalogoProductos(this.parametrosBusqueda, '');
    });
    this.despachoCliente = this.logistic.direccionCliente$.subscribe(r => {
      this.parametrosBusqueda.localidad = r.comuna.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      this.reinicaFiltros();
      this.cargarCatalogoProductos(this.parametrosBusqueda, '');
    });
  }

  private reinicaFiltros() {
    this.filterCategories = [];
    this.filters = [];
  }

  private cleanFilterSearchParams(params:any) {
    delete params.chassis;
    delete params.marca;
    delete params.modelo;
    delete params.anio;

    const filtered = Object.keys(params)
      .filter((key) => {
        if (key.startsWith('filter_') === false) {
          return true;
        }else{ return false}
      })
      .reduce((obj:any, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    return filtered;
  }

  cargarCatalogoProductos(parametros:any, texto:any, scroll = false) {
    this.parametrosBusqueda = parametros;
    this.removableCategory = [];
    this.filtrosOculto = true;

    if (texto.includes('SKU:')) {
      texto = texto.substring(4, texto.length);
      parametros.word = texto;
      this.productosTemp = texto.split(' ');
    }
    if (this.parametrosBusqueda.categoria !== '') {
      const cat = this.root.replaceAll(this.parametrosBusqueda.categoria, /-/g);
      this.removableCategory.push({ value: this.parametrosBusqueda.categoria, text: this.capitalize.transform(cat) });
      this.filtrosOculto = false;
    }

    // verificamos si esta la session iniciada
    const usuario: Usuario = this.localS.get('usuario');

    if (usuario != null) {
      this.parametrosBusqueda.rut = usuario.rut || '0';
    }

    // this.isLoadingSlider = true;

    if (!scroll) {
      this.parametrosBusqueda.page = 1;
      this.currentPage = 1;
      this.cargandoCatalogo = true;
    } else {
      this.cargandoProductos = true;
    }

    if (this.chassis.length > 0 || this.marca.length > 0 || this.modelo.length > 0 || this.anio.length > 0) {
      this.productsService.buscaPorVimNum(parametros).subscribe((r: any) => {
        this.SetProductos(r, texto, scroll);
      });
    } else {
      this.productsService.buscaListadoProducto(parametros).subscribe((r: any) => {
        this.SetProductos(r, texto, scroll);
      });
    }
  }

  SetProductos(r:any, texto:any, scroll = false) {
    this.cargandoCatalogo = false;
    this.cargandoProductos = false;

    // this.isLoadingSlider = false;
    if (scroll) {
      r.articulos.forEach((e:any) => {
        if (this.productosTemp.length > 0) {
          this.productosTemp.forEach(item => {
            if (item == e.sku) this.products.push(e);
          });
        } else {
          this.products.push(e);
        }
      });
    } else {
      this.products = [];
      r.articulos.forEach((e:any) => {
        this.productosTemp.forEach(item => {
          if (item == e.sku) this.products.push(e);
        });
      });
      if (this.products.length == 0) this.products = r.articulos;
    }
    if (this.products.length == 0) this.breadcrumbs = [];
    this.formatoPaginacion(r, texto);
    this.filters = [];
    this.formatFiltersFlota();
    this.formatCategories(r.categorias);
    this.formatFilters(r.filtros);
    this.agregarMatrizProducto(r.articulos);
  }

  private agregarMatrizProducto(productos:any) {
    if (productos.length === 1) {
      const producto: Product = productos[0];
      this.productsService.getMatrixProducts({ sku: producto.sku }).subscribe((r: ResponseApi) => {
        // console.log(r.data);
        for (const item of r.data) {
          this.products.push(item);
        }
      });
    }
  }

  private formatoPaginacion(r:any, texto:any) {
    const pagina = r.page;
    this.PagDesde = pagina === 1 ? 1 : (pagina - 1) * r.pageSize + 1;
    this.PagHasta = pagina * r.pageSize;

    if (this.PagHasta > r.totalResult) {
      this.PagHasta = r.totalResult;
    }

    this.totalPaginas = r.totalPages;
    this.PagTotalRegistros = r.totalResult;
    //console.log(this.PagTotalRegistros);
    if (texto != '' && r != null) {
      const user: Usuario = this.localS.get('usuario');
      if (user != null) {
        const parametro = {
          _id: user.email,
          busqueda: texto,
          resultado: this.PagTotalRegistros
        };
        this.cartService.agregaBusqueda(parametro).subscribe(dat => {});
      }
    }
  }

  addLevel(categories: ProductCategory[], level:any, catId:any) {
    const arr:any[] = [];
    categories.map((item, index) => {
      if (item.level === level && catId === item.parent) {
        arr.push(item);
      }
    });
    return arr;
  }

  private proccesingLevel(categories: ProductCategory[]) {
    // Guardamos las categorias nivel 1
    categories.map((item, index) => {
      if (item.level === 1) {
        this.levelCategories.push(item);
      }
    });

    // Guardamos las categorias nivel  2
    this.levelCategories.map((item2, index2) => {
      item2.categories = this.addLevel(categories, 2, item2.id);

      // Guardamos las categorias nivel  3
      item2.categories.map((item3, index3) => {
        item3.categories = this.addLevel(categories, 3, item3.id);
      });
    });
    // console.log(this.levelCategories);
    return this.levelCategories;
  }

  private addChildren(items: ProductCategory[] | any, productoBuscado:any, slugParents:any) {
    items.map((item:any) => {
      item.url = ['/', 'inicio', 'productos', productoBuscado, 'categoria', slugParents, item.slug];
      item.categories?.map((cat3:any) => {
        cat3.url = ['/', 'inicio', 'productos', productoBuscado, 'categoria', slugParents, item.slug, cat3.slug];
      });
    });

    return items;
  }

  private formatCategories(categorias:any) {
    const productoBuscado = this.parametrosBusqueda.word === '' ? 'todos' : this.parametrosBusqueda.word;
    let collapsed = false;
    // console.log(this.parametrosBusqueda);
    if (this.parametrosBusqueda.categoria !== '') {
      collapsed = false;
    }

    // console.log(collapsed)

    const filtros: ProductFilterCategory = {
      type: 'categories',
      name: 'CATEGORÍAS',
      collapsed,
      options: {
        items: []
      }
    };
    this.levelCategories = [];
    this.proccesingLevel(categorias);
    let queryParams = {};
    queryParams = this.armaQueryParams(queryParams);
    if (!isVacio(this.chassis)) {
      this.chassis.forEach(c => {
        queryParams = { ...queryParams, ...{ chassis: c } };
      });
    }

    this.levelCategories.map((r, index) => {
      filtros.options?.items?.push({
        type: 'parent',
        count: r.count,
        name: r.name,
        url: ['/', 'inicio', 'productos', productoBuscado, 'categoria', r.slug],
        queryParams,
        children: this.addChildren(r.categories, productoBuscado, r.slug)
      });

      // this.filterCategories.push(categoriasFiltro);
    });
    this.filters.push(filtros);
  }

  private formatFiltersFlota() {
    const filtro: ProductFilterCheckboxFlota = {
      name: 'MI FLOTA',
      type: 'checkboxFlota',
      collapsed: false,
      options: {
        items: []
      }
    };

    this.filtrosFlota.forEach(r => {
      let checked = false;
      // revisamos el valor para marcarlo

      let resultado;
      if (this.filterQueryVehicle.chassis && this.filterQueryVehicle.chassis.length > 0) {
        if (Array.isArray(this.filterQueryVehicle.chassis)) {
          resultado = this.filterQueryVehicle.chassis.find((e:any) => e === r.vehiculo?.chasis);
        } else {
          resultado = this.filterQueryVehicle.chassis === r.vehiculo?.chasis ? this.filterQueryVehicle.chassis : '';
        }
        if (!isVacio(resultado)) {
          checked = true;
        }
      }

      filtro.options.items.push({
        label: r.alias || '',
        chassis: r.vehiculo?.chasis || '',
        tipo: 'flota',
        checked,
        count: 10,
        disabled: false
      });
    });

    this.filtrosBusquedas.forEach(r => {
      let checked = false;
      // revisamos el valor para marcarlo

      let resultado;
      if (this.filterQueryVehicle.chassis && this.filterQueryVehicle.chassis.length > 0) {
        if (Array.isArray(this.filterQueryVehicle.chassis)) {
          resultado = this.filterQueryVehicle.chassis.find((e:any) => e === r.vehiculo?.chasis);
        } else {
          resultado = this.filterQueryVehicle.chassis === r.vehiculo?.chasis ? this.filterQueryVehicle.chassis : '';
        }
        if (!isVacio(resultado)) {
          checked = true;
        }
      }

      filtro.options.items.push({
        label: r.vehiculo?.chasis || '',
        chassis: r.vehiculo?.chasis || '',
        tipo: 'busqueda',
        checked,
        count: 10,
        disabled: false
      });
    });

    this.filters.push(filtro);
  }

  private formatFilters(atr:any) {
    const atributos = this.cleanFilters(atr);

    atributos?.map(r => {

      r.values = sort(r.values).asc();

      let collapsed = true;
      const field = 'filter_' + r.name;
      // revisamos el filtro de la url y lo expandimos
      const resultado =
        Object.keys(this.filterQuery).find(item => {
          if (field === item) {
            return true;
          }else{ return false}
        }) || false;
      if (resultado) {
        collapsed = false;
      }

      const filtro: ProductFilterCheckbox = {
        name: r.name,
        type: 'checkbox',
        collapsed,
        options: {
          items: []
        }
      };

      r.values.map((value: string) => {
        let checked = false;
        // revisamos el valor para marcarlo

        if (resultado) {
          const valueFilter = this.filterQuery[resultado];
          if (valueFilter === value) {
            checked = true;
          }
        }

        filtro.options.items.push({
          label: value,
          checked,
          count: 10,
          disabled: false
        });
      });

      this.filters.push(filtro);
    });
  }

  // limpia los atributos que no son mostrables
  cleanFilters(atributos:any) {
    const atributos2 = [];

    if (typeof atributos === 'undefined') {
      return;
    }

    for (const key in atributos) {
      if (atributos.hasOwnProperty(key)) {
        const exist = this.filtersIgnored.includes(key.trim());
        const elements = atributos[key];

        if (!exist) {
          const obj = {
            name: key,
            values: elements
          };
          atributos2.push(obj);
        }
      }
    }

    return atributos2;
  }

  getFiltersQuery(query:any, tipo = 'otros') {
    let resp = {};

    if (isVacio(query)) {
      return;
    }

    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const element = query[key];

        const existe = tipo === 'vehiculo' ? this.filtersVehicle.includes(key.trim()) : !this.filtersVehicle.includes(key.trim());

        if (existe) {
          resp = { ...resp, ...{ [key]: element } };
        }
      }
    }
    return resp;
  }

  paginacionProductos({ page, scroll }:any): void {
    this.reinicaFiltros();
    this.parametrosBusqueda.page = page;
    this.currentPage = page;
    this.cargarCatalogoProductos(this.parametrosBusqueda, '', scroll);
  }

  cambiaItemPorPagina(items:any) {
    this.reinicaFiltros();
    this.parametrosBusqueda.pageSize = items;
    this.cargarCatalogoProductos(this.parametrosBusqueda, '');
  }

  updateFilters(filtersObj:any) {
    let filters = filtersObj.selected;

    const url = this.router.url.split('?')[0];

    filters = this.armaQueryParams(filters);
    this.router.navigate([url], { queryParams: filters });
  }

  clearCategory(e:any) {
    let queryParams = {};
    queryParams = this.armaQueryParams(queryParams);
    if (!isVacio(this.chassis)) {
      this.chassis.forEach(c => {
        queryParams = { ...queryParams, ...{ chassis: c } };
      });
    }

    if (this.textToSearch === '') {
      this.removableCategory = [];
      if (this.chassis.length > 0) {
        this.router.navigate(['/', 'inicio', 'productos', 'todos'], { queryParams });
      } else {
        this.router.navigate(['/', 'inicio']);
      }
    } else {
      this.removableCategory = [];
      this.router.navigate(['/', 'inicio', 'productos', this.textToSearch], { queryParams });
    }
  }

  clearAll(e:any) {
    let queryParams = {};
    queryParams = this.armaQueryParams(queryParams);
    if (!isVacio(this.chassis)) {
      this.chassis.forEach(c => {
        queryParams = { ...queryParams, ...{ chassis: c } };
      });
    }

    if (this.textToSearch === '') {
      this.removableCategory = [];
      if (this.chassis.length > 0) {
        this.router.navigate(['/', 'inicio', 'productos', 'todos'], { queryParams });
      } else {
        this.router.navigate(['/', 'inicio']);
      }
    } else {
      this.removableCategory = [];
      this.router.navigate(['/', 'inicio', 'productos', this.textToSearch], { queryParams });
    }
  }

  armaQueryParams(queryParams:any) {
    if (this.marca !== '') {
      queryParams = { ...queryParams, ...{ marca: this.marca } };
    }
    if (this.modelo !== '') {
      queryParams = { ...queryParams, ...{ modelo: this.modelo } };
    }
    if (this.anio !== '') {
      queryParams = { ...queryParams, ...{ anio: this.anio } };
    }

    return queryParams;
  }

  setBreadcrumbs() {
    this.breadcrumbs = [];
    if (this.paramsCategory.firstCategory !== '') {
      const cat = this.root.replaceAll(this.paramsCategory.firstCategory, /-/g);
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: ['/', 'inicio', 'productos', this.textToSearch, 'categoria', this.paramsCategory.firstCategory]
      });
    }

    if (this.paramsCategory.secondCategory !== '') {
      const cat = this.root.replaceAll(this.paramsCategory.secondCategory, /-/g);
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: [
          '/',
          'inicio',
          'productos',
          this.textToSearch,
          'categoria',
          this.paramsCategory.firstCategory,
          this.paramsCategory.secondCategory
        ]
      });
    }

    if (this.paramsCategory.thirdCategory !== '') {
      const cat = this.root.replaceAll(this.paramsCategory.thirdCategory, /-/g);
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: [
          '/',
          'inicio',
          'productos',
          this.textToSearch,
          'categoria',
          this.paramsCategory.firstCategory,
          this.paramsCategory.secondCategory,
          this.paramsCategory.thirdCategory
        ]
      });
    }
  }

  setFilteState(state:any) {
    this.visibleFilter = state;
  }

  positionScroll(event:any) {
    this.innerWidth = window.innerWidth;
    this.scrollPosition = event.srcElement.children[0].scrollTop;
  }

  setOrigenes() {
    try {
      let categoria = '';
      // Si el Url tiene seteada la categoria , pero su busqueda no     es 'todos' ( no es Banner )
      if (this.route.snapshot.paramMap.get('nombre') && this.route.snapshot.paramMap.get('busqueda') !== 'todos') {
        categoria = this.route.snapshot.paramMap.get('nombre') || '';
        this.origen = ['buscador', '', categoria, ''];
      } else {
        const urlParams = this.route.snapshot.url[0].path.split('-');
        //Si no existe categoria en la url y se accede desde el 'Ver más'
        if (urlParams[0] == 'HOME') {
          urlParams.splice(0, 1);
          this.origen = ['home', 'ver-mas', urlParams.join(' '), ''];
          //Si viene desde Banner
        } else if (urlParams[0] == 'todos') {
          urlParams.splice(0, 1);
          categoria = this.route.snapshot.paramMap.get('nombre') || '';
          this.origen = ['home', 'banner', categoria, ''];
        } else {
          this.origen = ['buscador', '', 'sinCategoria', ''];
        }
      }
    } catch (e) {
      console.warn('Error a setear el origen!', e);
      this.origen = ['buscador', '', 'sinCategoria', ''];
    }
  }

  //Definicion de meta Información para optimización del SEO
  getDetalleSeoCategoria(category: String) {
    let metadataCount = 0;
    if (metadataCount === 0) {
      let meta = {};
      const url = 'https://www.implementos.cl/inicio/productos/todos/categoria/';
      const urlLimpieza = 'accesorios-y-limpieza-automotriz/';
      const urlAmarre = 'amarre-de-carga/';
      const urlBaterias = 'baterias/';
      const urlCromados = 'cromados-y-cabina-de-camion/';
      const urlHigiene = 'higiene-y-proteccion-personal/';
      const urlIluminacion = 'iluminacion/';
      const urlNeumaticos = 'llantas-y-neumaticos/';
      const urlLubricantes = 'lubricantes-filtros-y-aditivos/';
      const urlMotor = 'motor-y-transmision/';
      const urlRepuestos = 'repuestos-para-equipos-de-carga/';
      const urlSeguridad = 'seguridad-herramientas-y-tiempo-libre/';
      const urlFrenos = 'suspension-y-frenos/';
      const urlPasajeros = 'transporte-de-pasajeros/';

      switch (category) {
        case 'accesorios-y-limpieza-automotriz':
          meta = {
            title: 'Cuidados para tu vehículo Accesorios y limpieza automotriz',
            description:
              'Encuentra todo lo que necesitas para limpiar tu vehículo con stock disponible y despachos a todo Chile. ',
            keywords:
              ' Productos de limpieza, accesorios de limpieza, Shampoo para autos, ceras, cera, silicona, renovador de neumáticos, pulidor de autos, aspiradora portátil, esponja de limpieza, cubre asientos, fundas de asientos, cepillo, limpiavidrios, limpiaparabrisas, desengrasante, Paño, jabones, renovador de neumáticos, jabon para manos, gel para manos, M2, Loctite, Blacksmith, wd-40, Indiana, R-66, ',
            url: url + urlLimpieza
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'quimicos-de-aseo':
          meta = {
            title: 'Químicos de aseo Accesorios y limpieza automotriz ',
            description:
              'Todos los productos de aseo que necesites para todo tipo de vehículo renovador de neumáticos, cera, jabón mecánico, limpiavidrios, shampoo de auto, y más..',
            keywords:
              'Paño, jabones, desengrasante, renovador de neumáticos, aspiradora portátil, cepillo, esponja de limpieza, cera, pulidor de autos, cera pulidora, jabon para manos, gel para manos, shampoo autos, limpiavidrios, limpiaparabrisas, pasta de pulir, Aromatizantes, limpiadores, 3M, Indiana, R-66, wd-40, Areon, Little Trees, M2, Herrero and sons, Blaster,  Unic, Sika, Locx. ',
            url: url + urlLimpieza + 'quimicos-de-aseo'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-interior':
          meta = {
            title: 'Accesorios para el interior de tu vehículo   Limpieza automotriz',
            description:
              'Cuida tu vehículo, todo lo que buscas: paños de limpieza, aromatizantes, cubre asiento y volante, piso de goma, parasol, silicona, aspiradora portátil.',
            keywords:
              'cubre asiento, cubre volante, funda asiento, piso de goma, parasol, silicona, aromatizante, paño limpieza, aspiradora portátil.',
            url: url + urlLimpieza + 'accesorios-de-interior'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'adhesivos-y-siliconas':
          meta = {
            title: 'Adhesivos y siliconas para tu vehículo | Accesorios automotriz',
            description:
              'Encuentra Adhesivos y siliconas: Adhesivos de contacto, epóxidos, cintas, adhesivas, de embalaje, siliconas, de altas temperaturas, para empaquetaduras.',
            keywords:
              'Ahesivos, Adhesivos de contacto, adhesivos especiales, adhesivos epoxicos, cintas, cintas adhesivas, cintas de embalaje, silisonas, siliconas de altas temperaturas, siliconas para empaquetaduras, M2, loctite, Indiana, Teroson, Tactix, Sika, 3M, Locx, All-Tape spa, Motorlife, Lanco, Randon.',
            url: url + urlLimpieza + 'adhesivos-y-siliconas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-aseo':
          meta = {
            title: ' Accesorios de Aseo para tu vehículo  Limpieza automotriz ',
            description:
              'Accesorios para la limpieza de tu vehículo: Aspiradora portátil, cepillo, esponja, paño, escoba, balde, paño micro fibra, cuero de anthe, huaipe. ',
            keywords:
              'Aspiradora portátil, cepillo de limpieza, esponja de limpieza, paño de limpieza, escobas de limpieza baldes, paño micro fibra, cuero de anthe, huaipe, guaipe, kit de limpieza, disco pulir, Herrero and sons, Barron vieyra, Unic, Marcopolo, Karcher, Hilachas. ',
            url: url + urlLimpieza + 'accesorios-de-aseo'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'equipamiento-de-camionetas':
          meta = {
            title: 'Equipa tu camioneta, 4x4, pickup, Jeep | Todo Terreno',
            description:
              'Equipa tu vehículo con todos los accesorios que buscas: Cocos de arrastre, mano de enganche, barra antivuelco y de acero, gancho amarra carga.',
            keywords:
              'Cocos de arrastre, mano de enganche, barra antivuelco para camioneta, gancho amarra carga, discos para pulir, Imbest, mitsubishi, toyota, nissan. ',
            url: url + urlLimpieza + 'equipamiento-de-camionetas'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'accesorios-de-exterior':
          meta = {
            title: 'Accesorios para el exterior de tu vehículo | Espejos, plumillas... ',
            description:
              'Encuentra los accesorios para el exterior de tu vehículo: espejos, plumillas, cintas y kit de arrastre. Blacksmith, Unipoint, HS, Imbest, TRP, Paccar.',
            keywords:
              'espejos para autos, espejos para camionetas, plumillas, cinta de arrastre, kit de arrastre, plumillas para camiones, plumillas para buses, cinta de tiro 4 mts, Blacksmith, Unipoint, HS, Imbest, TRP, Paccar.',
            url: url + urlLimpieza + 'accesorios-de-exterior'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'aditivos':
          meta = {
            title: 'Aditivos y limpiadores | Cuidado y mantención del vehículo',
            description:
              'Encuentra los aditivos de: Combustible, limpieza, liquido de frenos, anticorrosivos, limpia inyectores, limpia correas.  Mannol, Senfineco, HS, Loctite.',
            keywords:
              'Aditivos de automovil, aditivos de combustible, aditivos de auto, limpiadores, liquido de frenos, anticorrosivos, limpia inyectores, limpia correas,  Mannol, Senfineco, HS, Locx, ',
            url: url + urlLimpieza + 'aditivos'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'quimicos':
          meta = {
            title: 'Químicos para mantención de tu vehículo | Despachos a todo chile',
            description:
              'Químicos para mejorar la mantención de tu vehículo, encuentra todo lo que necesites y te lo llevamos a la puerta de tu casa. ',
            keywords:
              'Lubricantes especiales, desagripante, anticorrosivos, limpiadores especiales, aditivo combustible, pegamento, masilla, liquido de freno, Wd-40, Mannol, Loctite, locx, Lanco, Senfineco, Sika, Simoniz, Archem, Imbest. ',
            url: url + urlLimpieza + 'quimicos'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'amarre-de-carga':
          meta = {
            title: 'Amarre de Carga | Sujeción de carga liviana y pesada',
            description:
              'Asegura la carga de tu transporte: eslingas, ratchet, pulpos, esquineros, ganchos, cadenas, tensores, barra de fijación, cordeles, cintas de amarre ',
            keywords:
              'Eslingas, ratchet, pulpos, esquineros, ganchos de amarre metálicos, cadenas, tensores de cadenas, cordeles, barra de fijación, cinta de amarre, unión de cadena, Blacksmith, Kinedyne, SCC, All-tape spa, Randon, Suntech, Cargo Guard. ',
            url: url + urlAmarre
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'accesorios-de-control-de-cargas':
          meta = {
            title: 'Accesorios de control de cargas para tu transporte',
            description:
              'Accesorios para mejorar el control de carga de tu transporte: Gancho clevis, de amarre metálico y lateral, Pulpo, lona, esquinero, refuerzo plástico, film.',
            keywords:
              'Gancho clevis, pulpo, ganchos de amarre metálico, Carpa, tarpulin, esquinero, gancho amarre lateral, tirante de amarre lona, refuerzo plástico, stretch film, Refuerzo plastico, Kinedyne, Blacksmith, All-Tape SPA, Randon, Cargo Guard, Suntech, SCC.',
            url: url + urlAmarre + 'accesorios-de-control-de-cargas'
          };
          this.seoService.generarMetaTag(meta);
          break;

        case 'fijaciones-de-carga-exterior':
          meta = {
            title: 'Fijación de carga exterior | Eslinga, Cadenas y tensores.',
            description:
              'Mantén tu carga segura: cintas de fijación, winches, cordel, ratchet, amarras elásticas, cuerda elástica, Blacksmith, Kinedyne, Suntech, Randon.',
            keywords:
              'Cadenas, cintas de fijación, Winches, tensores de cadenas, cordel, cadena de amarre carga, ratchet, eslinga, slinga, rachet, tensor cadena, amarras elásticas, cuerda elástica, rachet 9 metros, rachet 5 toneladas, cinta amarre 200 kg kilos, Blacksmith, Kinedyne, SCC, Suntech, Randon, Topsun, Kingroy. ',
            url: url + urlAmarre + 'fijacion-de-carga-exterior'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'fijaciones-de-carga-interior':
          meta = {
            title: 'Fijación de Carga para el interior de tu vehículo ',
            description:
              'Asegura la carga interior: riel logístico, barra de retención, de ajuste,  de instalación, winche, soporte de barra. Kinedyne, Blacksmith, SCC, Randon.',
            keywords:
              'Barras de fijación, riel logístico, barra ajuste galvanizado interior furgon, barra ajuste aluminio interior furgon, barra instalación, barra ajuste winche acero, soporte barra carga, Barra de retencion, kit aro de carga, Kinedyne, Blacksmith, SCC, Suntech, Randon. ',
            url: url + urlAmarre + 'fijacion-de-carga-interior'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'baterias':
          meta = {
            title: 'Baterías para Camiones, Buses, Camionetas, Tractores y Autos.',
            description:
              'Encuentra gran variedad de baterías desde 55 a 220 amperes, Borne estándar, esparrago, negativo, PowerTruck, Bosch, Hankook, Delkor, AC Delco.',
            keywords:
              'Baterias de linea pesada, baterias de camion, baterias para camion, baterias de lineas livianas, baterias para auto, baterias, bateria, Borne estandar, borne esparrago, bateria borne negativo invertido,  bateria borne americano, Baterias de amperaje 55,  amp 60, amp 70, amp 75, amp 90, amperaje 100, amp 120, amp 130, amp 150, amp 170, amp 200, amp 220,  AC Delco, Suntech, Quickstart, Delkor, hankook, Exide. ',
            url: url + urlBaterias
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'baterias-linea-pesada-100-a-220-amp':
          meta = {
            title: 'Baterías para vehículos pesados desde 100 a 220 amp',
            description:
              'Baterías para Camiones pequeños, 3/4, pesados, Tractores y Buses, Desde los 330 a los 1060 CCA, PowerTruck, Suntech, Exide, AC Delco, TPR, Delkor, Hankook.',
            keywords:
              'Baterias de amperaje 100, Bateria amp 120, bateria amp 130,  bateria amp 150, bateria amp 170, bateria amp 200,  bateria amp 220, bateria de camion, bateria para camion, PowerTruck, AZ10, Suntech, Exide, AC Delco, TPR, Delkor ',
            url: url + urlBaterias + 'baterias-linea-pesada-100-a-220-amp'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'baterias-linea-liviana-55-a-90-amp':
          meta = {
            title: 'Batería para vehículos livianos | Autos y Camionetas',
            description:
              'Baterías livianas desde 55 a 90 amperes, borne estándar, positivo derecho, izquierdo, libre mantención, PowerTruck, Hankook, Delkor.',
            keywords:
              'Baterias de 55 amp, 60 amp, 70 amp, 75 amp, 90 amperaje, bateria, bateria para autos, PowerTruck, AZ10, Suntech, Exide, AC Delco, TPR, Quickstart, Delkor.Baterias de amperaje 100, Bateria amp 120, bateria amp 130,  bateria amp 150,bateria amp 170, bateria amp 200,  bateria amp 220, bateria de camion, bateria para camion,PowerTruck, AZ10, Suntech, Exide, AC Delco, TPR, Delkor ',
            url: url + urlBaterias + 'baterias-linea-liviana-55-a-90-amp'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-baterias':
          meta = {
            title: 'Accesorios de Baterías | cable roba corriente, cargadores y más',
            description:
              'Accesorios de baterías: limpiador terminal, cables roba corriente, cargador y partidor de baterías de 12 a 24 volts, terminal para baterías, cable tierra',
            keywords:
              'cables robacorrientes, partidor, cargador de baterías, terminal para baterías, cepillo limpia bornes, cable tierra, limpiador terminal,  Blacksmith, Autonik Power, Imbest, Victoria Capital, Mikels, 3M, Simply, Safety, TPR. ',
            url: url + urlBaterias + 'accesorios-de-baterias'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'cromados-y-cabina-de-camion':
          meta = {
            title: 'Variedad en Cromados y Cabina de Camión',
            description:
              'Accesorios de baterías: limpiador terminal, cables roba corriente, cargador y partidor de baterías de 12 a 24 volts, terminal para baterías, cable tierraGran variedad de artículos cromados: espejos, parabrisas, bocinas, sistemas de escape, estanques de combustible, parachoques, tubos de escape y más.',
            keywords:
              'espejos, parabrisas, bocinas, sistemas de escape, estanques de combustible, accesorios de camion, parachoques, tubos de escape, rejillas, tacografos, abrazadera, DML, Nelson,  HDP, Automann, Maxiclima, Bepo, Blacksmith, Imbest, 3M, Grand General, Haocheng',
            url: url + urlCromados
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'cromados':
          meta = {
            title: 'Cromados para tu camión',
            description:
              'Encuentra accesorios cromados: parachoques, tapas de ruedas, tuercas, puntas y tubos de escape, molduras cromadas, máscaras, biseles de foco, ópticos.',
            keywords:
              'parachoques, tapas de ruedas, tuercas, puntas de escape,  tubos de escape, protector silenciador, molduras cromadas, mascaras, rejillas, soportes, biseles de foco, opticos, Nelson, Blacksmith, 3M, Automann, Grand General, TPR, Bepo, Alcoa, HDP. ',
            url: url + urlCromados + 'cromados'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'espejos':
          meta = {
            title: 'Espejos | Cromados y Cabina de Camión',
            description:
              'Variedad de espejos para tu camión: espejo americano, europeo, universales, cuadrado, esférico, de cabina, vidrio espejo, soporte de espejo.',
            keywords:
              'Espejo americano, espejo europeo,  espejos universales, espejo derecho, espejo izquierdo, espejos para camion, vidrio espejo, espejo cuadrado, espejo esferico, espejo de cabina, soporte de espejo, MarcoPolo, Visorama, APCO',
            url: url + urlCromados + 'espejos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-camiones':
          meta = {
            title: 'Accesorios para tu camión | Cromados y Cabina de Camión',
            description:
              'Accesorios para tu camión: manillas, chapas, alza vidrios, tersores de capot, tacógrafo, carrocería, goma,  guarda fangos, antenas, radio, soplador de aire.',
            keywords:
              'manillas, chapas , alzavidrios, tersores de capot, tarjetas tacografo, carroceria, goma,  guarda fangos, antenas, radio, soplador de aire, DML, Aiwa, HDP, Proline, Siemens Vdo, TRP, Rodoplast, Gaff, Maxiclima.',
            url: url + urlCromados + 'accesorios-de-camiones'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'parabrisas':
          meta = {
            title: 'Parabrisas para tu camión | Cromados y Cabina de Camión',
            description: 'Parabrisas y accesorios:  parabrisas para camiones americanos y europeos, accesorios parabrisas.',
            keywords:
              'Parabrisas, para brisas, accesorios parabrisas, parabrisas para camiones americanos, parabrisas para camiones, parabrisas para camion, parabrisas para camion europeo, parabrisas freightliner, brazo parabrisa, moto limpiaparabrisas, Paccar, Begel, Fuyao, Vm Glass, 3M, trp. ',
            url: url + urlCromados + 'parabrisas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'climatizadores-de-camion':
          meta = {
            title: 'Climatizadores para tu Camión | Cromados y Cabina de Camión',
            description:
              'Variedades de climatizadores para tu camión: climatizador 12 voltios, 24 voltios, control remoto, filtros slim, recambios salida de aire, cromado master.',
            keywords:
              'Climatizador de camion, climatizador 12 voltios, climatizador 24 voltios, control remoro de climatizador, filtros slim, recambios salida de aire, cromado master, Maxiclima, Bepo, Taco-AR ',
            url: url + urlCromados + 'climatizadores-de-camion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'bocinas':
          meta = {
            title: 'Bocinas para tu vehículo | Cabina de Camión',
            description:
              'Variedades de Bocinas de aire y eléctricas para tu camión: bocinas de camión, eléctricas, de aire, doble, caracol, corneta.',
            keywords:
              'Bocinas de camion, bocinas, bocinas electricas, bocinas de aire, bosinas, Bocinas doble, bocina caracol, bocina coneta, Imbest, Hella, Sorl, Hadley  ',
            url: url + urlCromados + 'bocinas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistema-de-escape':
          meta = {
            title: 'Sistema de escape | Cromados y Cabina de Camión',
            description:
              'Encuentra sistemas de escape: codos, sistema de escape, corrugados, silenciador, abrazaderas y tubos de escape.',
            keywords:
              'codos, sistema de escape,  corrugados, silenciador de escape,  abrazaderas de escape, tubos de escape, Nelson, Automann, TPR, Paccar, GAF.',
            url: url + urlCromados + 'sistema-de-escape'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'estanques-de-combustible':
          meta = {
            title: 'Estanques de combustible | Cromados y Cabina de Camión',
            description: 'Encuentra Estanques de combustible para tu camión.',
            keywords: 'Estanque de combustible ',
            url: url + urlCromados + 'estanques-de-combustible'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'higiene-y-proteccion-personal':
          meta = {
            title: 'Higiene y Protección para tu Salud | Protección personal',
            description:
              'Variedad en Protección personal: guantes forte, de algodón, buzo desechable, overol, chaleco reflectante, casco, zapatos de seguridad, ropa de trabajo.',
            keywords:
              'Guantes, buzo desechable, Overol, guante forte, Guante de algodon, Chaleco reflectante, casco, zapatos de seguridad, ropa de trabajo, proteccion personal, proteccion para pies, ',
            url: url + urlHigiene
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'proteccion-personal':
          meta = {
            title: 'Elementos de protección personal | Higiene y Protección personal',
            description:
              'Encuentra elementos para tu seguridad: arneses, guantes cabritilla, de nitrilo, multiuso, de soldador, látex, pigmentados, nylon.',
            keywords:
              'Arneses, guantes cabretilla, de nitrilo, multiuso, de soldador, latex, pigmentados, nylon y no olvides el jabon y alcohol gel. todo de nuestras marcas certificadas para tu seguridad, Steelpro, Forte, Sleiter, Stone, Mikels, Strong Work, Daumer, Ipro, 3M, Inderquim y Biogel',
            url: url + urlHigiene + 'proteccion-personal'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'ropa-de-trabajo':
          meta = {
            title: 'Ropa de Trabajo | Protección Personal',
            description:
              'Ropa de trabajo para estar protegido: coletos, pantalones, overoles, buzos desechables, ropa térmica, chalecos, chaquetas, camisas, blusas y poleras. ',
            keywords:
              'Coletos, pantalones, overoles, buzos desechables, ropa termica, chalecos, chaquetas, camisas, blusas y poleras. Encuentra nuestras marcas Strong Work, Bufalo, Alaska, Steelpro, 3M, Antuan y Cabbeen',
            url: url + urlHigiene + 'ropa-de-trabajo'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'proteccion-ortopedica':
          meta = {
            title: '¡Protégete! Cuellos y Fajas lumbares | Protección Personal',
            description:
              '¡Tú seguridad nos importa! encuentra cuellos y fajas lumbares, protección ortopédica, protección personal, cuellos, fajas de trabajo y lumbares.',
            keywords:
              'Proteccion, proteccion ortopedica, proteccion personal, cuellos, cuellos de trabajo, fajas de trabajo ,fajas lumbares, Evo.',
            url: url + urlHigiene + 'proteccion-ortopedica'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'proteccion-de-pies':
          meta = {
            title: 'Zapatos de seguridad | Protección Personal',
            description:
              'Protección personal, zapatos de seguridad, protección para pies: zapatos de trabajo, de seguridad, botas de goma y de trabajo.',
            keywords:
              'Proteccion para pies, proteccion personal, proteccion, Zapatos, zapatos de trbajo, zapatos de seguridas, zapatos para trabajar, botas de boma, botas de trabajo, Blacksmith, Mack Texas, Mack Colorado, Darroka, Quebec, HW Atacama, Technical, Alaska, Bufalo, 3M, Cabben, ',
            url: url + urlHigiene + 'proteccion-de-pies'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'proteccion-auditiva':
          meta = {
            title: 'Protección auditiva | Protección Personal',
            description:
              'No descuides la protección auditiva, cuida tus orejas!!   protección auditiva, protección de orejas, tapones de orejas, fono para casco.',
            keywords: 'Proteccion auditiva, proteccion de orejas, tapones de orejas, fono para casco, 3M, Daumer,  ',
            url: url + urlHigiene + 'proteccion-auditiva'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'prevencion':
          meta = {
            title: 'Prevención respiratoria | Protección Personal',
            description:
              'Encuentra Mascarillas: mascarilla desechable, KN95, N95, respirador, filtro para gases orgánicos, para vapores orgánicos, particular air.',
            keywords:
              'Prevencion, proteccion personal, respirador, mascarilla desechable, kn95, n95, filtro para gases organicos, filtro para vapores organicos, filtro particular air, RPC, 3M, AIR. ',
            url: url + urlHigiene + 'prevencion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'proteccion-visual':
          meta = {
            title: 'Protección visual | Protección Personal',
            description:
              'Máscaras y lentes de seguridad para tu trabajo: prevención visual, protección visual, lentes, anteojos de seguridad, mascaras de seguridad.',
            keywords:
              'Prevencion visual, prevencion, proteccion visual, lentes, anteojos de seguridad, mascaras de seguridad, Virtua, Daumer, 3M, Cabbeen, RPC. ',
            url: url + urlHigiene + 'proteccion-visual'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'iluminacion':
          meta = {
            title: 'Iluminación para tu vehículo | Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Encuentra equipos de iluminación para tu vehículo, luces, focos neblineros, ópticos, trocha, periféricos, señaleras, ampolletas, AZ10, Braslux, Suntech. ',
            keywords:
              'Iluminacion, luz camion, focos neblineros, focos opticos, focos perifericos,  luces de camion, focos, señaleras, ampolletas foco trocha, AZ10, Braslux, suntech, Multipartes, Automann, Hella, Randon, Tro-Grim, Multilight. ',
            url: url + urlIluminacion
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'focos':
          meta = {
            title: 'Focos para tu vehículo | Iluminación para Camión, Bus, Remolque',
            description:
              'Encuentra equipos de iluminación para tu vehículo, luces, focos neblineros, ópticos, trocha, periféricos, señaleras, ampolletas, AZ10, Braslux, Suntech. ',
            keywords:
              ' focos faeneros, focos neblineros, focos opticos, focos perifericos, focos traseros, focos laterales, foco trocha, foco para patentes, Braslux, Suntech, AZ10, Tro-Grim, Multipartes, Marcopolo, Haocheng, Randon, Multilight',
            url: url + urlIluminacion + 'focos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'senaleras':
          meta = {
            title: 'Señaleras para tu vehículo | Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Contamos con señaleras para tu vehículo led, halógenas, incandescentes,  rectangulares,  triangular, retroreflector, caja porta focos, mica farol, regleta. ',
            keywords:
              'señaleras, señaleras led, señaleras halogenas, señaleras incandecentes, Señaleras rectangulares, señaleras triangular, retroreflector, caja porta focos, mica farol, regleta, Begel, Paccar, Randon, HDP, TRP, Groupstar, AZ10, Tro-Grim, Multilight. ',
            url: url + urlIluminacion + 'senaleras'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-iluminacion':
          meta = {
            title: 'Accesorios de Iluminación',
            description:
              'Contamos con Accesorios para la iluminación de tu vehículo, accesorios para focos, ópticos, cables eléctricos, enchufes, cubre cables, kit eléctricos',
            keywords:
              'Accesorios de iluminacion, focos, biseles de focos, opticos, chicote electrico, Soquete,   cables, cables electricos, conectores, enchufes, cubrecables, kit electricos, Randon, Sorl, multilight, Tro-Grim, Suntech, Ampro, Phillips, HDP y 3M.  ',
            url: url + urlIluminacion + 'accesorios-de-iluminacion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'ampolletas':
          meta = {
            title: 'Ampolletas para tu vehículo | Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Ampolletas de focos y señaleras para tu vehículo, ampolletas led,  halogenos, incandecentes, Hella, CNL, Tungsram, Lucas, Bosch, Randon, y más..',
            keywords:
              'ampolletas led, Ampolletas halogenos, ampolletas incandecentes, Hella, CNL, Tungsram, Lucas, Bosch y Randon. ',
            url: url + urlIluminacion + 'ampolletas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'llantas-y-neumaticos':
          meta = {
            title: 'Llantas y Neumáticos para tu Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Encuentra llantas, neumáticos y sus accesorios, llantas de aluminio, acero, americanas, Europeas, de artillería,  kits de llantas, kit de neumáticos.',
            keywords:
              'neumático, neumatico, llantas de acero , llantas disco americanas, americanas, llanta disco europeas, Europeas, llantas de artilleria,  kits de llantas, neumatico de camion, neumatico de bus, neumatico de camioneta, neumatico para auto,  kit de neumaticos, Suntech, Agrale, Maxion, Jantsa, Golden Crown, Ampro, Rhino parts y Aeon. ',
            url: url + urlNeumaticos
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'llantas-de-acero':
          meta = {
            title:
              'Encuentra llantas, neumáticos y sus accesorios, llantas de aluminio, acero, americanas, Europeas, de artillería,  kits de llantas, kit de neumáticos.',
            description:
              'Encuentra llantas, neumáticos y sus accesorios, llantas de aluminio, acero, americanas, Europeas, de artillería,  kits de llantas, kit de neumáticos.',
            keywords:
              'llantas de acero, llantas disco americanas, llantas disco Europeas, llantas de artilleria, kits de llantas, kits de  neumaticos, Suntech, Agrale, Maxion, Jantsa, Golden Crown, Ampro, Rhino parts y Aeon.  ',
            url: url + urlNeumaticos + 'llantas-de-acero'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-neumaticos':
          meta = {
            title: 'Accesorios de neumáticos | Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Accesorios de Neumáticos tipo porta neumáticos, perno porta llanta, Barra y manipulo porta repuesto, Chaveta partida, fijador de rueda, y mas variedades.',
            keywords:
              'neumaticos, porta neumaticos, perno porta llanta, Manulo porta repuesto, Barra porta repuesto, Chaveta partida, fijador de rueda, y mas variedades. equipate con accesorios marca Randon y HDP. ',
            url: url + urlNeumaticos + 'accesorios-de-neumaticos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'neumaticos':
          meta = {
            title: 'Neumáticos para tu vehículo | Camión, Bus, Remolque, Auto, Tractor',
            description:
              'Neumáticos para tu Vehículo, neumaticos all terrain, direccional, mixto, tracc faena, tradicional, Triangle, Sunfull, Marcopolo, Sportiva, TopTrust.',
            keywords:
              'neumaticos all terrain, neumatico Direccional, neumatico mixto, neumatico tracc faena, neumatico tradicional, Triangle, Sunfull, Marcopolo, Sportiva, TopTrust, Lanvigator',
            url: url + urlNeumaticos + 'neumaticos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'llantas-de-aluminio':
          meta = {
            title: 'Llantas de aluminio | Camión, Bus, Remolque, Auto, Tractor.',
            description:
              'Encuentra llantas de aluminio, europeas, americanas, disco de aluminio, de marcas recomendadas, Suntech, Alcoa, Rheoforge y Eco alux.',
            keywords:
              'llantas de aluminio, llantas, disco de aluminio, europeas, americanas y especiales. de marcas recomendadas, Suntech, Alcoa, Rheoforge y Eco alux.',
            url: url + urlNeumaticos + 'llantas-de-aluminio'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-llantas':
          meta = {
            title: 'Accesorios de llantas | Camión, Bus, Remolque, Auto, Tractor.',
            description:
              'Accesorios de llantas, válvulas, alargadores, porta llantas, separadores de llantas, espaciador de soporte, aro rueda llanta, gancho porta llanta.',
            keywords:
              'accesorios de llantas, valvulas, alargadores, porta llantas, separadores de llantas, espaciador de soporte, aro rueda llanta, gancho porta llanta, todo de marcas como Randon, Suntech, Ningbo, Bepo, Alux, Automann, Alcoa y Schrader. ',
            url: url + urlNeumaticos + 'accesorios-de-llantas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'lubricantes-filtros-y-aditivos':
          meta = {
            title: 'Lubricantes y filtros para tu vehículo',
            description:
              'Lubricantes y filtros para líneas pesadas y livianas, y para todo tipo de vehículos. Aceite de motor, anticongelantes, refrigerantes, urea, aguas.',
            keywords:
              'filtros para lineas pesadas, filtros para camion, filtros para lineas livianas, filtros para autos, filtros para vehiculos, lubricantes normales, lubricantes de motor, aceite de motor,  lubricantes hidraulicos, lubricantes de transmision, anticongelates, refrigerantes,Urea,  Aguas, Indiana, Lubrax, IM-Parts, Global, WD-40, Fleetguard, Donalson, Tecfil, Randon, Castrol, Loctite, Tecfil, Goparts. ',
            url: url + urlLubricantes
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'filtros-para-linea-pesada':
          meta = {
            title: 'Filtros para tu Camión | Lubricanes y Filtros',
            description:
              'Variedad de filtros: filtro para camión, de aire, de aceite, de combustible, separador, hidráulico, refrigerante, secador, kits de filtros.',
            keywords:
              'filtro para camion, filtro de aire, filtro de aceite, filtro de combustible, filtro separador, filtro hidraulico, filtro refrigerante, urea, filtro secador, kits de filtros, Fleetguard, Donaldson, Tecfil, Racor, Agrale, Vehtec. ',
            url: url + urlLubricantes + 'filtros-para-linea-pesada'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'filtros-para-linea-liviana':
          meta = {
            title: 'Filtros para tu vehículo | Lubricantes y Filtros',
            description:
              'Variedad de filtros para tu vehículo: para línea liviana, de aire, de aceite, de combustible, de cabina, de polen.',
            keywords:
              'filtro para linea liviana, filtro para vehiculo, filtros de aire, filtro de aceite, filtro de combustible, filtro de cabina, filtro de polen, Sakura, Donalson. ',
            url: url + urlLubricantes + 'filtros-para-linea-liviana'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'lubricantes-de-motor':
          meta = {
            title: 'Lubricante de Motor | Lubricantes y Filtros',
            description:
              'Gran variedad de Lubricantes de motor para todo tipo de vehículos: lubricantes 5w, 10w, 15w, 20w, 25w-60, aceite 5w, 10w, 15w, 20w,  25w.',
            keywords:
              'lubricante 5w-30, lubricante 5w-40,lubricante 10w-30,lubricante 10w-40, lubricante 15w-40, lubricante 20w-50, lubricante 25w-60,lubricante 25w-50 ,  aceite 5w-30, aceite 5w-40, aceite 10w-30, aceite 10w-40, aceite 15w-40, aceite 20w-50, aceite 25w-60, aceite 25w-50. ',
            url: url + urlLubricantes + 'lubricantes-de-motor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'lubricantes-hidraulicos':
          meta = {
            title: 'Lubricantes Hidráulicos | Lubricantes y Filtros',
            description: 'Encuentra lubricantes hidráulicos, aceites de motor, Iso 32, Iso 46, Iso 68.',
            keywords: ' lubricantes hidraulicos , aceites de motor, Iso 32, Iso 46, Iso 68, Mobil, Lubrax, Indiana, Castrol',
            url: url + urlLubricantes + 'lubricantes-hidraulicos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'aguas':
          meta = {
            title: 'Aguas para tu vehículo | Lubricantes y Filtros',
            description: '¿Necesitas Aguas para tu vehículo? Elige la que necesitas: aguas verdes, desmineralizada.',
            keywords: 'Aguas verdes, Aguas desmineralizada,  Mobil, Indiana.',
            url: url + urlLubricantes + 'aguas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'lubricantes-de-transmision':
          meta = {
            title: 'Lubricantes de Transmisión | Lubricantes y Filtros',
            description: 'Encuentra lubricantes de transmisión, de camión, para vehículos, lubricantes 75w, 80w, 85w, 10w.',
            keywords:
              ' lubricantes de transmision, lubricante de camion, lubricante para vehiculo, lubricante para auto, lubricante 75w-90, lubricante 80w-90, lubricante 85w-140, lubricante 10w, lubricante atf, Lubrax, Mobil ',
            url: url + urlLubricantes + 'lubricantes-de-transmision'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'refrigerantes-anticongelantes':
          meta = {
            title: 'Refrigerante y Anticongelantes | Lubricantes y Filtros',
            description: 'Encuentra gran variedad de Refrigerantes y anticongelantes especiales para todo tipo de climas.',
            keywords: ' Refrigerantes, Anticongelantes, Indiana, Global, goparts, Lubrax, 3M, Mobil, IM-Parts, ',
            url: url + urlLubricantes + 'refrigerantes-anticongelantes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'urea':
          meta = {
            title: 'Urea para tu Motor | Lubricantes y Filtros',
            description:
              'Reduce tus emisiones de óxidos causados por los escapes de tu motor diésel.                              .',
            keywords: ' urea,  IM-Parts, Mobil, control de emisiones, urea 10litros, urea 20 lts, urea 208 lts, ',
            url: url + urlLubricantes + 'urea'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'lubricantes-industriales-y-grasas':
          meta = {
            title: 'Lubricantes Industriales | Lubricantes y Filtros',
            description:
              'Encuentra todo tipo de lubricantes industriales, anticorrosivo, desagripante, multiuso y grasas para tu vehículo. ',
            keywords:
              ' Lubricantes, Grasas, lubrax, WD-40, Lubricante anticorrosivo, Randon, Loctite, Lubricante desagripante, Lubricante multiuso, Castrol, Locx, ',
            url: url + urlLubricantes + 'lubricantes-industriales-y-grasas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'motor-y-transmision':
          meta = {
            title: 'Implementos Motor y Transmisión de tu vehículo | Motor y Transmisión',
            description:
              'Motor y transmisión de tu vehículo: motor, transmisión, block de motor, culata de motor, diferencial, embriagues, sistemas de refrigeración, caja de cambio. ',
            keywords:
              'Motor, Transmision, Transmisión, Block de motor, culata de motor, diferencial, embriagues, sistemas de refrigeracion, caja de cambio mecanica, mecanismo de accionamiento, sistema de direccion, carter de motor, Motores de partida, Mecanismo de desgaste, sistema electrico, alternador, motor, Pai, Eaton, Automann, Unipoint, Horton, Agrale, Cabovel, Urba, Randon, Suntech, Kuboshi, Della Rosa, Aliance, Gates, Valeo, Kuboshi, Fabbof. ',
            url: url + urlMotor
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'culata-de-motor':
          meta = {
            title: 'Culatas de Motor | Motor y Transmisión',
            description:
              'Culatas de motor: válvulas de admisión, escape, ejes de leva, ejes de bijes, balancines, asientos, alza, guías, retenes de válvulas, resortes de culatas. ',
            keywords:
              'culatas, valvulas de admision, escape, ejes de leva, ejes de bijes, balancines, asientos, alza, guias, retenes de valvulas, resortes de culatas, resortes de valvulas, empaquetaduras, kits de empaquetaduras, tapas de valvulas, pernos de culata, seguros de valvula, empaquetaduras de tapas de valvula, MWM, PAI, SEBO, Cummins,  ',
            url: url + urlMotor + 'culata-de-motor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'block-de-motor':
          meta = {
            title: 'Block de Motor | Motor y Transmisión',
            description:
              'Block de motor: soporte y retenes de motor, metales de bielas, cigueñal, pistones, anillos, bielas, sellos, camisas de motor, carcazas de motor, piolas.',
            keywords:
              ' Soporte de motor, Retenes de motor, metales de bielas, cigueñal, pistones, anillos, bielas, sellos, camisas de motor, carcazas de motor, piolas, pasadores de piston, metales bancadas, bielas, axiales, kits de reparacion cilindros, overhaul, bombas de aceite, damper, volante de inercia, buje de viela, soportes, retenes de motor,  distribucion,  Agrale, Cabovel, Della rosa, Betico, Gaff, Pai, Fuller, ZF, Randon, Fabraco, Knorr.',
            url: url + urlMotor + 'block-de-motor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'diferencial':
          meta = {
            title: 'Diferencial de Motor | Motor y Transmisión',
            description:
              'Diferencial de motor: diferencial de transmisión, kit de reparación, de diferencial, tuercas, golillas, pernos, horquillas, satélites, planetarios.',
            keywords:
              'Diferencial de motor, diferencial de transmisión, kit de reparacion de diferencial, tuercas, golillas, pernos, horquillas de diferencial, satelites, planetarios de diferencial, corona, pinon, caja satelite de diferencial, reten de diferencial, crucetas, Machones, tapas de difrencial, Semi ejes diferencial, rodamiento de cardan, Carcasas diferencial, Cardanes, Gaff, Automann, Meritor, ZF, Rodafuso, Kl Rayton, Spicer, Braseixos, Pai, Max Gear, Ampro. ',
            url: url + urlMotor + 'diferencial'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistema-de-refrigeracion':
          meta = {
            title: 'Sistema de refrigeración | Motor y Transmisión',
            description:
              'Sistema de refrigeración de motor, radiadores, mangueras, poleas, bombas de agua, correas y sensores de refrigeración, empaquetaduras de enfriador y más.',
            keywords:
              'Sistema de refrigeracion, refrigeracio de motor, Radiadores, Mangueras, poleas, Bombas de Agua, Correas de refrigeracion, Empaquetaduras de enfriador, Enfriador de aceite, sensores de refrigeracion, termostatos, tensores, viscosos, aspas de refrigeracion, aspas, vasos expansores, Horton, Urba, Gates, Fabbof, Suntech, Borg Warner, Pai, Automann, Goodyear, Paccar, Cummins, Ford, Max gear, Meritor. ',
            url: url + urlMotor + 'sistema-de-refrigeracion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'embragues':
          meta = {
            title: 'Embragues para tu camión | Motor y Transmisión',
            description:
              'Embragues para camión americano y europeo, embrague simple, hidráulico, rodamiento de embrague, Kit camión, disco y prensa camión brasilero.',
            keywords:
              'Embrages, discos de embrague, embrague camion americano, embriague camion europeo, rodamiento de embrague, embrague simple, embrague hidraulico, Kit camion europeo, camion americano, disco camion brasilero, Prensa camion brasilero, camion brasilero, Eaton, Pai, Suntech, Alliance, Valeo,  Hammer, Sachs, Flrs.  ',
            url: url + urlMotor + 'embragues'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'cajas-de-cambio-mecanica':
          meta = {
            title: 'Cajas de cambio Mecánicas | Motor y Transmisión',
            description:
              'Caja de cambio mecánica, piñones, engranajes, rodamiento de transmisores, horquilla, retenes de transmisión, ejes principales, piloto, secundarios y más.',
            keywords:
              'Caja de cambio mecanica, piñones, engranajes, Rodamiento de transmisores, horquilla caja de cambios, retenes de transmision, ejes principales, sincronizadores, ejes piloto, ejes secundarios, empaquetaduras de caja de cambios, cajas de cambio completa, piolas selectoras, Eaton, Fag, ZF, Fuller, Paccar, Pai, TRP. ',
            url: url + urlMotor + 'cajas-de-cambio-mecanica'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'mecanismo-de-accionamiento':
          meta = {
            title: 'Mecanismos de accionamiento | Motor y Transmisión',
            description:
              'Mecanismo de accionamiento, horquillas, servo, cilindro, bomba y disco de embrague, freno de caja, cilindro principal, servo mercedes,  volantes de camión.',
            keywords:
              'Mecanismo de accionamiento, horquillas de embrague, servo de embrague, freno de caja, cilindro de embrague, bomba de embrague, cilindro principal, disco de embrague, Servo mercedes,  volantes de camion, Pai, Eaton, TRP, TRW, Sorl, Valeo,  Agrale, Sorl, Dayu, Technik, Controil. ',
            url: url + urlMotor + 'mecanismo-de-accionamiento'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistema-de-direccion':
          meta = {
            title: 'Sistema de dirección de Motor | Motor y Transmisión',
            description:
              'Sistema de dirección, barras, terminales, cajas, bombas, pernos de dirección, kits reparación y repuestos de muñón, bomba hidráulica y más.',
            keywords:
              'Sistema de direccion, Barras, terminales de direccion, Caja de direccion, repuestos de reparacion, bombas de direccion, Kits , reparacion de muñon, repuestos de muñon, pernos de direccion, Barra corta direccion, Bomba hidraulica, Randon, TRP, Automann, Meritor, Sorl, TRW, Agrale, Eaton, Dayu, Technik, Controil. ',
            url: url + urlMotor + 'sistema-de-direccion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'motores-de-partida-y-componentes':
          meta = {
            title: 'Motor de partida para tu vehículo | Motor y Transmisión',
            description:
              'Motor de partida y componentes: solenoide, bendix, motor de arranque, Str-4302, Str-0141, Str-2351,  Str-7906, Str-4201, Str-4292 y más.',
            keywords:
              'Motor de partida, solenoide, bendix, motor de arranque, Str-4302, Str-0141, Str-2351,  Str- 7906, Str-4201, Str-4292,   Unipoint, Kuboshi, Delco Remy, Cummins, Western star, Paccar, TRP.',
            url: url + urlMotor + 'motores-de-partida-y-componentes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'mecanismo-de-desgaste':
          meta = {
            title: 'Repuestos de embragues y balatas | Motor y Transmisión',
            description:
              'Mecanismo de desgaste, reparación, repuesto, balatas, pastillas de embrague, remache diafragma, resorte disco, forro embrague y más.',
            keywords:
              'Mecanismo de desgaste, reparacion de embrague, repuesto de embrague, balata de embrague, pastillas de embrague, remache diafragma, resorte disco, Forro embrague, Frasle, Betico, Priority, Epysa frenos, Wellman.',
            url: url + urlMotor + 'mecanismo-de-desgaste'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistema-electrico-de-motor':
          meta = {
            title: 'Todo en sistema eléctrico de motor | Motor y Transmisión',
            description:
              'Sistema Eléctrico de motor, sistema de motor, módulos switch, sensores eléctricos, interruptor, conversor, vorad radar, Ecm, Horton, Cummins, MWM y más.',
            keywords:
              'sistema electrico de motor, sistema de motor, modulos switch, sensores electricos de motor, interruptor, conversor, vorad radar, Ecm, Horton, Cummins, MWM. ',
            url: url + urlMotor + 'sistema-electrico-de-motor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'alternadores-y-componentes':
          meta = {
            title: 'Todo en alternadores | Motor y Transmisión',
            description:
              'Alternadores, componentes de alternador, Alt-1006, Alt-1240, Alt. 1003, Alt-1004, Alt-2120, Alt-2502, Alt-3650, Kuboshi, Bosh, Unipoint, Delco Remy. ',
            keywords:
              'Alternadores, componentes de alternador, Alt-1006, Alt-1240, Alt. 1003, Alt-1004, Alt-2120, Alt-2502, Alt-3650, Kuboshi, Bosh, Unipoint, Delco Remy.  ',
            url: url + urlMotor + 'alternadores-y-componentes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'motor':
          meta = {
            title: 'Motores para tu Vehículo | Motor y Transmisión',
            description: 'Motor y transmisión para tu vehículo: motor, motor completo, motor de camión y más. ',
            keywords: 'Moto, motor completo, motor de camion, motor de vehiculo, ',
            url: url + urlMotor + 'motor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'repuestos-para-equipos-de-carga':
          meta = {
            title: 'Repuestos para equipos de Carga para tu vehículo',
            description:
              'Repuestos para Equipos de Carga: repuestos, autoencarpe, enganches, componentes de estanques, de silos, de bateas, repuestos de remolques y semiremolques y más. ',
            keywords:
              'repuestos para equipos de carga, equipos de carga, repuestos,  autoencarpe, repustos auntoencarpe, enganches, componentes de estanques, componentes de silos, componentes de bateas, repuestos de remolques,  repuestos de semiremolques, guardafangos, repuestos guardafangos, soportes, cierres, bisagras, Randon, HDP, Forbal, Suntech, Copar, Jost, Blacksmith, Rockinger, Ampro. ',
            url: url + urlRepuestos + 'repuestos-para-equipos-de-carga'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'autoencarpes':
          meta = {
            title: 'Autoencarpe | Repuestos para Equipos de Carga',
            description:
              'Autoencarpe: repuestos, carpas, ejes, poleas de autoencarpe, motor, manivelas, resortes de equipos de carga, rolete fijación, autoencarpe manual, eléctrico y más. ',
            keywords:
              'Repuestos autoencarpe, autoencarpe, auto encarpe, Carpas, Ejes, Poleas de autoencarpe, Motor, Manivelas, resortes de equipos de carga, Rolete fijacion, Autoencarpe estacionamiento manual, autoencarpe electrico,  browsliders, autoencarpe flash, Componentes electricos, Donovan, Jost, SCC, Gillibrand, Randon. ',
            url: url + urlRepuestos + 'autoencarpes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'enganches':
          meta = {
            title: 'Enganches para equipos de Carga  | Repuestos para Equipos de Carga',
            description:
              'Enganches para equipos de carga: tornamesas, quinta rueda, perno rey, muelas, piñas, kit de reparaciones de muelas, de quinta rueda, lanza, gato apoyo y más. ',
            keywords:
              'tornamesas, quita rueda, perno rey, muelas, piñas, kit de reparaciones de muelas, kit de reparacion de quinta rueda, buje quinta rueda, lanza, gato apoyo, bujes, resortes lanza, Suntech, Jost, Rockinger, Randon, Gaff, Silpa, HDP, Automann, Ampro, Cars, ',
            url: url + urlRepuestos + 'enganches'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-de-estanques-y-silos':
          meta = {
            title: 'Componentes de estanques y silos | Repuestos para Equipos de Carga',
            description:
              'Componentes de estanques y silos: válvulas mecánicas para combustible, para químicos, de descargas, sistemas de control y de descargas, tapas de estanques y más.',
            keywords:
              ' Valvulas mecanicas para combustible, valvulas mecanicas para quimicos, valvulas de descargas,  seguridad para silos, sistemas de control, sistema de descargas, acoples,  tapas de estanques, tapas de silos, tapas de valvulas de descarga para silos, OPW, Randon, Betico,  Aile.',
            url: url + urlRepuestos + 'componentes-de-estanques-y-silos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'hidraulica-para-equipos-de-carga':
          meta = {
            title: 'Hidráulica para equipos de carga | Repuestos para Equipos de Carga',
            description:
              'Hidráulica para equipos de carga: comandos, cilindros, acoples, bombas hidráulicas, filtros, válvulas hidráulicas, kit hidráulicos, estanques y más.',
            keywords:
              'equipos de carga, comandos, cilindros, acoples, bombas hidraulicas, filtros, valvulas hidraulicas, kit hidraulicos, estanques, Hyva, Randon, Hyundai. ',
            url: url + urlRepuestos + 'hidraulica-para-equipos-de-carga'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-de-furgones-y-sider':
          meta = {
            title: 'Componentes de Furgones y Siders | Repuestos para Equipos de Carga',
            description:
              'Componentes de furgones y siders: furgones, siders, paneles, perfiles, pilares, catracas, cortinas laterales, puertas traseras, nan, accesorios y más.',
            keywords:
              'furgones, siders, paneles, perfiles, pilares, catracas, cortinas laterales, puertas traseras, nan, accesorios  Randon, HYVA, Kinedyne,  Allsafe. ',
            url: url + urlRepuestos + 'componentes-de-furgones-y-sider'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios-de-enganche':
          meta = {
            title: 'Accesorios de enganche para tu Equipo de Carga | Repuestos para Equipos de Carga',
            description:
              'Accesorios de enganche: candados perno rey, disco de fricción, zapatas, pernos de fijación de enganche, base de quinta rueda y más.',
            keywords:
              'Candados perno rey, Disco de friccion, Zapatas, Pernos de fijacion de enganche, Base de quinta rueda y mas. todo de las mejores marcas del mercado, Ampro, Jost, Automann, Midwest, Suntech, Randon y Rockinger.',
            url: url + urlRepuestos + 'accesorios-de-enganche'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'guardafangos-soportes-y-accesorios':
          meta = {
            title: 'Guardafangos para tu equipo de carga | Repuestos para Equipos de Carga',
            description:
              'Guardafangos, soporte y accesorios: guardafangos, envolventes, fijadores, gomas y soportes para guardafangos, guardafangos bipartidos, guardafangos de fibra y más.',
            keywords:
              'Guardafangos, guardafangos envolventes, fijadores para guardafangos , gomas para guardafangos, guardafangos bipartidos, soportes de guardafangos, guardafalgos de fibra, HDP, Forbal, Copar, Randon, Suntech, Kingroy, ',
            url: url + urlRepuestos + 'guardafangos-soportes-y-accesorios'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-remolques-y-semiremolques':
          meta = {
            title: 'Componentes Remolques y Semiremolques | Repuestos para Equipos de Carga',
            description:
              'Componentes Remolques y Semiremolques: barandas frontales, cajas organizadoras, soporte de remolques, para cajas de remolque, estanques, dispensadores y más.',
            keywords:
              ' barandas frontales, cajas organizadoras de equipos de carga, soporte para cajas de remolque, sopote de remolques, accesorios para cajas de remolque, estanques de equipos de carga,  dispensadores de equipos de carga, Randon, Forbal, Copar, HDP,  Daker, Kingroy, Marssoli, Bepo. ',
            url: url + urlRepuestos + 'componentes-remolques-y-semiremolques'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-de-bateas':
          meta = {
            title: 'Componentes de Bateas | Repuestos para Equipos de Carga',
            description:
              'Componentes de bateas: puertas de descarga para bateas, apoyos caja de carga, tapa, resorte, broche tapa parachoques, buje mayor, tubo alta presión y más.',
            keywords:
              'bateas, puertas de descarga para bateas, apoyos caja de carga, tapa parachoques, resorte parachoque, Broche tapa parachoque, Buje mayor, resorte , apoyo caja carga, tuercas, tubo alta presion, jaula señalera,  Randon, Kinedyne, Goros,Marssoli,  HYVA, Emco',
            url: url + urlRepuestos + 'componentes-de-bateas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'gato-de-apoyo':
          meta = {
            title: 'Gato de apoyo para tu vehículo | Repuestos para Equipos de Carga',
            description:
              'Gato de apoyo para tu vehículo: bujes, resortes, repuesto de gato de apoyo, pasador elástico gato de apoyo, piñón gato de apoyo y más.',
            keywords:
              'Gato de apoyo, bujes de gato de apoyo, resortes de gato de apoyo, repuesto gato de apoyo, pasador elastico gato de apoyo, piñon garo de apoyo, Suntech, Ampro, Jost, Fuwa, Cmec, Randon y Agrale',
            url: url + urlRepuestos + 'gato-de-apoyo'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'cierres-y-bisagras-de-equipo-de-carga':
          meta = {
            title: 'Cierres y Bisagras de equipos de Carga | Repuestos para Equipos de Carga',
            description:
              'Cierres y bisagras de equipos de carga: bisagras para equipos de carga, brazos para equipos de carga, codos para equipos de carga y más.',
            keywords:
              'Bisagras para equipos de carga, brazos para equipos de carga, codos para equipos de carga, Donovan, Randon. ',
            url: url + urlRepuestos + 'cierres-y-bisagras-de-equipo-de-carga'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'parachoques-y-componentes':
          meta = {
            title: 'Parachoques y componentes | Repuestos para Equipos de Carga',
            description:
              'Parachoques y Componentes: Randon, parachoque columna izquierda, parachoque columna derecha, pasador de columna, eje, resorte, parachoque móvil y más.',
            keywords:
              'Randon, Parachoque columna izquierda, parachoque de columna derecha, Pasador de columna, eje, resorte, parachoque movil.',
            url: url + urlRepuestos + 'parachoques-y-componentes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'fijacion-de-carga':
          meta = {
            title: 'Fijación de Carga | Repuestos para Equipos de Carga',
            description: 'fijacion de carga, cadenas de carga, cadenas, tensores de carga, tensores, .',
            keywords: 'fijacion de carga, cadenas de carga, cadenas, tensores de carga, tensores, ',
            url: url + urlRepuestos + 'fijacion-de-carga'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'seguridad-herramientas-y-tiempo-libre':
          meta = {
            title: 'Seguridad, Herramientas y Tiempo Libre | Todo en un solo lugar',
            description:
              'Equípate comprando todo en un solo lugar: equipos de seguridad y prevención de riesgos, herramientas, seguridad vial, organizadores, colchones, ropa de cama y más.',
            keywords:
              'equipos de seguridad, quipo de prevencion de riesgos, Accesorios de seguridad, herramientas, seguridad vial, seguridad señaletica, equipamientos para taller, Racks, recipientes, segurodad en rodado, cajas de seguridad, organizadores, maquinaria especializada, colchones, ropa de cama. ',
            url: url + urlSeguridad
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'accesorios':
          meta = {
            title: 'Accesorios | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Accesorios: pulverizador, neveras, botiquines,  extintores, cintas de prevención, calibrador presión neumáticos, mesas, sillas, parrillas, parlantes y más.',
            keywords:
              'Accesorios de seguridad, accesorios, pulverizador rociador, Neveras, Termos, mug, Protectores solares, Botiquines, Kit de emergencia, Prevencion derrames, Extintores, Cintas de prevencion, Calibrador presion neumaticos, Mesas , sillas, Parrillas, cocinillas, Parlantes,  equipos de musica, Portaequipajes portabicicletas,  barras, Porta extintores.  ',
            url: url + urlSeguridad + 'accesorios'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'herramientas-manuales':
          meta = {
            title: 'Todo tipo de Herramientas |Seguridad, Herramientas y Tiempo Libre',
            description:
              'Herramientas manuales: atornillador, gatas hidráulicas, herramientas manuales, mecánicas, multiuso y medición, graseras, brocas, llaves para ruedas y más.',
            keywords:
              'Herramientas, atornillador, apriete, gatas hidraulicas,  manuales multiuso y medicion, herramientas de mecanica, graseras, brocas, set de herramientas, discos de corte, patos, pistolas calafateras, llaves para ruedas, multiplicadores de torque, Blacksmith, Tableau,  Tactix,  Bahco, Slime, PowerPro, Sbu, Agrale, 3M, King Tony, Randon, Kiomi.  ',
            url: url + urlSeguridad + 'herramientas-manuales'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'equipamientos-de-taller':
          meta = {
            title: 'Equipa tu Taller | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Equipa tu taller con: amarre de cables, cinta aisladora, abrazaderas, tubos corrugados, linternas, alargadores, pisos, banquillos, golillas, pasadores y más.',
            keywords:
              'Amarre de cables, cinta aisladora, abrazaderas, tubos corrugados, linternas, lamparas, alargadores, camillas, pisos , banquillos, oring, golillas, pasadores, remaches, termorretractil, 3M, Tactix,  Onsite, Dimaflow, Suntech, Imbest, Loctite, Sonic, Mikels, Randon.',
            url: url + urlSeguridad + 'equipamientos-de-taller'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'seguridad-vial-y-senaletica':
          meta = {
            title: 'Seguridad vial y señalética para la ruta | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Seguridad Vial: conos, cadenas plásticas, balizas, pertigas, topes estacionamientos, triángulos, alarmas de retroceso, cintas reflectantes y más.',
            keywords:
              'Conos, cadenas plasticas, balizas, pertigas, balizas, pertigas, topes estacionamientos,  triangulos, alarmas de retroceso,  cinta reflectante bicolor, cinta reflectante fluor, cinta fluor, cinta blanca, cinta roja, cinta reflectante escolar, cinta escolar,  cinta reflectante blanca, cinta reflectante roja.  3M, Blacksmith, Avery dennison,  Rgb,  Smart Alarm, Proparts, Imbest,  Minsafe. ',
            url: url + urlSeguridad + 'seguridad-vial-y-senaletica'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'seguridad-en-rodado':
          meta = {
            title: 'Seguridad en Rodado | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Seguridad en rodado: cuñas, portacuñas, soporte para cuñas, cables de seguridad, indicador de torque, seguros para tuercas, cadenas para nieve y más.',
            keywords:
              'Cuñas, portacuñas,soporte para cuñas, cables de seguridad,  Indicador de torque, seguros para tuercas, cadenas para nieve, Blacksmith, Takler, Business lines, Copar, Suntech, Proparts',
            url: url + urlSeguridad + 'seguridad-en-rodado'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'maquinaria-especializada':
          meta = {
            title: 'Todo en Maquinaria especializada | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Maquinaria especializada: motores, generadores, compresores, hidrolavadoras, aspiradoras, barredoras, maquinaria de soldador y más.',
            keywords:
              'Motores, generadores, compresores, Hidrolavadoras, aspiradoras, barredoras, maquinaria de soldador,  c hallenger, Karcher, Imbest, Force Action.',
            url: url + urlSeguridad + 'maquinaria-especializada'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'racks-y-recipientes':
          meta = {
            title: 'Racks y recipientes | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Racks y Recipientes: bidones, embudos, estanques de agua, bandeja para aceite, estanque plástico, bomba de trasvasije, bomba barril manual, contenedor y más.',
            keywords:
              'racks, recipientes, bidones, embudos, estanques de agua, bandeja para aceite, esante plastico, bomba de trasvasije, bomba barril manual,   contenedor, Goodcar, King Tony, JRP, Suntech, tactix, lubritek, MotorLife, ',
            url: url + urlSeguridad + 'racks-y-recipientes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'seguridad':
          meta = {
            title: 'Implementos de Seguridad | Seguridad, Herramientas y Tiempo Libre',
            description:
              'Implementos de seguridad: seguridad, trabavolante, trabarueda, candados, cadenas, corta corriente y más.',
            keywords:
              'Seguridad, Trabavolante, trabarueda, candados, cadenas, corta corriente, combustible, Odis, Blacksmith, Imbest, Kipor.  ',
            url: url + urlSeguridad + 'seguridad'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'cajas-y-organizadores':
          meta = {
            title: 'Cajas y Organizadores | Seguridad, Herramientas y Tiempo Libre ',
            description:
              'Cajas y Organizadores: cajas metálicas, plásticas, carro de carga, organizador, carro herramientas, organizador tipo maleta, gabinetes plásticos y más.',
            keywords:
              'Cajas , Organizadores, cajas metalicas, cajas plasticas, carro de carga, organizador, caja de trasporte metalica, carro herramientas, bolsa ecologica, organizador tipo maleta, gabinetes plasticos, Rubbermaid, Tactix, ',
            url: url + urlSeguridad + 'cajas-y-organizadores'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'colchones-y-ropa-de-cama':
          meta = {
            title: 'Frazadas y ropa de cama | Seguridad, Herramientas y Tiempo Libre',
            description: 'Porque también nos preocupamos de tí, encuentra colchones, ropa de cama, frazadas y más.',
            keywords: 'Frazadas, Frazadas de una plaza,  ',
            url: url + urlSeguridad + 'colchones-y-ropa-de-cama'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'colchones-y-ropa-de-cama':
          meta = {
            title: 'Frazadas y ropa de cama | Seguridad, Herramientas y Tiempo Libre',
            description: 'Porque también nos preocupamos de tí, encuentra colchones, ropa de cama, frazadas y más',
            keywords: 'Frazadas, Frazadas de una plaza,  ',
            url: url + urlSeguridad + 'colchones-y-ropa-de-cama'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'suspension-y-frenos':
          meta = {
            title: 'Suspensión y freno para tu vehículo',
            description:
              'Suspensión de auto y camión, frenos de auto y camión, accesorios de freno, accesorios de neumáticos, suspensiones mecánicas y neumáticas, mazas, ejes y más.',
            keywords:
              'Suspension, suspension de auto, suspension de camion, suspension de vehiculo, freno de auto, freno de camion, freno, freno de vehiculo, accesorios de freno, accesorios de neumaticos, suspensiones mecanicas, componentes de mazas, mazas, suspensiones neumaticos, , ejes, ejes de camion, ejes de auto, ejes de vehiculo, sistema abs, sistema ebs, sistema abs y ebs, pulmon de suspension, control de frenos, kit de suspension, pulmon, camara de frenos, amortiguadores, amortiguadores de camion, amortiguadores de vehiculo, amortiguadores de auto, pulmon de levante, pulmon de cabina, ebs y abs.  ',
            url: url + urlFrenos
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-de-frenos':
          meta = {
            title: 'Componentes de Freno | Suspensión y Freno',
            description:
              'Componente de frenos: accesorio de frenos, patines, pastillas, resorte, bujes, tambores y discos de freno, retem de rodillo seguro, pasadores, balatas y más.',
            keywords:
              'Componente de freno, accesorio de frenos, frenos, retem de rodillo seguro, pasadores, patines, patines de freno, patin de freno, resorte de freno, ejes de levas, bujes de frenos, tambores de freno, discos de freno, balatas, ajustadores chicharra de freno, chicharra de freno, piezas de reparacion, cajas comando, pastillas de freno, caliper, componentes caliper, remaches, cilindros de frenos, Suntech, MBA, Frasle, NAM, Master, Best Breake, Frum, Tome, Metrofund, stark, Batista.  ',
            url: url + urlFrenos + 'componentes-de-frenos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-sistemas-neumaticos-para-frenos':
          meta = {
            title: 'Componentes Sistemas Neumáticos para Frenos | Suspensión y Freno',
            description:
              'Componentes sistema de neumáticos para frenos: secadores, válvulas, tecalan, flexibles y mangueras espiral de freno, estanques y gobernadores de aire y más.',
            keywords:
              'Componentes sistema de neumaticos para frenos, sistema de neumaticos, secadores de sistema de neumaticos para frenos, valvulas para frenos, conexiones niplerias, estanques de aire, gobernadores de aire, manos de acople, mangueras espiral de freno, tecalan, tecalan de freno, manometros, reguladores, flexibles de frenos, valvulas de freno, Wolds American Parts, Sorl, Randon, Mindwest, Haldex, Brex, Engatcar, SBU, Suntech. ',
            url: url + urlFrenos + 'componentes-sistemas-neumaticos-para-frenos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-suspensiones-mecanicas':
          meta = {
            title: 'Componentes Suspensiones Mecánicas | Suspensión y Freno',
            description:
              'Componentes suspensiones mecánicas: bujes y abrazaderas, soportes de suspensión, paquetes resortes, balancines, torres, tensores y ejes de suspensión y más.',
            keywords:
              'suspension mecanica, soportes de suspension, paquetes resortes, bujes de suspension mecanica, abrazaderas de suspension mecanica, balancines, torres de suspension, tensores de suspension, pasadores de balancin, kit de levante, ejes de suspension, Suspensys, Gaff, Suntech, Automann, Randon, Zurlo, Ampro, Rassini.  ',
            url: url + urlFrenos + 'componentes-suspensiones-mecanicas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-de-mazas':
          meta = {
            title: 'Componentes de Mazas| Suspensión y Freno',
            description:
              'Componentes de mazas: tuercas golillas, llave de maza, rodamientos, pernos, tuercas de rueda, mazas, guardapolvos, tapas de mazas, hubodometro y más.',
            keywords:
              'Componentes de mazas, tuercas golillas, tuercas, llave de maza, rodamientos rodado, pernos, tuercas de rueda, mazas, guardapolvos, tapas de mazas, retenes rodado, hubodometro, Suntech, Gaff, Randon, Suspensys, Automann, MBA, Midwest, Meritor, SKF, Ampro, Transtec, HDP, Cercena, Premier, Rodafuso, Sebo. ',
            url: url + urlFrenos + 'componentes-de-mazas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-suspensiones-neumaticas':
          meta = {
            title: 'Componentes Suspensiones Neumáticas | Suspensión y Freno',
            description:
              'Componentes suspensiones neumáticas: válvulas, herramientas de instalación de bujes, bujes, soporte, kit de levante y abrazaderas de suspensión neumática y más.',
            keywords:
              'Suspensiones neumaticas, valvulas de suspension, herramientas de instalacion de bujes, intalacion de bujes, bujes de suspension mecanica, soporte de suspension neumatica, suspension neumatica, kit de levante suspension neumatica, abrazaderas de suspension neumatica, Gaff, Haldex, Randon, Automann, Midwest, Sorl, Jost, Watson & Chalin, Suspensys,  ',
            url: url + urlFrenos + 'componentes-suspensiones-neumaticas'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'ejes':
          meta = {
            title: 'Ejes | Suspensión y Freno',
            description:
              'Ejes de suspensión y frenos: ejes, ejes disco americano, ejes disco europeo, ejes americanos, ejes europeos, vigas, ejes artilleros, ejes especiales y más.',
            keywords:
              'ejes, ejes disco americano, ejes disco europeo, ejes americanos, ejes europeos, vigas, ejer artilleros, ejes especiales, Suntech, Ampro, Suspensys, Fuwa, Watson & Chalin, Crane, Randon, Cars, Meister, Fuda, ',
            url: url + urlFrenos + 'ejes'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'componentes-sistemas-abs-y-ebs':
          meta = {
            title: 'Componentes Sistemas ABS y EBS | Suspensión y Freno',
            description:
              'Componentes sistemas ABS y EBS: sistema de frenado antibloqueo, sistema eléctrico de frenado,  anillos para ABS y EBS, válvulas para ABS y EBS y más.',
            keywords:
              'Componentes sistemas ABS, sistema de frenado antibloqueo, sistema abs, sistema electrico de frenado, sistema ebs, anillos para abs, anillos para ebs, electricos para abs, electricos para ebs, valvulas para abs, valvulas para ebs, Ecu unidad de control electronico abs, ecu unidad de control ebs, sensores abs, sensores ebs, valvulas antibloqueo, Haldex, Engatcar, Randon, Automann, Sorl, TRP, Wabco, 3M, ',
            url: url + urlFrenos + 'componentes-sistemas-abs-y-ebs'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'pulmones-de-suspension':
          meta = {
            title: 'Pulmones de Suspensión | Suspensión y Freno',
            description:
              'Pulmones de suspensión: pulmón de suspensión, kit de bolsas, fuelle de suspensión y más. Firestone, Stark, Ampro, Contitech, Goros, Suntech, Randon.',
            keywords:
              'Pulmon de suspension, kit de bolsas, fuelle de suspension, Meklas, Firestone, Stark, Ampro, Contitech, Watson & Chalin, Goros, Suntech, Randon, Fervi air, Euclid, ',
            url: url + urlFrenos + 'pulmones-de-suspension'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistemas-de-control-de-frenos':
          meta = {
            title: 'Sistema de Control de Frenos | Suspensión y Freno',
            description:
              'Sistema de control de frenos, control de frenos, kit ABS, kit EBS, soft docking y más. Haldex, Wabco, Randon, Byf, 3M. ',
            keywords:
              'Sistema de control de frenos, control de frnos , kit abs, kit ebs, Soft docking, abs, ebs, Haldex, Wabco, Randon, Byf, 3M.  ',
            url: url + urlFrenos + 'sistemas-de-control-de-frenos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'kit-de-suspensiones':
          meta = {
            title: 'Kit de Suspensiones | Suspensión y Freno',
            description:
              'Kit de suspensiones: suspensión mecánica, neumática, pernos, tuercas, golillas de suspensión, pernos de suspensión, tuercas de suspensión y más. ',
            keywords:
              'Kit de suspension, suspension, suspension mecanica, suspension neumaticos, pernos, tuercas, golillas de suspension, pernos de suspension, tuercas de suspension, Randon, Agrale, Watson & Chalin, Suntech, Suspensys, Jost, Zurlo, Silpa, Gaff. ',
            url: url + urlFrenos + 'kit-de-suspensiones'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'pulmones-y-camaras-de-frenos':
          meta = {
            title: 'Pulmones y Cámara de Frenos | Suspensión y Freno',
            description:
              'Encuentra Pulmones y Cámara de Frenos: pulmones de frenos, cámara de frenos, membrana pulmón de frenos y más. Sorl, Suntech, Master, Premier, TRP, Randon. ',
            keywords:
              'pulmones, pulmon de freno , camara, camara de freno, Membrana pulmon de freno,  Sorl, Suntech, Master, Premier, TRP, Randon, Euclid, Meritor,  ',
            url: url + urlFrenos + 'pulmones-y-camaras-de-frenos'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'pulmones-de-levante':
          meta = {
            title: 'Pulmones y Cámara de Frenos | Suspensión y Freno',
            description:
              'Pulmones de levante: fuelle, fuelle de levante, pulmón de levante dos vueltas. Firestone, meklas, Jost, Stark, Randon, Contitech, Ampro, Suntech, Zurlo y más.',
            keywords:
              'Pulmon, pulmon de levante, fuelle, fuelle de levante, pulmon de levante dos vueltas, pulmon de levante 2 vueltas, Firestone, meklas, Jost, Stark, Randon, Contitech, Ampro, Suntech, Zurlo, Euclid.  ',
            url: url + urlFrenos + 'pulmones-de-levante'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'amortiguadores':
          meta = {
            title: 'Amortiguadores | Suspensión y Freno',
            description:
              'Amortiguadores: amortiguadores de suspensión, de cabina, de camión, de vehículos, amortiguador de neumáticos. Randon, Suspensys, Watson & Chalin, Cofap.',
            keywords:
              'Amortiguadores, amortiguadores de suspension, amortiguadores de cabina, amortiguador, amortiguadores de camion, amortiguadores de vehiculo, amortiguadores de auto, Amortiguador de neumaticos,  Randon, Suspensys, Watson & Chalin, Cofap, Nakata, Automann, HBZ, ',
            url: url + urlFrenos + 'amortiguadores'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'pulmones-de-cabina':
          meta = {
            title: 'Pulmones de Cabina | Suspensión y Freno',
            description: 'Pulmones de cabina: pulmones, soporte amarra y gancho, soporte cabina delantero y más.',
            keywords: 'pulmon, pulmon de cabina, Soporte amarra y gancho, soporte cabina delantero,  Automann. ',
            url: url + urlFrenos + 'pulmones-de-cabina'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'transporte-de-pasajeros':
          meta = {
            title: ' Transporte de Pasajeros | Especial buses',
            description:
              'Transporte de pasajeros: implementos, accesorios, motor, transmisión, dirección, iluminación, vidrios, parabrisas, suspensión, frenos y climatización de buses.',
            keywords:
              'Transporte de pasajeros, sistema de alimentacion, buses, implementos de buses, accesorios de buses, motor de buses, carroceria mayor, transmision buses, direccion buses, carroceria menos, iluminacion buses, vidrios buses, parabrisas buses, vidrios, parabrisas, suspension buses, freno buses, filtracion buses, climatizacion buses. ',
            url: url + urlPasajeros
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'sistema-de-alimentacion':
          meta = {
            title: 'Sistema de alimentación del motor | Transporte de Pasajeros',
            description:
              'Sistema de alimentación: de motor, turbos, empaquetaduras múltiples, sensores, válvulas, inyectores de sistema de alimentación, bomba inyectora y más.',
            keywords:
              'sistema de alimentacion, sistema de alimentacion de motor, turbos, empaquetadiras multiples, sensores de sistema de alimentacion, valvulas sistema de alimentacion, inyectores sistema de alimentacion, bomba inyectora, bomba inyectora sistema de alimentacion, bombas cebadoras, bombas de transferencia, cañerias de inyeccion, riel de combustible, compresor de motor, empaquetaduras de turbo, dreno motor, estanques de conbustible, Holset, Borgwarner, Garrett, Holset, Suntech, Fuller, Sabo, Robur, Automann, TRP, Cummins, Vaden, ZF, Knorr, Bosch, Horton, Bendix.  ',
            url: url + urlPasajeros + 'sistema-de-alimentacion'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'motor-buses':
          meta = {
            title: 'Motor de Buses | Transporte de Pasajeros',
            description:
              'Motor de Buses: alimentación de motor, escapes buses, mangueras, conexiones buses, periférico, empaquetaduras de motor, sellos, culatas, refrigeración y más.',
            keywords:
              'Motor de buses, buses, todo buses, alimentacion de motor, escapes buses, mangeras, conexiones buses, periferico de motor buses, empaquetaduras de motor, selos de buses, empaquetaduras buses, culatas, culatas buses, refrigeracion, sistema de refrigeracion, refrigeracion de buses, Block de buses, carter de buses, motor parcial, empaquetadura carter, MWM,Cummins, Click, Agrale, 3M. ',
            url: url + urlPasajeros + 'motor-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'carroceria-mayor':
          meta = {
            title: 'Carrocería Mayor Buses | Transporte de Pasajeros',
            description:
              'Carrocería mayor: puertas de buses, portezuelas, sistema de apertura, sistema de cierre, embellecedoras, estructuras, asientos, gomas, revestimiento buses y más.',
            keywords:
              'carroceria mayor, carroceria de buses, puertas de buses, puertas, portezuelas de buses, sistema de apertura, sistema de cierre buses, embellecedoras, estructuras, estructuras de buses, asientos de buses, asientos, gomas, gomas de buses, revestimiento interno, revestimiento buses, revestimiento interno buses, Amicintos, 3M, BMP, Marcopolo, Transacta, FNA, ISRI,  ',
            url: url + urlPasajeros + 'carroceria-mayor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'transmision-buses':
          meta = {
            title: 'Transmisión Buses | Transporte de Pasajeros',
            description:
              'Transmisión buses: caja de cambios buses, diferencial buses, embriagues buses, cardanes de buses, crucetas de buses y más. Agrale, Marcopolo, MWM, 3M, Eaton.',
            keywords:
              'Transmision de buses, caja de cambios buses, diferencial buses, embriagues buses, cardanes de buses, crucetas de buses, MWM, Agrale, Meritor, Eaton, 3M, Marcopolo, Timken.  ',
            url: url + urlPasajeros + 'transmision-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'direccion-buses':
          meta = {
            title: 'Dirección Buses | Transporte de Pasajeros',
            description:
              'Dirección Buses: cambio dirección, ensambles de dirección bus, ejes de bus, cajas de dirección, bombas de dirección, mazas de buses y más. ',
            keywords:
              'Direccion bus, cambio direccion, ensambles de direccion bus, ejes de bus, cajas de direccion, bombas de direccion, mazas de buses, Della Rosa, Meritor, Agrale, Western Star, Suspensys, 3M. ',
            url: url + urlPasajeros + 'direccion-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'carroceria-menor':
          meta = {
            title: 'Carrocería Menor Buses | Transporte de Pasajeros',
            description:
              'Carrocería menor: carrocería de buses, eléctricos de buses, limpiaparabrisas, sanitarios de buses, espejos de buses, plumillas buses, soquete buse y más. ',
            keywords:
              'carroceria de buses, carrocerias menor, electricos de buses, limpiaparabrisas, limpia parabrisas, limpia parabrisas de buses, sanitarios de bus, espejos de buses, espejos, plumillas buses, soquete buse, RGB, Multilight, BMP, Marcopolo, Guangxi, Agrale, Bosch, Doga, Granero, Ariesa, Visorama, Priority, Vidroforte. ',
            url: url + urlPasajeros + 'carroceria-menor'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'iluminacion-buses':
          meta = {
            title: 'Iluminación Buses | Transporte de Pasajeros',
            description:
              'Iluminación buses, iluminación, luces para buses, periféricos de iluminación, leds, focos internos, leds internos, iluminación frontal, iluminación trasera. ',
            keywords:
              'Iluminacion buses, iluminacion, luz para buses, luces para bus, perifericos de iluminacion, luces perifericas, leds, focos internos, leds internos, iluminacion frontal, iluminacion trasera, Marcopolo, Haocheng, Multilight, IAM, RCD, Suntech. ',
            url: url + urlPasajeros + 'iluminacion-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'vidrios-y-parabrisas-buses':
          meta = {
            title: 'Vidrios y Parabrisas Buses | Transporte de Pasajeros',
            description:
              'Vidrios y Parabrisas Buses: vidrios de buses, ventanas, parabrisas de bus, lunetas de bus, lunetas, Marcopolo, Fanavid, Vidroforte, Miyasato.  ',
            keywords:
              'Vidrios, vidrios de bus, ventanas, ventanas de bus, parabrisas de bus, parabrisas, lunetas de bus, lunetas, Marcopolo, Fanavid, Vidroforte, Miyasato.  ',
            url: url + urlPasajeros + 'vidrios-y-parabrisas-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'suspension-buses':
          meta = {
            title: 'Suspensión Buses | Transporte de Pasajeros',
            description:
              'Suspensión Buses: suspensión bus, sistema de suspensión, suspensión mecánica, suspensión neumática y más. Agrale, 3M, Cofap.   ',
            keywords:
              'suspension bus, suspension, sistema de suspension, suspension mecanica, suspension neumatica, suspension mecanica de bus, suspension neumatica de bus, Agrale, 3M, Cofap. ',
            url: url + urlPasajeros + 'suspension-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'freno-buses':
          meta = {
            title: 'Frenos Buses | Transporte de Pasajeros',
            description:
              'Freno de Buses: sistema de freno, filtro secado de aire, patín de freno, serpentín compresor, goma pedal freno, válvula moduladora, chicharra y tambor freno. ',
            keywords:
              'Freno de buses, sistema de freno bus, filtro secado de aire, resorte patin de freno, patin de freno, Serpentin compresor, Goma pedral freno , Valvula moduladora, Chicharra freno, Tambor de freno,   Sensor Abs, Wabco,  Agrale,  Sorl, Master, ',
            url: url + urlPasajeros + 'freno-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'filtracion-buses':
          meta = {
            title: 'Todo en Filtros de Buses|Implementos.cl ',
            description:
              'Filtración Buses: filtro de bus, filtro de vehículo, filtro de aire, filtro de combustible, filtro separador,  filtro de aceite. Agrale, MWM, Donalson.',
            keywords:
              'Fitracion de bus, filtro de bus, filtro de vehiculo, filtro, filtro de aire, filtro de combustible, filtro separador,  filtro de aceite, Tecfil, Fleetguard, Agrale, MWM,  Racor, Donalson, Vehtec.',
            url: url + urlPasajeros + 'filtracion-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        case 'climatizacion-buses':
          meta = {
            title: 'Climatiza tu bus | Implementos.cl',
            description:
              'Climatización Buses: aire acondicionado, sistema de climatización, válvula de calefacción, motor ventilador. BMP, Marcopolo, Continental, Goodyear, Valeo y más.',
            keywords:
              'Climatizacion, aire acondicionado de buses, aire para bus, sistema de climatizacion de bus, climatizacion bus, aire para buses, valvula de calefaccion, motor ventilador, Schumacher, Spheros, Optibelt, BMP, Webasto, Priority, Marcopolo, Spheros, Continental, Goodyear, Transacta, Dayco, Valeo',
            url: url + urlPasajeros + 'climatizacion-buses'
          };
          this.seoService.generarMetaTag(meta);
          break;
        default:
          meta = {
            title: 'Productos en Categoría ' + category,
            description: 'Productos en Categoría ' + category,
            keywords: category.replace(/(\b(\w{1,3})\b(\s|$))/g, '')
          };
          this.seoService.generarMetaTag(meta);
          break;
      }

      if (isPlatformBrowser(this.platformId)) {
        this.canonicalService.setCanonicalURL(location.href);
      }
      if (isPlatformServer(this.platformId)) {
        this.canonicalService.setCanonicalURL(environment.canonical + this.router.url);
      }
      metadataCount++;
    }
  }
  decodedUrl(cadena: string) {
    return decodeURIComponent(cadena);
  }

  setSort(event: any) {
    this.parametrosBusqueda.orden = event;
    let parametros: any = this.parametrosBusqueda;
    this.cargarCatalogoProductos(parametros, this.textToSearch, false);
  }
}
