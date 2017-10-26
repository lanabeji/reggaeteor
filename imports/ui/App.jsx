import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import Poem from './Poem.jsx';
import Useer from './Useer.jsx';
import Message from './Message.jsx';

import {Poems} from "../api/poems.js";
import {Messages} from "../api/messages.js";

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
        this.handleMessage = this.handleMessage.bind(this);
    }

    alerted() {
        alert("Hola");
    }

    renderPoems() {


        let lista = this.props.poems;

        var poems = lista;

        return poems.map((poem) => (
            <Poem key={poem._id} poem={poem} user={this.props.currentUser}/>
        ));
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const tag = ReactDOM.findDOMNode(this.refs.tagInput).value.trim();

        if (!(text == "" || tag == "")) {

            text.replace(/\r?\n/g, '<br />');
            console.log(text);
            Meteor.call('poems.insert', text, tag);

            // Clear form
            ReactDOM.findDOMNode(this.refs.textInput).value = '';
            ReactDOM.findDOMNode(this.refs.tagInput).value = '';
        } else {
            alert("Please complete all the fields");
        }
    }

    handleMessage(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const to = ReactDOM.findDOMNode(this.refs.toInput).value.trim();
        const mess = ReactDOM.findDOMNode(this.refs.textInputMessage).value.trim();

        if (!(to == "" || mess == "")) {

            let low = to.toLowerCase();
            let upp = to.toUpperCase();
            let lista = this.props.users.filter(user=>user.username===to|| user.username===low || user.username===upp);

            if(lista.length !== 0){
                const from = this.props.currentUser.username;
                console.log(from);

                Meteor.call('messages.insert',to,from,mess);

                // Clear form
                ReactDOM.findDOMNode(this.refs.toInput).value = '';
                ReactDOM.findDOMNode(this.refs.textInputMessage).value = '';
            }
            else {
                alert("The username does not exist");
            }

        } else {
            alert("Please complete all the fields");
        }
    }

    handleSearch(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.filterInput).value.trim();

        if (text !== "") {
            let list = this.props.poems;
            let low = text.toLowerCase();
            let upp = text.toUpperCase();
            let inicial = text.charAt(0).toUpperCase()+text.slice(1);
            let filtrados = list.filter(poem => poem.text.includes(text) || poem.username.includes(text) ||
                poem.tag.includes(text)|| poem.username.includes(low) || poem.tag.includes(low) || poem.text.includes(low)
                || poem.username.includes(upp) || poem.tag.includes(upp) || poem.text.includes(upp)
                || poem.username.includes(inicial) || poem.tag.includes(inicial) || poem.text.includes(inicial));

            console.log("Entró a handle search");

            this.setState({
                filteredPoems: filtrados
            });
        } else {
            alert("Please enter a valid filter value");
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

    renderNewMessage(){
        var b = document.getElementById('newMessage');
        b.style.display = "initial";
    }

    renderTopUsers() {

        let lista = this.props.users.sort(function (a, b) {
            return b.puntaje - a.puntaje;
        });

        var topUsers = lista.slice(0, 5);

     //   topUsers.forEach(function posicion(user, i) {
        //       Meteor.call('users.update', user._id, i)

    //    });

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

    renderRcvMessages(){

       //Descomentar en caso de querer borrar todos los mensajes de los usuarios y de la bd
        // Meteor.call('users.messages');
       //Meteor.call('messages.deleteAll');

        return this.props.messages.filter(message=>message.to===this.props.currentUser.username).map((message)=>(
            <Message key={message._id} message={message} user={this.props.currentUser}/>
        ));
    }

    renderSndMessages(){
        return this.props.messages.filter(message=>message.from===this.props.currentUser.username).map((message)=>(
            <Message key={message._id} message={message} user={this.props.currentUser}/>
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
                                    placeholder="Filter by username, tag"
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

                <div>

                    {this.props.currentUser ?
                        <div>
                            <button className="createMsg" onClick={this.renderNewMessage}>Create new message</button>
                            <form className="new-message" id="newMessage" style={{display: "none"}}>

                                <p>To:</p>
                                <input
                                    type="text"
                                    ref="toInput"
                                    className="messageTo"
                                    placeholder=""
                                />
                                <p>Message:</p>
                                <textarea
                                        ref="textInputMessage"
                                        className="messageInput"
                                        placeholder="Type to add write a new message"
                                    />

                                <button className="messageBtn" onClick={this.handleMessage}>Send</button>
                            </form>
                        </div>: ''
                    }

                    {this.props.currentUser ?
                        <div>
                            <p><strong>Sent messages</strong></p>
                            <ul>
                                {this.renderSndMessages()}
                            </ul>
                            <p><strong>Received messages</strong></p>
                            <ul>
                                {this.renderRcvMessages()}
                            </ul>
                        </div>: 'No hay mensajes para ti :('

                    }
                </div>

            </div>
        )
            ;
    }
}

App.propTypes = {
    poems: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    users: PropTypes.array.isRequired,
    messages: PropTypes.array
};

export default createContainer(() => {

    Meteor.subscribe('poems');
    Meteor.subscribe('users');
    Meteor.subscribe('messages');

    return {
        poems: Poems.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch(),
        messages: Messages.find().fetch()
    };
}, App);