import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Poems } from './poems.js';
import { Messages } from './messages.js';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import faker from "faker";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";

if (Meteor.isServer) {
    describe('Poems', () => {
        describe('poems methods', () => {

            const userId = Random.id();
            let poemId;
            let name = faker.name.findName();
            let currentUser;
            let currentTag = faker.lorem.word();

            beforeEach(() => {
                Poems.remove({});

                // Stud the user
                resetDatabase();
                Factory.define("user", Meteor.users, {
                    username: name,
                });
                currentUser = Factory.create("user");
                sinon.stub(Meteor, "user");
                Meteor.user.returns(currentUser);

                poemId = Poems.insert({
                    text: 'test poem',
                    createdAt: new Date(),
                    counter:0,
                    owner: userId,
                    username: currentUser,
                    tag:currentTag,
                    likers:[]
                });
            });

            afterEach(() => {
                Meteor.user.restore();
                resetDatabase();
            });

            it('can delete owned poem', () => {

                const deletePoem = Meteor.server.method_handlers['poems.remove'];
                const invocation = { userId };
                deletePoem.apply(invocation, [poemId]);
                assert.equal(Poems.find().count(), 0);

            });

            it('can increase poem counter', ()=>{

                const incCounter = Meteor.server.method_handlers['poems.increaseCounter'];
                const invocation = { userId };
                incCounter.apply(invocation,[poemId,userId]);

                let newPoem = Poems.findOne({owner:userId});
                assert.equal(1,newPoem.counter);

            });

            it('can insert a new poem', ()=>{

                let text = faker.lorem.text();
                let tag = faker.lorem.word();

                const addPoem = Meteor.server.method_handlers['poems.insert'];
                const invocation = { userId };
                addPoem.apply(invocation, [text,tag]);
                assert.equal(Poems.find({text:text}).count(), 1);

            });
        });
        describe('messages methods', () => {

            const userId = Random.id();
            let messageId;
            let toUser = faker.name.firstName();
            let fromUser = faker.name.firstName();

            beforeEach(() => {
                Messages.remove({});
                messageId = Messages.insert({
                    to:toUser,
                    from:fromUser,
                    text: 'test message'
                });
            });

            it('can insert a new message', ()=>{

                let text = faker.lorem.text();

                const addMessage = Meteor.server.method_handlers['messages.insert'];
                const invocation = { userId };
                addMessage.apply(invocation, [toUser,text]);
                assert.equal(Messages.find({to:toUser}).count(), 2);

            });

        });
    });
}