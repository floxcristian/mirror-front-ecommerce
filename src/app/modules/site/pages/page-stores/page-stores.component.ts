import { Component } from '@angular/core';
import { StoresService } from '../../../../shared/services/stores.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-stores',
    templateUrl: './page-stores.component.html',
    styleUrls: ['./page-stores.component.scss']
})
export class PageStoresComponent {
    isCollapsed = false;
    rows: string[] = [];
    innerWidth: number;
    tienda: any;

    constructor(
        private stores: StoresService,
        private toastr: ToastrService,

    ) {
        this.innerWidth = window.innerWidth;
    }

    ngOnInit() {
        this.stores.obtieneTiendas()
                .subscribe((r: any) => {
                    this.rows = r.data.map((result:any) => {
                        result.colapse = true;
                        return result;
                    });
                    this.rows[0]?
                    this.tienda = this.rows[0]:null;
                }, error => {
                    console.log(error);
                    this.toastr.error('Error de conexión, para obtener tiendas');
                });
    }

    mostrarTienda(tienda:any){
        if(this.innerWidth <427){
            tienda.colapse=! tienda.colapse;
        }else{
            // this.tienda = null;
            this.tienda = tienda;
        }
        let x = document.querySelector("#informacionTienda");
        if (x){
            x.scrollIntoView();
        }
    }
    onResize(event:any) {
        this.innerWidth = event.target.innerWidth;
    }
}
