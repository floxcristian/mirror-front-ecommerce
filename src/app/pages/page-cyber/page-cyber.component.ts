import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ResponseApi } from '../../shared/interfaces/response-api'
import { ClientsService } from '../../shared/services/clients.service'
import { rutValidator } from '../../shared/utils/utilidades'
import { RegistroOkModalComponent } from '../components/registro-ok-modal/registro-ok-modal.component'
declare var webkitSpeechRecognition: any

@Component({
  selector: 'app-page-cyber',
  templateUrl: './page-cyber.component.html',
  styleUrls: ['./page-cyber.component.scss'],
})
export class PageCyberComponent implements OnInit {
  formulario!: FormGroup
  cargando = false
  recognition: any
  recognizing = false
  public texto = ''
  public textToSearch = ''
  datos = {
    rut: '',
    nombre: '',
    email: '',
    celular: '',
    camion: false,
    liviano: false,
    bus: false,
  }

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private clientsService: ClientsService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      rut: [
        this.datos.rut,
        [Validators.required, Validators.maxLength(10), rutValidator],
      ],
      nombre: [
        this.datos.nombre,
        [Validators.required, Validators.maxLength(100)],
      ],
      email: [
        this.datos.email,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/,
          ),
        ],
      ],
      celular: [
        this.datos.celular,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]{8}$/),
        ],
      ],
      camion: [this.datos.camion, []],
      liviano: [this.datos.liviano, []],
      bus: [this.datos.bus, []],
    })
  }

  enviar() {
    if (this.cargando) {
      return
    }

    this.cargando = true
    this.clientsService
      .setFormularioCyber(this.formulario.value)
      .subscribe((resp: ResponseApi) => {
        if (resp.error) {
          this.toast.error(resp.msg)
          this.cargando = false
          return
        }

        this.cargando = false
        const initialState = {
          nombre: this.datos.nombre.split(' ')[0],
        }
        this.formulario.reset()
        this.modalService.show(RegistroOkModalComponent, {
          initialState,
          class: 'mx-auto',
        })
      })
  }
}
