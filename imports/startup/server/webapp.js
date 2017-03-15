import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Cards } from '../../api/cards/cards.js';

WebApp.connectHandlers.use(
    Meteor.bindEnvironment((req, res, next) => {
        const card = Cards.findOne(req.url.substr(1), { fields: { to: 1, from: 1, cover: 1 } });
        let meta;

        if (card) {
            meta = `
            <meta property="og:description" content="Hey ${card.to}, You have a message from ${card.from}. Click this e-card to open!">
            <meta property="og:image" content="http://tmv.hashtag-interactive.com/img/${card.cover}-cover.png">
            `;
        } else {
            meta = `
            <meta property="og:description" content="Tug at your special someone's heartstrings by making a cute e-card just for them.">
            <meta property="og:image" content="http://tmv.hashtag-interactive.com/img/preview.png">
            `;
        }

        req.dynamicHead = (req.dynamicHead || '') + meta;

        return next();
    })
);