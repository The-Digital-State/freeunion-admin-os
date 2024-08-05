import { ComponentStory, ComponentMeta } from '@storybook/react';
import Chip from './Chip';
import Avatar from '@material-ui/core/Avatar';

export default {
  title: 'Atoms/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const ChipComponent = Template.bind({});
ChipComponent.args = {
  label: 'Hello',
  variant: 'outlined',
  avatar: <Avatar style={{ width: 30, height: 30 }}>H</Avatar>,
  onDelete: () => {
    console.log('Deleted');
  },
};
