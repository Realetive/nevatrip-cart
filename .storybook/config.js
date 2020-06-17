import { addDecorator, configure } from '@storybook/react';
import { addReadme } from 'storybook-readme';

addDecorator(addReadme);

function loadStories() {
  require('./main.js');
}

configure(loadStories, module);