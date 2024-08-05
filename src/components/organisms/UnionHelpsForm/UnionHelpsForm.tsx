import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Box, Divider, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { HelpOffer } from 'services/api/helpOffers';
import { addHelpOffer, updateHelpOffers } from 'redux/slices/unionHelpOffers';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from '../../../redux';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

const UnionHelpsForm = () => {
  const params = useParams<{ organizationId?: string }>();
  const { organizationId } = params;
  const helpOffers: HelpOffer[] = useSelector((state) => state.helpOffers.data);
  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        help_offers: helpOffers || [],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        help_offers: Yup.array().min(1).required('Выберите хотя бы одну помощь'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          dispatch(updateHelpOffers(+organizationId, values.help_offers));
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Помощь объединению обновлена!');
        } catch (err) {
          toast.error(formatServerError(err));
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, isValid, dirty, handleReset, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Divider />
            <Box sx={{ pt: 3, pl: 2 }}>
              Действия, которые вы отметите галочкой, будут видеть новые участники и смогут быстро присоединиться к
              работе объединения. Если в списке нет необходимых вам дел, добавьте их в текстовом поле снизу.
            </Box>
            <Box
              sx={{
                pt: 2,
                pb: 4,
                pl: 2,
                height: 'auto',
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.ceil(values.help_offers.length / 7)}, 1fr)`,
                gridTemplateRows: `repeat(${Math.ceil(
                  values.help_offers.length / Math.ceil(values.help_offers.length / 7)
                )}, 1fr)`,
                gap: '4px 60px',
                overflowX: 'auto',
              }}
            >
              <FieldArray name="help_offers" validateOnChange>
                {({ replace }) => (
                  <>
                    {values.help_offers.map((unionHelp, index) => (
                      <FormControlLabel
                        sx={{ whiteSpace: 'nowrap' }}
                        name={unionHelp.text + unionHelp.id}
                        key={unionHelp.id}
                        checked={unionHelp.enabled}
                        onChange={() => {
                          const copyUnionHelp = { ...unionHelp };
                          copyUnionHelp.enabled = !unionHelp.enabled;
                          replace(index, copyUnionHelp);
                        }}
                        control={<Checkbox />}
                        label={unionHelp.text}
                      />
                    ))}
                  </>
                )}
              </FieldArray>
            </Box>
            <Divider />
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Formik
                initialValues={{
                  new_help_offer: '',
                }}
                validationSchema={Yup.object().shape({
                  new_help_offer: Yup.string(),
                })}
                onSubmit={async (values, { setStatus, setSubmitting, resetForm }): Promise<void> => {
                  try {
                    dispatch(addHelpOffer(+organizationId, values.new_help_offer));
                    toast.success('Помощь успешна добавлена!');
                    resetForm();
                  } catch (err) {
                    toast.error(err);
                    setStatus({ success: false });
                    setSubmitting(false);
                  }
                }}
              >
                {({ handleSubmit, handleChange, values }) => {
                  return (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        name="new_help_offer"
                        onChange={handleChange}
                        value={values.new_help_offer}
                        label="Что нужно делать"
                        variant="outlined"
                        sx={{ maxWidth: 404, width: '100%' }}
                      />
                      <Button
                        disabled={!values.new_help_offer.length}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        ДОБАВИТЬ
                      </Button>
                    </Box>
                  );
                }}
              </Formik>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  height: 50,
                  gap: 2,
                }}
              >
                <Button
                  disabled={!dirty}
                  color="light"
                  onClick={(e) => {
                    handleReset(e);
                  }}
                >
                  ОТМЕНИТЬ
                </Button>
                <Button
                  disabled={isSubmitting || !isValid || !dirty || !values.help_offers.find((i) => i.enabled)}
                  type="submit"
                >
                  СОХРАНИТЬ ИЗМЕНЕНИЯ
                </Button>
              </Box>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default UnionHelpsForm;
