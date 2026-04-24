export interface CategoryDetails {
  id: number;
  name: string;
  slug: string;
}

export interface AuthorDetails {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  status: string;
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  image: string | null;
  published_at: string;
  updated_at?: string;
  category_details: CategoryDetails | null;
  author_details: AuthorDetails | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination: {
      total_count: number;
      total_pages: number;
      current_page: number;
    };
  };
}
