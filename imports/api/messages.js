import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection("Messages");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('messages', function tasksPublication() {
        return Messages.find({$or: [ { to: Meteor.user().username }, { from: Meteor.user().username  } ] });
        //return Messages.find();
    });

}

Messages.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Meteor.methods({

    'messages.insert'(to,text) {
        check(text, String);
        check(to, String);

        var from= Meteor.user().username;

        // Make sure the user is logged in before inserting a message
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        let m = Messages.insert({
            to,
            from,
            text,
            createdAt: new Date()
        });

        Meteor.users.update({username:to}, { $push: { "rcvMessages": m } });
        Meteor.users.update({username:from}, { $push: { "sndMessages": m } });
    },
    'messages.deleteAll'(){
        Messages.remove({});
    },
    'users.messages'(){
        Meteor.users.update({},{$set: {"rcvMessages": []}},{ multi: true });
        Meteor.users.update({},{$set: {"sndMessages": []}},{ multi: true });
    }

});