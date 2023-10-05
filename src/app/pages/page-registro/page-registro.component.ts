import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ClientsService } from '../../shared/services/clients.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { LoginService } from '../../shared/services/login.service'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'

@Component({
  selector: 'app-registro',
  templateUrl: './page-registro.component.html',
  styleUrls: ['./page-registro.component.scss'],
})
export class PageRegistroComponent implements OnInit {
  TIPO_EMPRESA: number = 0
  TIPO_PERSONA: number = 1
  TIPO_PERSONA_BOLETA: number = 2

  comunas!: any[]
  giros!: any[]
  tipo_fono = '+569'
  slices = 8
  formUsuario!: FormGroup
  tipoCliente: number = this.TIPO_PERSONA
  sinMail: boolean = false
  sinCelular: boolean = false
  pdw1!: string
  pdw2!: string

  constructor(
    private fb: FormBuilder,
    private clients: ClientsService,
    private toastr: ToastrService,
    private router: Router,

    private loginService: LoginService,
    private localS: LocalStorageService,
  ) {}

  ngOnInit() {
    this.formUser()
    this.loadGiros()
  }

  cambiaTipo(tipo: any) {
    this.tipoCliente = tipo
  }

  sinMailChange() {
    this.sinMail = this.sinMail ? false : true
  }

  sinCelChange() {
    this.sinCelular = this.sinCelular ? false : true
  }

  loadGiros() {
    this.clients.buscarGiros().subscribe(
      (r: any) => {
        this.giros = r.map((record: any) => {
          return record
        })
      },
      (error) => {
        this.toastr.error(error.error.msg)
      },
    )
  }

  formUser() {
    this.clients.buscarComunas().subscribe(
      (r: any) => {
        this.comunas = r.data.map((record: any) => {
          var v = record.comuna + '@' + record.recid + '@' + record.region
          return { id: v, value: record.comuna }
        })
      },
      (error) => {
        this.toastr.error(error.error.msg)
      },
    )

    this.formUsuario = this.fb.group({
      pwd1: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      pwd2: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],

      fcc4chkcliente: [
        this.TIPO_PERSONA,
        [Validators.required, Validators.min(0), Validators.max(2)],
      ],
      fcc4txtRutCC: ['', [Validators.required]],
      fcc4txtNombreCC: [''],
      fcc4txtApellidoCC: [''],
      fcc4dropGiroCC: [''],
      fcc4dropSegmentoCC: [''],
      fcc4txtCNombreCC: [''],
      fcc4txtCApellidoCC: [''],
      fcc4txtEmailCC: ['', [Validators.required, Validators.email]],
      fcc4txtTelefonoCC2: [''],
      fcc4txtCalleCC: ['', [Validators.required]],
      fcc4txtNumeroCC: ['', [Validators.required]],
      fcc4dropComunaCC: ['', [Validators.required]],
    })
  }

  onSubmit(data: any) {
    if (this.formUsuario.valid) {
      this.clients.registrarUsuario(data).subscribe(
        (answer) => {
          this.loginService.notify(answer)
          this.localS.set('usuario', answer)

          this.router.navigate(['mi-cuenta/resumen']).then(() => {
            this.toastr.success('Usuario registrado exitosamente')
          })
        },
        (error) => {
          console.log(JSON.stringify(error))
          this.toastr.error(error.error.msg)
        },
      )
    } else {
      this.toastr.warning('Debe completar todos los campos')
    }
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo

    if (this.tipo_fono === '+569')
      this.formUsuario.controls['fcc4txtTelefonoCC2'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ])
    else
      this.formUsuario.controls['fcc4txtTelefonoCC2'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ])

    this.formUsuario.get('fcc4txtTelefonoCC2')?.updateValueAndValidity()
  }
}
