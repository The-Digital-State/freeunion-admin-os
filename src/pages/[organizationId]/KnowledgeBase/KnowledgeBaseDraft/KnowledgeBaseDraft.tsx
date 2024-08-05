import { TableColumn } from 'components/molecules/Table/Table';
import KnowledgeBaseTable from '../KnowledgeBaseTable/KnowledgeBaseTable';
import KnowledgeBasePageTabLayout from 'components/layout/KnowledgeBasePageTabLayout';

export default function KnowledgeBaseDraft() {
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
      id: 'section',
      Header: 'Раздел',
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
  ];

  return (
    <KnowledgeBasePageTabLayout>
      <KnowledgeBaseTable columnsConfig={columnsConfig} isDraft />
    </KnowledgeBasePageTabLayout>
  );
}
