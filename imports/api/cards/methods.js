import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { Cards } from './cards.js';
import { isStringEmpty } from '../../startup/both/lib/common.js';

Meteor.methods({
    createCardItem(card) {
        if (!Match.test(card, {
                cover: String,
                to: String,
                from: String,
                message: String,
                createdBy: String,
            })) {
            throw new Meteor.Error('not-valid', 'Data is not valid.');
        }

        const { cover, to, from, message, createdBy } = card;

        if (isStringEmpty(cover) || isStringEmpty(to) || isStringEmpty(from) || isStringEmpty(message) || isStringEmpty(createdBy)) {
            throw new Meteor.Error('not-valid', 'Do not rush love! Please fill out everything before publishing.');
        }

        card.createdAt = new Date();

        return Cards.insert(card);
    },
});