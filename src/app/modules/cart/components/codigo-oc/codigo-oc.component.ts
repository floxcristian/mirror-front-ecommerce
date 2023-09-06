import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartService } from '../../../../shared/services/cart.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-codigo-oc',
  templateUrl: './codigo-oc.component.html',
  styleUrls: ['./codigo-oc.component.scss'],
})
export class CodigoOcComponent implements OnInit {
  formulario!: FormGroup;
  @Input() id: any = null;
  user: any = null;
  fecha_limite = new Date();
  finishDateString = '';
  reenviar_codigo: boolean = false;
  confirmar: boolean = true;
  @Output() verificar: EventEmitter<any> = new EventEmitter();
  @Output() renv_cod: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private localS: LocalStorageService
  ) {
    this.iniciar_formulario();
  }

  async ngOnInit() {
    this.fecha_limite.setTime(
      this.fecha_limite.setMinutes(this.fecha_limite.getMinutes() + 1)
    );
    this.fecha_limite.setTime(
      this.fecha_limite.setSeconds(this.fecha_limite.getSeconds() + 30)
    );
    this.finishDateString = this.fecha_limite.toISOString();
    await this.id;
    this.user = this.localS.get('usuario');
  }
  // se inicia el formulario
  iniciar_formulario() {
    this.formulario = this.fb.group({
      codigo: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
        Validators.maxLength(6),
        Validators.minLength(6),
      ]),
    });
  }

  async Verificar_codigo() {
    let param = {
      id: this.id,
      codigo: this.formulario.controls['codigo'].value,
      aprobador: `${this.user.first_name} ${this.user.last_name}`,
    };

    let r: any = await this.cartService.confirmarOc(param).toPromise();
    this.confirmar = r.data.confirmar;
    if (this.confirmar) this.verificar.emit(r.data.confirmar);
  }

  async Atras_codigo() {
    this.verificar.emit(false);
  }

  async timeout(event: any) {
    this.reenviar_codigo = event;
    this.confirmar = true;
  }

  async reenvio_codigo() {
    this.fecha_limite = new Date();
    this.fecha_limite.setTime(
      this.fecha_limite.setMinutes(this.fecha_limite.getMinutes() + 1)
    );
    this.fecha_limite.setTime(
      this.fecha_limite.setSeconds(this.fecha_limite.getSeconds() + 30)
    );
    this.finishDateString = this.fecha_limite.toISOString();
    this.reenviar_codigo = false;
    this.renv_cod.emit(true);
  }
}
