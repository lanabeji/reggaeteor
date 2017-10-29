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
            currentPage : "AAA",
            filteredPoems: [],
            topPoems: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.renderTopUsers = this.renderTopUsers.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goTops = this.goTops.bind(this);
        this.goMessages = this.goMessages.bind(this);
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

            if (tag.startsWith("#")) {
                console.log(text);
                Meteor.call('poems.insert', text, tag);

                // Clear form
                ReactDOM.findDOMNode(this.refs.textInput).value = '';
                ReactDOM.findDOMNode(this.refs.tagInput).value = '';
            }
            else {
                alert("Please insert # before your tag");
            }

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
            let lista = this.props.users.filter(user => user.username === to || user.username === low || user.username === upp);

            if (lista.length !== 0) {

                Meteor.call('messages.insert', to, mess);

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
            let inicial = text.charAt(0).toUpperCase() + text.slice(1);
            let filtrados = list.filter(poem => poem.text.includes(text) || poem.username.includes(text) ||
                poem.tag.includes(text) || poem.username.includes(low) || poem.tag.includes(low) || poem.text.includes(low)
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

        let arrayOrdenado = this.props.poems.sort(function (a, b) {
            return b.counter - a.counter;
        });

        var top = arrayOrdenado.slice(0, 5);

        return top.map((poem) => (
            <Poem key={poem._id} poem={poem} user={this.props.currentUser}/>
        ));

    }

    renderNewMessage() {
        var b = document.getElementById('newMessage');
        b.style.display = "initial";
    }

    renderTopUsers() {

        let lista = this.props.users.sort(function (a, b) {
            return b.puntaje - a.puntaje;
        });

        var topUsers = lista.slice(0, 5);


        //Descomentar las siguientes dos lineas cuando las cosas salen mal y hay que borrar la info de puntae y posiciones de los usuarios
        //Y comentar el forEach de arriba

        //Meteor.call('users.puntaje');
        //Meteor.call('users.positions');

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
            <Poem key={poem._id} poem={poem} user={this.props.currentUser}/>
        ));
    }

    renderRcvMessages() {

        //Descomentar en caso de querer borrar todos los mensajes de los usuarios y de la bd
        //Meteor.call('users.messages');
        //Meteor.call('messages.deleteAll');

        console.log(this.props.messages);

        return this.props.messages.filter(message => message.to === this.props.currentUser.username).map((message) => (
            <Message key={message._id} message={message} user={this.props.currentUser}/>
        ));
    }

    renderSndMessages() {
        return this.props.messages.filter(message => message.from === this.props.currentUser.username).map((message) => (
            <Message key={message._id} message={message} user={this.props.currentUser}/>
        ));

    }

    goHome(event) {
        console.log("Evento:"+event.value);
        this.setState({
            currentPage: "home"
        })
    }

    goTops(event) {
        console.log("Evento:"+event.value);
        this.setState({
            currentPage: "tops"
        })
    }

    goMessages(event) {
        console.log("Evento:"+event.value);
        this.setState({
            currentPage: "messages"
        })
    }

    render() {
        return (
            <div>

                <div className="sidebar">
                    {this.props.currentUser ?
                        <div>
                            <p className="titulos">¿Necesita' reggaeton?</p>
                            <form className="new-poem">
                                <textarea
                                    ref="textInput"
                                    className="poemInput"
                                    placeholder="Comparte lo que quieras en este espacio"
                                />
                                <input
                                    type="text"
                                    ref="tagInput"
                                    className="poemTag"
                                    placeholder="#taggea tus publicaciones"
                                />
                                <button className="poemBtn" onClick={this.handleSubmit}>Send</button>
                            </form>
                            <p className="texto textoTag"><strong>Define un tag</strong> para tu publicación, ¡así nos
                                aseguramos de que más gente pueda verla!</p>
                        </div>
                        :
                        <div className="intro">
                            <p className="titulos">¡Bienvenido!</p>
                            <p className="texto"> Reggaeteor es una nueva alternativa para compartir tus versos
                                favoritos del reggaeton!</p>
                            <p className="texto">Para empezar solo tienes que seguir los siguientes pasos:</p>
                            <ul>
                                <li><strong>Ingresa</strong> al sistema / Registráte</li>
                                <li><strong>Comparte</strong> tus frases favoritas en el espacio indicado a la derecha
                                </li>
                                <li><strong>Dedícate</strong> a disfrutar de tus publicaciones y las de los demás</li>
                            </ul>
                            <p className="texto">Además de esto, podrás:</p>
                            <ul>
                                <li>Seguir a usuarios con gustos similares al tuyo</li>
                                <li>Contactar con estos usuarios</li>
                                <li>Ver cuales son los usuarios más activos</li>
                                <li>Ver el top 5 de frases de reggaeton más famosas</li>
                            </ul>
                            <p className="texto">¡Para ingresar <strong>solo haz click en el botón "Ingresar"</strong>
                                en la parte superior izquierda!</p>
                        </div>
                    }
                </div>
                <div className="content">
                    <p className="titulos">Feed</p>
                    <div className="longlist">
                        <ul className="poemList">
                            {this.renderPoems()}
                        </ul>
                    </div>
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