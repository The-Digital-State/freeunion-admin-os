import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteNewsAbusesThunk, getNewsAbusesThunk } from 'redux/slices/news';

import useSortBy from 'hooks/useSortBy';

import NewsPageTabLayout from 'components/layout/NewsPageTabLayout';
import { TableColumn } from 'components/molecules/Table/Table';
import { Box, Typography } from '@material-ui/core';
import Table from 'components/molecules/Table';

import { NewsAbuses } from 'types/news';

import { useDispatch, useSelector } from '../../../../redux';

import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import { formatTableColumnDate } from 'helpers/formatTableColumnDate';

export const abuseTypeText = [
  'Граматическая ошибка',
  'Недостоверная информация',
  'Публикация носит оскорбительный характер или содержит неприемлемый контент',
  'Публикация является скрытой рекламой, носит коммерческий характер',
];

const columnsConfig: TableColumn[] = [
  {
    id: 'id',
    Header: 'ID',
    sort: false,
  },
  {
    id: 'message',
    Header: 'Текст',
    sort: false,
  },
  {
    id: 'type_id',
    Header: 'Тип жалобы',
    sort: false,
  },
  {
    id: 'title',
    Header: 'Название новости',
    sort: false,
  },
  {
    id: 'created_at',
    Header: 'Дата отправки жалобы',
    sort: false,
  },
];

export default function NewsAbusesTable() {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const history = useHistory();

  const dispatch = useDispatch();
  const dataErrors = useSelector(({ news }) => news.newsAbuses);
  const sortBy = useSortBy();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getNewsAbusesThunk(organizationId));
      } catch (error) {
        toast.error(error);
      }
    })();
  }, [organizationId, dispatch]);

  const sliceText = (text: string): string => {
    return `${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`;
  };

  const mapNewsToTable = (newsList: NewsAbuses[]) => {
    return newsList?.map(({ id, news, created_at, message, type_id }) => ({
      id,
      title: sliceText(news.title),
      type_id: abuseTypeText[type_id - 1],
      message: sliceText(message),
      created_at: formatTableColumnDate(created_at),
    }));
  };

  const data = mapNewsToTable(dataErrors);

  const handleClickRow = async (id: number) => {
    try {
      history.push(`/${organizationId}/news/abuse/${id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      const isDelete = window.confirm('Вы действительно хотите удалить эту жалобу?');

      if (isDelete) {
        await dispatch(deleteNewsAbusesThunk(organizationId, id));
        toast('Жалоба удалена!');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <NewsPageTabLayout>
      {data?.length ? (
        <Table
          sortBy={sortBy}
          columns={columnsConfig}
          data={data?.map((abuse) => ({
            ...abuse,
          }))}
          onClickRow={handleClickRow}
          actions={[
            {
              id: 'delete',
              title: 'Удалить',
              onClick: handleDeleteNews,
              Icon: TrashIcon,
            },
          ]}
        />
      ) : (
        <Box sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Жалобы отсуствуют</Typography>
        </Box>
      )}
    </NewsPageTabLayout>
  );
}
