import { NewsAutoPost, NewsMeta } from './../../types/news';
import { LightweightNews, NewsData, ImageUploadResponse, NewsAbuses } from 'types/news';
import { api } from './helper';

type GetNewsTypes = {
  orgId: string;
  limit?: number;
  page?: number;
  published?: string | null;
};

export async function getNews({
  orgId,
  limit = 10,
  page = 1,
  published = 'nnl,',
}: GetNewsTypes): Promise<{ data: LightweightNews[]; meta: NewsMeta }> {
  const response = await api().get(`/admin_org/${orgId}/news`, {
    params: {
      sortDirection: 'desc',
      sortBy: 'updated_at',
      limit: limit,
      page: page,
      published_at: published,
    },
  });
  return response?.data;
}

export async function getNewsById(orgId: string, newsId: string | number): Promise<NewsData> {
  const response = await api().get(`/admin_org/${orgId}/news/${newsId}`);
  return response?.data?.data;
}

export async function createNews(orgId: string, data: Partial<NewsData>): Promise<NewsData> {
  const response = await api().post(`/admin_org/${orgId}/news`, data);
  return response?.data?.data;
}

export async function updateNews(orgId: string, newsId: number, data: Partial<NewsData>): Promise<NewsData> {
  const response = await api().put(`/admin_org/${orgId}/news/${newsId}`, data);
  return response?.data?.data;
}

export async function deleteNews(orgId: string, newsId: number): Promise<void> {
  await api().delete(`/admin_org/${orgId}/news/${newsId}`);
}

export async function publishNews(orgId: string, newsId: number): Promise<void> {
  await api().post(`/admin_org/${orgId}/news/${newsId}/publish`);
}

export async function unpablishNews(orgId: string, newsId: number): Promise<void> {
  await api().post(`/admin_org/${orgId}/news/${newsId}/unpublish`);
}

export async function uploadImage(orgId: string, image: string | ArrayBuffer): Promise<ImageUploadResponse> {
  return await api().post(`/admin_org/${orgId}/news/upload`, { image });
}

export async function getAbuses(orgId: string): Promise<NewsAbuses[]> {
  const response = await api().get(`/admin_org/${orgId}/news/abuses`);
  return response.data.data;
}

export async function deleteAbuse(orgId: string, abuseId: number): Promise<{}> {
  const response = await api().delete(`/admin_org/${orgId}/news/abuses/${abuseId}`);
  return response.data.data;
}

export async function getAbuse(orgId: string, abuseId: string): Promise<NewsAbuses> {
  const response = await api().get(`/admin_org/${orgId}/news/abuses/${abuseId}`);
  return response.data.data;
}

export async function getAutoPostingTelegrams(orgId: string): Promise<NewsAutoPost[]> {
  const response = await api().get(`/admin_org/${orgId}/organization_teleposts`);
  return response.data.data;
}

export async function createAutoPostingChannel(orgId: string, data: Partial<NewsAutoPost>): Promise<NewsAutoPost> {
  const response = await api().post(`/admin_org/${orgId}/organization_teleposts`, data);
  return response?.data?.data;
}

export async function deleteAutoPostingChannel(orgId: string, channelId: number): Promise<NewsAutoPost> {
  const response = await api().delete(`/admin_org/${orgId}/organization_teleposts/${channelId}`);
  return response.data.data;
}

export async function publishAutoPostingNews(
  orgId: string,
  newsId: number,
  channelsId: Partial<number[]>
): Promise<NewsAutoPost> {
  const response = await api().post(`/admin_org/${orgId}/news/${newsId}/telepost`, { telepost: channelsId });
  return response?.data?.data;
}
