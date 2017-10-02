import React, { Component } from 'react';

import Poem from './Poem.jsx';

// App component - represents the whole app
export default class App extends Component {
    getPoems() {
        return [
            { _id: 1, text: 'This is poem 1' },
            { _id: 2, text: 'This is poem 2' },
            { _id: 3, text: 'This is poem 3' },
        ];
    }

    renderPoems() {
        return this.getPoems().map((poem) => (
            <Poem key={poem._id} poem={poem} />
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Poetry</h1>
                </header>

                <ul>
                    {this.renderPoems()}
                </ul>
            </div>
        );
    }
}