import React, { useState, useEffect, useRef } from 'react';
import { snippetsAPI } from '../api';
import './SnippetDetail.css';

function SnippetDetail({ selectedSnippetId, onStartUpdate, onStartDelete }) {
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prismLoaded, setPrismLoaded] = useState(false);
    const codeRef = useRef(null);

    useEffect(() => {
        if (window.Prism) {
            setPrismLoaded(true);
            return;
        }

        // Load Prism CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
        document.head.appendChild(link);

        // Load Prism JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            // Load common language support after main Prism loads
            const languages = ['javascript', 'python', 'java', 'csharp', 'css', 'markup', 'sql', 'json', 'jsx', 'cshtml'];
            let loadedCount = 0;

            languages.forEach(lang => {
                const langScript = document.createElement('script');
                langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
                langScript.onload = () => {
                    loadedCount++;
                    if (loadedCount === languages.length) {
                        setPrismLoaded(true);
                    }
                };
                document.head.appendChild(langScript);
            });
        };

        document.head.appendChild(script);

        // Cleanup function
        return () => {
            // Note: In practice, you might want to keep Prism loaded
            // This is just for demonstration of proper cleanup
        };
    }, []);

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

    // Highlight code when snippet changes
    useEffect(() => {
        if (prismLoaded && window.Prism && codeRef.current && snippet) {
            window.Prism.highlightElement(codeRef.current);
        }
    }, [snippet, prismLoaded]);

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
                <p>No Snippet Selected</p>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="snippet-detail loading">
                <p>Loading Snippet Details...</p>
            </div>
        );
    }

    const handleUpdate = () => {
        if (onStartUpdate) {
            onStartUpdate();
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            try {
                await snippetsAPI.deleteSnippet(selectedSnippetId);
                if (onStartDelete) {
                    onStartDelete();
                }
            } catch (err) {
                alert('Failed to delete snippet.');
                console.error('Error deleting snippet:', err);
            }
        }
    };

    return (
        <div className="snippet-detail">
            <div className="snippet-header">
                <h2>{snippet.title}</h2>
                <h3>{snippet.language}</h3>
                <h4>{snippet.description}</h4>
                <div className="detail-tags">
                    {snippet.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="tag">
                            {typeof tag === 'string' ? tag : tag.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="snippet-code">
                <pre>
                    <code ref={codeRef} className={`language-${snippet?.language.toLowerCase() || 'javascript'}`}>
                        {snippet.code}
                    </code>
                </pre>
            </div>

            <div className="detail-actions">
                <button className="btn-update" onClick={handleUpdate}>
                    Update
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default SnippetDetail;