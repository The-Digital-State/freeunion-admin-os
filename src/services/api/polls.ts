import { PollQuestionType, PollType } from 'shared/interfaces/polls';
import { api } from './helper';

const getPollsUrl = (orgId: number) => `/admin_org/${orgId}/quizzes`;

type GetPollsType = {
  orgId: number;
  page: number;
  limit: number;
  published?: number;
  is_active?: number;
  is_closed?: number;
};

export async function getPolls({
  orgId,
  page = 1,
  limit = 10,
  published,
  is_active,
  is_closed,
}: GetPollsType): Promise<{ data: PollType[]; meta: { total: number; current_page: number } }> {
  const response = await api().get(`${getPollsUrl(orgId)}`, {
    params: { page, limit, sortDirection: 'desc', published, is_active, is_closed },
  });
  return response?.data;
}

export async function getPoll(orgId, pollId): Promise<PollType> {
  const response = await api().get(`${getPollsUrl(orgId)}/${pollId}`);
  return response?.data?.data;
}

export async function createPoll(poll: Omit<PollType, 'id'>, orgId: number): Promise<PollType> {
  const response = await api().post(`${getPollsUrl(orgId)}`, poll);
  window.dataLayer.push({
    event: 'event',
    eventProps: {
      category: 'polls',
      action: 'create_poll',
    },
  });
  return response?.data?.data;
}

export async function updatePoll(poll: PollType, orgId: number, pollId: number): Promise<PollType> {
  const response = await api().put(`${getPollsUrl(orgId)}/${pollId}`, poll);
  return response?.data?.data;
}

export function dragQuestion(orgId: number, pollId: number, quesitonId: number, rowId: number) {
  return api().post(`${getPollsUrl(orgId)}/${pollId}/questions/${quesitonId}/drag/${rowId}`);
}

export async function publishPoll(orgId: number, pollId: number, poll?: PollType): Promise<void> {
  await api().post(`${getPollsUrl(orgId)}/${pollId}/publish`, poll);
}

export async function closePoll(orgId: number, pollId: number): Promise<void> {
  await api().post(`${getPollsUrl(orgId)}/${pollId}/close`);
}

export async function deletePoll(orgId: number, pollId: number): Promise<PollType> {
  const response = await api().delete(`${getPollsUrl(orgId)}/${pollId}`);
  return response?.data?.data;
}

//-------------------------------------------------------------------------------------------------------------

type GetQuestionsType = {
  orgId: number;
  pollId: number;
  page?: number;
  limit?: number;
};

export async function getQuestions({ orgId, pollId, page, limit }: GetQuestionsType): Promise<PollQuestionType[]> {
  const response = await api().get(`${getPollsUrl(orgId)}/${pollId}/questions`, {
    params: { page, limit, sortDirection: 'asc' },
  });
  return response?.data?.data;
}

export async function createQuestion(
  question: Omit<PollQuestionType, 'id'>,
  pollId: number,
  orgId: number
): Promise<PollQuestionType> {
  const response = await api().post(`${getPollsUrl(orgId)}/${pollId}/questions`, question);

  return response?.data?.data;
}

export async function getQuestion(orgId, pollId, questionId): Promise<PollQuestionType> {
  const response = await api().get(`${getPollsUrl(orgId)}/${pollId}/questions/${questionId}`);
  return response?.data?.data;
}

export async function updateQuestion(
  question: PollQuestionType,
  orgId: number,
  pollId: number,
  questionId: number
): Promise<PollQuestionType> {
  const response = await api().put(`${getPollsUrl(orgId)}/${pollId}/questions/${questionId}`, question);
  return response?.data?.data;
}

export async function deleteQuestion(orgId: number, pollId: number, questionId: number): Promise<PollQuestionType> {
  const response = await api().delete(`${getPollsUrl(orgId)}/${pollId}/questions/${questionId}`);
  return response?.data?.data;
}
