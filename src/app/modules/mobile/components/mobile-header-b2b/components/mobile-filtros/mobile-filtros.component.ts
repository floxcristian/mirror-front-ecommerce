import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ResponseApi } from '../../../../../../shared/interfaces/response-api'
import {
  BuscadorService,
  BusquedaData,
} from '../../../../../../shared/services/buscador.service'
import { CatalogoService } from '../../../../../../shared/services/catalogo.service'
import { ClientsService } from '../../../../../../shared/services/clients.service'
import { isVacio } from '../../../../../../shared/utils/utilidades'

@Component({
  selector: 'app-mobile-filtros',
  templateUrl: './mobile-filtros.component.html',
  styleUrls: ['./mobile-filtros.component.scss'],
})
export class MobileFiltrosComponent implements OnInit {
  chasisPatente = ''
  marca = ''
  modelo = ''
  anio = ''

  marcas: any
  modelos: any
  anios: any

  filtrandoPorVin = false
  filtrandoPorMarca = false

  public event: EventEmitter<any> = new EventEmitter()

  constructor(
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private buscadorService: BuscadorService,
    private clientsService: ClientsService,
    public modalRef: BsModalRef,
  ) {}

  ngOnInit() {
    this.catalogoService.getFiltroAnios().subscribe((resp: ResponseApi) => {
      this.anios = resp.data.map((e: any) => e.anio)
    })
  }

  /* Boton "buscar Vehiculo" - Pestaña VIN / Patente - envia datos al parent para buscar categorias y redireccionar a productos */
  buscarChassis() {
    if (isVacio(this.chasisPatente)) {
      this.toastr.info(
        'Debe ingresar un VIN o un numero de parte.',
        'Información',
      )
    } else {
      this.clientsService
        .getVehiculo(this.chasisPatente)
        .subscribe((resp: ResponseApi) => {
          if (resp.data.length > 0) {
            this.chasisPatente = ''
            const data: BusquedaData = {
              filtro: { vehiculo: resp.data[0] },
            }

            this.buscadorService.buscar(data)
          } else {
            this.toastr.warning('No se encontraron registros.', 'Mensaje')
          }
        })
    }
  }

  /* Boton "buscar Vehiculo" - Pestaña Marca / Modelo / Año - envia datos al parent para buscar categorias y redireccionar a productos */
  buscarVehiculo() {
    if (this.marca === '' || this.modelos === '' || this.anio === '') {
      this.toastr.info(
        'Debe seleccionar una marca, modelo o año.',
        'Información',
      )
    } else {
      const data: BusquedaData = {
        marcaModeloAnio: {
          marca: this.marca,
          modelo: this.modelo,
          anio: this.anio,
        },
      }

      this.buscadorService.setFiltro(true)
      this.buscadorService.buscar(data)
    }
  }

  seleccionaAnio() {
    if (this.anio !== '') {
      this.marca = ''
      this.modelo = ''
      this.catalogoService
        .getFiltroMarcas(this.anio)
        .subscribe((resp: ResponseApi) => {
          this.marcas = resp.data.map((e: any) => e.marca)
        })
    } else {
      this.marca = ''
      this.modelo = ''
    }
  }

  seleccionaMarca() {
    if (this.marca !== '') {
      this.modelo = ''
      this.catalogoService
        .getFiltroModelos(this.anio, this.marca)
        .subscribe((resp: ResponseApi) => {
          this.modelos = resp.data.map((e: any) => e.modelo)
        })
    } else {
      this.modelo = ''
    }
  }

  close(flag: boolean) {
    this.event.emit(flag)
    this.modalRef.hide()
  }
}
