import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DocumentDownloadService } from '@core/services-v2/document-download.service';
import { environment } from '@env/environment';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-page-downloadpdf',
  templateUrl: './page-downloadpdf.component.html',
  styleUrls: ['./page-downloadpdf.component.scss'],
})
export class PageDownloadpdfComponent implements OnInit {
  pdfBase64: any = null;
  numero: any = null;
  tipo: any = null;
  authBasic = 'Basic c2VydmljZXM6MC49ajNEMnNzMS53Mjkt';
  noDocument: boolean = false;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    // Services V2
    private readonly documentDownloadService: DocumentDownloadService
  ) {}

  ngOnInit() {
    this.numero = this.activatedRoute.snapshot.queryParams['numero'];
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    console.log(this.tipo);
    if (this.tipo === 'factura') this.downloadFacturaPdf();
    else if (this.tipo === 'orden-compra') this.downloadOcPdf();
    else this.downloadOvPdf();
  }

  headers() {
    return environment.apiShoppingCart.startsWith('http://192')
      ? new HttpHeaders()
      : new HttpHeaders().append('Authorization', this.authBasic);
  }
  downloadOvPdf() {
    let base64Code = '';
    if (this.tipo == 1 || this.numero.startsWith('CO-')) {
      base64Code = btoa(`quotation@quotation@${this.numero}`);
    } else {
      base64Code = btoa(`sales_order@sales_order@${this.numero}`);
    }

    this.documentDownloadService
      .downloadSalesOrder(base64Code)
      .subscribe((arrayBuffer) => {
        let response = Buffer.from(arrayBuffer).toString('base64');
        response = 'data:application/pdf;base64,' + response;
        response = response + '#toolbar=1&statusbar=1&navpanes=1';
        this.pdfBase64 =
          this.sanitizer.bypassSecurityTrustResourceUrl(response);
      });
  }

  downloadOcPdf() {
    const headers = this.headers();

    const url = environment.apiShoppingCart + 'getOc?id=' + this.numero;
    this.http
      .get(url, { headers, responseType: 'blob' })
      .subscribe((response: any) => {
        var file3 = new Blob([response], { type: 'application/pdf' });
        this.pdfBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file3)
        );
      });
  }

  downloadFacturaPdf() {
    // const numero = this.numero.split('-');
    const numero = 'BEL-69788'.split('-');
    if (numero.length < 2) {
      console.warn('Formato de número no válido');
      return;
    }
    const codigo = this.generarCodigo(numero[0], numero[1]);
    this.documentDownloadService.downloadFacturaPdf(codigo).subscribe({
      next: (data: any) => this.procesarRespuesta(data),
      error: (err) => {
        console.warn('Error al descargar el PDF:', err);
        this.noDocument = true;
      },
    });
  }

  generarCodigo(prefijo: string, valor: string) {
    const codigos: any = {
      BEL: 'receipt@39@',
      FEL: 'invoice@33@',
      NCE: 'credit_note@61@',
    };
    return codigos[prefijo] ? btoa(`${codigos[prefijo]}${valor}@`) : '';
  }

  procesarRespuesta(data: { base64: string; filename: string }) {
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      data.base64 + '#toolbar=1&statusbar=1&navpanes=1'
    );
    this.pdfBase64 = sanitizedUrl;
  }
}
