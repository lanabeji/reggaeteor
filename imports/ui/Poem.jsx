import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import {Poems} from "../api/poems.js";

export default class Poem extends Component {


    increaseCounter() {

        console.log(this.props.poem.owner);
        Meteor.call('poems.increaseCounter', this.props.poem._id, this.props.poem.owner, function(error, result)
        {
         if(error){
             alert("You've already voted this poem");
         }
        });
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
                    <pre className="poemText">{this.props.poem.text}</pre>
                </span>

                    <span className="buttons">

                        {this.props.user ?
                            <span>
                                {this.props.user.username===this.props.poem.username?
                                    <button className="delete" id="DeleteButton" onClick={this.deleteThisPoem.bind(this)}
                                            style={{display:"initial"}}>
                                        &nbsp;
                                    </button>
                                    :
                                    <button className="delete" id="DeleteButton" onClick={this.deleteThisPoem.bind(this)}
                                            style={{display:"none"}}>
                                        &nbsp;
                                    </button>
                                }
                            </span>:''
                        }

                        {this.props.user?
                            <button className="like" id="LikeButton" name='PuedeContar' onClick={this.increaseCounter.bind(this)}
                                    style={{display:"initial"}}>
                                &nbsp;
                            </button>
                            :
                            <button className="like" id="LikeButton" name='PuedeContar' onClick={this.increaseCounter.bind(this)}
                                    style={{display:"none"}}>
                                &nbsp;
                            </button>
                        }



                    <span className="likesCounter">
                         Likes: {this.props.poem.counter}
                    </span>
                </span>

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