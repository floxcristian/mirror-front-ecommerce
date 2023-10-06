import { MobileMenuItem } from '../app/shared/interfaces/mobile-menu-item';

export const mobileMenu: MobileMenuItem[] = [
  { type: 'link', label: 'Página Principal', url: ['/'] },

  {
    type: 'button',
    label: 'Mi Cuenta',
    children: [
      { type: 'link', label: 'Mi cuenta', url: './account/dashboard' },
      { type: 'link', label: 'Editar perfil', url: './account/profile' },
      { type: 'link', label: 'Pedidos', url: './account/orders' },
      { type: 'link', label: 'Direcciones', url: './account/addresses' },
      { type: 'link', label: 'Cambiar contraseña', url: './account/password' },
    ],
  },
  { type: 'link', label: 'Acerca de nosotros', url: './site/about-us' },
  { type: 'link', label: 'Politica de envíos', url: './site/terms' },
  { type: 'link', label: 'Contacto', url: './site/contact-us' },
];
