import {
  Dialog,
  Avatar,
  Divider,
  DialogTitle,
  DialogContent,
  Card,
  Typography,
  Box,
  Tooltip,
  FormLabel,
  IconButton,
  CircularProgress,
  RadioGroup,
  Radio,
  List,
  ListItem,
  FormControlLabel,
  DialogActions,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { NewsData } from 'types/news';
import { AuthorList } from './AuthorList/AuthorList';
import { TagsInput } from './TagsInput/TagsInput';
import { Cover } from './Сover/Cover';
import CloseIcon from '../../../../lib/material-kit/icons/X';
import OptionsIcon from '../../../../lib/material-kit/icons/Options';
import TaskIcon from '../../../../lib/material-kit/icons/AddSquare';
import ProposalIcon from '../../../../lib/material-kit/icons/ClipboardList';
import EventIcon from '../../../../lib/material-kit/icons/NoteAdd';
import TagsIcon from '../../../../lib/material-kit/icons/HashtagUp';
import { belarusForUkraineTags } from 'shared/constants';
import { useSelector } from '../../../../redux';
import { KbaseSectionLight } from 'shared/interfaces/kbase';

export const useStyles = makeStyles(() => ({
  item: { marginBottom: '20px', display: 'grid', alignItems: 'start', gridTemplateColumns: '150px 1fr' },
  itemLabel: { fontWeight: 500, fontSize: '14px', lineHeight: '25px' },
  headerBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    right: '18px',
    top: '18px',
    width: '60px',
  },
  headerBtn: {
    padding: 0,
    minWidth: '24px',
    color: '#000',
  },
}));

type PublicationSettingsProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  news: Partial<NewsData>;
  onChange: (news: Partial<NewsData>) => void;
  isMaterial?: boolean;
  sectionId?: number;
  publishSetting?: boolean;
};

enum Visibility {
  all = 'ALL',
  users = 'USERS',
  organization = 'ORGANIZATION',
  admin = 'ADMIN',
}

enum OptinalFields {
  TAGS = 'tags',
  TASK = 'task',
  PROPOSAL = 'proposal',
  EVENT = 'event',
}

const optinalFieldsText = {
  [OptinalFields.TAGS]: 'Тэги',
  [OptinalFields.TASK]: 'Задачи',
  [OptinalFields.PROPOSAL]: 'Предложение',
  [OptinalFields.EVENT]: 'Мероприятие',
};

const visibalityText = {
  [Visibility.all]: 'Видно всем',
  [Visibility.users]: 'Только пользователям платформы',
  [Visibility.organization]: 'Только участникам объединения',
  [Visibility.admin]: 'Видно только из админки',
};

export const PublicationSettings = ({
  open,
  setOpen,
  news,
  onChange,
  isMaterial,
  sectionId,
  publishSetting,
}: PublicationSettingsProps) => {
  const [visible, setVisible] = useState(news.visible || 0);
  //@ts-ignore
  const [cover, setCover] = useState(news.preview || news.image || null);
  const [authorList, setAuthorList] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [task, setTask] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [event, setEvent] = useState(null);
  const [section, setSection] = useState(!!isMaterial ? sectionId : null);
  const [tags, setTags] = useState(news.tags || []);
  const sections: KbaseSectionLight[] = useSelector(({ articles }) => articles.sections);

  const [optinalFields, setOptinalFields] = useState<{ [field in OptinalFields]: boolean }>({
    [OptinalFields.TAGS]: true,
    [OptinalFields.TASK]: false,
    [OptinalFields.PROPOSAL]: false,
    [OptinalFields.EVENT]: false,
  });

  const toggleOptinalField = (field: OptinalFields) => {
    setOptinalFields({
      ...optinalFields,
      [field]: !optinalFields[field],
    });
    setOpenMenu(false);
  };

  const anchorRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    if (news.user) {
      setAuthorList([news.user]);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="md"
    >
      <Box className={classes.headerBtns}>
        <Box ref={anchorRef}>
          {/* <Button className={classes.headerBtn} onClick={() => setOpenMenu(true)}>
            <OptionsIcon />
          </Button> */}
          <Menu id="basic-menu" open={openMenu} anchorEl={anchorRef.current} onClose={() => setOpenMenu(false)}>
            {(Object.keys(OptinalFields) as Array<keyof typeof OptinalFields>).map((key) => {
              return (
                <MenuItem onClick={() => toggleOptinalField(OptinalFields[key])}>
                  <ListItemIcon>
                    <TaskIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{optinalFieldsText[OptinalFields[key]]}</ListItemText>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
        <Button className={classes.headerBtn} onClick={() => setOpen(false)}>
          <CloseIcon />
        </Button>
      </Box>
      <DialogTitle style={{ display: 'flex' }}>
        <Typography style={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '18px', lineHeight: '25px' }}>
          настройки публикации
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List style={{ fontWeight: 500, fontSize: '14px', lineHeight: '25px' }}>
          {/* <ListItem style={{ marginBottom: '20px' }}>
            <AuthorList authors={authorList} onChange={setAuthorList} />
          </ListItem> */}
          {/* <ListItem className={classes.item}>
            <Typography className={classes.itemLabel}>Время публикации:</Typography>
            <Typography style={{ fontWeight: 500, fontSize: '14px', lineHeight: '25px' }}>
              {news?.updated_at || news?.created_at
                ? (news?.updated_at ? news.updated_at : news.created_at)?.slice(0, 10)
                : new Date().toISOString().slice(0, 10)}
            </Typography>
          </ListItem> */}
          <ListItem className={classes.item}>
            <Typography style={{ fontWeight: 500, fontSize: '14px', lineHeight: '25px' }}>Видимость:</Typography>
            <RadioGroup value={visible} onChange={(e) => setVisible(+e.target.value)}>
              {(Object.keys(Visibility) as Array<keyof typeof Visibility>).map((key, index) => {
                if (index === 3 && !isMaterial) {
                  return null;
                }
                return (
                  <FormControlLabel
                    value={index}
                    control={<Radio />}
                    label={visibalityText[Visibility[key]]}
                    labelPlacement="end"
                  />
                );
              })}
            </RadioGroup>
          </ListItem>
          <ListItem style={{ marginBottom: '20px' }}>
            <Cover news={news} value={cover} onChange={setCover} />
          </ListItem>

          {optinalFields[OptinalFields.TASK] && (
            <ListItem style={{ marginBottom: '20px' }}>
              <Box style={{ width: '440px' }}>
                <TextField
                  value={task}
                  placeholder="Вставьте ссылку"
                  fullWidth
                  variant="outlined"
                  label="Задача"
                  onChange={setTask}
                />
              </Box>
            </ListItem>
          )}
          {optinalFields[OptinalFields.PROPOSAL] && (
            <ListItem style={{ marginBottom: '20px' }}>
              <Box style={{ width: '440px' }}>
                <TextField
                  value={proposal}
                  placeholder="Вставьте ссылку"
                  fullWidth
                  variant="outlined"
                  label="Предложение"
                  onChange={setProposal}
                />
              </Box>
            </ListItem>
          )}
          {optinalFields[OptinalFields.EVENT] && (
            <ListItem style={{ marginBottom: '20px' }}>
              <Box style={{ width: '440px' }}>
                <TextField
                  value={event}
                  placeholder="Вставьте ссылку"
                  fullWidth
                  variant="outlined"
                  label="Мероприятие"
                  onChange={setEvent}
                />
              </Box>
            </ListItem>
          )}
          {optinalFields[OptinalFields.TAGS] && (
            <ListItem style={{ marginBottom: '20px' }}>
              <TagsInput
                tags={tags}
                suggestedTags={belarusForUkraineTags}
                onChange={(tags) => setTags(tags)}
                isMaterial={isMaterial}
              />
            </ListItem>
          )}
          {isMaterial && sections.length && (
            <FormControl
              sx={{
                margin: '15px 0',
              }}
              fullWidth
            >
              <InputLabel>Раздел</InputLabel>
              <Select
                fullWidth
                label="Раздел"
                name="section"
                onChange={(e) => setSection(e.target.value)}
                //@ts-ignore
                value={section}
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
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          style={{ fontSize: '16px', fontWeight: 500, textTransform: 'uppercase' }}
          color="primary"
          variant="contained"
          onClick={() => setOpen(false)}
        >
          закрыть
        </Button>
        <Button
          style={{ fontSize: '16px', fontWeight: 500, textTransform: 'uppercase' }}
          color="primary"
          variant="contained"
          onClick={() => {
            onChange({
              ...news,
              //@ts-ignore
              visible: visible,
              //@ts-ignore
              section: section,
              tags: tags,
              //@ts-ignore
              // authors: authorList,
              preview: cover,
            });
          }}
        >
          {publishSetting ? 'опубликовать' : 'сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
