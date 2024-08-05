import { TableColumn } from 'components/molecules/Table/Table';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Table from 'components/molecules/Table';
import useSortBy from 'hooks/useSortBy';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../../redux';
import { Box, Typography } from '@material-ui/core';
import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import EyeIcon from '../../../../lib/material-kit/icons/Eye';
import EyeOffIcon from '../../../../lib/material-kit/icons/EyeOff';
import { formatTableColumnDate } from 'helpers/formatTableColumnDate';
import formatServerError from 'shared/utils/formatServerError';
import { changeMaterialsThunk, deleteMaterialAction, getMaterialsTableAction } from 'redux/slices/articles';
import { routes } from 'Routes';
import { publishMaterial, unpublishMaterial } from 'services/api/kbase';
import { KbaseMaterialAdmin, KbaseSectionLight } from 'shared/interfaces/kbase';
import TableFooter from 'components/molecules/TableFooter';
import { NewsMeta } from 'types/news';

export interface IKbaseTableProps {
  data?: KbaseMaterialAdmin[];
  columnsConfig: TableColumn[];
  isDraft?: boolean;
}

export default function KnowledgeBaseTable({ columnsConfig, isDraft }: IKbaseTableProps) {
  const sortBy = useSortBy();
  const history = useHistory();
  const dispatch = useDispatch();
  const { organizationId } = useParams<{ organizationId?: string }>();
  const allSections: KbaseSectionLight[] = useSelector(({ articles }) => articles.sections);
  const meta: NewsMeta = useSelector(({ articles }) => articles.currentMeta);
  const data = useSelector(({ articles }) => articles.tableMaterials);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editMaterialsList, setEditMaterialsList] = useState<any>([]);
  const [forceUpdate, setForceUpdate] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await dispatch(getMaterialsTableAction(+organizationId, limit, page, !!isDraft ? 'nl,' : 'nnl,'));
      } catch (error) {
        toast.error(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch, organizationId, limit, page, isDraft, forceUpdate]);

  useEffect(() => {
    if (data) {
      setEditMaterialsList(
        data?.map((material) => {
          return {
            ...material,
            created_at: formatTableColumnDate(material.created_at),
            updated_at: formatTableColumnDate(material.updated_at),
            section: allSections.find((section) => material.section_id === section.id)?.name,
          };
        })
      );
    }
  }, [data, allSections]);

  const handleClickRow = async (id: number) => {
    try {
      const { section_id, type } = data.find((material) => material.id === id);
      if (type === 'text') {
        history.push(
          routes.kbase.getLinkEditorMaterials({
            organizationId: organizationId,
            sectionId: `${section_id}`,
            materialId: `${id}`,
          })
        );
      } else {
        history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/${section_id}/material/${id}`);
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    try {
      const isDelete = window.confirm(`Вы действительно хотите удалить материал?`);

      if (isDelete) {
        await dispatch(deleteMaterialAction(+organizationId, id));
        toast('Материал удален');
        setForceUpdate(Math.random());
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const toggleVisibility = async (id: number, publish: boolean) => {
    try {
      const updatePublishMaterial = data.map((news) => (news.id === id ? { ...news, published: publish } : news));
      if (!!publish) {
        await publishMaterial(+organizationId, id);
      } else {
        await unpublishMaterial(+organizationId, id);
      }
      await dispatch(changeMaterialsThunk(updatePublishMaterial));
      setForceUpdate(Math.random());
      toast(`Материал ${!publish ? 'скрыт' : 'снова виден всем'}!`);
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  return (
    <>
      {editMaterialsList?.length ? (
        <div>
          <Table
            sortBy={sortBy}
            columns={columnsConfig}
            data={editMaterialsList}
            loading={isLoading}
            onClickRow={handleClickRow}
            actions={[
              {
                id: 'delete',
                title: 'Удалить',
                onClick: handleDeleteMaterial,
                Icon: TrashIcon,
              },
              ...[{ show: true }, { show: false }].map(({ show }) => {
                return {
                  id: show ? 'show' : 'hide',
                  title: show ? 'Показать материал' : 'Скрыть материал',
                  onClick: (e) => toggleVisibility(e, show),
                  Icon: show ? EyeOffIcon : EyeIcon,
                  showCallback: (row) => (!!row.published_at && show ? !row.published : row.published),
                };
              }),
            ]}
          />
          {meta.total > 10 && (
            <TableFooter
              count={meta.total}
              onPageChange={(value) => setPage(value + 1)}
              onRowsPerPageChange={(value) => {
                setPage(1);
                setLimit(value);
              }}
              page={meta.current_page - 1}
              rowsPerPage={meta.per_page}
              rowsPerPageOptions={[10, 25, 50]}
            />
          )}
        </div>
      ) : (
        <Box sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>У вас нет {isDraft ? 'черновиков' : 'материалов'}</Typography>
        </Box>
      )}
    </>
  );
}
