import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import Poem from './Poem.jsx';
import Useer from './Useer.jsx';

import {Poems} from "../api/poems.js";

import {createContainer} from "meteor/react-meteor-data";
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredPoems: [],
            topPoems: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.renderTopUsers = this.renderTopUsers.bind(this);
    }

    alerted() {
        alert("Hola");
    }

    renderPoems() {


        let lista = this.props.poems;

        var poems = lista;

        return poems.map((poem) => (
            <Poem key={poem._id} poem={poem}/>
        ));
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const tag = ReactDOM.findDOMNode(this.refs.tagInput).value.trim();

        Meteor.call('poems.insert', text, tag);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        ReactDOM.findDOMNode(this.refs.tagInput).value = '';
    }

    handleSearch(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.filterInput).value.trim();

        if (text.startsWith('#')) {
            let list = this.props.poems;
            console.log("Entró a handle search");
            let filtrados = list.filter(poem => poem.tag == text);

            this.setState({
                filteredPoems: filtrados
            });

        }
        else {
            let list = this.props.poems;
            let filtrados = list.filter(poem => poem.username == text);

            console.log("Entró a handle search");

            this.setState({
                filteredPoems: filtrados
            });
        }

        // Clear form
        ReactDOM.findDOMNode(this.refs.filterInput).value = '';
    }

    renderTopPoems() {

        let lista = this.props.poems;
        let arrayOrdenado = lista.sort(function (a, b) {
            return b.counter - a.counter;
        });

        var top = arrayOrdenado.slice(0, 5);

        console.log("Entró a top poems");
        return top.map((poem) => (
            <Poem key={poem._id} poem={poem}/>
        ));

    }
    //Cuando se piden los top user varias veces, se siguen incrementando los badges. A veces no aparece la imagen del badge
    renderTopUsers() {

        let lista = this.props.users.sort(function (a, b) {
            return b.puntaje - a.puntaje;
        });

        var topUsers = lista.slice(0, 5);



        topUsers.forEach(function posicion(user, i) {
            Meteor.call('users.update', user._id, i)

        });

        //Descomentar las siguientes dos lineas cuando las cosas salen mal y hay que borrar la info de puntae y posiciones de los usuarios
        //Y comentar el forEach de arriba

        // Meteor.call('users.puntaje', 0);
        // Meteor.call('users.positions', 0);

        var b = document.getElementById('listaUsers');
        b.style.visibility = "visible";

        console.log(topUsers);
    }

    renderUser() {

        let lista = this.props.users.sort(function (a, b) {
            return b.puntaje - a.puntaje;
        });

        return lista.map((user) => (
            <Useer key={user._id} user={user}/>
        ));

    }

    renderFilteredPoems() {
        return this.state.filteredPoems.map((poem) => (
            <Poem key={poem._id} poem={poem}/>
        ));
    }


    render() {
        return (
            <div>
                <div className="navbar">
                    <header>
                        <img src="/banner.png" alt="Logo Poetry"/>
                    </header>
                    <AccountsUIWrapper/>
                </div>
                <section className="cont">
                    <div className="row">
                        <div className="column" id="Col1">

                            <p className="titulos">Write something...</p>

                            {this.props.currentUser ?
                                <form className="new-poem">
                                <textarea
                                    ref="textInput"
                                    className="poemInput"
                                    placeholder="Type to add new poems"
                                />
                                    <input
                                        type="text"
                                        ref="tagInput"
                                        className="poemTag"
                                        placeholder="#tag"
                                    />
                                    <button className="poemBtn" onClick={this.handleSubmit}>Send</button>
                                </form> : ''
                            }
                        </div>

                        <div className="column" id="Col2">
                            <p className="titulos">Filters </p>
                            <form className="filter-poem">
                                <input
                                    className="filterInput"
                                    type="text"
                                    ref="filterInput"
                                    placeholder="Filter by username, #tag"
                                />
                                <button className="filterBtn" onClick={this.handleSearch}>
                                    &nbsp;
                                </button>
                            </form>

                            <ul className="poemList">
                                {this.renderFilteredPoems()}
                            </ul>

                        </div>

                        <div className="column" id="Col3">
                            <p className="titulos">Feed</p>
                            <div className="longlist">
                                <ul className="poemList">
                                    {this.renderPoems()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <hr/>
                <section>
                    <div className="row">
                        <div className="column" id="Col4">
                            <p className="titulos">Top 5 poems</p>
                            <div className="longlist">
                                <ul className="poemList">
                                    {this.renderTopPoems()}
                                </ul>
                            </div>
                        </div>
                        <div className="column" id="Col5">
                            <p className="titulos">Top 5 users</p>

                            <button className="topBtn" onClick={this.renderTopUsers}>Get top users</button>
                            <div className="longlist">
                                <ol id="listaUsers" style={{visibility: "hidden"}}>
                                    {this.renderUser()}
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
            ;
    }
}

App.propTypes = {
    poems: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    users: PropTypes.array.isRequired
};

export default createContainer(() => {

    Meteor.subscribe('poems');
    Meteor.subscribe('users');

    return {
        poems: Poems.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch()
    };
}, App);
