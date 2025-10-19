import React, { useState, useEffect } from "react";
import { snippetsAPI } from '../api';
import './StartPage.css';

function StartPage({ onNavigateToView, onSnippetsFetched }) {
    const [recentSnippets, setRecentSnippets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch snippets in the background when component loads
        const fetchSnippets = async () => {
            try {
                setLoading(true);
                const data = await snippetsAPI.getAllSnippets();

                // Pass all snippets back to App for caching
                onSnippetsFetched && onSnippetsFetched(data);

                // Get the 5 most recent snippets (assuming they have a date field)
                // If no date field, just take the first 5
                const recent = data.slice(0, 5);
                setRecentSnippets(recent);
            } catch (err) {
                console.error('Error fetching snippets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, []);

    const handleSnippetClick = (snippetId) => {
        // Navigate to view and select this snippet
        onNavigateToView(snippetId);
    };

    return (
        <div className="start-page">
            <div className="start-header">
                <h1>Welcome to Snippet Manager</h1>
                <p>Organize and manage your code snippets efficiently</p>
            </div>

            <div className="start-actions">
                <button
                    className="btn-view-all"
                    onClick={() => onNavigateToView(null)}>
                    Start Now
                </button>
            </div>

            <div className="recent-snippets">
                <h2>Recent Snippets</h2>
                {loading ? (
                    <p className="loading-message">Loading snippets...</p>
                ) : recentSnippets.length > 0 ? (
                    <div className="snippet-grid">
                        {recentSnippets.map(snippet => (
                            <div
                                key={snippet.id}
                                className="snippet-card"
                                onClick={() => handleSnippetClick(snippet.id)}
                            >
                                <h3>{snippet.title}</h3>
                                <p className="snippet-language">{snippet.language}</p>
                                {snippet.tags && snippet.tags.length > 0 && (
                                    <div className="snippet-tags">
                                        {snippet.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="tag">
                                                {typeof tag === 'string' ? tag : tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-snippets">No snippets yet. Create your first one!</p>
                )}
            </div>

            <div className="start-stats">
                <div className="stat-card">
                    <h3>{recentSnippets.length > 0 ? `${recentSnippets.length}+` : '0'}</h3>
                    <p>Code Snippets</p>
                </div>
                <div className="stat-card">
                    <h3>Ready</h3>
                    <p>To Organize</p>
                </div>
            </div>
        </div>
    );
}

export default StartPage;