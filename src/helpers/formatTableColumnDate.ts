import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';

export const formatTableColumnDate = (date: Date) => {
  return `${format(new Date(date), 'dd-MM-yyyy в HH:mm', {
    locale: ru,
  })}`;
};
