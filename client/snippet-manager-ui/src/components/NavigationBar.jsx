import React, { useState, useRef, useEffect } from 'react';
import './NavigationBar.css';
import ReactLogo from '../assets/icon.svg';

function NavigationBar({ currentView, setCurrentView, setServer, server }) {
    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            // Close if clicking outside both the button and the dropdown menu
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showStart = () => {
        setCurrentView('start');
    };

    const showView = () => {
        setCurrentView('view');
    };

    const showCreate = () => {
        setCurrentView('create');
    };

    return (
        <nav className="navigation-bar" id="navigation">
            <svg xmlns="http://www.w3.org/2000/svg" alt="Logo" className="nav-logo" viewBox="0 0 472.615 472.615" onClick={showStart}>
                <g>
                    <g>
                        <polygon points="472.615,384 472.615,324.894 0,324.894 0,384 147.692,384 147.692,433.231 108.308,433.231 108.308,452.923 
			364.308,452.923 364.308,433.231 324.923,433.231 324.923,384 		"/>
                    </g>
                </g>
                <g>
                    <g>
                        <path d="M0,19.692v285.509h472.615V19.692H0z M226.462,49.201h49.231v19.692h-49.231V49.201z M216.615,98.432H256v19.692h-39.385
			V98.432z M187.077,167.355v-19.692h118.154v19.692H187.077z M285.538,196.894v19.692h-19.692v-19.692H285.538z M187.077,49.201
			h19.692v19.692h-19.692V49.201z M147.692,49.201h19.692v19.692h-19.692V49.201z M49.231,98.432h147.692v19.692H49.231V98.432z
			 M90.654,253.931l-13.923,13.923l-41.423-41.423l41.423-41.424l13.923,13.923l-27.5,27.5L90.654,253.931z M112.529,279.316
			l-18.288-7.307l39.385-98.462l18.288,7.307L112.529,279.316z M169.423,267.855L155.5,253.931L183,226.432l-27.499-27.5
			l13.922-13.923l41.424,41.424L169.423,267.855z M226.462,196.894h19.692v19.692h-19.692V196.894z M423.385,265.817H236.308
			v-19.692h187.077V265.817z M423.385,216.586H305.231v-19.692h118.154V216.586z M423.385,167.355h-98.462v-19.692h98.462V167.355z
			 M423.385,118.124H275.692V98.432h147.692V118.124z M423.385,68.894h-128V49.201h128V68.894z"/>
                    </g>
                </g>
            </svg>
            <div className="button-group" id="nav-buttons">
                <button className={`btn-view ${currentView === 'view' ? 'active' : ''}`} onClick={showView}>View Snippets</button>
                <button className={`btn-create ${currentView === 'create' ? 'active' : ''}`} onClick={showCreate}>Create Snippet</button>
            </div>
            <div className="dropdown" id="dropdown-serverpicker-container">
                <button
                    ref={buttonRef}
                    type="button"
                    className={`dropdown-button ${isDropdownOpen ? 'dropdown-open' : ''}`}
                    id="dropdown-serverpicker-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {server || "Select Server"}
                    <span className="dropdown-arrow" id="serverpicker-dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {isDropdownOpen && (
                    <ul className="dropdown-menu" id="serverpicker-dropdown-menu" ref={dropdownRef}>
                        <li className="server" id="remote-server" onClick={() => { setServer("Remote"); setIsDropdownOpen(false);}}
                        >Remote</li>
                        <li className="server" id="local-server" onClick={() => { setServer("Local"); setIsDropdownOpen(false); }}
                        >Local</li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default NavigationBar;