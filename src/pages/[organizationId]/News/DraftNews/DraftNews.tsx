import NewsPageTabLayout from 'components/layout/NewsPageTabLayout';
import NewsTable from '../NewsTable/NewsTable';
import { TableColumn } from 'components/molecules/Table/Table';

export default function DraftNews() {
  const columnsConfig: TableColumn[] = [
    {
      id: 'id',
      Header: 'ID',
      sort: false,
    },
    {
      id: 'title',
      Header: 'Черновики',
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
      id: 'comment',
      Header: 'Комментарий',
      sort: false,
    },
  ];

  return (
    <NewsPageTabLayout>
      <NewsTable columnsConfig={columnsConfig} published="nl," />
    </NewsPageTabLayout>
  );
}
