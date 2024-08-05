import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createExternalChat } from 'services/api/organizations';
import formatServerError from 'shared/utils/formatServerError';
import { ExternalChat, ExternalChatTypes } from 'shared/interfaces/externalChats';

const chatTypes = [
  {
    type: ExternalChatTypes.SimpleExternalChat,
    label: 'Добавить свой чат (например: Viber, Telegram)',
  },
  {
    type: ExternalChatTypes.IncognioChat,
    label: 'Создать анонимный чат Incognio в Telegram',
  },
];

type NewExternalChatType = {
  addNewChat: (chat: ExternalChat) => void;
  setShowAddNewChat: (addNewsChat: boolean) => void;
  organizationId: number;
  firstChat: boolean;
};

const NewExternalChat = ({ addNewChat, setShowAddNewChat, organizationId, firstChat }: NewExternalChatType) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        type: 0,
        value: '',
        data: [],
      }}
      validationSchema={() => {
        return Yup.lazy((values) => {
          return Yup.object().shape({
            type: Yup.number().required(),
            name: Yup.string().trim().required('Поле обязательно для заполнения'),
            value: !+values.type
              ? Yup.string().url('Неправильный формат ссылки на чат').required('Поле обязательно для заполнения')
              : Yup.string()
                  .min(4, 'Мало символов')
                  .matches(/@[a-zA-Z0-9]/, 'Неправильный формат')
                  .required('Поле обязательно для заполнения'),
          });
        });
      }}
      onSubmit={async (values) => {
        const { type, name, value } = values;
        try {
          const newChat = await createExternalChat({ type, value, name }, organizationId);
          addNewChat(newChat);
          setShowAddNewChat(false);
          toast.success('Чат успешно добавлен!');
        } catch (e) {
          toast.error(formatServerError(e));
        }
      }}
    >
      {({
        handleSubmit,
        handleBlur,
        isSubmitting,
        isValid,
        dirty,
        values,
        touched,
        errors,
        handleChange,
      }): JSX.Element => {
        return (
          <form onSubmit={handleSubmit}>
            <Typography color="textPrimary" variant="h6">
              Добавление чата:
            </Typography>
            <RadioGroup name="newChat" sx={{ flexDirection: 'column' }}>
              {chatTypes.map((chatType) => (
                <FormControlLabel
                  control={<Radio color="primary" sx={{ ml: 1 }} />}
                  checked={+values.type === chatType.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="type"
                  key={chatType.type}
                  label={
                    <Typography color="textPrimary" variant="body1">
                      {chatType.label}
                    </Typography>
                  }
                  value={chatType.type}
                />
              ))}
            </RadioGroup>
            <Typography color="textPrimary" variant="body1" sx={{ mt: 3 }}>
              {!+values.type ? (
                <>Вставьте ссылку на чат в окно снизу</>
              ) : (
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <ol style={{ paddingLeft: '20px', width: '45%' }}>
                    <li>
                      Создайте чат{' '}
                      <a style={{ color: 'blue' }} href="https://t.me/incognio_bot" target="_blank" rel="noreferrer">
                        @incognio_bot{' '}
                      </a>
                    </li>
                    <li>
                      Отправьте ему команду <strong>/connect GWE8ST</strong> в Incognio_bot
                    </li>
                    <li>
                      Скопируйте имя чата и вствьте в окно ниже (например: <strong>@test_bot</strong>)
                    </li>
                  </ol>
                  <Typography color="textPrimary" variant="body1" sx={{ width: '45%' }}>
                    Incognio - это чат для безопасной коммуникации, где ваше имя в телеграмм заменяет ваш никнейм из
                    сервиса freeunion.online, что гарантирует анонимность и безопасность
                  </Typography>
                </Box>
              )}
            </Typography>

            <Box
              sx={{
                mb: 3,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                flexWrap: 'wrap',
                '&>div, &>button': {
                  marginBottom: '10px',
                },
              }}
            >
              <TextField
                label="Ссылка на чат"
                onBlur={handleBlur}
                placeholder={!+values.type ? 'https://t.me/testchat' : '@test_bot'}
                name="value"
                onChange={handleChange}
                value={values.value}
                variant="outlined"
                sx={{ height: 50, width: '45%' }}
                error={Boolean(touched.value && errors && errors.value)}
                helperText={touched.value && errors && errors.value}
              />
              <TextField
                label="Название чата"
                onBlur={handleBlur}
                name="name"
                onChange={handleChange}
                value={values.name}
                variant="outlined"
                sx={{ height: 50, width: '25%' }}
                error={Boolean(touched.name && errors && errors.name)}
                helperText={touched.name && errors && errors.name}
              />

              <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                Добавить чат
              </Button>
              {firstChat && <Button onClick={() => setShowAddNewChat(false)}>Отмена</Button>}
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default NewExternalChat;
