import { Box } from '@material-ui/core';
import KnowledgeBasePageTabLayout from 'components/layout/KnowledgeBasePageTabLayout';
import ArticleSidebar from './KnowledgeBaseSidebar/KnowledgeBaseSidebar';
import ArticleContent from './KnowledgeBaseContent/KnowledgeBaseContent';

const KnowledgeBaseSections = () => {
  return (
    <KnowledgeBasePageTabLayout>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <ArticleSidebar />
        <ArticleContent />
      </Box>
    </KnowledgeBasePageTabLayout>
  );
};

export default KnowledgeBaseSections;
