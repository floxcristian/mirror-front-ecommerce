import { Component, ComponentFactoryResolver } from '@angular/core';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-recovering',
    templateUrl: './page-recover-change.component.html',
    styleUrls: ['./page-recover-change.component.scss']
})
export class PageRecoveringChangeComponent {

    clientId!: string;
    formChangepass!: FormGroup;
    tokenValido = true;

    constructor(
        private clients: ClientsService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,

    ) {}

    ngOnInit() {
        this.clientId = this.route.snapshot.params['id'];
        this.clients.buscarUsuario(this.clientId).subscribe(
            (data) => {
                this.tokenValido = true;
            },
            (error) => {
                this.tokenValido = false;
        });
        this.formRecover();
    }

    formRecover() {
        this.formChangepass = this.fb.group({
            clientId: [this.clientId],
            pwd1: ['', Validators.required],
            pwd2: ['', Validators.required],
        });
    }

    changePass(data:any) {
        var pwd1 = data.pwd1;
        var pwd2 = data.pwd2;
        if (this.formChangepass.valid) {
            if (pwd1 != pwd2) {
                this.toastr.warning('Las contraseñas ingresadas deben ser iguales');
            } else if (pwd1.length < 6) {
                this.toastr.warning('La contraseña debe tener un largo mínimo de 6 caracteres');
            } else if (!/\d/.test(pwd1)) {
                this.toastr.warning('La contraseña debe contener al menos un número');
            } else {
                data['password'] = pwd1;
                data['recoverId'] = this.clientId;
                this.clients.updatePassword(data)
                    .subscribe(() => {
                        this.toastr.success('Contraseña modificada exitosamente');
                        this.formRecover();
                        // this.router.navigate(['/inicio/site/iniciar-sesion']);
                        this.router.navigate(['/sitio', 'iniciar-sesion'])
                    }, error => {
                        this.toastr.error('Error de conexión, para crear usuarios');
                    });
            }
        } else {
            this.toastr.warning('Ingrese ambas contraseñas');
        }
    }
}
