// Models
import {
  IArticleResponse,
  IAttribute,
} from '@core/models-v2/article/article-response.interface';
import { IProductImage } from '../models/image.interface';
// Services
import { ImageUtils } from '@core/utils-v2/image-utils.service';

export class GalleryUtils {
  // FIXME: esto debe ser privado.
  static formatThumbVideo(attribute: IAttribute): string {
    const thumbImage = attribute.value.split('/embed')[1];
    return `https://i.ytimg.com/vi${thumbImage}/1.jpg`;
  }

  static formatImageSlider(product: IArticleResponse): IProductImage[] {
    if (
      !product.images ||
      !product.images['1000'].length ||
      !product.images['150'].length
    ) {
      const image: IProductImage = {
        id: `${product.sku}_0`,
        url: ImageUtils.getDefaultProductImage(),
        active: true,
      };
      return [image];
    } else {
      const image1000 = product.images['1000'];
      const image150 = product.images['150'];

      const images: IProductImage[] = image1000.map((item, index) => ({
        id: `${product.sku}_${index}`,
        url: item,
        urlThumbs: image150[index],
        active: index === 0,
        video: false,
      }));

      // Formateando los thumbs de video.
      const videos = product.attributes.filter(
        (item) => item.name === 'VIDEO'
      );
      const videoImages = videos.map((item, index) => ({
        id: `${product.sku}_${images.length + index}`,
        url: item.value,
        urlThumbs: GalleryUtils.formatThumbVideo(item),
        active: index === 0,
        video: true,
      }));
      images.push(...videoImages);
      return images;
    }
  }

  static formatActiveImage(images: IProductImage[], imageId: string): void {
    images.forEach((image) => {
      const active = image.id === imageId;
      return { ...image, active };
    });
  }
}
