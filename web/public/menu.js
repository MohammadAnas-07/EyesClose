// Closes the phone menu on the home page after one of its links is tapped, or when Escape is pressed.
// The menu is a <details>, so it still opens and closes without this file.
// This file reads nothing and sends nothing: no storage, no network, no page content.
'use strict';

document.addEventListener('click', function (event) {
  var link = event.target instanceof Element ? event.target.closest('.nav-menu-panel a') : null;
  var menu = link ? link.closest('details') : null;
  if (menu) menu.open = false;
});

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return;
  var menu = document.querySelector('.nav-menu[open]');
  if (!menu) return;
  menu.open = false;
  menu.querySelector('summary').focus();
});
