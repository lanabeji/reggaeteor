import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Poem from './Poem.jsx';

import {Poems} from "../api/poems.js";

import {createContainer} from "meteor/react-meteor-data";
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        this.state={
            filteredPoems:[
            ],
            topPoems:[

            ]
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('poems.insert',text);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    handleSearch(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.filterInput).value.trim();

        let filtrados = this.props.poems.filter(poem => poem.username==text);

        this.setState({
            filteredPoems: filtrados.sort(function (a, b) {
                return b.counter-a.counter;
            })
        });

        // Clear form
        ReactDOM.findDOMNode(this.refs.filterInput).value = '';
    }

    renderTopPoems(){

        let arrayOrdenado = this.props.poems.sort(function (a, b) {
            return b.counter-a.counter;
        });

        let top = arrayOrdenado.slice(0,11);

        return top.map((poem)=>(
            <Poem key={poem._id} poem={poem} />
        ));

    }

    renderFilteredPoems(){
        return this.state.filteredPoems.map((poem) => (
            <Poem key={poem._id} poem={poem} />
        ));
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

                </header>
                <div className="row">
                    <div className="col-4">

                        { this.props.currentUser ?
                            <form className="new-poem"  >
                                <input
                                    type="text"
                                    ref="textInput"
                                    placeholder="Type to add new poems"
                                />
                                <button onClick={this.handleSubmit.bind(this)}>Send</button>
                            </form> : ''
                        }

                        <ul>
                            {this.renderPoems()}
                        </ul>
                    </div>

                    <div className="col-4">

                        <p>Filters </p>
                        <form className="filter-poem">
                            <input
                                type="text"
                                ref="filterInput"
                                placeholder="Filter poems by username"
                            />
                            <button onClick={this.handleSearch.bind(this)}>Search</button>
                        </form>

                        <ul>
                            {this.renderFilteredPoems()}
                        </ul>
                    </div>

                    <div className="col-4">

                        <p>Top 10</p>
                        <ul>
                            {this.renderTopPoems()}
                        </ul>

                    </div>
                </div>

            </div>
        );
    }
}

App.propTypes = {
    poems: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(()=>{

    Meteor.subscribe('poems');

    return{
        poems: Poems.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
    };
}, App);