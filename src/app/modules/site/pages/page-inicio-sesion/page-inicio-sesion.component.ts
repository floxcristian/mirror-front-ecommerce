import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/core/modules/local-storage/local-storage.service";

@Component({
    selector: "app-page-inicio-sesion",
    templateUrl: "./page-inicio-sesion.component.html",
    styleUrls: ["./page-inicio-sesion.component.scss"],
})
export class PageInicioSesionComponent implements OnInit {
    innerWidth: number;
    ruta: any;
    constructor(private localStorage: LocalStorageService) {
        this.innerWidth = window.innerWidth;
    }

    ngOnInit() {
        let pagina = this.localStorage.get("ruta");
        this.ruta = pagina;
    }
    onResize(event:any) {
        this.innerWidth = event.target.innerWidth;
    }
}
