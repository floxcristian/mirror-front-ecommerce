export interface Image {
  filename: File;
  folder: string;
  orig: string;
  title: string;
  alt: string;
  description: string;
  link: string;
  target: string;
  image_full?: string;
  image_tablet?: string;
  image_mobile?: string;
  created_at: string;
  updated_at: string;
}
