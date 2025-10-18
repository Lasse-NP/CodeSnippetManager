import React from 'react';
import './NavigationBar.css';
import logo from '../assets/icon.svg';

function NavigationBar({ currentView, setCurrentView }) {

    const showView = () => {
        setCurrentView('view');
    };

    const showCreate = () => {
        setCurrentView('create');
    };

    return (
        <nav className="navigation-bar">
            <img src={logo} alt="Logo" className="nav-logo" />
            <div className="button-group">
                <button className={`btn-view ${currentView === 'view' ? 'active' : ''}`} onClick={showView}>View Snippets</button>
                <button className={`btn-create ${currentView === 'create' ? 'active' : ''}`} onClick={showCreate}>Create Snippet</button>
            </div>
        </nav>
    );
}

export default NavigationBar;