import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/default-layout/default-layout.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('defaultLayout', { main: 'home' });
  },
});

FlowRouter.route('/:cardId', {
  name: 'cardIndex',
  action() {
    BlazeLayout.render('defaultLayout', { main: 'home' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('defaultLayout', { main: 'notFound' });
  },
};