import React, { useState, useEffect } from 'react';
import { snippetsAPI } from '../api';
import './SnippetList.css';

function SnippetList({ selectedSnippetId, setSelectedSnippetId, searchQuery, cachedSnippets, refreshTrigger }) {
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        // If we have cached snippets, use them immediately
        if (cachedSnippets && refreshTrigger === 0) {
            console.log('Using cached snippets');
            setSnippets(cachedSnippets);
            setLoading(false);
            return;
        }

        const fetchSnippets = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Attempting to fetch from API...');
                const data = await snippetsAPI.getAllSnippets();
                console.log('Successfully fetched snippets:', data);
                console.log('First snippet structure:', data[0]); // See the actual structure
                setSnippets(data);
                setRetryCount(0);
            } catch (err) {
                console.error('Full error details:', err);
                console.error('Error message:', err.message);
                setError(`Failed to load snippets: ${err.message}`);
                // Retry logic with exponential backoff
                const retryDelay = Math.min(Math.pow(2, retryCount) * 1000, 30000); // Max 30 seconds
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, retryDelay);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [retryCount, cachedSnippets, refreshTrigger]);

    const filteredSnippets = snippets.filter(snippet => {
        const titleMatch = snippet.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = snippet.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const languageMatch = snippet.language?.toLowerCase().includes(searchQuery.toLowerCase());

        // Check if tags match - handles nested structure from junction table
        const tagMatch = snippet.tags?.some(tag =>
            (typeof tag === 'string' ? tag : tag.name)?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return titleMatch || descriptionMatch || languageMatch || tagMatch;
    });

    if (loading) {
        return (
            <div className="snippet-list">
                <h2>List of Snippets</h2>
                <p>Loading... {retryCount > 0 && `(Retry attempt ${retryCount})`}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="snippet-list">
                <h2>List of Snippets</h2>
                <p className="error">{error}</p>
                <p className="retry-info">Retry attempt {retryCount}...</p>
            </div>
        );
    }

    return (
        <div className="snippet-list">
            <h2>List of Snippets</h2>
            <div className="snippets-container">
                {filteredSnippets.length === 0 ? (<p>No snippets found</p>
                    ) : (
                    filteredSnippets.map(snippet => (
                        <div key={snippet.id} className={`snippet-item ${selectedSnippetId === snippet.id ? 'selected' : ''}`} onClick={() => setSelectedSnippetId(snippet.id)}>
                            <h3>{snippet.title}</h3>
                            <p>{snippet.language}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SnippetList;