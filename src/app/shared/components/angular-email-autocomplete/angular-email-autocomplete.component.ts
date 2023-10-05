import { Component, Input, Output } from '@angular/core'
import { EventEmitter } from '@angular/core'
@Component({
  selector: 'autocomplete',
  templateUrl: './angular-email-autocomplete.component.html',
  styleUrls: ['./angular-email-autocomplete.component.scss'],
})
export class AngularEmailAutocompleteComponent {
  public toggleDropDown: boolean
  public dropDownValues: Array<{
    imgUrl?: undefined | string
    value: string
  }> = []
  public inputValue: string
  public placeholder: string
  public correoValido: boolean = false
  public regularExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();
  @Input() givenPlaceHolder: string
  @Input() domainNames: Array<{
    imgUrl?: undefined | string
    value: string
  }>
  @Input() disabled!: boolean

  constructor() {
    this.toggleDropDown = false
    this.placeholder = ''
    this.inputValue = ''
    this.givenPlaceHolder = ''
    this.domainNames = []
  }

  ValidaCorreo = () => {
    // validation email
    if (this.inputValue && this.inputValue.length) {
      this.correoValido = this.regularExpression.test(
        String(this.inputValue).toLowerCase(),
      )
    }
  }

  handleSelect = (value: string) => {
    this.inputValue = value
    this.ValidaCorreo()
    // $('.dropdown-menu').hide();
  }

  ocultaMenuDropdown = (event: any) => {
    // $('.dropdown-menu').hide();
  }

  activaFiltro = (event: any) => {
    this.toggleDropDown = true
  }

  onInputChange = (event: any) => {
    let tecla_presionada = event.keyCode

    if (tecla_presionada == 27) {
      // this.handleVisibility('hide');
      return
    }

    this.toggleDropDown = true
    this.dropDownValues = []

    let last_value = this.inputValue.substr(-1, 1)

    if (this.inputValue && this.inputValue.length > 0) {
      // if(this.inputValue.indexOf("@") == -1 || last_value == '@'){

      this.domainNames.forEach((domainName) => {
        let valueToDisplay: string

        if (this.inputValue.indexOf('@') != -1) {
          let correo = this.inputValue.split('@')

          let correo_sin_dom = correo[0]

          let dominio_usuario: string = correo[1]

          let valor_domain: string = domainName.value

          if (valor_domain.includes(dominio_usuario)) {
            valueToDisplay = `${correo_sin_dom}@${domainName.value}`
            this.dropDownValues.push({
              value: valueToDisplay,
              imgUrl: domainName.imgUrl,
            })
          }
        } else {
          valueToDisplay =
            this.inputValue.indexOf('@') == -1
              ? `${this.inputValue}@${domainName.value}`
              : `${this.inputValue}${domainName.value}`
          this.dropDownValues.push({
            value: valueToDisplay,
            imgUrl: domainName.imgUrl,
          })
        }
        // valueToDisplay = this.inputValue.indexOf("@") == -1 ? `${this.inputValue }@${domainName.value}` : `${this.inputValue }${domainName.value}`;
      })
      // } else {
      //   this.toggleDropDown = false;
      // }

      // if(this.dropDownValues.length == 0){
      //   $('.dropdown-menu').hide();
      // } else {
      //   $('.dropdown-menu').show();
      // }
    } else {
      this.toggleDropDown = false
      // $('.dropdown-menu').hide();
    }
    this.ValidaCorreo()
  }
}
