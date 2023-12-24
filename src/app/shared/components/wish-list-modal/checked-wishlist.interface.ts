import { IWishlist } from '@core/services-v2/wishlist/models/wishlist-response.interface';

export type ICheckedWishlist = IWishlist & { checked: boolean };
