import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Poem from './Poem.jsx';
import Useer from './Useer.jsx';

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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.renderTopUsers = this.renderTopUsers.bind(this);
    }

    renderPoems() {

        return this.props.poems.map((poem) => (
            <Poem key={poem._id} poem={poem} />
        ));
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const tag = ReactDOM.findDOMNode(this.refs.tagInput).value.trim();

        Meteor.call('poems.insert',text,tag);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        ReactDOM.findDOMNode(this.refs.tagInput).value = '';
    }

    handleSearch(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.filterInput).value.trim();

        if(text.startsWith('#')){
            let list = this.props.poems;
            console.log("Entró a handle search");
            let filtrados = list.filter(poem => poem.tag == text);

            this.setState({
                filteredPoems: filtrados
            });

        }
        else{
            let list = this.props.poems;
            let filtrados = list.filter(poem => poem.username==text);

            console.log("Entró a handle search");

            this.setState({
                filteredPoems: filtrados
            });
        }

        // Clear form
        ReactDOM.findDOMNode(this.refs.filterInput).value = '';
    }

    renderTopPoems(){

        let lista = this.props.poems;
        let arrayOrdenado = lista.sort(function (a, b) {
            return b.counter-a.counter;
        });

        var top = arrayOrdenado.slice(0,11);

        console.log("Entró a top poems");
        return top.map((poem)=>(
            <Poem key={poem._id} poem={poem} />
        ));

    }

    renderTopUsers(){

        let lista = this.props.users.sort(function (a,b) {
            return b.puntaje - a.puntaje;
        });

        var topUsers = lista;

        console.log(topUsers);


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

    renderUser(){

        let lista = this.props.users.sort(function (a,b) {
            return b.puntaje - a.puntaje;
        });

        return lista.map((user) => (
            <Useer key={user._id} user={user} />
        ));

    }

    renderFilteredPoems(){
        return this.state.filteredPoems.map((poem) => (
            <Poem key={poem._id} poem={poem} />
        ));
    }



    render() {
        return (
            <div className="container">
                <header>
                    <h1>Poetry 1.0</h1>
                    <p><i>At the touch of love everyone becomes a poet</i></p>

                    <AccountsUIWrapper />

                </header>
                <div className="row">
                    <div className="col-4">

                        <p className="titulos">Dashboard</p>

                        { this.props.currentUser ?
                            <form className="new-poem"  >
                                <input
                                    type="text"
                                    ref="textInput"
                                    placeholder="Type to add new poems"
                                />
                                <input
                                    type="text"
                                    ref="tagInput"
                                    placeholder="#tag"
                                />
                                <button onClick={this.handleSubmit}>Send</button>
                            </form> : ''
                        }

                        <ul>
                            {this.renderPoems()}
                        </ul>
                    </div>

                    <div className="col-4">

                        <p className="titulos">Filters </p>
                        <form className="filter-poem">
                            <input
                                type="text"
                                ref="filterInput"
                                placeholder="Filter by username, #tag"
                            />
                            <button onClick={this.handleSearch}>Search</button>
                        </form>

                        <ul>
                            {this.renderFilteredPoems()}
                        </ul>
                    </div>

                    <div className="col-4">

                        <p className="titulos">Top 10</p>
                        <ul>
                            {this.renderTopPoems()}
                        </ul>

                        <button onClick={this.renderTopUsers}>Top users</button>

                        <ol id="listaUsers" style={{visibility:"hidden"}}>
                            {this.renderUser()}
                        </ol>

                    </div>
                </div>

            </div>
        );
    }
}

App.propTypes = {
    poems: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    users: PropTypes.array.isRequired
};

export default createContainer(()=>{

    Meteor.subscribe('poems');
    Meteor.subscribe('users');

    return{
        poems: Poems.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch()
    };
}, App);