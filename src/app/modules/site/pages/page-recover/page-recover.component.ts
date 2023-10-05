import { Component, Inject, PLATFORM_ID } from '@angular/core'
import { ClientsService } from '../../../../shared/services/clients.service'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-recovering',
  templateUrl: './page-recover.component.html',
  styleUrls: ['./page-recover.component.scss'],
})
export class PageRecoveringComponent {
  isCollapsed = false
  rows: String[] = []
  innerWidth: number
  formRecoverpass!: FormGroup

  constructor(
    private clients: ClientsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
  }

  ngOnInit() {
    this.formRecover()
  }

  formRecover() {
    this.formRecoverpass = this.fb.group({
      email: ['', Validators.required],
    })
  }

  recoverPass(data: any) {
    if (this.formRecoverpass.valid) {
      this.clients.recuperarPassword(data).subscribe(
        (data: any) => {
          if (data['status'] === 'OK') {
            this.toastr.success('Link enviado exitosamente')
            this.formRecover()
            this.router.navigate(['/inicio'])
          } else {
            this.toastr.error(data['msg'])
          }
        },
        (error) => {
          console.log(error)
          this.toastr.error('Error de conexión, para crear usuarios')
        },
      )
    } else {
      this.toastr.warning('Debe ingresar su e-mail')
    }
  }
}
