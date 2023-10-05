import { Component, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Usuario } from '../../interfaces/login'
import { Product } from '../../interfaces/product'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-aviso-stock',
  templateUrl: './aviso-stock.component.html',
  styleUrls: ['./aviso-stock.component.scss'],
})
export class AvisoStockComponent {
  //variables del aviso
  aviso_change: EventEmitter<any> = new EventEmitter()
  sku!: string
  sucursal!: string
  usuario!: Usuario
  producto!: Product

  //formuluario
  formulario!: FormGroup
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.ingresarForm()
  }

  ingresarForm() {
    this.formulario = this.fb.group({
      sku: [this.sku],
      nombre: [, [Validators.required, Validators.maxLength(100)]],
      email: [
        ,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/,
          ),
        ],
      ],
      estado: [false],
    })
    if (this.usuario.user_role != 'temp') {
      this.formulario.controls['nombre'].setValue(
        this.usuario.first_name + ' ' + this.usuario.last_name,
      )
      this.formulario.controls['email'].setValue(this.usuario.email)
    }
  }

  submit(event: boolean): void {
    this.bsModalRef.hide()
  }
}
