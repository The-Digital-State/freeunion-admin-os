import { User } from './User';

export type NewsOrganization = {
  avatar: string;
  id: number;
  name: string;
  short_name: string;
  type_id: number;
  type_name: string;
};

export type LightweightNews = {
  ctr: number;
  clicks: number;
  impressions: number;
  comment: string;
  created_at: Date;
  id?: number;
  organization: NewsOrganization;
  published: boolean;
  published_at: string;
  title: string;
  updated_at: Date;
  user: User;
  tags: string[];
  visible: number;
  preview: string;
};

export type NewsData = LightweightNews & {
  content: string;
};

export type ImageUploadResponse = {
  data: {
    url: string;
  };
};

export type NewsAbuses = {
  created_at: Date;
  id: number;
  message: string;
  news: {
    id: number;
    title: string;
  };
  type_id: number;
};

export type NewsAutoPost = {
  id: number;
  name: string;
  channel: string;
  verified: boolean;
  verify_code?: string;
};

export type NewsMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: any[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};
