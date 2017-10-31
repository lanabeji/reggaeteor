import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {createContainer} from "meteor/react-meteor-data";

import {Messages} from "../../api/messages";


import MessageS from '../MessageS';
import MessageR from '../MessageR';


class Messenger extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    renderRcvMessage() {

        var a = document.getElementById('rcvBtn');
        var b = document.getElementById('rcvCont');


        a.style.backgroundColor === "rgb(55, 31, 76)" ? a.style.backgroundColor = "dimgray" : a.style.backgroundColor = "#371f4c";

        var state = b.style.display;

        state === "initial" ? b.style.display = "none" : b.style.display = "initial";
    }

    renderSntMessage() {

        var a = document.getElementById('sntBtn');
        var b = document.getElementById('sentCont');

        a.style.backgroundColor === "rgb(55, 31, 76)" ? a.style.backgroundColor = "dimgray" : a.style.backgroundColor = "#371f4c";

        var state = b.style.display;


        state === "initial" ? b.style.display = "none" : b.style.display = "initial";
    }

    renderNewMessage() {

        var a = document.getElementById('createBtn');
        a.style.backgroundColor === "rgb(55, 31, 76)" ? a.style.backgroundColor = "dimgray" : a.style.backgroundColor = "#371f4c";

        var b = document.getElementById('newMessage');
        var state = b.style.display;

        state === "initial" ? b.style.display = "none" : b.style.display = "initial";
    }

    handleMessage(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const to = ReactDOM.findDOMNode(this.refs.toInput).value.trim();
        const mess = ReactDOM.findDOMNode(this.refs.textInputMessage).value.trim();


        if (!(to === "" || mess === "")) {

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

    renderRcvMessages() {

        //Descomentar en caso de querer borrar todos los mensajes de los usuarios y de la bd
        //Meteor.call('users.messages');
        //Meteor.call('messages.deleteAll');

        console.log(this.props.messages);

        return this.props.messages.filter(message => message.to === this.props.currentUser.username).map((message) => (
            <MessageR key={message._id} message={message} user={this.props.currentUser}/>
        ));
    }

    renderSndMessages() {
        return this.props.messages.filter(message => message.from === this.props.currentUser.username).map((message) => (
            <MessageS key={message._id} message={message} user={this.props.currentUser}/>
        ));

    }

    handleSubmit(event) {
        console.log("si entra");
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
    }


    render() {
        return (
            <div className="messContent">
                <div className="sidebar">
                    {this.props.currentUser ?
                        <div>
                            <p className="tituloFrase">¿Necesita' reggaeton?</p>
                            <form className="new-poem">
                                <textarea
                                    ref="textInput"
                                    className="poemInput"
                                    placeholder="Comparte lo que quieras en este espacio"
                                    aria-label = "Frase célebre"
                                />
                                <input
                                    type="text"
                                    ref="tagInput"
                                    className="poemTag"
                                    placeholder="#taggea tus publicaciones"
                                    aria-label = "tag para la frase célebre"
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
                <div className="content mainMess">

                    {this.props.currentUser ?
                        <div>
                            <div className="messBtn">
                                <button className="createMsg" id="createBtn" onClick={this.renderNewMessage}>Create new
                                    message
                                </button>
                                <button className="createMsg" id="rcvBtn" onClick={this.renderRcvMessage}>Ver mensajes
                                    recibidos
                                </button>
                                <button className="createMsg" id="sntBtn" onClick={this.renderSntMessage}>Ver mensajes
                                    enviados
                                </button>
                            </div>
                            <div className="newMessCont">
                                <form className="new-message" id="newMessage" style={{display: "none"}}>
                                    <br/>
                                    <p><strong className="mesHeader">Envía un mensaje nuevo</strong></p>
                                    <p className="dir">To:</p>
                                    <input
                                        type="text"
                                        ref="toInput"
                                        className="messageTo"
                                        placeholder="Destinatario"
                                        aria-label = "Destinatario del mensaje"
                                    />
                                    <p className="dir">Message:</p>
                                    <textarea
                                        ref="textInputMessage"
                                        className="messageInput"
                                        placeholder="Dí lo que tengas que decir"
                                        aria-label = "Cuerpo del mensaje"
                                    />

                                    <button className="messageBtn" onClick={this.handleMessage}>Send</button>
                                </form>
                            </div>
                        </div> : ''
                    }
                    <div className="mesStatsCont">
                        {this.props.currentUser ?
                            <div>
                                <div id="sentCont">
                                    <p><strong className="mesHeader">Sent messages</strong></p>
                                    <ul>
                                        {this.renderSndMessages()}
                                    </ul>
                                </div>
                                < div id="rcvCont">
                                    <p><strong className="mesHeader"> Received messages</strong></p>
                                    <ul>
                                        {this.renderRcvMessages()}
                                    </ul>
                                </div>
                            </div>
                            : 'No hay mensajes para ti :('
                        }
                    </div>
                </div>
            </div>

        )
    }
}

Messenger.propTypes = {
    currentUser: PropTypes.object,
    messages: PropTypes.array
};

export default createContainer(() => {

    Meteor.subscribe('messages');
    Meteor.subscribe('users');

    return {
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch(),
        messages: Messages.find().fetch()
    };
}, Messenger);