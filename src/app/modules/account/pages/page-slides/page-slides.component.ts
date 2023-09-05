import { Component, OnInit, TemplateRef } from '@angular/core';
import { Usuario } from '../../../../shared/interfaces/login';
import { Slide } from '../../../../shared/interfaces/slide';
import { RootService } from '../../../../shared/services/root.service';
import { SlidesService } from '../../../../shared/services/slides.service';
import { ImagesService } from '../../../../shared/services/images.service';

import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-slides',
  templateUrl: './page-slides.component.html',
  styleUrls: ['./page-slides.component.sass'],
})
export class PageSlidesComponent implements OnInit {
  usuario: Usuario;
  slide!: Slide;
  selectedSlide!: Slide | null | any;
  editing = false;
  loadingData = true;
  slides: Slide[] = [];
  modalRef!: BsModalRef;
  form!: FormGroup;
  formUploads!: FormGroup;
  imgType: string = 'image_classic';
  filename!: string;
  extension!: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  preview!: string;
  percentDone: any = 0;

  image1:any
  image2:any
  image3:any
  image4:any

  constructor(
    private root: RootService,
    private toastr: ToastrService,
    private slidesService: SlidesService,
    private imagesService: ImagesService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.usuario = this.root.getDataSesionUsuario();
  }

  ngOnInit() {
    this.dtOptions = this.root.simpleDtOptions;
    this.clearForm();
    this.clearFormUploads();

    this.slidesService.obtieneSlides().subscribe(
      (r: any) => {
        this.slides = r.data;
        this.loadingData = false;
        this.dtTrigger.next(null);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error de conexión, para obtener diapositivas');
        this.loadingData = false;
      }
    );
  }

  clearForm() {
    this.form = this.fb.group({
      _id: [''],
      order: ['', [Validators.pattern('[0-9]+')]],
      title: [''],
      text: [''],
      alt: [''],
      btn_url: [''],
    });

    this.selectedSlide = null;
    this.editing = false;
  }

  clearFormUploads() {
    this.formUploads = this.fb.group({
      _id: [''],
      selImgType: ['image_classic'],
      name: [''],
      avatar: [''],
      btn_url: [''],
    });

    this.selectedSlide = null;
    this.editing = false;
  }

  openForm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  openModalUploadImage(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  select(slide: any) {
    this.editing = true;
    this.selectedSlide = slide;
    this.form.patchValue(slide);
  }

  selectUploads(slide: any) {
    this.preview = '';
    this.editing = true;
    this.selectedSlide = slide;
    this.formUploads.patchValue(slide);
  }

  delete(slide: any) {
    if (confirm('Esta seguro de eliminar la diapositiva seleccionada ?')) {
      slide['id'] = slide['_id'];
      this.slidesService.deleteSlide(slide).subscribe((r: any) => {
        this.toastr.success(r.msg);
        this.clearForm();
        this.slidesService.obtieneSlides().subscribe(
          (r: any) => {
            this.slides = r.data;
            this.loadingData = false;
          },
          (error) => {
            console.log(error);
            this.toastr.error('Error de conexión, para obtener diapositivas');
            this.loadingData = false;
          }
        );
      });
    }
  }

  onSubmit(data: any) {
    if (this.formUploads.valid) {
      if (this.selectedSlide) {
        data['id'] = data['_id'];

        this.slidesService.updateSlide(data).subscribe(
          () => {
            this.toastr.success('Diapositiva actualizada exitosamente');
            this.modalRef.hide();
            this.clearForm();

            this.slidesService.obtieneSlides().subscribe(
              (r: any) => {
                this.slides = r.data;
                this.loadingData = false;
                this.dtTrigger.next(null);
              },
              (error) => {
                console.log(error);
                this.toastr.error(
                  'Error de conexión, para obtener diapositivas'
                );
                this.loadingData = false;
              }
            );
          },
          (error) => {
            this.toastr.error('Error de conexión, para crear diapositivas');
            this.loadingData = false;
          }
        );
      } else {
        this.slidesService.crearSlide(data).subscribe(
          () => {
            this.toastr.success('Diapositiva creada exitosamente');
            this.modalRef.hide();
            this.clearForm();

            this.slidesService.obtieneSlides().subscribe(
              (r: any) => {
                this.slides = r.data;
                this.loadingData = false;
                this.dtTrigger.next(null);
              },
              (error) => {
                console.log(error);
                this.toastr.error(
                  'Error de conexión, para obtener diapositivas'
                );
                this.loadingData = false;
              }
            );
          },
          (error) => {
            this.toastr.error('Error de conexión, para crear diapositivas');
            this.loadingData = false;
          }
        );
      }
    } else {
      this.toastr.warning('Debe completar todos los campos');
    }
  }

  // file uploading

  uploadFile(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
    this.extension = file.name.split('.')[file.name.split('.').length - 1];

    this.formUploads.patchValue({
      avatar: file,
    });
    this.formUploads.get('avatar')?.updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    this.filename =
      this.selectedSlide['_id'] + '_' + this.imgType + '.' + this.extension;

    this.imagesService
      .uploadImage(
        this.selectedSlide['_id'],
        this.filename,
        this.imgType,
        this.formUploads.value.avatar
      )
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;

          case HttpEventType.ResponseHeader:
            break;

          case HttpEventType.UploadProgress:
            this.percentDone = Math.round(
              (event.loaded / (event.total || 1)) * 100
            );

            break;

          case HttpEventType.Response:
            this.percentDone = false;
            this.toastr.success('Datos actualizados!');

            this.loadingData = true;
            this.slidesService.obtieneSlides().subscribe(
              (r: any) => {
                this.slides = r.data;
                this.loadingData = false;
                this.modalRef.hide();
                this.dtTrigger.next(null);
                this.router.navigate(['/mi-cuenta', 'diapositivas']);
              },
              (error) => {
                console.log(error);
                this.toastr.error(
                  'Error de conexión, para obtener diapositivas'
                );
                this.loadingData = false;
              }
            );
            break;
        }
      });
  }

  onSubmitUploads(value:any){

  }
}
