import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Dialog,
  Avatar,
  Divider,
  DialogTitle,
  Card,
  Typography,
  Box,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import NumberHighlight from '../../atoms/NumberHighlight';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/AddBox';
import { getUserData, addTemplateToSettings } from 'services/api/auth';
import { toast } from 'react-toastify';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';

type TemplateModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  updateTemplateId: (id: number) => void;
  addedNewTemplate: boolean;
};

const TemplateModal = ({ open, setOpen, updateTemplateId, addedNewTemplate }: TemplateModalProps) => {
  const [templateCards, setTemplateCards] = useState<any>([]);
  const [toggleDelete, setToggleDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const userData = await getUserData();

      if (userData) {
        setIsLoading(false);
        setTemplateCards(userData.settings.templates);
      }
    })();
  }, [toggleDelete, addedNewTemplate]);

  const deleteTemplate = (id: number) => {
    const newTemplateCards = templateCards;
    newTemplateCards.splice(id, 1);

    (async () => {
      await addTemplateToSettings(newTemplateCards);
      setToggleDelete(!toggleDelete);
      toast.success('Шаблон удален!');
    })();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="lg"
      PaperProps={{ sx: { width: '80%' } }}
      title="fds"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <DialogTitle id="form-dialog-title"> Шаблоны уведомлений</DialogTitle>
        </Box>
        <Box sx={{ display: 'flex', height: 50 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <Typography sx={{ marginRight: 2 }} variant="h6">
              {`Всего шаблонов: `}
            </Typography>
            <NumberHighlight>{templateCards?.length || 0}</NumberHighlight>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '413px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : templateCards ? (
          templateCards.map((templateCard, i) => (
            <Card
              key={i}
              sx={{
                backgroundColor: '#F7F8F9',
                marginTop: 4,
                ml: 3,
                mr: 3,
                mb: 4,
                width: '355px',
                minWidth: '355px',
                height: '350px',
                overflowY: 'auto',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: ' space-between',
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ mr: '21px' }}>
                      <Avatar alt="organization" src="" sx={{ width: '65px', height: '65px' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '16px', lineHeight: '24px', color: '#171719' }}>
                        {templateCard.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ pt: 3, fontSize: '16px', lineHeight: '24px', fontWeight: 'normal', color: '#000000' }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(templateCard.message, {
                          allowedTags: allowedTagsSynitizer,
                        }),
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="Select" sx={{ p: 0, mr: 2 }}>
                    <IconButton
                      onClick={() => {
                        updateTemplateId(i);
                        setOpen(false);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" sx={{ p: 0 }}>
                    <IconButton
                      onClick={() => {
                        deleteTemplate(i);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '413px',
            }}
          >
            <Typography>Пока нет шаблонов, но вы можете их создать!</Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default TemplateModal;
