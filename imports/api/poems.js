import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Poems = new Mongo.Collection("Poems");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('poems', function tasksPublication() {
        return Poems.find();
    });

    Meteor.publish('users', function usersPublication() {
        return Meteor.users.find();
    });
}

Meteor.methods({
    'poems.insert'(text,tag) {
        check(text, String);
        check(tag, String);

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
            tag: tag
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
    'poems.increaseCounter'(poemId, userId){
        check(poemId, String);
       // check(newCounter,String);

        Poems.update(poemId, { $inc: {counter: 1} });
        Meteor.users.update(userId, {$inc:{puntaje: 1 }});
    },
    'poems.findBy'(userFilter){
        check(userFilter, String);

        return Poems.find({username: userFilter});
    },
    'poems.find'(text){
        check(text, String);

        return Poems.find({"text" : /.*text.*/});
    },
    'users.update'(idUser, newPosition){
        Meteor.users.update(idUser, { $push: { "positions": newPosition } });
    },
    'users.puntaje'(newPuntaje){
        Meteor.users.update({}, {$set: {"puntaje": 0}},{ multi: true });
    },
    'users.positions'(newPosition){
        Meteor.users.update({},{$set: {"positions": []}},{ multi: true })
    }
});