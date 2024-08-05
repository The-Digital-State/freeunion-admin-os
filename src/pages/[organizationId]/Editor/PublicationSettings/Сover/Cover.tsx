import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch } from '../../../../../redux';
import { finishLoading, startLoading } from 'redux/slices/news';
import { uploadImage } from 'services/api/news';
import { NewsData } from 'types/news';
import { imageParser } from './imageParser';
import { useStyles } from '../PublicationSettings';
import formatServerError from 'shared/utils/formatServerError';
import { allowedSizeFiles, toLargeFileSize } from 'shared/constants/allowedFileSize';

type CoverProps = {
  news: Partial<NewsData>;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
};

export const Cover = ({ news, value, onChange }: CoverProps) => {
  const [showHover, setShowHover] = useState(false);
  const [coverList, setCoverList] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);
  const [openImageSelector, setOpenImageSelector] = useState(false);
  const [toSettings, setToSettings] = useState(false);
  const hiddenFileInput = useRef(null);
  const { organizationId } = useParams<{ organizationId?: string; newsId?: string }>();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const imageSet = new Set([...(value ? [value] : []), ...coverList, ...imageParser(news.content)]);
    const imageList = Array.from(imageSet);
    setCoverList(imageList);
    if (!value) {
      onChange(imageList[0]);
    }
    setSelectedCover(value);
  }, []);

  // useEffect(() => {

  //   setSelectedCover(coverList[coverList.length - 1]);
  // }, [coverList]);

  const handleLoadImage = (e) => {
    if (e.target.files[0].size > allowedSizeFiles) {
      toast.error(toLargeFileSize);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = async () => {
      try {
        dispatch(startLoading());
        const {
          data: { url },
        } = await uploadImage(organizationId, fileReader.result);
        if (toSettings) {
          onChange(url);
        } else {
          setCoverList([...coverList, url]);
          setTimeout(() => {
            setSelectedCover(url);
          }, 0);
        }
      } catch (error) {
        toast.error(formatServerError(error));
        console.error(error);
      } finally {
        dispatch(finishLoading());
      }
    };
  };

  return (
    <Box className={classes.item}>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e) => handleLoadImage(e)}
        style={{ display: 'none' }}
        accept="image/png, image/gif, image/jpeg, image/jpg"
      />
      <Typography className={classes.itemLabel}>Обложка:</Typography>
      <Box
        style={{ position: 'relative', width: 'fit-content' }}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
        onBlur={() => setShowHover(false)}
      >
        {value ? (
          <Box>
            {showHover && (
              <Box
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  background: '#000',
                  color: '#fff',
                  opacity: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setOpenImageSelector(true)}
              >
                <Typography>изменить</Typography>
              </Box>
            )}
            <img src={value} style={{ width: '200px' }} alt="cover" />
          </Box>
        ) : (
          <Button
            style={{ textTransform: 'uppercase' }}
            color="primary"
            variant="contained"
            onClick={() => {
              setToSettings(true);
              hiddenFileInput.current.click();
            }}
          >
            загрузить
          </Button>
        )}
        <Dialog open={openImageSelector} onClose={() => setOpenImageSelector(false)} maxWidth="xs">
          <DialogTitle style={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '18px', lineHeight: '25px' }}>
            выберите обложку
          </DialogTitle>
          <DialogContent>
            <List style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {coverList.map((cover) => (
                <ListItem
                  key={cover}
                  style={{
                    width: 'fit-content',
                    padding: 0,
                    margin: '5px',
                    boxSizing: 'border-box',
                    ...(cover === selectedCover
                      ? {
                          boxShadow: '#e5da0e 0px 0px 0px 2px',
                        }
                      : {}),
                  }}
                >
                  <img
                    src={cover}
                    alt="cover"
                    style={{ width: '170px', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedCover(cover);
                    }}
                  />
                </ListItem>
              ))}
              <ListItem
                style={{
                  padding: 0,
                  margin: '5px',
                  width: 'fit-content',
                }}
              >
                <Button
                  style={{ textTransform: 'uppercase', width: '170px', height: '170px' }}
                  onClick={() => {
                    setToSettings(false);
                    hiddenFileInput.current.click();
                  }}
                >
                  загрузить
                </Button>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: 'uppercase' }}
              color="primary"
              variant="contained"
              onClick={() => {
                onChange(selectedCover);
                setOpenImageSelector(false);
              }}
            >
              Выбрать
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
