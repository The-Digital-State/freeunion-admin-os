import { ComponentStory, ComponentMeta } from '@storybook/react';
import ChipButtonAdd from './ChipButtonAdd';

export default {
  title: 'Atoms/ChipButtonAdd',
  component: ChipButtonAdd,
} as ComponentMeta<typeof ChipButtonAdd>;

const Template: ComponentStory<typeof ChipButtonAdd> = (args) => <ChipButtonAdd {...args} />;

export const ChipButtonAddComponent = Template.bind({});
ChipButtonAddComponent.args = {
  label: 'Добавить',
  onClick: () => {
    console.log('Added');
  },
};
