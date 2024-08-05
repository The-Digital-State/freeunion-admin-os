import { Box, Typography, TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Button } from 'shared/components/common/Button/Button';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PollType } from 'shared/interfaces/polls';
import { useDispatch, useSelector } from '../../../../../redux';
import cloneDeep from 'lodash/cloneDeep';
import { publishPollAction } from 'redux/slices/polls';
import { routes } from 'Routes';
import formatServerError from 'shared/utils/formatServerError';
import { Icon } from 'shared/components/common/Icon/Icon';
import { DatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';

interface IPollPublishSettings {
  close: () => void;
  pollId: number;
  organizationId: number;
}

const PollPublishSettings = ({ close, organizationId, pollId }: IPollPublishSettings) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const poll: PollType | null = useSelector(({ polls }) =>
    pollId ? polls?.polls.find((poll) => poll?.id === +pollId) : null
  );

  const date = new Date();

  const minDateStart = date.setDate(date.getDate() + 1);
  const minDateEnd = date.setDate(date.getDate() + 1.5);

  if (!pollId || !poll) {
    return null;
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={Yup.object().shape({
        date_start: Yup.date().nullable(),
        date_end: Yup.date().nullable(),
      })}
      initialValues={
        {
          name: poll.name || '',
          description: poll.description || '',
          images: poll?.images || [],
          date_start: null,
          date_end: null,
        } as PollType
      }
      onSubmit={async (values, { resetForm }) => {
        try {
          let copyPoll = cloneDeep(values);

          await dispatch(publishPollAction(+organizationId, pollId, copyPoll));
          toast('Опрос опубликован!');
          close();
          history.push(routes.polls.getActivePoll(organizationId, pollId));

          resetForm();
        } catch (e) {
          toast.error(formatServerError(e));
        }
      }}
    >
      {({
        handleSubmit,
        isSubmitting,
        touched,
        values,
        isValid,
        dirty,
        handleReset,
        setFieldValue,
        resetForm,
      }): JSX.Element => (
        <Form onSubmit={handleSubmit}>
          <Box>
            <Box>
              <Box display="flex" flexDirection="row" alignItems="center" width="100%">
                <Box sx={{ mr: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                    <DatePicker
                      minDate={minDateStart}
                      mask="__.__.____"
                      label="Дата начала"
                      onChange={(date: Date) => {
                        setFieldValue('date_start', date);
                      }}
                      value={values.date_start}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <DatePicker
                    minDate={(() => {
                      if (!!values.date_start) {
                        const dateStart = cloneDeep(values.date_start);
                        const newDate = dateStart.setDate(dateStart.getDate() + 1);
                        return newDate;
                      } else {
                        return minDateEnd;
                      }
                    })()}
                    mask="__.__.____"
                    label="Дата окончания"
                    onChange={(date) => setFieldValue('date_end', date)}
                    value={values.date_end}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 3,
                }}
              >
                <Icon iconName="infoCircle" />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Дата - необязательное поле. Этот опрос автоматически появится и исчезнет в период выбранных вами дат
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!values.date_end && !values.date_start} onClick={resetForm}>
                Сброс
              </Button>
              <Button disabled={isSubmitting || !isValid} type="submit">
                {!!values.date_start ? 'Опубликовать' : 'Опубликовать сейчас'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PollPublishSettings;
