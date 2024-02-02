// Angular
import { Injectable } from '@angular/core';
// Env
import { environment } from '@env/environment';
// Services
import { ScriptService } from '../script/script.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly webChatScript = environment.webChatScript;

  constructor(private readonly scriptService: ScriptService) {}

  /**
   * Cargar script de chat.
   */
  loadChatScript() {}

  /**
   * Mostrar botón de chat.
   */
  showChatButton() {}

  /**
   * Ocultar botón de chat.
   */
  hideChatButton() {}
}
