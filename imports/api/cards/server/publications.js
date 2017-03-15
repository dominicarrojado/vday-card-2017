import { Meteor } from 'meteor/meteor';

import { Cards } from '../cards.js';

Meteor.publish('cardIndex', function cardIndexPublication(cardId) {
    return Cards.find(cardId);
});