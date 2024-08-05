import { HelpOffer } from 'services/api/helpOffers';
import { Sex } from '../services/api/types';
import { User } from '../services/api/users';

const formatDate = (date: Date) => date.toLocaleDateString();

const sexMap = {
  [Sex.MAN]: 'М',
  [Sex.WOMAN]: 'Ж',
};

const stringifyUser = (user: User, dictionaries, helpOffers: HelpOffer[]) => {
  const { activityScopes, permissions } = dictionaries;
  const getActivityScope = (number) => activityScopes?.find((x) => x.id === number)?.name;

  const formatHelpOffers = () => {
    return Array.isArray(user.helpOffers) && user.helpOffers.length > 0
      ? user.helpOffers.map((el) => helpOffers?.find((offer) => offer.id === el)?.text)
      : 'Не выбрано';
  };

  return {
    ...user,
    user: {
      avatar: user.avatar,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
    member_description: user.member_description,
    permission_name: user.permissions
      ? permissions.find((permission) => permission.permission === user.permissions)?.title
      : undefined,
    birthday: user.birthday ? formatDate(user.birthday) : null,
    activityScope: getActivityScope(user.activityScope),
    lastUsed: user.lastUsed ? formatDate(user.lastUsed) : null,
    sex: sexMap[user?.sex] || '',
    helpOffers: formatHelpOffers(),
  };
};

export default stringifyUser;
