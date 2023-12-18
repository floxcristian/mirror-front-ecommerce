export interface IInvitado {
  rut: string;
  carro_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  giro?: string;
  tipoEnvio: 'DES' | 'RC';
  calle: string;
  comuna: string;
  comunaCompleta: string;
  numero: string;
  depto: string;
}
