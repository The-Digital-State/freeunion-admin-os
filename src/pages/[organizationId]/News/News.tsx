import { Route } from 'react-router-dom';
import DraftNews from './DraftNews/DraftNews';
import AllNews from './AllNews/AllNews';
import NewsAbusesTable from './NewsAbusesTable/NewsAbusesTable';
import NewsAutoPosting from './NewsAutoPosting/NewsAutoPosting';
import { useEffect } from 'react';
import { getAutoPostingTelegramsThunk } from 'redux/slices/news';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../../redux';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

const News = ({ match }) => {
  const dispatch = useDispatch();
  const { organizationId } = useParams<{ organizationId?: string }>();

  const intervalRequest = setInterval(() => {
    dispatch(getAutoPostingTelegramsThunk(organizationId));
  }, 1000 * 60 * 3);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getAutoPostingTelegramsThunk(organizationId));
      } catch (error) {
        toast.error(formatServerError(error));
      }
    })();

    return () => clearInterval(intervalRequest);
  }, [dispatch, organizationId, intervalRequest]);

  return (
    <>
      <Route
        path={`${match.path}/draft`}
        component={DraftNews}
        exact={true}
        sensitive={true}
        strict={true}
        key={'draft-news-key'}
      />
      <Route exact path={`${match.path}/all`} component={AllNews} />
      <Route exact path={`${match.path}/abuse`} component={NewsAbusesTable} />
      <Route exact path={`${match.path}/auto-posting`} component={NewsAutoPosting} />
    </>
  );
};

export default News;
