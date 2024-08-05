import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Box from '@material-ui/core/Box';
import NumberHighlight from './NumberHighlight';

export default {
  title: 'Atoms/NumberHighlight',
  component: NumberHighlight,
} as ComponentMeta<typeof NumberHighlight>;

const Template: ComponentStory<typeof NumberHighlight> = (args) => (
  <Box sx={{ display: 'flex', height: '2.5rem' }}>
    <NumberHighlight sx={{ marginRight: 5 }}>{4}</NumberHighlight>
    <NumberHighlight>{404}</NumberHighlight>
  </Box>
);

export const NumberHighlightComponent = Template.bind({});
