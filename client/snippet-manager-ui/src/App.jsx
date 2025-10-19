import React, { useState } from 'react';
import './App.css'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetCreate from './components/SnippetCreate';
import SnippetUpdate from './components/SnippetUpdate';

function App() {
    // State to track which snippet is selected
    const [selectedSnippetId, setSelectedSnippetId] = useState(null);
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    // State to track current view
    const [currentView, setCurrentView] = useState('view');

    const handleCreateSnippet = (newSnippet) => {
        // After creating, switch back to view mode and select the new snippet
        setCurrentView('view');
        setSelectedSnippetId(newSnippet.id);
        // You might want to refresh the snippet list here
    };

    const handleUpdateSnippet = () => {
        // After updating, switch back to view mode
        setCurrentView('view');
        // The snippet detail will automatically refresh because selectedSnippetId hasn't changed
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
                    />
                </div>
                {currentView === 'view' ? (
                    <div className="detail-view">
                        <SnippetDetail
                            selectedSnippetId={selectedSnippetId}
                            onStartUpdate={handleStartUpdate}
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