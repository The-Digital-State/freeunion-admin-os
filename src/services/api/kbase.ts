import { KbaseMaterialAdmin, KbaseSectionLight } from 'shared/interfaces/kbase';
import { ImageUploadResponse } from 'types/news';
import { api } from './helper';

const getKbaseUrl = (orgId: number) => `/admin_org/${orgId}/kbase`;

export async function getSections(orgId: number): Promise<KbaseSectionLight[]> {
  const response = await api().get(`${getKbaseUrl(orgId)}/sections`);
  return response?.data?.data;
}

export async function createSection(section: Omit<KbaseSectionLight, 'id'>, orgId: number): Promise<KbaseSectionLight> {
  const response = await api().post(`${getKbaseUrl(orgId)}/sections`, section);
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'knowledge_base',
      action: 'create_section',
    },
  });
  return response?.data?.data;
}

export async function updateSection(
  section: KbaseSectionLight,
  orgId: number,
  sectionId: number
): Promise<KbaseSectionLight> {
  const response = await api().put(`${getKbaseUrl(orgId)}/sections/${sectionId}`, section);
  return response?.data?.data;
}

export async function deleteSection(orgId: number, sectionid: number): Promise<KbaseSectionLight> {
  const response = await api().delete(`${getKbaseUrl(orgId)}/sections/${sectionid}`);
  return response?.data?.data;
}

//MATERIALS ----------------------------------------------------------------------------------------------------------------------------

export async function getMaterials(
  orgId: number,
  sectionId?: number,
  limit?: number,
  page?: number,
  published?: string
): Promise<any> {
  const response = await api().get(`${getKbaseUrl(orgId)}/materials`, {
    params: {
      section: sectionId,
      sortDirection: 'desc',
      sortBy: 'updated_at',
      limit: limit,
      page: page,
      published_at: published,
    },
  });
  return response?.data;
}

export async function createMaterial(
  material: Omit<KbaseMaterialAdmin, 'id'>,
  orgId: number
): Promise<KbaseMaterialAdmin> {
  const response = await api().post(`${getKbaseUrl(orgId)}/materials`, material);
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'knowledge_base',
      action: 'create_material',
    },
  });
  return response?.data?.data;
}

export async function updateMaterial(
  material: KbaseMaterialAdmin,
  orgId: number,
  materialId: number
): Promise<KbaseMaterialAdmin> {
  const response = await api().put(`${getKbaseUrl(orgId)}/materials/${materialId}`, material);
  return response?.data?.data;
}

export async function publishMaterial(orgId: number, materialId: number): Promise<void> {
  await api().post(`${getKbaseUrl(orgId)}/materials/${materialId}/publish`);
}

export async function unpublishMaterial(orgId: number, materialId: number): Promise<void> {
  await api().post(`${getKbaseUrl(orgId)}/materials/${materialId}/unpublish`);
}

export async function getMaterial(orgId: number, materialId: number): Promise<KbaseMaterialAdmin> {
  const response = await api().get(`${getKbaseUrl(orgId)}/materials/${materialId}`);
  return response?.data?.data;
}

export async function uploadImageMaterial(orgId: string, image: string | ArrayBuffer): Promise<ImageUploadResponse> {
  return await api().post(`${getKbaseUrl(+orgId)}/materials/upload`, { image });
}

export async function deleteMaterial(orgId: number, materialId: number): Promise<KbaseSectionLight> {
  const response = await api().delete(`${getKbaseUrl(orgId)}/materials/${materialId}`);
  return response?.data?.data;
}

export function dragMaterial(orgId: number, materialId: string, rowId: number) {
  return api().post(`${getKbaseUrl(orgId)}/materials/${materialId}/drag/${rowId}`);
}
