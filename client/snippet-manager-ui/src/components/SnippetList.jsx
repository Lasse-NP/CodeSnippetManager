import React, { useState, useEffect } from 'react';
import { snippetsAPI } from '../api';
import './SnippetList.css';

function SnippetList({ selectedSnippetId, setSelectedSnippetId, searchQuery }) {
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await snippetsAPI.getAllSnippets();
                setSnippets(data);
                setRetryCount(0);
            } catch (err) {
                setError('Failed to load snippets. Retrying...');
                console.error('Error fetching snippets:', err);
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
    }, [retryCount]);

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
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="snippet-list">
                <h2>List of Snippets</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="snippet-list">
            <h2>List of Snippets</h2>
            <div className="snippets-container">
                {filteredSnippets.length === 0 ? (<p>No snippets found</p>) : (
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