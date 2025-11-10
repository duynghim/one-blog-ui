import type BaseDTO from "./BaseDTO";

export interface PostSummary extends BaseDTO {
  title: string;
  slug: string;
  featuredImageUrl: string;
}

export interface PostDetail extends PostSummary {
  content: string;
}

export interface PostRequest extends Pick<PostDetail, 'title' | 'content' | 'featuredImageUrl'> {
  categoryIds: number[];
}
