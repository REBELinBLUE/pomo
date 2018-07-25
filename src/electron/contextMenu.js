import { Menu, shell } from 'electron'; // eslint-disable-line
import { homepage } from '../../package.json';
import isDevelopment from './isDevelopment';

const menuItems = [
  {
    label: 'Homepage',
    click() { shell.openExternal(homepage); },
  },
  { label: 'Quit', role: 'quit' },
];

if (isDevelopment) {
  menuItems.unshift({
    type: 'separator',
  });

  menuItems.unshift({
    role: 'toggledevtools',
  });
}

export default Menu.buildFromTemplate(menuItems);
