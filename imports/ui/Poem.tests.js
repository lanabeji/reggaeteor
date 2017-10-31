import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { shallow } from "enzyme";
import { Random } from 'meteor/random';
import React from "react";
import { chai } from "meteor/practicalmeteor:chai";
import Poem from "./Poem.jsx";
import faker from "faker";
import { Factory } from 'meteor/dburles:factory';


describe('Poem', function () {
    it('should render', function () {

        const userId = Random.id();
        let name = faker.name.findName();
        let ta = faker.lorem.word();
        const poem1 =  { text: 'testing', createAt: new Date(), counter: 0, owner: userId, username:name, tag:ta};

        const poem = shallow(<Poem poem={poem1}></Poem>);

        chai.assert(poem.find("button").length, 2);
        chai.assert(poem.find("li").length, 1);
        chai.assert(poem.find("p").length, 1);
        chai.assert(poem.find("pre").length, 1);
        chai.assert(poem.find("span").length, 3);

    });
});