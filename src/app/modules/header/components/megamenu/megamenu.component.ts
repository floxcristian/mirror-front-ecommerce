import { Component, Input, ViewChild } from '@angular/core';
import { Megamenu } from '../../../../shared/interfaces/megamenu';
import { DepartmentsComponent } from '../departments/departments.component';


@Component({
    selector: 'app-header-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss']
})
export class MegamenuComponent {
    @Input() menu: Megamenu;
    @Input() departments = false;

    @ViewChild(DepartmentsComponent, { static: true }) departamentComp: DepartmentsComponent;

    constructor() { }

    public toggle() {
        // no funciona
        //this.departamentComp.close();
    }
}
