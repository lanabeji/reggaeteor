import React from 'react';
import AccountsUIWrapper from '../AccountsUIWrapper';
import {Link} from 'react-router';

const MainLayout = ({children}) =>
    <div className="main-layout">
        <div className="navbar">
            <header>
                <img src="/banner.png" alt="Logo Poetry"/>
                <div className="navItems">
                    <Link to="/" className="navLink">Inicio</Link>
                    <Link to="/tops" className="navLink">Tops</Link>
                    <Link to="/messages" className="navLink">Mensajes</Link>
                    <Link to="/favorites" className="navLink">Favs</Link>
                </div>
            </header>
        <AccountsUIWrapper/>
        </div>
        <p>Hola</p>
        {children}
    </div>

export default MainLayout;