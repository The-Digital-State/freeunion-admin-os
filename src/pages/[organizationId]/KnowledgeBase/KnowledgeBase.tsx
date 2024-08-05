import { Route, Switch, useParams } from 'react-router-dom';
import KnowledgeBaseSections from './KnowledgeBaseSections/KnowledgeBaseSections';
import { routes } from 'Routes';
import Editor from '../Editor/Editor';
import KnowledgeBaseMaterials from './KnowledgeBaseMaterials/KnowledgeBaseMaterials';
import KnowledgeBaseDraft from './KnowledgeBaseDraft/KnowledgeBaseDraft';
import { useEffect } from 'react';
import { useDispatch } from '../../../redux';
import { getMaterialsAction, getSectionsAction } from 'redux/slices/articles';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

const KnowledgeBase = () => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getMaterialsAction(+organizationId));
        await dispatch(getSectionsAction(+organizationId));
      } catch (error) {
        toast.error(formatServerError(error));
      }
    })();
  }, [dispatch, organizationId]);

  return (
    <Switch>
      <Route path={routes.kbase.createKbase} component={KnowledgeBaseSections} key={'materials-creation'} />
      <Route path={routes.kbase.materialsKbase} component={KnowledgeBaseMaterials} key={'materials-all'} />
      <Route path={routes.kbase.draftMaterialsKbase} component={KnowledgeBaseDraft} key={'materials-draft'} />
      <Route path={routes.kbase.editor} key={'materials-editor'}>
        <Editor isMaterial />
      </Route>
    </Switch>
  );
};

export default KnowledgeBase;
