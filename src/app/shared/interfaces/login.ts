import * as moment from 'moment'

export interface Login {
  username: string
  password: string
}

export interface Usuario {
  id?: number
  _id?: string
  id_sesion?: string
  user?: number
  password?: string
  rut?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  phone?: string
  company?: string
  store_recid?: string
  store_code?: string
  store?: string
  recid_empresa?: string
  recid_billing?: string
  method_payment?: string
  user_role?: string
  first_name?: string
  last_name?: string
  email?: string
  active?: boolean
  login_temp?: boolean
  tipo_usuario?: number
  username?: string
  giro?: string
  iva?: boolean
  vendedor?: any
  credito?: any
  ultimoCierre?: moment.Moment
  fechaControl?: moment.Moment
}

/**
 * @author José Espinoza
 * Por ahora la única forma de saber que un usuario es empresa,
 * es por el giro.
 * Para usuarios empresa el giro es un string de dígitos,
 * Para usuarios persona, el giro es null.
 */
export function esEmpresa(usuario: Usuario): boolean {
  return typeof usuario.giro !== 'undefined' && usuario.giro !== null
}
