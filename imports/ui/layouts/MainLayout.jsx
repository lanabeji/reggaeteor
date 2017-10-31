import React, {Component} from 'react';
import AccountsUIWrapper from '../AccountsUIWrapper';
import {Link} from 'react-router';
import {Meteor} from 'meteor/meteor';

import {Messages} from "../../api/messages";

const MainLayout = ({children}) => {
    return (
        <div className="main-layout">
            <div className="navbar">
                <header>
                    <img src="/banner.png" alt="Logo Poetry"/>
                    <div className="navItems">
                        <Link to="/" className="navLink">Inicio</Link>
                        <Link to="/tops" className="navLink">Tops</Link>
                        <Link to="/messages" className="navLink">Mensajes </Link>
                    </div>
                </header>
                <AccountsUIWrapper/>
            </div>
            {children}

        </div>
    );
};


export default MainLayout;