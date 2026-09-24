export type Category = {
  _id: string;
  name: string;
  kind: 'region' | 'type';
};

export type Location = {
  _id: string;
  name: string;
  type: Category;
  region: Category;
  description: string;
  images: string[];
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  reviewsCount: number;
};

export type LocationQuery = {
  page?: number;
  limit?: number;
  region?: string;
  type?: string | string[];
  search?: string;
  sort?: 'popular' | 'rating' | 'new';
};

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
