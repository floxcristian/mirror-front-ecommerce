export interface Rom {
  id?: string;
  body?: string;
  author?: string;
  time?: string;
  chatId?: string;
  mensajes?: ChatMsg[];
  estado?: string;
  bot?: boolean;
  necesitaActualizar?: boolean;
  nombreUsuario?: string;
}

export interface ChatMsg {
  id: string;
  body: string;
  oculto: boolean;
  fromMe?: string;
  time: number;
  type: string;
  caption: string;
  filename: string;
  leido: boolean;
  entregado: boolean;
  bodyHtmlFormat?: any;
}
