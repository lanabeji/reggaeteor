import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Poems = new Mongo.Collection("Poems");

Meteor.methods({
    'poems.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Poems.insert({
            text,
            createdAt: new Date(),
            counter:0,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'poems.remove'(poemId){
        check(poemId,String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Poems.remove(poemId);
    },
    'poems.increaseCounter'(poemId, newCounter){
        check(poemId, String);
       // check(newCounter,String);

        Poems.update(poemId, { $set: {counter: newCounter} });

    },
});