import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import {createContainer} from "meteor/react-meteor-data";

import {Poems} from "../../api/poems";

import Useer from '../Useer';
import Poem from '../Poem';


class Tops extends Component{

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTopUsers = this.renderTopUsers.bind(this);
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

        return topUsers.map((user) => (
            <Useer key={user._id} user={user}/>
        ));
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

    render(){
        return (
            <div className="topContent">
                <div className="sidebar">
                        {this.props.currentUser ?
                        <div>
                            <p className="tituloFrase">¿Necesita' reggaeton?</p>
                            <form className="new-poem">
                                <textarea
                                    ref="textInput"
                                    className="poemInput"
                                    placeholder="Comparte lo que quieras en este espacio"
                                    aria-label = "frase célebre"
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
                <div className="content mainTop">
                    <div className="topUsers">
                    <p className="titulos">Top 5 users</p>
                    <div className="longlist feed-2col">
                        <div id="listaUsers">
                            {this.renderTopUsers()}
                        </div>
                    </div>
                    </div>
                    <div className="topFrases">
                    <p className="titulos">Top 5 poems</p>
                    <div className="longlist feed-2col">
                        <div className="poemList">
                            {this.renderTopPoems()}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

Tops.propTypes = {
    poems: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    currentUser: PropTypes.object
};

export default createContainer(() => {

    Meteor.subscribe('users');
    Meteor.subscribe('poems');

    return {
        poems: Poems.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch()
    };
}, Tops);