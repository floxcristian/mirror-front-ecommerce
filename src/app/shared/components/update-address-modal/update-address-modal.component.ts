import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Direccion } from '../../interfaces/cliente';
import { Usuario } from '../../interfaces/login';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import { LogisticsService } from '../../services/logistics.service';
import { RootService } from '../../services/root.service';
import { DireccionMap } from '../map/map.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-address-modal',
  templateUrl: './update-address-modal.component.html',
  styleUrls: ['./update-address-modal.component.scss'],
})
export class UpdateAddressModalComponent implements OnInit {
  @Input() modalUpdateAddressRef!: BsModalRef;
  @Input() direccion!: Direccion;
  @Output() respuesta = new EventEmitter<boolean>();

  comunas!: any[];
  coleccionComuna!: any[];
  localidades!: any[];
  address!: DireccionMap | null;
  formDireccion!: FormGroup;
  autocompletado = true;
  loadingForm = false;

  constructor(
    private fb: FormBuilder,
    private logisticsService: LogisticsService,
    private clientsService: ClientsService,
    private root: RootService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadComunas();

    const { calle, numero, comuna, localidad } = this.direccion;
    const comunaArr = comuna.split('@');

    this.address = {
      direccion: `${calle} ${numero}`,
      zona: `${comunaArr[0]} ${localidad}`,
    };

    this.formDireccion = this.fb.group({
      calle: new FormControl(this.direccion.calle, {
        validators: [Validators.required],
      }),
      depto: new FormControl(this.direccion.deptocasa),
      numero: new FormControl(this.direccion.numero, {
        validators: [Validators.required],
      }),
      comuna: new FormControl(null, {
        validators: [Validators.required],
      }),
      localizacion: new FormControl(this.direccion.localidad),
      latitud: new FormControl(this.direccion.lat),
      longitud: new FormControl(this.direccion.lng),
      referencia: new FormControl(this.direccion.referencia),
    });
  }

  set_direccion(data: any[]) {
    const buscar = this.getAddressData(data[0], 'locality').toUpperCase();
    const existe = this.comunas.filter((comuna) => comuna.value == buscar);

    if (existe.length != 0) {
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
    this.getAddressData(data[0], 'street_number')
      ? this.formDireccion.controls['numero'].setValue(
          this.getAddressData(data[0], 'street_number')
        )
      : this.formDireccion.controls['numero'].setErrors({ completar: true });
    this.formDireccion.controls['latitud'].setValue(data[1].lat);
    this.formDireccion.controls['longitud'].setValue(data[1].lng);

    this.obtenerLocalidades({
      id: this.formDireccion.controls['comuna'].value,
    });

    this.cargarDireccion();
  }

  getAddressData(address_components: any[], tipo: string) {
    let value = '';

    address_components.forEach((element) => {
      // tslint:disable-next-line: triple-equals
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

      const result = this.comunas.find(
        (data) => this.quitarAcentos(data.value) === nombre
      );

      if (result && result.id) {
        this.obtenerLocalidades(result);
        this.findComunaLocalizacion(result.value);
        return result.id;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  findComunaLocalizacion(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      const result = this.localidades.find(
        (data) => this.quitarAcentos(data.localidad) === nombre
      );

      if (result && result.localidad) {
        this.formDireccion.controls['localizacion'].setValue(result.localidad);
      }
    }
  }

  quitarAcentos(cadena: string) {
    // Definimos los caracteres que queremos eliminar
    const specialChars = '!@#$^&%*()+=-[]/{}|:<>?,.';

    // Los eliminamos todos
    for (let i = 0; i < specialChars.length; i++) {
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

  async actualizarDireccion() {
    this.loadingForm = true;
    this.cargarDireccion();

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
    const usuario: Usuario = this.root.getDataSesionUsuario();

    const direccion: any = {
      recid: this.direccion.recid,
      rut: usuario.rut,

      tipo: 'DES',
      region: comunaArr[2],
      comuna: comunaArr[0],
      numero: numero.toString(),
      provincia: comunaArr[1],
      direccion: calle,
      localidad: localizacion,
      latitud: latitud.toString(),
      longitud: longitud.toString(),
      deptoCasa: depto,
      referencia,
      codPostal: '0',
      codEmpleado: 0,
      codUsuario: 0,
      cuentaUsuario: usuario.username,
      rutUsuario: usuario.rut,
      nombreUsuario: `${usuario.first_name} ${usuario.last_name}`,
    };

    const resultado: ResponseApi = (await this.clientsService
      .actualizaDireccion(direccion)
      .toPromise()) as ResponseApi;

    if (resultado.error) {
      this.toastr.error('Ocurrió un error al actualizar la dirección');
      this.respuesta.emit(false);
      this.modalUpdateAddressRef.hide();
    } else {
      this.toastr.success('Se actualizó la dirección correctamente');
      this.respuesta.emit(true);
      this.modalUpdateAddressRef.hide();
    }
    this.loadingForm = false;
  }

  cargarDireccion() {
    this.address = null;
    if (!this.formDireccion.valid) {
      return;
    }
    const { calle, numero, comuna, localizacion } = this.formDireccion.value;
    const comunaArr = comuna.split('@');

    this.address = {
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

        const comuna = this.comunas.find(
          (c) => c.value === this.direccion.comuna
        );
        if (comuna) {
          this.formDireccion.controls['comuna'].setValue(comuna.id);
        }
      },
      (error) => {
        this.toastr.error(error.error.msg);
      }
    );
  }

  obtenerLocalidades(event: any) {
    const localidades: any[] = [];
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
