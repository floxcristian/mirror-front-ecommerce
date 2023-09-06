import { Component, OnInit, TemplateRef } from '@angular/core';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { CmsService } from '../../../../shared/services/cms.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-page-new-products',
  templateUrl: './page-new-products.component.html',
  styleUrls: ['./page-new-products.component.sass'],
})
export class PageNewProductsComponent implements OnInit {
  usuario: Usuario;
  producto: any;
  selectedProduct: any;
  editing = false;
  loadingData = true;
  newProducts: any[] = [];
  categories: any[] = [];
  catLevel1: any[] = [];
  catLevel2: any[] = [];
  catLevel3: any[] = [];
  ready: Boolean = false;
  cat2Disable = true;
  modalRef!: BsModalRef;
  form!: FormGroup;
  filename!: string;
  extension!: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  preview!: string;
  percentDone: any = 0;
  isDtInitialized: boolean = false;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private cms: CmsService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.usuario = this.root.getDataSesionUsuario();
  }

  ngOnInit() {
    this.loadingData = false;
    this.dtOptions = this.root.simpleDtOptions;
    this.clearForm();
    this.loadtable();
  }
  loadtable() {
    this.cms.obtenerNuevosProductos().subscribe(
      (r: any) => {
        this.newProducts = r.data;
        this.dtOptions = this.root.simpleDtOptions;
        this.loadingData = false;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next('');
          });
        } else {
          this.isDtInitialized = true;
          this.dtTrigger.next('');
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error de conexión, para obtener nuevos productos');
        this.loadingData = false;
      }
    );
  }
  loadLevel1(level: any) {
    let level1 = level.target.value
    this.form.setValue({
      level1: level1,
      level2: -1,
      level3: -1,
      sku: this.selectedProduct.sku,
    });
    this.catLevel2 = [];
    this.catLevel3 = [];
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].parent_id == level1)
        this.catLevel2.push(this.categories[i]);
    }
    this.catLevel2.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  loadLevel2(level: any) {
    let level2 = level.target.value
    this.form.controls['level2'].setValue(level2);
    this.catLevel3 = [];
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].parent_id == level2)
        this.catLevel3.push(this.categories[i]);
    }
    this.catLevel3.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  loadLevel3(level: any) {
    let level3 = level.target.value
    if (level3 > -1) this.ready = true;
    this.form.controls['level3'].setValue(level3);
  }

  clearForm() {
    this.ready = false;
    this.cms.obtenerCategorias().subscribe(
      (r: any) => {
        this.categories = r.data;
        for (let i = 0; i < r.data.length; i++) {
          if (r.data[i].level == 1) this.catLevel1.push(r.data[i]);
        }
        this.catLevel1.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.form = this.fb.group({
          sku: ['', Validators.required],
          level1: ['', Validators.required],
          level2: ['', Validators.required],
          level3: ['', Validators.required],
        });
        this.selectedProduct = null;
        this.editing = false;
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error de conexión, para obtener categorias');
        this.loadingData = false;
      }
    );
  }

  openForm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  select(producto: any) {
    this.editing = true;
    this.selectedProduct = producto;
    this.form.patchValue(producto);
  }

  asignar(data: any) {
    if (this.form.valid) {
      this.cms.asignarCategorias(data).subscribe(
        (r: any) => {
          this.toastr.success(r.message);
          this.modalRef.hide();
          this.clearForm();
          this.loadingData = false;
          this.loadtable();
        },
        (error) => {
          this.toastr.error('Error de conexión, para asignar categorías');
          this.loadingData = false;
        }
      );
    } else {
      this.toastr.warning('Debe completar todos los campos');
    }
  }
}
