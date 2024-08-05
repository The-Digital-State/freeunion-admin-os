import Head from 'react-helmet';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../../redux';

import useUnion from '../../../hooks/useUnion';
import { getOrganizations } from '../../../redux/slices/organizations';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, Typography, AccordionDetails, AccordionSummary } from '@material-ui/core';

import UnionHelpsForm from '../../../components/organisms/UnionHelpsForm/UnionHelpsForm';
import UnionInfoForm from '../../../components/organisms/UnionInfoForm/UnionInfoForm';
import UnionPageLayout from '../../../components/layout/UnionPageLayout/UnionPageLayout';
import WayToEntryForm from '../../../components/organisms/WayToEntryForm/WayToEntryForm';
import UnionBannersForm from '../../../components/organisms/UnionBannersForm/UnionBannersForm';
import ScopeOrganisation from '../../../components/organisms/ScopeOrganistion/ScopeOrganisation';
import EditRolesInfoBlock from '../../../components/organisms/EditRolesInfoBlock/EditRolesInfoBlock';
import UnionSocialLinks from 'components/organisms/UnionSocialLinks/UnionSocialLinks';
import ExternalChats from 'components/organisms/ExternalChats/ExternalChats';

const Union = () => {
  const params = useParams<{ organizationId?: string }>();
  const dispatch = useDispatch();
  const { organization, dictionaries, isLoading, banners } = useUnion();
  const { organizationId } = params;
  useEffect(() => {
    if (!organization.isDeleted) {
      organization.fetch({ organizationId: +organizationId });
      banners.fetch(+organizationId);
      dictionaries.fetch();
    }
  }, [organizationId]);

  useEffect(() => {
    dispatch(getOrganizations());
  }, [organization]);

  const sections = [
    {
      title: 'Информация объединения',
      details: (
        <UnionInfoForm
          dictionaries={dictionaries}
          organization={organization?.data || {}}
          update={(formData) =>
            organization.update({
              organizationId: +organizationId,
              ...formData,
            })
          }
        />
      ),
    },
    {
      title: 'Социальные сети',
      details: (
        <UnionSocialLinks
          organization={organization?.data || {}}
          update={(formData) =>
            organization?.update({
              organizationId: organizationId,
              ...formData,
            })
          }
        />
      ),
    },
    {
      title: 'Изображение шапки объединения',
      details: (
        <UnionBannersForm
          banners={banners.data}
          create={(banner) => banners.create(+organizationId, banner)}
          remove={(index: number) => banners.remove(+organizationId, index)}
          updateImages={(index: number, type: string, banner: string) => banners.update(+organizationId, index, type, banner)}
          updateVisibility = {(index: number, enabled: boolean) => banners.updateVisibility(+organizationId, index, enabled)}
        />
      ),
    },
    {
      title: 'Помощь объединению',
      details: <UnionHelpsForm />,
    },
    {
      title: 'Способ вступления в объединение',
      details: (
        <WayToEntryForm
          organization={organization?.data || {}}
          update={(formData) =>
            organization?.update({
              organizationId: +organizationId,
              ...formData,
            })
          }
        />
      ),
    },
    {
      title: 'Видимость объединения',
      details: (
        <ScopeOrganisation
          organization={organization?.data || {}}
          update={(formData) =>
            organization?.update({
              organizationId: organizationId,
              ...formData,
            })
          }
        />
      ),
    },
    {
      title: 'Роли и доступ',
      details: <EditRolesInfoBlock />,
    },
    {
      title: 'Чаты',
      details: <ExternalChats organizationId={+organizationId} />,
    },
  ];

  if (!organization.data || !(Object.keys(organization.data).length > 0)) {
    return null; // TODO: think how to handle better
  }

  return (
    <>
      <Head>
        <title>Объединение</title>
      </Head>
      <UnionPageLayout organization={organization} organizationId={organizationId} isLoading={isLoading}>
        {sections.map((section) => (
          <Accordion
            key={section.title}
            sx={{
              borderRadius: 1,
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ height: 75 }}
            >
              <Typography variant="h6">{section.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{section.details}</AccordionDetails>
          </Accordion>
        ))}
      </UnionPageLayout>
    </>
  );
};

export default Union;
