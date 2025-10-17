import React, { useState } from 'react';
import './App.css'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';

function App() {

    const [selectedSnippetId, setSelectedSnippetId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    return (
        <div className="App">
            <NavigationBar />

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
        </div>
    );
}

export default App;