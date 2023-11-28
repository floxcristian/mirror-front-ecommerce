export interface IInvitado {
  rut: string;
  carro_id: string;
  tipoEnvio: 'DES' | 'RC';
  calle: string;
  comuna: string;
  comunaCompleta: string;
  numero: string;
  depto: string;
}
