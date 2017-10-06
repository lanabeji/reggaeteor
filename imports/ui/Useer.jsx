import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import {Poems} from "../api/poems.js";

export default class Useer extends Component {



    render() {

        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const userClassName = this.props.user.checked ? 'checked' : '';


        return (
            <li className={userClassName}>

                <span className="text">
                    <strong>{this.props.user.username}</strong>: {this.props.user.puntaje}
                </span>

                { this.props.user.positions ?

                    <div>
                        <p>Historic positions</p>
                    {this.props.user.positions.map(function (pos) {
                        return <span>{pos},</span>
                    })}
                    </div>: ''
                }

                {/*<p>Position: {this.props.user.positions[0]} </p>*/}
                {/*<p>{this.props.poem.tag}</p>*/}

            </li>
        );
    }
}

Useer.propTypes = {
    // This component gets the poem to display through a React prop.
    // We can use propTypes to indicate it is required
    user: PropTypes.object.isRequired
};