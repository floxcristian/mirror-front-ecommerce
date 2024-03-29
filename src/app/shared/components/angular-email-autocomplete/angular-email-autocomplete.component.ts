import { Component, Input } from '@angular/core';
@Component({
  selector: 'autocomplete',
  templateUrl: './angular-email-autocomplete.component.html',
  styleUrls: ['./angular-email-autocomplete.component.scss'],
})
export class AngularEmailAutocompleteComponent {
  toggleDropDown: boolean;
  dropDownValues: Array<{
    imgUrl?: undefined | string;
    value: string;
  }> = [];
  inputValue: string;
  placeholder: string;
  correoValido: boolean = false;
  regularExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() givenPlaceHolder: string;
  @Input() domainNames: Array<{
    imgUrl?: undefined | string;
    value: string;
  }>;
  @Input() disabled!: boolean;

  constructor() {
    this.toggleDropDown = false;
    this.placeholder = '';
    this.inputValue = '';
    this.givenPlaceHolder = '';
    this.domainNames = [];
  }

  ValidaCorreo = () => {
    // validation email
    if (this.inputValue?.length) {
      this.correoValido = this.regularExpression.test(
        String(this.inputValue).toLowerCase()
      );
    }
  };

  handleSelect = (value: string) => {
    this.inputValue = value;
    this.ValidaCorreo();
  };

  activaFiltro = (event: any) => {
    this.toggleDropDown = true;
  };

  onInputChange = (event: any) => {
    let tecla_presionada = event.keyCode;

    if (tecla_presionada == 27) {
      // this.handleVisibility('hide');
      return;
    }

    this.toggleDropDown = true;
    this.dropDownValues = [];

    let last_value = this.inputValue.substr(-1, 1);

    if (this.inputValue && this.inputValue.length > 0) {
      // if(this.inputValue.indexOf("@") == -1 || last_value == '@'){

      this.domainNames.forEach((domainName) => {
        let valueToDisplay: string;

        if (this.inputValue.indexOf('@') != -1) {
          let correo = this.inputValue.split('@');

          let correo_sin_dom = correo[0];

          let dominio_usuario: string = correo[1];

          let valor_domain: string = domainName.value;

          if (valor_domain.includes(dominio_usuario)) {
            valueToDisplay = `${correo_sin_dom}@${domainName.value}`;
            this.dropDownValues.push({
              value: valueToDisplay,
              imgUrl: domainName.imgUrl,
            });
          }
        } else {
          valueToDisplay =
            this.inputValue.indexOf('@') == -1
              ? `${this.inputValue}@${domainName.value}`
              : `${this.inputValue}${domainName.value}`;
          this.dropDownValues.push({
            value: valueToDisplay,
            imgUrl: domainName.imgUrl,
          });
        }
        // valueToDisplay = this.inputValue.indexOf("@") == -1 ? `${this.inputValue }@${domainName.value}` : `${this.inputValue }${domainName.value}`;
      });
    } else {
      this.toggleDropDown = false;
    }
    this.ValidaCorreo();
  };
}
