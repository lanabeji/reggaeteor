import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import {Poems} from "../api/poems.js";

// Task component - represents a single
export default class Poem extends Component {

    // toggleChecked() {
    //     // Set the checked property to the opposite of its current value
    //     Poems.update(this.props.poem._id, {
    //         $set: { checked: !this.props.poem.checked },
    //     });
    // }

    increaseCounter() {

        var contador = this.props.poem.counter;
        Meteor.call('poems.increaseCounter', this.props.poem._id, contador+1);
        var b = document.getElementById('LikeButton');
        b.disabled = true;
    }

    deleteThisPoem() {
        Meteor.call('poems.remove', this.props.poem._id);
    }


    render() {

        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const poemClassName = this.props.poem.checked ? 'checked' : '';

        return (
            <li className={poemClassName}>

                <span className="text">
                    <strong>{this.props.poem.username}</strong>: {this.props.poem.text}
                </span>

                <button className="delete" onClick={this.deleteThisPoem.bind(this)}>
                    &times;
                </button>

                <button className="like" id="LikeButton" onClick={this.increaseCounter.bind(this)}>
                    Like
                </button>

                <p>{this.props.poem.counter} </p>

                {/*<input*/}
                    {/*type="checkbox"*/}
                    {/*readOnly*/}
                    {/*checked={this.props.poem.checked}*/}
                    {/*onClick={this.toggleChecked.bind(this)}*/}
                {/*/>*/}

            </li>
        );
    }
}

Poem.propTypes = {
    // This component gets the poem to display through a React prop.
    // We can use propTypes to indicate it is required
    poem: PropTypes.object.isRequired
};