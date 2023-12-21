import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { LogisticsService } from '../../services/logistics.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';
import { CustomerAddressApiService } from '@core/services-v2/customer-address/customer-address-api.service';
import { IError } from '@core/models-v2/error/error.interface';
import { AddressType } from '@core/enums/address-type.enum';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss'],
})
export class AddressModalComponent implements OnInit {
  @Input() modalAddressRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<any>();

  comunas!: any[];
  localidades!: any[];
  formDireccion: FormGroup;
  // tienda: DireccionMap;
  tienda: any;
  coleccionComuna!: any[];
  autocompletado = true;
  loadingForm = false;

  constructor(
    private fb: FormBuilder,
    private logisticsService: LogisticsService,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly customerAddressService: CustomerAddressApiService
  ) {
    this.formDireccion = this.fb.group({
      calle: new FormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      depto: new FormControl(null),
      numero: new FormControl(null),
      comuna: new FormControl(null, { validators: [Validators.required] }),
      localizacion: new FormControl(null, {
        validators: [Validators.required],
      }),
      latitud: new FormControl(null),
      longitud: new FormControl(null),
      referencia: new FormControl(null),
    });
    this.tienda = null;
  }

  ngOnInit() {
    this.loadComunas();
  }

  set_direccion(data: any[]) {
    this.clearAddress();

    if (this.getAddressData(data[0], 'street_number')) {
      this.formDireccion.controls['calle'].enable();

      if (this.getAddressData(data[0], 'locality')) {
        this.formDireccion.controls['comuna'].setValue(
          this.findComuna(this.getAddressData(data[0], 'locality'))
        );
      } else {
        this.formDireccion.controls['comuna'].setValue(
          this.findComuna(
            this.getAddressData(data[0], 'administrative_area_level_3')
          )
        );
      }
      this.formDireccion.controls['calle'].setValue(
        this.getAddressData(data[0], 'route')
      );
      this.formDireccion.controls['numero'].setValue(
        this.getAddressData(data[0], 'street_number')
      );
      this.formDireccion.controls['latitud'].setValue(data[1].lat);
      this.formDireccion.controls['longitud'].setValue(data[1].lng);

      this.cargarDireccion();
    }
  }

  getAddressData(address_components: any, tipo: string) {
    let value = '';

    address_components.forEach((element: any) => {
      if (element.types[0] == tipo) {
        value = element.long_name;
        return;
      }
    });
    return value;
  }

  findComuna(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      var result = this.comunas.find(
        (data) => this.quitarAcentos(data.value) === nombre
      );

      if (result && result.id) {
        this.obtenerLocalidades(result);
        this.findComunaLozalizacion(result.value);
        return result.id;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  findComunaLozalizacion(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      var result = this.localidades.find(
        (data) => this.quitarAcentos(data.localidad) === nombre
      );

      if (result && result.localidad) {
        this.formDireccion.controls['localizacion'].setValue(result.localidad);
      }
    }
  }

  quitarAcentos(cadena: string) {
    // Definimos los caracteres que queremos eliminar
    var specialChars = '!@#$^&%*()+=-[]/{}|:<>?,.';

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, '_');

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, 'a');
    cadena = cadena.replace(/é/gi, 'e');
    cadena = cadena.replace(/í/gi, 'i');
    cadena = cadena.replace(/ó/gi, 'o');
    cadena = cadena.replace(/ú/gi, 'u');
    cadena = cadena.replace(/ñ/gi, 'n');

    return cadena;
  }

  async agregarDireccion() {
    this.loadingForm = true;
    const {
      calle,
      depto,
      numero,
      comuna,
      localizacion,
      latitud,
      longitud,
      referencia,
    } = this.formDireccion.value;
    const comunaArr = comuna.split('@');
    const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();

    const direccion = {
      documentId: usuario.documentId,
      addressType: AddressType.DELIVERY,
      region: comunaArr[2],
      city: comunaArr[0],
      number: numero.toString(),
      province: comunaArr[1],
      street: calle,
      location: localizacion,
      latitude: latitud,
      longitude: longitud,
      departmentOrHouse: depto,
      reference: referencia,
    };

    this.customerAddressService.createAddress(direccion).subscribe({
      next: (_) => {
        this.toastr.success('Se agrego con exito la dirección');
        this.respuesta.emit(true);
        this.modalAddressRef.hide();
        this.loadingForm = false;
      },
      error: (err: IError) => {
        this.toastr.error('No se logro agregar la direccion');
        this.respuesta.emit(false);
        this.loadingForm = false;
      },
    });
  }

  cargarDireccion() {
    this.tienda = null;
    if (!this.formDireccion.valid) {
      return;
    }
    const { calle, numero, comuna, localizacion } = this.formDireccion.value;
    const comunaArr = comuna.split('@');

    this.tienda = {
      direccion: `${calle} ${numero}`,
      zona: `${comunaArr[0]} ${localizacion}`,
    };
  }

  loadComunas() {
    this.logisticsService.obtieneComunas().subscribe(
      (r: any) => {
        this.coleccionComuna = r.data;
        this.comunas = r.data.map((record: any) => {
          const v =
            record.comuna + '@' + record.provincia + '@' + record.region;
          return { id: v, value: record.comuna };
        });
      },
      (error) => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  obtenerLocalidades(event: any) {
    const localidades: any = [];
    const comunaArr = event.id.split('@');
    const comunas = this.coleccionComuna.filter(
      (comuna) => comuna.comuna == comunaArr[0]
    );
    comunas.map((comuna) =>
      comuna.localidades.map((localidad: any) => localidades.push(localidad))
    );
    this.localidades = localidades;
  }

  geolocalizacion(event: any) {
    this.formDireccion.controls['latitud'].setValue(event.lat);
    this.formDireccion.controls['longitud'].setValue(event.lng);
  }

  clearAddress() {
    this.formDireccion.setValue({
      calle: '',
      depto: '',
      numero: '',
      comuna: '',
      localizacion: '',
      referencia: '',
      latitud: '',
      longitud: '',
    });
  }
}
