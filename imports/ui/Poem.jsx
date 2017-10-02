import React, { Component} from 'react';
import PropTypes from 'prop-types';

// Task component - represents a single
export default class Poem extends Component {
    render() {
        return (
            <div>
                <li>{this.props.poem.text}</li>
            </div>

        );
    }
}

Poem.propTypes = {
    // This component gets the poem to display through a React prop.
    // We can use propTypes to indicate it is required
    poem: PropTypes.object.isRequired
};