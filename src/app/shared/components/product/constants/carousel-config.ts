import { NguCarouselConfig } from '@ngu/carousel';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

export const CarouselConfig: NguCarouselConfig = {
  grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
  slide: 1,
  interval: { timing: 4000, initialDelay: 1000 },
  load: 3,
  loop: true,
  vertical: {
    enabled: true,
    height: 380,
  },
  point: {
    visible: true,
    hideOnSingleSlide: true,
  },
};

export const CarouselOptions: Partial<OwlCarouselOConfig> = {
  autoplay: false,
  dots: true,
  loop: true,
  responsive: {
    0: { items: 1 },
  },
  rtl: false,
};
