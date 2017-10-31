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
                <div className="poem">

                <span className="text">
                    <strong className="poemAuthor">{this.props.poem.username}</strong><strong> canta:</strong>
                    <br/>
                    <str>Tag: </str><str className="poemTextTag">{this.props.poem.tag}</str>
                    <pre className="poemText">{this.props.poem.text}</pre>
                </span>

                    <span className="buttons">

                        {this.props.user ?
                            <span>
                                {this.props.user.username===this.props.poem.username?
                                    <button className="delete" onClick={this.deleteThisPoem.bind(this)}
                                            style={{display:"initial", color:"white"}} value="like" tabIndex="0">
                                        .
                                    </button>
                                    :
                                    <button className="delete" onClick={this.deleteThisPoem.bind(this)}
                                            style={{display:"none", color:"white"}} value="like" tabIndex="0">
                                        .
                                    </button>
                                }
                            </span>:''
                        }

                        {this.props.user?
                            <button className="like" name='PuedeContar' onClick={this.increaseCounter.bind(this)}
                                    style={{display:"initial", color:"white"}} value="like" tabIndex="0">
                                .
                            </button>
                            :
                            <button className="like" name='PuedeContar' onClick={this.increaseCounter.bind(this)}
                                    style={{display:"none", color:"white"}} value="like" tabIndex="0">
                                &nbsp;
                            </button>
                        }
                        
                    <span className="likesCounter">
                         Likes: {this.props.poem.counter}
                    </span>
                </span>

                </div>
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