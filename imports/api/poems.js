import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Poems = new Mongo.Collection("Poems");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('poems', function tasksPublication() {
        return Poems.find();
    });
}

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

        const poem = Poems.findOne(poemId);
        if (poem.owner !== Meteor.userId()) {
            // Only the owner can delete the poem
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