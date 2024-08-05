import { Box, TextField, Typography } from '@material-ui/core';
import ImageDropzone from 'components/molecules/ImageDropzone';
import { toast } from 'react-toastify';
import { addGeneralImage } from 'services/api/genereal';
import { QuestionsDescriptionPropsType } from './QuestionsDescriptionPropsType';

const QuestionsDescription = ({
  handleBlur,
  handleChange,
  question,
  touched,
  errors,
  url,
  setFieldValue,
  questionId,
  questionType,
}: QuestionsDescriptionPropsType) => {
  return (
    <>
      <Typography variant="h5" mb={3}>
        {!!questionId ? `Тип вопроса "${questionType}"` : `Добавление вопроса "${questionType}"`}
      </Typography>
      <TextField
        label="Вопрос"
        name={'question'}
        multiline
        onBlur={handleBlur}
        onChange={handleChange}
        value={question}
        variant="outlined"
        placeholder="Вопрос"
        required
        sx={{
          maxWidth: '750px',
          width: '100%',
        }}
        error={Boolean(touched.question && errors.question)}
        helperText={touched.question && errors.question}
      />
      <Box
        sx={{
          maxWidth: '750px',
          width: '100%',
          margin: '20px 0',
        }}
      >
        <ImageDropzone
          value={url}
          onDrop={(acceptedFiles) => {
            acceptedFiles.forEach((file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                (async () => {
                  const image = await addGeneralImage(reader.result);
                  let newImage = { uuid: image[0].uuid, url: reader.result };
                  setFieldValue('image', newImage);
                  toast('Фото добавлено');
                })();
              };
            });
          }}
          label="Изображение"
          dropzoneInfo="Вы можете вставить любое изображение"
        />
      </Box>
    </>
  );
};

export default QuestionsDescription;
