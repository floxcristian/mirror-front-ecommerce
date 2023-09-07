import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactUsService } from '../../../../shared/services/contact-us.service';

@Component({
  selector: 'app-footer-blog',
  templateUrl: './footer-blog.component.html',
  styleUrls: ['./footer-blog.component.scss']
})
export class FooterBlogComponent implements OnInit {

  formContactoC: FormGroup;
    constructor(
        private formGroup: FormBuilder,
        private toastr: ToastrService,
        private contactUService: ContactUsService) {
        this.formContactoC = this.formGroup.group({
            nombreC: new FormControl(null, Validators.required),
            paraC: new FormControl(
                null,
                [
                    Validators.required,
                    Validators.email,
                    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
                ]
            ),
            asuntoC: new FormControl('contacto blog', Validators.required),
            htmlC: new FormControl(null, Validators.required)
        });
    }
    ngOnInit() {
    }
    async enviarCorreo() {
        let { nombreC, paraC, asuntoC, htmlC } = this.formContactoC.value;
        let cliente = paraC
        paraC = await this.agregarEmail();
        let cuerpo = `

        <strong>Nombre: </strong>
        <br />${nombreC}<br />
        <strong>Correo: </strong>
        <br />${cliente}<br />
        <strong>Asunto: </strong>
        <br />${asuntoC}<br />
        <strong>Mensaje: </strong>
        <p> ${htmlC}</p>`;
        htmlC = cuerpo;
        let respuesta = await this.contactUService.enviarCorreoContacto({ nombreC, paraC, asuntoC, htmlC });
        if(respuesta == 'ok'){
            this.toastr.success(`Correo Enviado correctamente`);
            this.formContactoC.reset();
        }else{
            this.toastr.error(`No se logro enviar el correo`);
        }
    }

    async agregarEmail() {
        let correos = 'ruben.espinoza@implementos.cl;freddy.rodriguez@implementos.cl;claudio.montoya@implementos.cl'

        return correos;
    }

}
