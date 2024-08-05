import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import {
  createMaterial,
  createSection,
  deleteMaterial,
  deleteSection,
  getMaterials,
  getSections,
  publishMaterial,
  updateMaterial,
  updateSection,
} from 'services/api/kbase';
import { KbaseMaterialAdmin, KbaseSectionLight } from 'shared/interfaces/kbase';
import { NewsMeta } from 'types/news';

export type KbaseState = {
  materials: KbaseMaterialAdmin[];
  tableMaterials: KbaseMaterialAdmin[];
  currentMeta: NewsMeta;
  sections: KbaseSectionLight[];
  isLoading: boolean;
};

const initialState: KbaseState = {
  materials: [],
  tableMaterials: [],
  currentMeta: null,
  sections: [],
  isLoading: false,
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSectionsReducer(state: KbaseState, { payload }: PayloadAction<KbaseSectionLight[]>): KbaseState {
      return {
        ...state,
        sections: payload,
      };
    },
    setMaterialsReducer(state: KbaseState, { payload }: PayloadAction<KbaseMaterialAdmin[]>): KbaseState {
      return {
        ...state,
        materials: payload,
      };
    },
    setPublishReducer(state: KbaseState, { payload }: PayloadAction<number>): KbaseState {
      return {
        ...state,
        materials: state.materials.map((material) => ({
          ...material,
          ...(material?.id === payload && { published: true }),
        })),
      };
    },
    addSectionsReducer(state: KbaseState, { payload }: PayloadAction<KbaseSectionLight>): KbaseState {
      return {
        ...state,
        sections: [...state.sections, payload],
      };
    },
    addMaterialsReducer(state: KbaseState, { payload }: PayloadAction<KbaseMaterialAdmin>): KbaseState {
      return {
        ...state,
        materials: [...state.materials, payload],
      };
    },
    setMaterialsCurrentReducer(
      state: KbaseState,
      { payload }: PayloadAction<{ data: KbaseMaterialAdmin[]; meta: NewsMeta }>
    ): KbaseState {
      return {
        ...state,
        tableMaterials: payload.data,
        currentMeta: !!payload.meta ? payload.meta : state.currentMeta,
      };
    },
    updateMaterialsReducer(state: KbaseState, { payload }: PayloadAction<KbaseMaterialAdmin>): KbaseState {
      return {
        ...state,
        materials: state.materials.map((material) => ({
          ...material,
          ...(material?.id === payload.id && payload),
        })),
      };
    },
    updateSectionsReducer(state: KbaseState, { payload }: PayloadAction<KbaseSectionLight>): KbaseState {
      return {
        ...state,
        sections: state.sections.map((section) => ({
          ...section,
          ...(section?.id === payload.id && payload),
        })),
      };
    },

    deleteSectionsReducer(state: KbaseState, { payload }: PayloadAction<number>): KbaseState {
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== payload),
      };
    },
    deleteMaterialReducer(state: KbaseState, { payload }: PayloadAction<number>): KbaseState {
      return {
        ...state,
        materials: state.materials.filter((material) => material.id !== +payload),
      };
    },
    // deleteNewsReducer(state: NewsState, { payload }: PayloadAction<number>): NewsState {
    //   return {
    //     ...state,
    //     data: state.data.filter((news) => news?.id !== payload),
    //   };
    // },

    startLoading(state: KbaseState): KbaseState {
      return {
        ...state,
        isLoading: true,
      };
    },
    finishLoading(state: KbaseState): KbaseState {
      return {
        ...state,
        isLoading: false,
      };
    },
  },
});

export const { reducer } = slice;
export const {
  actions: {
    setSectionsReducer,
    setMaterialsReducer,
    addSectionsReducer,
    updateMaterialsReducer,
    setMaterialsCurrentReducer,
    updateSectionsReducer,
    deleteSectionsReducer,
    deleteMaterialReducer,
    addMaterialsReducer,
    setPublishReducer,
    startLoading,
    finishLoading,
  },
} = slice;

export const getSectionsAction =
  (orgId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const sections = await getSections(orgId);
    dispatch(setSectionsReducer(sections));

    dispatch(finishLoading());
  };

export const createSectionAction =
  (section: Omit<KbaseSectionLight, 'id'>, orgId: number): AppThunk =>
  async (dispatch): Promise<number> => {
    dispatch(startLoading());
    const newSection = await createSection(section, orgId);
    dispatch(addSectionsReducer(newSection));

    dispatch(finishLoading());
    return newSection.id;
  };
export const updateSectionAction =
  (section: KbaseSectionLight, orgId: number, sectionId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const updatedSection = await updateSection(section, orgId, sectionId);
    dispatch(updateSectionsReducer(updatedSection));

    dispatch(finishLoading());
  };

export const deleteSectionAction =
  (orgId: number, sectionId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await deleteSection(orgId, sectionId);
    dispatch(deleteSectionsReducer(sectionId));

    dispatch(finishLoading());
  };

export const getMaterialsAction =
  (orgId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const materials = await getMaterials(orgId);
    dispatch(setMaterialsReducer(materials.data));

    dispatch(finishLoading());
  };

export const getMaterialsTableAction =
  (orgId: number, limit?: number, page?: number, published?: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const materials = await getMaterials(orgId, null, limit, page, published);
    dispatch(setMaterialsCurrentReducer(materials));

    dispatch(finishLoading());
  };

export const createMaterialAction =
  (orgId: number, material: Omit<KbaseMaterialAdmin, 'id'>, publish: boolean): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const createdMaterial = await createMaterial(material, orgId);
    dispatch(addMaterialsReducer(createdMaterial));
    if (publish) {
      await publishMaterial(orgId, createdMaterial.id);
      dispatch(setPublishReducer(createdMaterial.id));
    }
    dispatch(finishLoading());
  };

export const updateMaterialAction =
  (orgId: number, materialId: number, material: KbaseMaterialAdmin, publish: boolean): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const materialUpdated = await updateMaterial(material, orgId, materialId);
    dispatch(updateMaterialsReducer(materialUpdated));

    if (publish) {
      await publishMaterial(+orgId, +materialId);
      dispatch(setPublishReducer(materialId));
    }
    dispatch(finishLoading());
  };

export const changeMaterialsThunk =
  (materials: KbaseMaterialAdmin[]): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());

    dispatch(setMaterialsReducer(materials));
    dispatch(finishLoading());
  };

export const deleteMaterialAction =
  (orgId: number, materialId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await deleteMaterial(orgId, materialId);
    dispatch(deleteMaterialReducer(materialId));

    dispatch(finishLoading());
  };

export default slice;
