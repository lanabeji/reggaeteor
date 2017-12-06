import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import Poem from './Poem.jsx';
import Useer from './Useer.jsx';
import Message from './MessageS.jsx';

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
            topPoems: [],
            lastSearch: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.renderTopUsers = this.renderTopUsers.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    langed() {

    }

    renderPoems() {


        let lista = this.props.poems;

        var poems = lista;

        return poems.map((poem) => (
            <Poem key={poem._id} poem={poem} user={this.props.currentUser}/>
        ));
    }
//Ya que la página está en español, pueden manejar las alertas en español también.
    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const tag = ReactDOM.findDOMNode(this.refs.tagInput).value.trim();

        if (!(text == "" || tag == "")) {

            if (tag.startsWith("#")) {
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
        //Meteor.call('deletePoems');
        console.log(this.props.poems);
    }
    //Ya que la página está en español, pueden manejar las alertas en español también.
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

                Meteor.call('messages.©insert', to, mess);

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
                lastSearch: text,
                filteredPoems: filtrados
            });
        } else {

            let lista = this.props.poems;

            this.setState({
                filteredPoems: lista
            });

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
        if (this.state.filteredPoems.length > 0) {
            return this.state.filteredPoems.map((poem) => (
                <Poem key={poem._id} poem={poem} user={this.props.currentUser}/>
            ));
        }
        else {
            return (
                <div className="poem">
                <span className="text">
                    <strong className="poemAuthor">No se encontró ningún resultado</strong>
                </span>
                </div>
            )
        }
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

    printPrueba() {
        return "prueba";
    }


    render() {
        return (
            <div className="homeContent">
                <div className="sidebar">
                    {this.props.currentUser ?
                        <div>
                            <p className="tituloFrase">¿Necesita' reggaeton?</p>
                            <form className="new-poem">
                                <textarea
                                    ref="textInput"
                                    className="poemInput"
                                    placeholder="Comparte lo que quieras en este espacio"
                                    aria-label="frase célebre"
                                />
                                <input
                                    type="text"
                                    ref="tagInput"
                                    className="poemTag"
                                    placeholder="#taggea tus publicaciones"
                                    aria-label="tag para la frase célebre"
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
                <div className="content mainFeed">
                    {/*<p className="titulos">Esto está pasando:</p>*/}
                    {/*<div className="longlist feed">*/}
                    {/*<div className="poemList">*/}
                    {/*{this.renderPoems()}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <p className="titulos">Lo que está pasando:  </p>
                    <form className="filter-poem">
                        <input
                            className="filterInput"
                            type="text"
                            ref="filterInput"
                            placeholder="Busca y encuentra"
                            aria-label="búsqueda"
                        />
                        <button className="filterBtn" onClick={this.handleSearch}>
                            .
                        </button>
                    </form>

                    <div className="longlist feed">
                        {this.state.filteredPoems.length > 0 || this.state.lastSearch !== "" ? this.renderFilteredPoems() : this.renderPoems()}
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
