import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactUsService } from '../../../../shared/services/contact-us.service';
import { ToastrService } from 'ngx-toastr';
import { rutValidator } from 'src/app/shared/utils/utilidades';
// import { RutValidator } from 'ng2-rut';

@Component({
  selector: 'app-contact-us',
  templateUrl: './page-contact-us.component.html',
  styleUrls: ['./page-contact-us.component.scss']
})
export class PageContactUsComponent {
  formContacto: FormGroup;
  asuntos = ['Cotización', 'Información'];
  constructor(
    private formGroup: FormBuilder,
    private toastr: ToastrService,
    private contactUService: ContactUsService
  ) {
    this.formContacto = this.formGroup.group({
      nombre: new FormControl(null, Validators.required),
      para: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
      ]),
      asunto: new FormControl(null, Validators.required),
      rut: [, rutValidator],
      telefono: new FormControl(null),
      html: new FormControl(null, Validators.required)
    });
  }

  async enviarCorreo() {
    let { nombre, para, asunto, html, rut, telefono } = this.formContacto.value;

    let rutAux = rut;
    let existe = rut ? rutAux.indexOf('-') : null;
    if (existe == -1) {
      let dv = rutAux.substring(rutAux.length - 1, rutAux.length);
      rutAux = rutAux.substring(0, rutAux.length - 1);
      rut = `${rutAux}-${dv}`;
    }
    let cliente = para;

    para = await this.agregarEmail();
    let cuerpo = rut
      ? `
        <strong>Rut: </strong>
        <br />${rut}<br />
        <strong>Nombre: </strong>
        <br />${nombre}<br />
        <strong>Correo: </strong>
        <br />${cliente}<br />
        <strong>Telefono: </strong>
        <br />${telefono}<br />
        <strong>Asunto: </strong>
        <br />${asunto}<br />
        <strong>Mensaje: </strong>
        <p> ${html}</p>`
      : `
        <strong>Nombre: </strong>
        <br />${nombre}<br />
        <strong>Correo: </strong>
        <br />${cliente}<br />
        <strong>Asunto: </strong>
        <br />${asunto}<br />
        <strong>Mensaje: </strong>
        <p> ${html}</p>`;
    html = cuerpo;
    let respuesta = await this.contactUService.enviarCorreoContacto({ nombre, para, asunto, html });
    if (respuesta == 'ok') {
      this.toastr.success(`Correo Enviado correctamente`);
      this.formContacto.reset();
    } else {
      this.toastr.error(`No se logro enviar el correo`);
    }
  }

  async agregarEmail() {
    let correos = 'ruben.espinoza@implementos.cl;freddy.rodriguez@implementos.cl;claudio.montoya@implementos.cl';

    return correos;
  }

  tipoAsunto(event:any) {
    let asunto = this.formContacto.get('asunto')?.value;
    if (asunto == 'Cotización') {
      this.formContacto.get('rut')?.reset();

      this.formContacto.get('rut')?.setValidators([Validators.required]);
      this.formContacto.get('telefono')?.reset();
      this.formContacto.get('telefono')?.setValidators([
          Validators.required,
          Validators.pattern('[1-9][0-9]{0,9}'),
          Validators.minLength(8),
          Validators.maxLength(8)
        ]);
    } else {
      this.formContacto.get('rut')?.clearValidators();
      this.formContacto.get('telefono')?.clearValidators();
    }
    this.formContacto.get('rut')?.updateValueAndValidity();
    this.formContacto.get('telefono')?.updateValueAndValidity();
  }
}
