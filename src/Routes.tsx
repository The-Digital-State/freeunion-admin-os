import { Route, Switch, useHistory } from 'react-router-dom';

import Home from 'pages/Home/Home';
import SignIn from 'pages/signin';

import Union from 'pages/[organizationId]/union';
import Users from 'pages/[organizationId]/users/Users';
import Notifications from 'pages/[organizationId]/Notifications/Notifications';
import Tasks from 'pages/[organizationId]/tasks';
import NavigationLayout from 'components/layout/NavigationLayout';
import News from 'pages/[organizationId]/News/News';
import Editor from 'pages/[organizationId]/Editor/Editor';
import UnionWrapper from 'components/layout/UnionWrapper/UnionWrapper';
import Finances from 'pages/[organizationId]/Finances/Finances';
import NewsAbuse from 'pages/[organizationId]/News/NewsAbuse/NewsAbuse';
import Api from 'pages/[organizationId]/Api/Api';
import { getNotificationRedirectUrl } from 'shared/modules/notifications';
import { getUrl } from 'modules/notifications';
import ChatWrapper from 'pages/[organizationId]/chat';
import KnowledgeBase from 'pages/[organizationId]/KnowledgeBase/KnowledgeBase';
import Polls from 'pages/[organizationId]/Polls/Polls';

export const routes = {
  lists: {},
  chat: {
    route: '/:organizationId/chat',
    getLink(organizationId) {
      return this.route.replace(':organizationId', organizationId);
    },
  },
  polls: {
    route: '/:organizationId/polls',

    creatingPolls: '/:organizationId/polls/create',

    newPoll: '/:organizationId/polls/create/poll/new',
    creatingPoll: '/:organizationId/polls/create/poll/:pollId',
    editPoll: '/:organizationId/polls/create/poll/:pollId/edit',

    newQuestionPage: '/:organizationId/polls/create/poll/:pollId/question/new',
    newQuestionType: '/:organizationId/polls/create/poll/:pollId/new-question?questionType=:questionType',
    newQuestionTypeLink: '/:organizationId/polls/create/poll/:pollId/new-question',
    creatingQuestion: '/:organizationId/polls/create/poll/:pollId/question/:quiestionId?questionType=:questionType',
    creatingQuestionLink: '/:organizationId/polls/create/poll/:pollId/question/:quiestionId',
    editQuestion: '/:organizationId/polls/create/poll/:pollId/question/:quiestionId/edit',

    activePolls: '/:organizationId/polls/active',

    activePoll: '/:organizationId/polls/active/poll/:pollId',
    activeQuestion: '/:organizationId/polls/active/poll/:pollId/question/:quiestionId?questionType=:questionType',
    activeQuestionLink: '/:organizationId/polls/active/poll/:pollId/question/:quiestionId',

    completedPolls: '/:organizationId/polls/completed',

    completedPoll: '/:organizationId/polls/completed/poll/:pollId',
    completedQuestion: '/:organizationId/polls/completed/poll/:pollId/question/:quiestionId?questionType=:questionType',
    completedQuestionLink: '/:organizationId/polls/completed/poll/:pollId/question/:quiestionId',

    getLink(organizationId) {
      return this.route.replace(':organizationId', organizationId);
    },

    getCreatingPolls(organizationId) {
      return this.creatingPolls.replace(':organizationId', organizationId);
    },
    getNewPoll(organizationId) {
      return this.newPoll.replace(':organizationId', organizationId);
    },
    getCreatingPoll(organizationId, pollId) {
      return this.creatingPoll.replace(':organizationId', organizationId).replace(':pollId', pollId);
    },
    getEditPoll(organizationId, pollId) {
      return this.editPoll.replace(':organizationId', organizationId).replace(':pollId', pollId);
    },
    getNewQuestionPage(organizationId, pollId) {
      return this.newQuestionPage.replace(':organizationId', organizationId).replace(':pollId', pollId);
    },
    getNewQuestionType(organizationId, pollId, questionType) {
      return this.newQuestionType
        .replace(':organizationId', organizationId)
        .replace(':pollId', pollId)
        .replace(':questionType', questionType);
    },
    getCreatingQuestion(organizationId, quiestionId, pollId, questionType) {
      return this.creatingQuestion
        .replace(':organizationId', organizationId)
        .replace(':quiestionId', quiestionId)
        .replace(':pollId', pollId)
        .replace(':questionType', questionType);
    },
    getEditQuestion(organizationId, quiestionId, pollId) {
      return this.editQuestion
        .replace(':organizationId', organizationId)
        .replace(':quiestionId', quiestionId)
        .replace(':pollId', pollId);
    },
    getActivePolls(organizationId) {
      return this.activePolls.replace(':organizationId', organizationId);
    },
    getActiveQuestion(organizationId, quiestionId, pollId, questionType) {
      return this.activeQuestion
        .replace(':organizationId', organizationId)
        .replace(':quiestionId', quiestionId)
        .replace(':pollId', pollId)
        .replace(':questionType', questionType);
    },
    getActivePoll(organizationId, pollId) {
      return this.activePoll.replace(':organizationId', organizationId).replace(':pollId', pollId);
    },

    getCompletedPolls(organizationId) {
      return this.completedPolls.replace(':organizationId', organizationId);
    },
    getCompletedQuestion(organizationId, quiestionId, pollId, questionType) {
      return this.completedQuestion
        .replace(':organizationId', organizationId)
        .replace(':quiestionId', quiestionId)
        .replace(':pollId', pollId)
        .replace(':questionType', questionType);
    },
    getCompletedPoll(organizationId, pollId) {
      return this.completedPoll.replace(':organizationId', organizationId).replace(':pollId', pollId);
    },
  },
  kbase: {
    route: '/:organizationId/kbase',
    createKbase: '/:organizationId/kbase/sections',
    sectionKbase: '/:organizationId/kbase/sections/:sectionId',
    materialsKbase: '/:organizationId/kbase/materials',
    draftMaterialsKbase: '/:organizationId/kbase/draft',
    editor: '/:organizationId/kbase/editor',
    linkMaterialRoute: '/:organizationId/kbase/sections/:sectionId/materialLink',
    linkMaterial: '/:organizationId/kbase/sections/:sectionId/materialLink?materialId=:materialId',
    editorMaterials: '/:organizationId/kbase/editor?materialId=:materialId&sectionId=:sectionId',

    getLink(organizationId) {
      return this.route.replace(':organizationId', organizationId);
    },
    getLinkMaterials(organizationId) {
      return this.materialsKbase.replace(':organizationId', organizationId);
    },
    getLinkDraftMaterials(organizationId) {
      return this.draftMaterialsKbase.replace(':organizationId', organizationId);
    },
    getLinkCreateKbase(organizationId) {
      return this.createKbase.replace(':organizationId', organizationId);
    },
    getLinkSection(organizationId, sectionId) {
      return this.sectionKbase.replace(':organizationId', organizationId).replace(':sectionId', sectionId);
    },
    getMaterialLink({
      organizationId,
      materialId,
      sectionId,
    }: {
      organizationId: string;
      sectionId: string;
      materialId?: string;
    }) {
      if (!materialId) {
        return this.linkMaterial
          .replace(':organizationId', organizationId)
          .replace(':sectionId', sectionId)
          .replace('?materialId=:materialId', '');
      }
      return this.linkMaterial
        .replace(':organizationId', organizationId)
        .replace(':materialId', materialId)
        .replace(':sectionId', sectionId);
    },
    getLinkEditorMaterials({
      organizationId,
      materialId,
      sectionId,
    }: {
      organizationId: string;
      sectionId: string;
      materialId?: string;
    }) {
      if (!materialId) {
        return this.editorMaterials
          .replace(':organizationId', organizationId)
          .replace('materialId=:materialId&', '')
          .replace(':sectionId', sectionId);
      }
      return this.editorMaterials
        .replace(':organizationId', organizationId)
        .replace(':materialId', materialId)
        .replace(':sectionId', sectionId);
    },
  },
};

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={SignIn} />

      <Route
        path="/handle-push"
        component={() => {
          /* eslint-disable-next-line */
          const history = useHistory();

          const url = getNotificationRedirectUrl(window.location.search, getUrl);
          history.push(url || '/');

          return null;
        }}
      />

      <Route path="/:organizationId">
        <UnionWrapper>
          <NavigationLayout>
            <Route path="/:organizationId/union" component={Union} />
            <Route path="/:organizationId/users" component={Users} />
            <Route path="/:organizationId/notifications" component={Notifications} />
            <Route path="/:organizationId/tasks" component={Tasks} />
            <Route path="/:organizationId/news" component={News} />
            <Route path="/:organizationId/finances" component={Finances} />
            <Route path="/:organizationId/api" component={Api} />
            <Route exact path="/:organizationId/news/editor" component={Editor} />
            <Route exact path="/:organizationId/news/editor/:newsId" component={Editor} />
            <Route exact path="/:organizationId/news/abuse/:abuseId" component={NewsAbuse} />
            <Route path={routes.chat.route} component={ChatWrapper} />
            <Route path={routes.kbase.route} component={KnowledgeBase} />
            <Route path={routes.polls.route} component={Polls} />
          </NavigationLayout>
        </UnionWrapper>
      </Route>
    </Switch>
  );
}

export default Routes;
