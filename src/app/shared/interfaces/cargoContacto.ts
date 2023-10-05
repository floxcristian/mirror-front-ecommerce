import { ResponseApi } from './response-api'

export interface CargoContacto {
  title: string
  titleid: string
  recid: number
}

export interface CargosContactoResponse extends ResponseApi {
  data: CargoContacto[]
}
