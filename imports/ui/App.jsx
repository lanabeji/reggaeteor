import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Poem from './Poem.jsx';

import {Poems} from "../api/poems.js";

import {createContainer} from "meteor/react-meteor-data";
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Poems.insert({
            text,
            createdAt: new Date(), // current time
            counter: 0,
        });

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    renderPoems() {
        return this.props.poems.map((poem) => (
            <Poem key={poem._id} poem={poem} />
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Poetry </h1>

                    <AccountsUIWrapper />

                    <form className="new-poem" onSubmit={this.handleSubmit.bind(this)} >
                        <input
                            type="text"
                            ref="textInput"
                            placeholder="Type to add new poems"
                        />
                    </form>

                </header>

                <ul>
                    {this.renderPoems()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    poems: PropTypes.array.isRequired
};

export default createContainer(()=>{
    return{
        poems: Poems.find({}, { sort: { createdAt: -1 } }).fetch()
    };
}, App);