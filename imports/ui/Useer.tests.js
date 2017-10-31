import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { shallow } from "enzyme";
import { Random } from 'meteor/random';
import React from "react";
import { chai } from "meteor/practicalmeteor:chai";
import faker from "faker";
import { Factory } from 'meteor/dburles:factory';
import Useer from "./Useer";


describe('User', function () {
    it('should render user', function () {

        let name = faker.name.findName();
        const us =  { puntaje: 0, posiciones: [], username:name};

        const usu = shallow(<Useer user={us}/>);

        chai.assert(usu.find("div").length, 2);
        chai.assert(usu.find("span").length, 2);
        chai.assert(usu.find("hr").length, 1);
        chai.assert(usu.find("strong").length, 1);
        chai.assert(usu.find("li").length, 1);

    });
});