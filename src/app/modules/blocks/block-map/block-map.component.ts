import { Component } from '@angular/core';

@Component({
    selector: 'app-block-map',
    templateUrl: './block-map.component.html',
    styleUrls: ['./block-map.component.scss']
})
export class BlockMapComponent {
    countries = [
        {
            id: 'CL',
            nombre: 'CHILE',
        },
        {
            id: 'BR',
            nombre: 'BRASIL',
        },
        {
            id: 'AR',
            nombre: 'ARGENTINA',
        }
    ];
    country = 'CL';

    constructor() {

    }
}
