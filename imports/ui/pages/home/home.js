import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './home.html';

import { Cards } from '../../../api/cards/cards.js';
import autosize from 'autosize';
import moment from 'moment';
import Clipboard from 'clipboard';

const copy = {
    timeout: '',
    set(event) {
        this.timeout = Meteor.setTimeout(() => {
            $(event.currentTarget).removeClass('active');
        }, 1500);
    },
    clear() {
        Meteor.clearTimeout(this.timeout);
    },
};

Template.home.onCreated(function homeOnCreated() {
    const self = this;
    let userId = window.localStorage.getItem('userId');

    if (!userId) {
        userId = Random.id();
        window.localStorage.setItem('userId', userId);
    }

    self.state = new ReactiveDict();
    self.state.setDefault({
        userId,
        activeCover: 'teal',
    });

    self.autorun(() => {
        const cardId = FlowRouter.getParam('cardId');
        if (cardId) {
            self.subscribe('cardIndex', cardId, () => {
                const card = Cards.findOne(cardId);

                if (!card) {
                    FlowRouter.go('/');
                }

            });
        }
    });
});

Template.home.onRendered(function homeOnRendered() {
    const $message = $('#message');
    if ($message.length > 0) {
        autosize($message);
    }

    new Clipboard('.copy-btn');
});

Template.home.helpers({
    cardId() {
        return FlowRouter.getParam('cardId');
    },
    card() {
        return Cards.findOne(FlowRouter.getParam('cardId'));
    },
    userId() {
        const instance = Template.instance();
        return instance.state.get('userId');
    },
    covers() {
        return ['teal', 'red', 'pink', 'black', 'purple'];
    },
    activeCover() {
        const instance = Template.instance();
        return instance.state.get('activeCover');
    },
    isEqualTo(a, b) {
        return a === b;
    },
    today() {
        return moment().format('MMMM DD, YYYY');
    },
    showMonthDayYear(date) {
        return !date ? '' : moment(date).format('MMMM DD, YYYY');
    },
    showModal() {
        const instance = Template.instance();
        return instance.state.get('showModal');
    },
    messages() {
        return [
            'Loved you then,\nLove you still,\nAlways have,\nAlways will.',
            'When I say I love you\nIt\'s because it\'s true\nAnd because no one on earth\nIs as wonderful as you!',
            'Don\'t take this the wrong way,\nI think that you\'re hot.\nYou\'re also very lovely,\nAnd I fancy you a lot.',
            'A dream is a dream\nUntil it comes true.\nLove was just a word\n\'Til the day I met you.',
            'You are\nThe peanut to my butter,\nThe Twinkle in my eye,\nThe Milk to My Shake,\nThe Love of My Life.',
        ];
    },
    buttonColor(cover) {
        if (cover === 'teal') {
            return 'btn-pink';
        } else if (cover === 'red') {
            return 'btn-teal';
        } else if (cover === 'pink') {
            return 'btn-darker-pink';
        } else if (cover === 'black') {
            return 'btn-yellow';
        } else if (cover === 'purple') {
            return 'btn-green';
        }
    },
    open() {
        const instance = Template.instance();
        return instance.state.get('open');
    },
    preview() {
        const instance = Template.instance();
        return instance.state.get('preview');
    },
    parseMessage(message) {
        if (message) {
            // escape HTML tags
            message = _.escape(message);

            // replace newline to br
            message = message.replace(/\n/gm, ' <br/> ');

            // replace double space with nbsp
            message = message.replace(/  /gm, " &nbsp;");

            return message;
        }

        return '';
    },
    isPublishingCard() {
        const instance = Template.instance();
        return instance.state.get('isPublishingCard');
    },
    error() {
        const instance = Template.instance();
        return instance.state.get('error');
    },
});

Template.home.events({
    'click .cover-item'(event, instance) {
        instance.state.set('activeCover', String(this));
    },
    'click .open-card-btn, click .preview-cover.show'(event, instance) {
        instance.state.set('open', !instance.state.get('open'));
    },
    'click .open-preview-btn'(event, instance) {
        instance.state.set('preview', true);
    },
    'click .close-preview-btn'(event, instance) {
        instance.state.set('preview', false);
    },
    'input #to, input #from, input #message'(event, instance) {
        instance.state.set('error', '');
    },
    'click .suggestions-btn, click .close-modal-btn'(event, instance) {
        instance.state.set('showModal', !instance.state.get('showModal'));
    },
    'click .suggested-message'(event, instance) {
        instance.state.set('showModal', false);
        $('#message').val(String(this));
    },
    'submit #publishForm'(event, instance) {
        event.preventDefault();

        if (!instance.state.get('isPublishingCard')) {
            instance.state.set('isPublishingCard', true);
            instance.state.set('error', '');

            const { target } = event;
            const card = {
                cover: instance.state.get('activeCover'),
                to: target.to.value,
                from: target.from.value,
                message: target.message.value,
                createdBy: instance.state.get('userId'),
            };

            Meteor.call('createCardItem', card, (error, result) => {
                if (error) {
                    instance.state.set('isPublishingCard', false);
                    instance.state.set('error', error.reason);
                } else {
                    instance.state.set('isPublishingCard', false);
                    instance.state.set('open', true);
                    FlowRouter.go(`/${result}`);
                }
            });
        }
    },
    'click .create-your-own-btn'(event, instance) {
        instance.state.set('activeCover', 'teal');
        instance.state.set('preview', false);
        FlowRouter.go('/');
    },
    'click .copy-btn'(event, instance) {
        $(event.currentTarget).addClass('active');
        copy.clear();
        copy.set(event);
    },
});