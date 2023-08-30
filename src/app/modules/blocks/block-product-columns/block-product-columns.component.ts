import { Component, Input } from '@angular/core';
import { RootService } from '../../../shared/services/root.service';
import { BlockProductColumn } from '../../../shared/interfaces/block-product-column';

@Component({
    selector: 'app-block-product-columns',
    templateUrl: './block-product-columns.component.html',
    styleUrls: ['./block-product-columns.component.scss']
})
export class BlockProductColumnsComponent {
    @Input() columns: BlockProductColumn[] = [];
    isB2B: boolean;

    constructor(private rootService: RootService) {
        const role = this.rootService.getDataSesionUsuario().user_role;
        this.isB2B = (role === 'supervisor' || role === 'comprador');
    }
}
