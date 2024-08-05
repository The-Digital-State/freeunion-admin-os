import { routes } from 'Routes';
import { Box, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import { Button } from 'shared/components/common/Button/Button';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { deleteSectionAction } from 'redux/slices/articles';
import { useDispatch, useSelector } from '../../../../../../redux';
import { KbaseSectionLight } from 'shared/interfaces/kbase';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

const SectionPreview = () => {
  const history = useHistory();
  const { organizationId, sectionId } = useParams<{ sectionId?: string; organizationId?: string }>();
  const section: KbaseSectionLight = useSelector(({ articles }) =>
    articles?.sections.find((section) => section?.id === +sectionId)
  );
  const dispatch = useDispatch();

  const deleteSection = async () => {
    try {
      const isDelete = window.confirm(`Вы действительно хотите удалить раздел "${section.name}"?`);

      if (isDelete) {
        await dispatch(deleteSectionAction(+organizationId, +sectionId));
        history.push(routes.kbase.getLinkCreateKbase(+organizationId));
        toast('Раздел удален');
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const editSection = () => {
    history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/new?sectionId=${section.id}`);
  };

  if (!section) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h5" mb={2}>
          Раздел - {section.name}
        </Typography>
        <Typography
          mb={3}
          dangerouslySetInnerHTML={{
            __html:
              sanitizeHtml(section.description, {
                allowedTags: allowedTagsSynitizer,
              }) ||
              sanitizeHtml('<p>Описания пока нет</p>', {
                allowedTags: allowedTagsSynitizer,
              }),
          }}
        ></Typography>
        {section.cover && (
          <Box
            component="img"
            sx={{
              maxWidth: '640px',
              maxHeight: '368px',
              objectFit: 'cover',
              width: '100%',
              borderRadius: '15px',
            }}
            alt="The house from the offer."
            src={section.cover}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={editSection}>Изменить</Button>
        <Button color="light" onClick={deleteSection}>
          Удалить
        </Button>
      </Box>
    </Box>
  );
};

export default SectionPreview;
