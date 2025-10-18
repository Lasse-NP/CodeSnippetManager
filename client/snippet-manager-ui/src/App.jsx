import React, { useState } from 'react';
import './App.css'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetCreate from './components/SnippetCreate';

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

    const handleCancelCreate = () => {
        setCurrentView('view');
    };

    return (
        <div className="App">
            <NavigationBar
                currentView={currentView}
                setCurrentView={setCurrentView}
            />

            {currentView === 'view' ? (
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

                    <div className="detail-view">
                        <SnippetDetail selectedSnippetId={selectedSnippetId} />
                    </div>
                </div>
            ) : (
                <div className="main-layout">
                        <div className="sidebar createView">
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
                    </div>
                    <div className="create-view">
                        <SnippetCreate
                            onCreate={handleCreateSnippet}
                            onCancel={handleCancelCreate}
                            />
                        </div>
                </div>
            )}

        </div>
    );
}

export default App;