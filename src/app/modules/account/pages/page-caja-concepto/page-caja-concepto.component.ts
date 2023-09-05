import {
  Component,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { CmsService } from '../../../../shared/services/cms.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-page-caja-concepto',
  templateUrl: './page-caja-concepto.component.html',
  styleUrls: ['./page-caja-concepto.component.scss'],
})
export class PageCajaConceptoComponent implements OnInit {
  @Input() caja_concepto: any = {};
  @Input() index = '0';
  @Input() id!: String;
  files: any = {};
  modalRef!: BsModalRef;
  loadingData: boolean = false;
  filename!: string;
  extension!: string;
  preview!: string;
  form_concepto!: FormGroup;
  posicion = 0;
  categorias: any = null;
  subcategorias: any = null;
  temp: any = null;
  url: string = '';
  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private modalService: BsModalService
  ) {
    this.instanciaFormularios();
    this.set_categorias();
  }

  ngOnInit() {}

  ngDoCheck(): void {}

  openForm(template: TemplateRef<any>, pos: number) {
    this.form_concepto.controls['titulo'].setValue(null);
    this.form_concepto.controls['image'].setValue(null);
    this.form_concepto.controls['url'].setValue(null);
    this.form_concepto.controls['categoria'].setValue(null);
    this.form_concepto.controls['subcategoria'].setValue(null);
    this.form_concepto.controls['url'].setValue(null);
    this.preview = '';
    this.url = '';
    this.posicion = pos;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  openForm_update(template: TemplateRef<any>, pos: number) {
    this.posicion = pos;

    this.form_concepto.controls['titulo'].setValue(
      this.caja_concepto.conceptos[pos].title
    );
    this.form_concepto.controls['image'].setValue(
      this.caja_concepto.conceptos[pos].image
    );
    this.form_concepto.controls['url'].setValue(
      this.caja_concepto.conceptos[pos].url
    );
    this.form_concepto.controls['categoria'].setValue(
      this.caja_concepto.conceptos[pos].categoria
    );
    this.form_concepto.controls['subcategoria'].setValue(
      this.caja_concepto.conceptos[pos].subcategoria
    );

    this.preview = this.caja_concepto.conceptos[pos].image;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  close_modal() {
    this.modalRef.hide();
  }

  instanciaFormularios() {
    this.form_concepto = this.fb.group({
      titulo: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      categoria: new FormControl(null, [Validators.required]),
      subcategoria: new FormControl(null),
      url: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(1)])
      ),
    });
  }

  async actualizar() {
    this.loadingData = true;
    let subir: any = await (
      await this.cmsService.subir_imagen(this.files)
    ).toPromise();

    let array_concepto: any = {
      title: this.form_concepto.controls['titulo'].value,
      image: subir.data.url,
      url: this.form_concepto.controls['url'].value,
      categoria: this.form_concepto.controls['categoria'].value,
      subcategoria: this.form_concepto.controls['subcategoria'].value,
    };

    if (this.caja_concepto.id == this.id) {
      this.caja_concepto.conceptos[this.posicion] = array_concepto;
    }

    this.close_modal();
    this.loadingData = false;
  }

  async set_categorias() {
    this.categorias = await this.cmsService.obtenerCategoriaL1();
  }

  async SubCategoria() {
    let parent_id = this.form_concepto.controls['categoria'].value;

    this.url = '/inicio/productos/todos/categoria/';

    this.form_concepto.controls['url'].setValue(null);
    if (parent_id === '0: null') {
      this.subcategorias = null;
    } else {
      this.temp = this.categorias.find((r: any) => r.id == parent_id);

      this.url = this.url + this.temp.url.split('/')[1];
      this.form_concepto.controls['url'].setValue(this.url);

      this.subcategorias = await this.cmsService.obtenerSubcategoria(parent_id);
    }
  }

  seleccionar(children_id: string) {
    this.form_concepto.controls['url'].setValue(null);
    if (children_id === '0: null') {
      this.url = '/inicio/productos/todos/categoria/';
      this.url = this.url + this.temp.url.split('/')[1];
      this.form_concepto.controls['url'].setValue(this.url);
    }
    this.url = '/inicio/productos/todos/categoria/';
    this.url = this.url + this.temp.url.split('/')[1];
    let subcategoria = this.subcategorias.find((r: any) => r.id == children_id);
    this.url = this.url + subcategoria.url;
    this.form_concepto.controls['url'].setValue(this.url);
  }

  //* subiendo imagen */

  // file uploading
  uploadFile(event: any) {
    var file = event.target.files[0] || '';
    this.extension = file.name.split('.')[file.name.split('.').length - 1];
    this.files.file = file;
    this.files.tipo = 'caja_concepto';

    // File Preview

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.form_concepto.controls['image'].setValue(this.preview);
    };
    reader.readAsDataURL(file);
  }
}
