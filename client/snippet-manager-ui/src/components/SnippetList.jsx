import React, { useState, useEffect } from 'react';
import './SnippetList.css';

function SnippetList({ selectedSnippetId, setSelectedSnippetId, searchQuery }) {
    const [snippets, setSnippets] = useState([]);

    useEffect(() => {
        //fetch snippets from backend or local storage
    })

    const filteredSnippets = snippets.filter(snippet =>
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="snippet-list">
            <h2>List of Snippets</h2>
            <div className="snippets-container">"
                {filteredSnippets.map(snippet => (
                    <div key={snippet.id} className={`snippet-item ${selectedSnippetId === snippet.id ? 'selected' : ''}`} onClick={() => setSelectedSnippetId(snippet.id)}>
                        <h3>{snippet.title}</h3>
                        <p>{snippet.language}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SnippetList;