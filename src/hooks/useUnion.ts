import { useCallback, useState } from 'react';
import {
  ActivityScope,
  IOrganizationTypes,
  IInterestScopes,
  getInterestScopes,
  getOrganizationTypes,
  getActivityScopes,
} from '../services/api/dictionaries';
import {
  IBanner,
  updateLargeOrganizationBanner,
  updateSmallOrganizationBanner,
  updateOrganizationBannerVisibility,
  removeOrganizationBanner,
  createOrganizationBanner,
  getOrganizationBanners,
  updateOrganizationAvatar,
  updateOrganizationScopes,
  getOrganization,
  IOrganization,
  IGetOrganization,
  removeOrganization,
  updateOrganization,
  IUpdateOrganization,
  updateOrganizationInterests,
} from '../services/api/organizations';

const useUnion = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [organization, setOrganization] = useState<{
    data: IOrganization;
    isDeleted: boolean;
  }>({
    data: null,
    isDeleted: false,
  });
  const [dictionariesData, setDictionariesData] = useState<{
    activityScopes: ActivityScope[];
    organizationTypes: IOrganizationTypes[];
    interestScopes: IInterestScopes[];
  }>({
    activityScopes: [],
    organizationTypes: [],
    interestScopes: [],
  });

  const fetchBanners = useCallback(async (organizationId: number) => {
    setIsLoading(true);

    const orgBanners = await getOrganizationBanners(organizationId);

    setBanners(orgBanners);
    setIsLoading(false);
  }, []);

  const updateBanner = useCallback(
    async (organizationId: number, index: number, type: string, banner: string) => {
      setIsLoading(true);

      if (type === 'large') {
        await updateLargeOrganizationBanner(organizationId, index, banner);
      } else if (type === 'small') {
        await updateSmallOrganizationBanner(organizationId, index, banner);
      }

      await fetchBanners(organizationId);

      setIsLoading(false);
    },
    [fetchBanners]
  );

  const updateBannerVisibility = useCallback(
    async (organizationId: number, index: number, enabled: boolean) => {
      setIsLoading(true);

      await updateOrganizationBannerVisibility(organizationId, index, enabled);

      await fetchBanners(organizationId);

      setIsLoading(false);
    },
    [fetchBanners]
  );

  const removeBanner = useCallback(
    async (organizationId: number, index: number) => {
      setIsLoading(true);

      const isDeleted = await removeOrganizationBanner(organizationId, index);
      if (isDeleted) {
        await fetchBanners(organizationId);
      }
      setIsLoading(false);
    },
    [fetchBanners]
  );

  const createBanner = useCallback(
    async (organizationId: number, newBanner: IBanner) => {
      setIsLoading(true);

      const orgBanner = await createOrganizationBanner(organizationId, newBanner);

      if (orgBanner?.id) {
        await fetchBanners(organizationId);
      }

      setIsLoading(false);
    },
    [fetchBanners]
  );

  const fetchDictionariesData = useCallback(async () => {
    setIsLoading(true);

    const interestScopes = await getInterestScopes();
    const organizationTypes = await getOrganizationTypes();
    const activityScopes = await getActivityScopes();

    setDictionariesData({
      ...dictionariesData,
      activityScopes: activityScopes || [],
      organizationTypes: organizationTypes || [],
      interestScopes: interestScopes || [],
    });
    setIsLoading(false);
  }, [dictionariesData]);

  const changeOrganization = useCallback(
    async ({ organizationId, body, interests, scopes, avatar }: IUpdateOrganization) => {
      setIsLoading(true);

      if (interests) await updateOrganizationInterests(organizationId, interests);
      if (scopes) await updateOrganizationScopes(organizationId, scopes);
      if (avatar) await updateOrganizationAvatar(organizationId, avatar);

      const formattedData = Object.keys(body).reduce((prev, key) => {
        if (body[key] === '') {
          // formatting for back-end
          prev[key] = null;
        } else {
          prev[key] = body[key];
        }
        return prev;
      }, {}) as IOrganization;

      return updateOrganization({ organizationId, body: formattedData })
        .then((data) => {
          setOrganization({ ...organization, data });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);

          throw e;
        });
    },
    [organization]
  );

  const fetchOrganization = useCallback(
    ({ organizationId }: IGetOrganization) => {
      setIsLoading(true);

      return getOrganization({ organizationId })
        .then((data) => {
          setOrganization({ ...organization, data });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);

          throw e;
        });
    },
    [organization]
  );

  const deleteOrganization = useCallback(
    ({ organizationId }: IGetOrganization) => {
      setIsLoading(true);

      return removeOrganization({ organizationId })
        .then(() => {
          setOrganization({ ...organization, isDeleted: true });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);

          throw e;
        });
    },
    [organization]
  );

  return {
    isLoading,
    banners: {
      data: banners,
      update: updateBanner,
      updateVisibility: updateBannerVisibility,
      fetch: fetchBanners,
      create: createBanner,
      remove: removeBanner,
    },
    organization: {
      ...organization,
      update: changeOrganization,
      fetch: fetchOrganization,
      remove: deleteOrganization,
    },
    dictionaries: {
      ...dictionariesData,
      fetch: fetchDictionariesData,
    },
  };
};

export default useUnion;
