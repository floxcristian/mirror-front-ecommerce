import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PhotoSwipeService } from '../../../../../shared/services/photo-swipe.service';
import { environment } from '@env/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal_recibo',
  templateUrl: './modal_recibo.component.html',
  styleUrls: ['./modal_recibo.component.scss'],
})
export class Modal_reciboComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private photoSwipe: PhotoSwipeService,
    private sanitizer: DomSanitizer
  ) {}
  data?: any;
  PODImageUrl: string = environment.apiLogistic + '/PODImage';
  urlGuiaMostrar!: SafeUrl;
  urlGuiaMostrarNotSanitized!: string;
  pdfBase64: any = null;

  photoSwipeSubscriptions$: Subscription[] = [];

  ngOnInit() {
    this.setPodImage();
  }

  setPodImage() {
    if (this.data && this.data.base64Data) {
      if (!this.esPdf()) {
        this.urlGuiaMostrarNotSanitized = this.data.base64Data;
        this.urlGuiaMostrar = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlGuiaMostrarNotSanitized
        );
      } else {
        const pdfBase64 =
          this.data.base64Data + '#toolbar=1&statusbar=1&navpanes=1';
        this.pdfBase64 =
          this.sanitizer.bypassSecurityTrustResourceUrl(pdfBase64);
      }
    } else {
      this.urlGuiaMostrar = '';
    }
  }

  esPdf(): boolean {
    return this.data.fileType.toLowerCase().trim() === 'pdf';
  }

  openPhotoSwipe(event: MouseEvent): void {
    event.preventDefault();

    const imageElements = [this.urlGuiaMostrarNotSanitized];

    const images = imageElements.map((eachImage) => {
      return {
        src: eachImage,
        msrc: eachImage,
        w: 800,
        h: 800,
      };
    });
    const options = {
      index: 0,
      bgOpacity: 0.9,
      history: false,
    };

    let sub$ = this.photoSwipe.open(images, options).subscribe((_) => {});
    this.photoSwipeSubscriptions$.push(sub$);
  }
}
