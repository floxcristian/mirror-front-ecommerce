import { Component, OnInit } from '@angular/core'
import { Usuario } from '../../../../shared/interfaces/login'
import { Category } from '../../../../shared/interfaces/category'
import { RootService } from '../../../../shared/services/root.service'

import { BsModalRef } from 'ngx-bootstrap/modal'
import { FormGroup } from '@angular/forms'
import { Subject } from 'rxjs'

import { Router } from '@angular/router'

@Component({
  selector: 'app-page-products-categories',
  templateUrl: './page-products-categories.component.html',
  styleUrls: ['./page-products-categories.component.sass'],
})
export class PageProductsCategoriesComponent implements OnInit {
  usuario: Usuario
  category!: Category
  selectedCategory!: Category
  editing = false
  loadingData = true
  categories: Category[] = []
  modalRef!: BsModalRef
  form!: FormGroup
  formUploads!: FormGroup
  imgType: string = 'image_full'
  filename!: string
  extension!: string
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  preview!: string
  percentDone: any = 0

  constructor(
    private root: RootService,
    public router: Router,
  ) {
    this.usuario = this.root.getDataSesionUsuario()
  }

  ngOnInit() {}
}
