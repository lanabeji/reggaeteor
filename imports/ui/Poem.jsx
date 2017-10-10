import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import {Poems} from "../api/poems.js";

export default class Poem extends Component {

    // toggleChecked() {
    //     // Set the checked property to the opposite of its current value
    //     Poems.update(this.props.poem._id, {
    //         $set: { checked: !this.props.poem.checked },
    //     });
    // }

    increaseCounter() {

        var contador = this.props.poem.counter;

        // var b = document.getElementById('LikeButton');
        // console.log(b.name);

        Meteor.call('poems.increaseCounter', this.props.poem._id, this.props.poem.owner);

        // if(b.name == 'PuedeContar'){
        //     Meteor.call('poems.increaseCounter', this.props.poem._id, contador+1);
        //     b.name = 'NoPuedeContar';
        //     b.innerHTML='Unlike';
        // }
        //
        // else{
        //     Meteor.call('poems.increaseCounter', this.props.poem._id, contador-1);
        //     b.name = 'PuedeContar';
        //     b.innerHTML='Like';
        // }


    }

    deleteThisPoem() {
        Meteor.call('poems.remove', this.props.poem._id);
    }


    render() {


        return (
            <div>
                <li className="poem">

                <span className="text">
                    <strong className="poemAuthor">{this.props.poem.username} posted:</strong>
                    <p className="poemTextTag">{this.props.poem.tag}</p>
                    <p className="poemText">"{this.props.poem.text}"</p>
                </span>

                    <span className="buttons">
                     <button className="delete" onClick={this.deleteThisPoem.bind(this)}>
                         &nbsp;
                     </button>

                    <button className="like" id="LikeButton" name='PuedeContar'
                            onClick={this.increaseCounter.bind(this)}>
                         &nbsp;
                    </button>

                    <span className="likesCounter">
                         Likes: {this.props.poem.counter}
                    </span>
                </span>
                    {/*<input*/}
                    {/*type="checkbox"*/}
                    {/*readOnly*/}
                    {/*checked={this.props.poem.checked}*/}
                    {/*onClick={this.toggleChecked.bind(this)}*/}
                    {/*/>*/}

                </li>
                <hr/>
            </div>
        );
    }
}

Poem.propTypes = {
    // This component gets the poem to display through a React prop.
    // We can use propTypes to indicate it is required
    poem: PropTypes.object.isRequired
};