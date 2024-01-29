// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartV2Service {
  private productOrigin: string[] = [];

  /**
   * Guardar origen previo al ingreso de una ficha de producto.?
   * @param origin
   */
  setProductOrigin(origin: string[]): void {
    this.productOrigin = this.productOrigin ? origin : [];
  }

  /***
   * Obtener origen previo al ingreso de una ficha de producto.
   */
  getProductOrigin(): string[] {
    return this.productOrigin;
  }
}
