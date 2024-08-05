import createSvgIcon from '@material-ui/core/utils/createSvgIcon';
import { ReactComponent as TaskIcon } from './task.svg';

const Tasks = createSvgIcon(<TaskIcon />, 'Tasks');

export default Tasks;
