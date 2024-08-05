import { Box, IconButton, TextField } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle } from '@material-ui/icons';
import { ModalContext } from 'context/Modal';
import ChannelCodeModal from './ChannelCodeModal/ChannelCodeModal';
import { useDispatch } from '../../../../../redux';
import { getAutoPostingTelegramsThunk } from 'redux/slices/news';
import { createAutoPostingChannel } from 'services/api/news';
import formatServerError from 'shared/utils/formatServerError';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Поле обязательно к заполнению'),
  channel: Yup.string()
    .min(4, 'Мало символов')
    .matches(/@[a-zA-Z0-9]/, 'Неправильный формат')
    .required('Поле обязательно для заполнения'),
});

const NewAutoPostingChannel = ({
  organizationId,
  setAddNewChannel,
}: {
  organizationId: string;
  setAddNewChannel: (item: boolean) => void;
}) => {
  const modalContext = useContext(ModalContext);
  const dispatch = useDispatch();

  const openModal = (verifyCode: string) => {
    modalContext.openModal(<ChannelCodeModal verifyCode={verifyCode} />);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        channel: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setStatus, setSubmitting }): Promise<void> => {
        try {
          const channelResponse = await createAutoPostingChannel(organizationId, values);
          dispatch(getAutoPostingTelegramsThunk(organizationId));
          openModal(channelResponse.verify_code);
          setAddNewChannel(false);
          setStatus({ success: true });

          toast('Информация сохранена!');
          resetForm();
        } catch (err) {
          console.error(err);
          toast.error(formatServerError(err));
        }
        setSubmitting(false);
      }}
    >
      {({
        handleSubmit,
        handleBlur,
        handleChange,
        isSubmitting,
        isValid,
        dirty,
        values,
        errors,
        touched,
      }): JSX.Element => (
        <Form>
          <Box
            sx={{
              display: 'flex',
              p: 4,
              pt: 0,
            }}
          >
            <TextField
              name="channel"
              style={{ width: '45%', height: 50, marginRight: 30 }}
              label="Ссылка на канал"
              onBlur={handleBlur}
              placeholder={'@test_channel'}
              value={values.channel}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(touched.channel && errors.channel)}
              helperText={touched.channel && errors.channel}
            />
            <TextField
              name="name"
              style={{ width: '30%', height: 50, marginRight: 30 }}
              label="Название канала"
              onBlur={handleBlur}
              value={values.name}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />

            <IconButton
              disabled={isSubmitting || !isValid || !dirty}
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
              data-tip
              data-for={`addAutoPostChannelTooltip`}
            >
              <CheckCircle fontSize="medium" />
            </IconButton>
            <Tooltip id="addAutoPostChannelTooltip" title="Добавить канал!" />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default NewAutoPostingChannel;
