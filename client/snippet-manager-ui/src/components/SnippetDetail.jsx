import React, { useState, useEffect } from 'react';
import { snippetsAPI } from '../api';
import './SnippetDetail.css';

function SnippetDetail({ selectedSnippetId }) {
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedSnippetId) {
            const fetchSnippetDetails = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await snippetsAPI.getSnippetById(selectedSnippetId);
                    setSnippet(data);
                } catch (err) {
                    setError('Failed to load snippet details.');
                    console.error('Error fetching snippet details:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchSnippetDetails();
        }
    }, [selectedSnippetId]);

    if (loading) {
        return (
            <div className="snippet-detail empty">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="snippet-detail empty">
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!selectedSnippetId) {
        return (
            <div className="snippet-detail no-selection">
                <p>No snippet selected.</p>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="snippet-detail loading">
                <p>Loading snippet details...</p>
            </div>
        );
    }

    const handleUpdate = () => {
        // Handle snippet update logic
    };

    const handleDelete = () => {
        // Handle snippet delete logic
    };

    return (
        <div className="snippet-detail">
            <div className="snippet-header">
                <h2>{snippet.title}</h2>
                <h3>{snippet.language}</h3>
            </div>
            <div className="snippet-code">
                <pre>
                    <code>{snippet.code}</code>
                </pre>
            </div>

            <div className="snippet-actions">
                <button className="btn-update" onClick={handleUpdate}>Update</button>
                <button className="btn-delete" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default SnippetDetail;