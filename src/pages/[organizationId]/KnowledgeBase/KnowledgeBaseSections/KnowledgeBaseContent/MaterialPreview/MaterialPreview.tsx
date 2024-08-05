import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import { Button } from 'shared/components/common/Button/Button';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { deleteMaterialAction, updateMaterialAction } from 'redux/slices/articles';
import { routes } from 'Routes';
import { useSelector, useDispatch } from '../../../../../../redux';
import { KbaseMaterialAdmin, KbaseMaterialTypes, KbaseSectionLight } from 'shared/interfaces/kbase';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

const MaterialPreview = () => {
  const history = useHistory();
  const { organizationId, materialId, sectionId } =
    useParams<{ materialId?: string; organizationId?: string; sectionId?: string }>();

  const sections: KbaseSectionLight[] = useSelector(({ articles }) => articles.sections);
  const material: KbaseMaterialAdmin = useSelector(({ articles }) =>
    articles.materials?.find((material: KbaseMaterialAdmin) => material.id === +materialId)
  );

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const isDelete = window.confirm(`Вы действительно хотите удалить материал?`);

      if (isDelete) {
        await dispatch(deleteMaterialAction(+organizationId, +materialId));
        history.push(routes.kbase.getLinkSection(organizationId, sectionId));
        toast('Материал удален');
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const editMaterial = () => {
    if (material.type === KbaseMaterialTypes.text) {
      history.push(
        `${routes.kbase.getLinkEditorMaterials({
          organizationId: organizationId,
          materialId: materialId,
          sectionId: `${material.section_id}`,
        })}`
      );
    } else {
      history.push(
        `${routes.kbase.getMaterialLink({
          organizationId: organizationId,
          materialId: materialId,
          sectionId: `${material.section_id}`,
        })}`
      );
    }
  };

  const changeSection = async (section: number) => {
    try {
      await dispatch(
        updateMaterialAction(+organizationId, +materialId, { ...material, section: +section } as any, false)
      );
      history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/${section}/material/${material.id}`);
      toast('Раздел изменен!');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  if (!material) {
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
          Материал - {material.title}
        </Typography>
        <Typography
          mb={3}
          dangerouslySetInnerHTML={{
            __html:
              sanitizeHtml(material.excerpt, {
                allowedTags: allowedTagsSynitizer,
              }) ||
              sanitizeHtml('<p>Текста нет</p>', {
                allowedTags: allowedTagsSynitizer,
              }),
          }}
        ></Typography>
        {material.image && (
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
            src={material.image}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {sections.length && (
          <FormControl
            sx={{
              margin: '15px 0',
            }}
          >
            <InputLabel>Раздел</InputLabel>
            <Select
              fullWidth
              label="Раздел"
              name="section"
              onChange={(e) => changeSection(e.target.value)}
              value={sections.find(({ id }) => id === +sectionId).id}
              variant="outlined"
            >
              {sections.map((section) => {
                return (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}

        <Button onClick={editMaterial}>Изменить</Button>
        <Button color="light" onClick={handleDelete}>
          Удалить
        </Button>
      </Box>
    </Box>
  );
};

export default MaterialPreview;
