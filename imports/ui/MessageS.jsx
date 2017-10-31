import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

export default class MessageS extends Component {


    render() {
        return (
            <div>

                <hr/>
                <div className="mCont">
                    <li>
                        <p className="dir"><b>To: </b>{this.props.message.to}</p>
                        <p className="message">{this.props.message.text}</p>
                    </li>
                </div>
            </div>
        );
    }
}

MessageS.propTypes = {
    message: PropTypes.object.isRequired
};