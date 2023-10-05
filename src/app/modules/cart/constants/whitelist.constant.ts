import { Router } from '@angular/router'

/**
 * @author José Espinoza
 * Existen componentes que se subscriben al carro,
 * y que si está vacío te redirige a la página del carro vacío.
 * Esta lista es para evitar que se redirija a la página del carro vacío y
 * muestre la ruta de la forma correcta.
 *
 * Ejemplo de llamada en el componente page-cart-shipping.component.ts
 * if ((this.cartSession == null || this.cartSession.productos.length === 0) && !isInWhiteList(this.router)) {
 *   this.router.navigate(['/', 'carro-compra']);
 * }
 */
export const WHITELIST = ['/carro-compra/comprobante-de-cotizacion']

// Ejemplo de router.url: "/carro-compra/comprobante-de-cotizacion/CO-123456"
export function isInWhiteList(router: Router): boolean {
  return WHITELIST.some((route) => router.url.includes(route))
}
