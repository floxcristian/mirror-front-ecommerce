import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ResponseApi } from '../../shared/interfaces/response-api';
import { ClientsService } from '../../shared/services/clients.service';
import { rutValidator } from '../../shared/utils/utilidades';
import { RegistroOkModalComponent } from '../components/registro-ok-modal/registro-ok-modal.component';
declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-page-mes-del-camionero',
  templateUrl: './page-mes-del-camionero.component.html',
  styleUrls: ['./page-mes-del-camionero.component.scss'],
})
export class PageMesDelCamioneroComponent implements OnInit {
  formulario!: FormGroup;
  cargando = false;
  recognition: any;
  recognizing = false;
  texto = '';
  textToSearch = '';
  datos = {
    rut: '',
    nombre: '',
    email: '',
    celular: '',
    historia: '',
  };

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private clientsService: ClientsService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      rut: [
        this.datos.rut,
        [Validators.required, Validators.maxLength(10), rutValidator],
      ],
      nombre: [
        this.datos.nombre,
        [Validators.required, Validators.maxLength(100)],
      ],
      email: [
        this.datos.email,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/
          ),
        ],
      ],
      celular: [
        this.datos.celular,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]{8}$/),
        ],
      ],
      historia: [
        this.datos.historia,
        [Validators.required, Validators.maxLength(5000)],
      ],
      aceptar: [false, Validators.required],
    });

    this.initMic();
  }

  enviar() {
    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.clientsService
      .setConcurso(this.formulario.value)
      .subscribe((resp: ResponseApi) => {
        if (resp.error) {
          this.toast.error(resp.msg);
          this.cargando = false;
          return;
        }

        this.cargando = false;
        const initialState = {
          nombre: this.datos.nombre.split(' ')[0],
        };
        this.formulario.reset();
        this.modalService.show(RegistroOkModalComponent, {
          initialState,
          class: 'mx-auto',
        });
      });
  }

  initMic() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('¡API no soportada!');
    } else {
      let interim = '';
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'es';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.onstart = function () {
        console.log('Estoy escuchando tu historia...');
      };
      this.recognition.onresult = async (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            interim = event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };
      this.recognition.onerror = (event: any) => {
        console.log('onerror: ' + event);
      };
      this.recognition.onend = async () => {
        console.log('dejo de escuchar...');
        this.recognizing = false;
        $('.fa-microphone').removeClass('fa-beat');
        $('.fa-microphone').css('color', 'yellow');
        // Eventos al terminar de escuchar
        // $('.search__input').val(interim);
        this.textToSearch = interim.slice(0, -1);

        this.datos.historia = this.datos.historia + ' ' + this.textToSearch;
        $('#historia').val(this.datos.historia);
        //Ejecuto click sobre input buscador para desplegar opciones de búsqueda
        // $('.search__input').click();
        //this.buscar();
      };

      //events

      this.recognition.onaudiostart = function (event: any) {
        console.log('onaudiostart');
        interim = '';
      };

      this.recognition.onsoundstart = function (event: any) {
        console.log('onsoundstart');
      };

      this.recognition.onspeechstart = function (event: any) {
        console.log('onspeechstart');
        // $('#finalTranscript').append($('#areaResult').val());
      };

      this.recognition.onspeechend = function (event: any) {
        console.log('onspeechend');
        console.log('onspeechstart');

        // $('#finalTranscript').append($('#areaResult').val());
      };

      this.recognition.onsoundend = function (event: any) {
        console.log('onsoundend');
        console.log('onspeechstart');
        // $('#finalTranscript').append($('#areaResult').val());
      };

      this.recognition.onaudioend = function (event: any) {
        console.log('onaudioend');

        console.log('onspeechstart');
        // $('#finalTranscript').append($('#areaResult').val());
      };

      this.recognition.onnomatch = function (event: any) {
        console.log('onnomatch');
        console.log('onspeechstart');
        // $('#finalTranscript').append($('#areaResult').val());
      };

      this.recognition.onerror = function (event: any) {
        console.log('onerror: ' + event);
      };

      this.recognition.onstart = function (event: any) {
        console.log('onstart');
      };

      // this.recognition.onend = function (event) {
      //   console.log('onend');
      // };
    }
  }
  openMic() {
    console.log(this.recognizing);
    try {
      if (!this.recognizing) {
        //console.log('start');
        this.recognition.start();
        this.recognizing = true;
        $('.fa-microphone').addClass('fa-beat');
        $('.fa-microphone').css('color', 'red');
      } else {
        this.recognition.stop();
        this.recognizing = false;
        $('.fa-microphone').removeClass('fa-beat');
        $('.fa-microphone').css('color', 'yellow');
      }
    } catch (e) {
      console.log(e);
    }
  }
}
