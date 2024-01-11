import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

export const CarouselOptions: Partial<OwlCarouselOConfig> = {
  autoplay: false,
  dots: true,
  loop: true,
  responsive: {
    0: { items: 1 },
  },
  rtl: false,
};
