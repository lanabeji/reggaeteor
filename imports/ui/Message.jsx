import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

export default class Message extends Component {

//Dejar texto en la página en español
    render() {
        return (
            <div>
                <li>
                    <p>To:{this.props.message.to}</p>
                    <p>From:{this.props.message.from}</p>
                    <p>Message:{this.props.message.text}</p>
                </li>
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired
};
