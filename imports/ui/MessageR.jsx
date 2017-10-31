import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

export default class MessageR extends Component {

    render() {
        return (
            <div>

                <hr/>
                <div className="mCont">
                    <li>
                        <p className="dir"><b>From: </b>{this.props.message.from}</p>
                        <p className="message" id={this.props.message._id}>{this.props.message.text}</p>
                    </li>
                </div>
            </div>
        );
    }
}

MessageR.propTypes = {
    message: PropTypes.object.isRequired
};