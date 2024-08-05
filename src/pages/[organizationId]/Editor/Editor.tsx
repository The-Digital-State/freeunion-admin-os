import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { capitalize } from 'lodash';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { useHistory, useLocation, useParams } from 'react-router';
import { NewsAutoPost, NewsData } from 'types/news';
import { useDispatch, useSelector } from '../../../redux';
import { createNewsThunk, finishLoading, startLoading, updateNewsThunk } from 'redux/slices/news';
import { getNewsById } from 'services/api/news';
import ContentEditor from '../../../shared/components/Editor/Editor';
import { normalizeContent } from '../../../shared/components/Editor/helpers/normalize';
import { PublicationSettings } from './PublicationSettings/PublicationSettings';
import { ModalContext } from 'context/Modal';
import PublishAutoPostingModal from '../News/NewsAutoPosting/PublishAutoPostingModal/PublishAutoPostingModal';
import { routes } from 'Routes';
import { getMaterial } from 'services/api/kbase';
import formatServerError from 'shared/utils/formatServerError';
import { createMaterialAction, updateMaterialAction } from 'redux/slices/articles';

function Editor({ isMaterial }: { isMaterial?: boolean }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { search } = useLocation<{ from?: string }>();

  function useQuery() {
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();

  const sectionId = query.get('sectionId') || '';
  const materialId = query.get('materialId') || '';

  const isLoading = useSelector(({ news }) => news.isLoading);
  const autoPostingTelegrams: NewsAutoPost[] = useSelector(({ news }) => news.autoPostingTelegrams);

  const modalContext = useContext(ModalContext);

  const { organizationId, newsId } = useParams<{ organizationId?: string; newsId?: string }>();
  const [news, setNews] = useState<Partial<NewsData>>({ title: '', content: '' });
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [publishSetting, setPublishSetting] = useState<boolean>(false);

  const validate = (title: string, content: string) => {
    let errs = [];
    if (!title?.length) {
      errs.push('введите заголовок');
    }

    if (content.length <= 8) {
      errs.push('введите текст новости');
    }

    if (errs.length) {
      toast.error(capitalize(errs.join(' и ')));
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (newsId && !isMaterial) {
      (async () => {
        dispatch(startLoading());
        try {
          const newsData = await getNewsById(organizationId, newsId);
          setNews(() => ({ ...newsData }));
        } catch (error) {
          toast.error(formatServerError(error));
        }
        dispatch(finishLoading());
      })();
    } else if (isMaterial && materialId) {
      (async () => {
        try {
          const response = await getMaterial(+organizationId, +materialId);
          setNews(response);
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
  }, [newsId, dispatch, organizationId, isMaterial, materialId]);

  const handleSave = async (news: Partial<NewsData>, publish: boolean) => {
    const { id, title, content } = news;
    const normalizedContent = normalizeContent(content);
    if (validate(title, normalizedContent)) {
      try {
        if (!isMaterial) {
          if (id) {
            await dispatch(updateNewsThunk(organizationId, news?.id, { ...news, content: normalizedContent }, publish));
            toast('Новость обновлена!');
          } else {
            await dispatch(createNewsThunk(organizationId, { ...news, content: normalizedContent }, publish));
            if (!!autoPostingTelegrams.length && autoPostingTelegrams.find((channel) => channel.verified)) {
              openPublishAutoPostingTelegrams();
            }
            toast('Новость создана!');
          }

          history.push(news?.published ? `/${organizationId}/news/all` : `/${organizationId}/news/draft`);
        } else {
          if (materialId) {
            await dispatch(
              updateMaterialAction(+organizationId, news?.id, { ...news, content: normalizedContent } as any, publish)
            );
            toast('Материал обновлен!');
          } else {
            await dispatch(
              createMaterialAction(+organizationId, { ...news, content: normalizedContent } as any, publish)
            );

            toast(publish ? 'Материал создан!' : 'Материал добавлен в черновик!');
          }
          history.push(
            publish || news.published
              ? routes.kbase.getLinkMaterials(organizationId)
              : routes.kbase.getLinkDraftMaterials(organizationId)
          );
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const openPublishAutoPostingTelegrams = async () => {
    modalContext.openModal(
      <PublishAutoPostingModal onClose={modalContext.closeModal} organizationId={organizationId} />
    );
  };

  return (
    <Box sx={{ background: '#FFFFFF', position: 'relative' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            opacity: 0.7,
            zIndex: 2000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'visible', minHeight: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
          <ContentEditor
            title={news.title}
            content={news.content}
            isMaterial={isMaterial}
            onChange={(type, value) => setNews((news) => ({ ...news, [type]: value }))}
            isAdmin
          />
        </Box>
        <Box>
          <Box
            sx={{
              mt: 2,
              p: 1,
              width: '290px',
              display: 'flex',
              flexDirection: 'column',
              background: '#FFFFFF',
              flexWrap: 'wrap',
            }}
          >
            <Button
              sx={{
                mb: 2,
                padding: 1.5,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
              color="primary"
              type="submit"
              variant="contained"
              onClick={() => {
                const { content, title } = news;

                if (!title || !content) {
                  toast.error(`Необходимо заполнить ${isMaterial ? 'материал' : 'новость'}`);
                  return;
                }
                setPublishSetting(false);
                setOpenSettings(true);
              }}
            >
              {newsId || (isMaterial && materialId) ? 'Coхранить ' : 'Создать '}
              {news?.published ? `${isMaterial ? 'материал' : 'новость'}` : 'черновик'}
            </Button>
            {(!news?.published ?? false) && (
              <>
                <Button
                  sx={{
                    padding: 1.5,
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                  }}
                  color="primary"
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    const { content, title } = news;

                    if (!title || !content) {
                      toast.error(`Необходимо заполнить ${isMaterial ? 'материал' : 'новость'}`);
                      return;
                    }
                    setPublishSetting(true);
                    setOpenSettings(true);
                  }}
                >
                  Опубликовать
                </Button>
              </>
            )}
            {openSettings && (
              <PublicationSettings
                open={openSettings}
                setOpen={setOpenSettings}
                news={news}
                isMaterial={isMaterial}
                sectionId={+sectionId}
                publishSetting={publishSetting}
                onChange={(newNews) => {
                  handleSave({ ...news, ...newNews }, publishSetting);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
