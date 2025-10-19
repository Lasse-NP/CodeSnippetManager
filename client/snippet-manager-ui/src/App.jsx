import React, { useState } from 'react';
import './App.css'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetCreate from './components/SnippetCreate';
import SnippetUpdate from './components/SnippetUpdate';
import StartPage from './components/StartPage';

function App() {
    // State to track which snippet is selected
    const [selectedSnippetId, setSelectedSnippetId] = useState(null);
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    // State to track current view
    const [currentView, setCurrentView] = useState('start');
    // Cache snippets fetched from StartPage
    const [cachedSnippets, setCachedSnippets] = useState(null);
    // State to track when to refresh
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreateSnippet = (newSnippet) => {
        setCurrentView('view');
        setSelectedSnippetId(newSnippet.id);
        setCachedSnippets(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUpdateSnippet = () => {
        setCurrentView('view');
        setSelectedSnippetId(selectedSnippetId.id);
        setCachedSnippets(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCancelCreate = () => {
        setCurrentView('view');
    };

    const handleCancelUpdate = () => {
        setCurrentView('view');
    };

    const handleStartUpdate = () => {
        setCurrentView('update');
    };

    const handleStartDelete = () => {
        setCurrentView('view');
        setSelectedSnippetId(null);
        setCachedSnippets(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleNavigateToView = (snippetId) => {
        setCurrentView('view');
        if (snippetId) {
            setSelectedSnippetId(snippetId);
        }
    };

    const handleSnippetsFetched = (snippets) => {
        // Cache the snippets for immediate display in SnippetList
        setCachedSnippets(snippets);
    };

    // Render StartPage
    if (currentView === 'start') {
        return (
            <div className="App">
                <div className="start-view">
                    <StartPage
                        onNavigateToView={handleNavigateToView}
                        onSnippetsFetched={handleSnippetsFetched}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <NavigationBar
                currentView={currentView}
                setCurrentView={setCurrentView}
            />


            <div className="main-layout">
                <div className="sidebar">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                    <SnippetList
                        selectedSnippetId={selectedSnippetId}
                        setSelectedSnippetId={setSelectedSnippetId}
                        searchQuery={searchQuery}
                        cachedSnippets={cachedSnippets}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
                {currentView === 'view' ? (
                    <div className="detail-view">
                        <SnippetDetail
                            selectedSnippetId={selectedSnippetId}
                            onStartUpdate={handleStartUpdate}
                            onStartDelete={handleStartDelete}
                        />
                    </div>
                ) : currentView === 'create' ? (
                    <div className="create-view">
                        <SnippetCreate
                            onCreate={handleCreateSnippet}
                            onCancel={handleCancelCreate}
                        />
                    </div>
                ) : (
                    <div className="update-view">
                        <SnippetUpdate
                            selectedSnippetId={selectedSnippetId}
                            onUpdate={handleUpdateSnippet}
                            onCancel={handleCancelUpdate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;