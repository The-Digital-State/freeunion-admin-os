import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CommentTableCell from './CommentTableCell';

export default {
  title: 'Atoms/CommentTableCell',
  component: CommentTableCell,
} as ComponentMeta<typeof CommentTableCell>;

const Template: ComponentStory<typeof CommentTableCell> = (args) => <CommentTableCell {...args} />;

export const CommentTableCellComponent = Template.bind({});
CommentTableCellComponent.args = {
  id: '1',
  value: 'My Value',
};
