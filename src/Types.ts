export interface Track  {
  id: string;
  name: string;
  preview_url?: string | null;
  album: Album;
  artists: Artist[];
};

export interface Album  {
  id: string;
  name: string;
  images: Image[];
};

export interface Artist  {
  id: string;
  name: string;
  images?: Image[];
};

export interface Image {
  url: string;
  height?: number;
  width?: number;
};
