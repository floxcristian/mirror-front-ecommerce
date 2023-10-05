import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-concurso-giftcard-ok-modal',
  templateUrl: './concurso-giftcard-ok-modal.component.html',
  styleUrls: ['./concurso-giftcard-ok-modal.component.scss'],
})
export class ConcursoGiftcardOkModalComponent implements OnInit {
  constructor(public ModalRef: BsModalRef) {}

  ngOnInit() {}
}
