export interface MobileMenuItemBase {
  label: string;
  data?: any;
  children?: MobileMenuItem[];
  icon?: string;
  cod?: string;
}

export interface MobileMenuItemLink extends MobileMenuItemBase {
  type: 'link';
  url: any;
}

export interface MobileMenuItemButton extends MobileMenuItemBase {
  type: 'button';
  url?: any;
}

export interface MobileMenuItemDivider extends MobileMenuItemBase {
  type: 'divider';
  url?: any;
}

export type MobileMenuItem =
  | MobileMenuItemLink
  | MobileMenuItemButton
  | MobileMenuItemDivider;
