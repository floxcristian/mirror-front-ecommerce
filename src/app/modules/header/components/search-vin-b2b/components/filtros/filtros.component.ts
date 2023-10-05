import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { isVacio } from '../../../../../../shared/utils/utilidades'
import { CatalogoService } from '../../../../../../shared/services/catalogo.service'
import {
  BuscadorService,
  BusquedaData,
} from '../../../../../../shared/services/buscador.service'
import { ResponseApi } from '../../../../../../shared/interfaces/response-api'
import { ClientsService } from '../../../../../../shared/services/clients.service'

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
})
export class FiltrosComponent implements OnInit {
  chasisPatente = ''
  marca = ''
  modelo = ''
  anio = ''

  marcas: any
  modelos: any
  anios: any

  @Input() inHeader!: boolean

  constructor(
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private buscadorService: BuscadorService,
    private clientsService: ClientsService,
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

            if (this.inHeader) {
              this.buscadorService.buscar(data)
            } else {
              this.buscadorService.buscarExterno(data)
            }
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
      if (this.inHeader) {
        this.buscadorService.buscar(data)
      } else {
        this.buscadorService.buscarExterno(data)
      }
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
}
