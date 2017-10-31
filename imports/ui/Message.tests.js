import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { shallow } from "enzyme";
import { Random } from 'meteor/random';
import React from "react";
import { chai } from "meteor/practicalmeteor:chai";
import faker from "faker";
import { Factory } from 'meteor/dburles:factory';
import Message from "./Message";

describe('Message', function () {
    it('should render message', function () {

        const from = faker.name.findName();
        let to = faker.name.findName();


        const mes =  { text: 'testing', createAt: new Date(), to: to, from: from};

        const mens = shallow(<Message message={mes}/>);

        chai.assert(mens.find("div").length, 1);
        chai.assert(mens.find("li").length, 1);
        chai.assert(mens.find("p").length, 3);


    });
});