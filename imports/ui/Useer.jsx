import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';

import {Poems} from "../api/poems.js";

export default class Useer extends Component {

    printBadge(pos) {
        // console.log("pos: "+pos);
        // switch (pos) {
        //     case 0:
        //         return <img src="/1.png" className="badge" alt="First place"/>
        //     case 1:
        //         return <img src="/2.png" className="badge" alt="First place"/>
        //         break;
        //     case 2:
        //         return <img src="/3.png" className="badge" alt="First place"/>
        //         break;
        //     default:
        //         return ("")
        // }

    }

    render() {


        return (
            <div>
                <li className="user">
                <span className="text">
                    <strong>{this.props.user.username}:</strong> {this.props.user.puntaje === undefined ? 0 : this.props.user.puntaje}
                    points
                </span>

                    {this.props.user.positions ?

                        <div>
                            Badges:&nbsp;
                            {
                                this.props.user.positions.map(function (pos) {
                                    let post = (pos+1).toString();
                                    let posit = "/"+post+".png"
                                    console.log(posit);
                                    return <span><img src={posit} className="badge" alt="Prize badge"/>&nbsp;</span>
                                })}
                        </div> : ''
                    }

                    {/*<p>Position: {this.props.user.positions[0]} </p>*/}
                    {/*<p>{this.props.poem.tag}</p>*/}

                </li>
                <hr/>
            </div>
        );
    }
}

Useer.propTypes = {
    // This component gets the poem to display through a React prop.
    // We can use propTypes to indicate it is required
    user: PropTypes.object.isRequired
};