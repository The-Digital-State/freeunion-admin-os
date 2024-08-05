import NewsPageTabLayout from 'components/layout/NewsPageTabLayout';
import NewsTable from '../NewsTable/NewsTable';
import { TableColumn } from 'components/molecules/Table/Table';

export default function AllNews() {
  const columnsConfig: TableColumn[] = [
    {
      id: 'id',
      Header: 'ID',
      sort: false,
    },
    {
      id: 'title',
      Header: 'Заголовок',
      sort: false,
    },
    {
      id: 'author',
      Header: 'Автор',
      sort: false,
    },
    {
      id: 'created_at',
      Header: 'Дата создания',
      sort: false,
    },
    {
      id: 'updated_at',
      Header: 'Дата обновления',
      sort: false,
    },
    {
      id: 'impressions',
      Header: 'Просмотры',
      sort: false,
    },
    {
      id: 'clicks',
      Header: 'Клики',
      sort: false,
    },
    {
      id: 'ctr',
      Header: 'CTR',
      sort: false,
    },
    {
      id: 'comment',
      Header: 'Комментарий',
      sort: false,
    },
  ];

  return (
    <NewsPageTabLayout>
      <NewsTable columnsConfig={columnsConfig} />
    </NewsPageTabLayout>
  );
}
