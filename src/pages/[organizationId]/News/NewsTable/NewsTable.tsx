import { TableColumn } from 'components/molecules/Table/Table';
import { useParams } from 'react-router-dom';

import Table from 'components/molecules/Table';
import useSortBy from 'hooks/useSortBy';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../../redux';
import { changeNewsThunk, deleteNewsThunk, getNewsThunk } from 'redux/slices/news';
import { Box, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import { Telegram } from '@material-ui/icons';
import EyeIcon from '../../../../lib/material-kit/icons/Eye';
import EyeOffIcon from '../../../../lib/material-kit/icons/EyeOff';
import { formatTableColumnDate } from 'helpers/formatTableColumnDate';
import formatServerError from 'shared/utils/formatServerError';
import { LightweightNews, NewsAutoPost, NewsMeta } from 'types/news';
import { publishNews, unpablishNews } from 'services/api/news';
import PublishAutoPostingModal from '../NewsAutoPosting/PublishAutoPostingModal/PublishAutoPostingModal';
import { useContext, useEffect, useState } from 'react';
import { ModalContext } from 'context/Modal';
import TableFooter from 'components/molecules/TableFooter';

export interface INewsTableProps {
  columnsConfig: TableColumn[];
  published?: string;
}

export default function NewsTable({ columnsConfig, published }: INewsTableProps) {
  const sortBy = useSortBy();
  const history = useHistory();
  const dispatch = useDispatch();
  const { organizationId } = useParams<{ organizationId?: string }>();
  const autoPostingTelegrams: NewsAutoPost[] = useSelector(({ news }) => news.autoPostingTelegrams);
  const meta: NewsMeta = useSelector(({ news }) => news.currentMeta);
  const data: LightweightNews[] = useSelector(({ news }) => news.data);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modalContext = useContext(ModalContext);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await dispatch(getNewsThunk(organizationId, limit, page, published));
      } catch (error) {
        toast.error(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    })();
  }, [dispatch, organizationId, limit, page, published]);

  let editNewsList;

  if (data) {
    editNewsList = data.map((news) => {
      return {
        ...news,
        created_at: formatTableColumnDate(news.created_at),
        updated_at: formatTableColumnDate(news.updated_at),
      };
    });
  }

  const openPublishAutoPostingTelegrams = (id: number) => {
    modalContext.openModal(
      <PublishAutoPostingModal onClose={modalContext.closeModal} organizationId={organizationId} newsId={id} />
    );
  };

  const handleClickRow = async (id: number) => {
    try {
      history.push(`/${organizationId}/news/editor/${id}`);
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      const isDelete = window.confirm('Вы действительно хотите удалить эту новость?');

      if (isDelete) {
        await dispatch(deleteNewsThunk(organizationId, id));
        toast('Новость удалена');
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const toggleVisibility = async (id: number, publish: boolean) => {
    try {
      const updatePublishNews = data.map((news) => (news.id === id ? { ...news, published: publish } : news));
      if (!!publish) {
        await publishNews(organizationId, id);
      } else {
        await unpablishNews(organizationId, id);
      }
      await dispatch(changeNewsThunk(updatePublishNews));
      toast(`Новость ${!publish ? 'скрыта' : 'снова видна всем'}!`);
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  return (
    <>
      {editNewsList?.length ? (
        <div>
          <Table
            sortBy={sortBy}
            columns={columnsConfig}
            data={editNewsList?.map((news) => ({
              ...news,
              author: `${news.user?.public_name} ${news.user?.public_family}`,
            }))}
            onClickRow={handleClickRow}
            loading={isLoading}
            actions={[
              {
                id: 'delete',
                title: 'Удалить',
                onClick: handleDeleteNews,
                Icon: TrashIcon,
              },
              {
                id: 'rePublishNews',
                title: 'Продублировать новость',
                onClick: openPublishAutoPostingTelegrams,
                Icon: Telegram,
                showCallback: (row) => !!row.published_at && !!autoPostingTelegrams.find((channel) => channel.verified),
              },
              ...[{ show: true }, { show: false }].map(({ show }) => {
                return {
                  id: show ? 'show' : 'hide',
                  title: show ? 'Показать новость' : 'Скрыть новость',
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
          <Typography>У вас нет данных</Typography>
        </Box>
      )}
    </>
  );
}
