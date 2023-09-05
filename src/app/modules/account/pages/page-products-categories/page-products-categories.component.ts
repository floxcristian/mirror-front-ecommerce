import { Component, OnInit, TemplateRef } from '@angular/core';
import { Usuario } from '../../../../shared/interfaces/login';
import { Category } from '../../../../shared/interfaces/category';
import { RootService } from '../../../../shared/services/root.service';
import { CmsService } from '../../../../shared/services/cms.service';
import { ImagesService } from '../../../../shared/services/images.service';

import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-page-products-categories',
    templateUrl: './page-products-categories.component.html',
    styleUrls: ['./page-products-categories.component.sass']
})

export class PageProductsCategoriesComponent implements OnInit {

    usuario: Usuario;
    category: Category;
    selectedCategory: Category;
    editing = false;
    loadingData = true;
    categories: Category[] = [];
    modalRef: BsModalRef;
    form: FormGroup;
    formUploads: FormGroup;
    imgType: string = 'image_full';
    filename: string;
    extension: string;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    preview: string;
    percentDone: any = 0;

    constructor(

        private root: RootService,
        private toastr: ToastrService,
        private cms: CmsService,
        private modalService: BsModalService,
        private fb: FormBuilder,
        public router: Router,

    ) {
        this.usuario = this.root.getDataSesionUsuario();
    }

    ngOnInit() {

        this.dtOptions = this.root.simpleDtOptions;
        // this.clearForm();
        // this.clearFormUploads();
        
        // this.cms.obtenerCategorys()
        //     .subscribe((r: any) => {
        //         this.categories = r.data;                
        //         this.loadingData = false;
        //         this.dtTrigger.next();
        //     }, error => {
        //         console.log(error);
        //         this.toastr.error('Error de conexión, para obtener categories');
        //         this.loadingData = false;
        //     });
    }

    // clearForm() {
    //     this.form = this.fb.group({
    //         _id: [''],
    //         active: [true],
    //         position: [''],
    //         order: [0, [Validators.pattern('[0-9]+')]],
    //         url: [''],
    //         title: [''],
    //         alt: [''],
    //         expiration_date: [null],
    //         target: ['_blank']
    //     }, { collection: 'cmscategories' })
    //     this.selectedCategory = null;
    //     this.editing = false;
    // }    

    // clearFormUploads() {

    //     this.formUploads = this.fb.group({
    //         _id: [''],
    //         selImgType: ['image_full'],
    //         name: [''],
    //         avatar: ['']
    //     });

    //     this.selectedCategory = null;
    //     this.editing = false;
    // }    

    // openForm(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    // }

    // openModalUploadImage(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template);
    // }

    // select(slide) {
    //     this.editing = true;
    //     this.selectedCategory = slide;
    //     this.form.patchValue(slide);
    // }

    // selectUploads(slide) {

    //     this.preview = '';
    //     this.editing = true;
    //     this.selectedCategory = slide;
    //     this.formUploads.patchValue(slide);
        
    // }

    // delete(slide) {

    //     this.cms.deleteCategory(slide)
    //         .subscribe((r: any) => {
    //             this.toastr.success(r.msg);
    //             this.clearForm();
    //             this.cms.obtenerCategorys()
    //                 .subscribe((r: any) => {
    //                     this.categories = r.data;
    //                     this.loadingData = false;
    //                 }, error => {
    //                     console.log(error);
    //                     this.toastr.error('Error de conexión, para obtener categories');
    //                     this.loadingData = false;
    //                 });
    //         });
    // }

    // onSubmit(data) {
        
    //     if (this.formUploads.valid) {
    //         if (this.selectedCategory) {

    //             data['id'] = data['_id'];

    //             this.cms.updateCategory(data)
    //                 .subscribe(() => {

    //                     this.toastr.success('Category actualizado exitosamente');
    //                     this.modalRef.hide();
    //                     this.clearForm();

    //                     this.cms.obtenerCategorys()
    //                         .subscribe((r: any) => {
    //                             this.categories = r.data;
    //                             this.loadingData = false;
    //                             this.dtTrigger.next();
    //                         }, error => {
    //                             console.log(error);
    //                             this.toastr.error('Error de conexión, para obtener categories');
    //                             this.loadingData = false;
    //                         });
                            
    //                 }, error => {
    //                     this.toastr.error('Error de conexión, para crear categories');
    //                     this.loadingData = false;
    //                 });

    //         } else {

    //             this.cms.crearCategory(data)
    //                 .subscribe(() => {
                        
    //                     this.toastr.success('Category creado exitosamente');
    //                     this.modalRef.hide();
    //                     this.clearForm();

    //                     this.cms.obtenerCategorys()
    //                         .subscribe((r: any) => {
    //                             this.categories = r.data;
    //                             this.loadingData = false;
    //                             this.dtTrigger.next();
    //                         }, error => {
    //                             console.log(error);
    //                             this.toastr.error('Error de conexión, para obtener categories');
    //                             this.loadingData = false;
    //                         });
                            
    //                 }, error => {
    //                     // console.log(error);
    //                     this.toastr.error('Error de conexión, para crear categories');
    //                     this.loadingData = false;
    //                 });
                    
    //         }

    //     } else {

    //         this.toastr.warning('Debe completar todos los campos');
    //     }

    // }

    // // file uploading
    // uploadFile(event) {

    //     var file = (event.target as HTMLInputElement).files[0];        
    //     this.extension = file.name.split('.')[file.name.split('.').length-1];
        
    //     this.formUploads.patchValue({
    //       avatar: file
    //     });
    //     this.formUploads.get('avatar').updateValueAndValidity()
    
    //     // File Preview
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       this.preview = reader.result as string;
    //     }
    //     reader.readAsDataURL(file)
    // }
    
    // submitForm() {
        
    //     this.filename = this.selectedCategory['_id'] + '_' + this.imgType + '.' + this.extension;

    //     this.imagesService.uploadCategoryImage(
    //       this.selectedCategory['_id'],
    //       this.filename,
    //       this.imgType,
    //       this.formUploads.value.avatar
    //     ).subscribe((event: HttpEvent<any>) => {

    //       switch (event.type) {
            
    //         case HttpEventType.Sent:
    //             // console.log('Request has been made!');
    //             break;
            
    //         case HttpEventType.ResponseHeader:
    //             // console.log('Response header has been received!');
    //             break;

    //         case HttpEventType.UploadProgress:
    //             this.percentDone = Math.round(event.loaded / event.total * 100);
    //             console.log(`Uploaded! ${this.percentDone}%`);
    //         break;

    //         case HttpEventType.Response:

    //             console.log('Image Uploaded!', event.body);
                
    //             this.percentDone = false;
    //             this.toastr.success("Datos actualizados!");
                
    //             this.loadingData = true;
    //             this.cms.obtenerCategorys()
    //                         .subscribe((r: any) => {
    //                             this.categories = r.data;
    //                             this.loadingData = false;
    //                             this.modalRef.hide();
    //                             this.dtTrigger.next();
    //                             this.router.navigate['/mi-cuenta/categories']
    //                         }, error => {
    //                             console.log(error);
    //                             this.toastr.error('Error de conexión, para obtener categories');
    //                             this.loadingData = false;
    //                         });
    //             // this.router.navigated = false;
    //             // this.router.navigate(['mi-cuenta', 'categories']);

    //         break;


    //       }
    //     })
    // }



}
