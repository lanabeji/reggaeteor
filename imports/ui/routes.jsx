import React from 'react';
import {
    Router,
    Route,
    IndexRoute,
    browserHistory
} from 'react-router';
import {render} from 'react-dom';

import App from './App';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
import Tops from './pages/Tops';
import MainLayout from './layouts/MainLayout';


Meteor.startup(() => {
    render(
        <Router history={browserHistory}>
            <Route path="/" component={MainLayout}>
                <IndexRoute component={App}/>
                <Route path="/tops" component={Tops}/>
                <Route path="/messages" component={Messages}/>
                <Route path="/favorites" component={Favorites}/>
            </Route>
        </Router>,
        document.getElementById('render-target'));
});
