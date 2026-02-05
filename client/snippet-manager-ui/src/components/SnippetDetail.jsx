import React, { useState, useEffect, useRef, useCallback } from 'react';
import { snippetsAPI } from '../api';
import './SnippetDetail.css';

function SnippetDetail({ selectedSnippetId, onStartUpdate, onStartDelete, prismLoaded }) {
    const previousSnippetId = useRef(null);
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [animationState, setAnimationState] = useState('idle');
    const codeRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    useEffect(() => {
        if (selectedSnippetId) {
            const fetchSnippetDetails = async () => {
                try {
                    setError(null);
                    const shouldAnimate = previousSnippetId.current && previousSnippetId.current !== selectedSnippetId;
                    // If there's a previous snippet and it's different, trigger exit animation
                    if (shouldAnimate) {
                        setAnimationState('exit');
                        const [data] = await Promise.all([
                            snippetsAPI.getSnippetById(selectedSnippetId),
                            new Promise(resolve => setTimeout(resolve, 500)) // Match CSS animation duration
                        ])
                        setSnippet(data);
                        setAnimationState('enter');
                    } else {
                        // First load - no animation needed
                        setLoading(true);
                        const data = await snippetsAPI.getSnippetById(selectedSnippetId);
                        setSnippet(data);
                        setLoading(false);
                        setAnimationState('enter');
                    }
                    previousSnippetId.current = selectedSnippetId;

                    if (animationTimeoutRef.current) {
                        clearTimeout(animationTimeoutRef.current);
                    }

                    animationTimeoutRef.current = setTimeout(() => {
                        setAnimationState('idle');
                    }, 500);
                } catch (err) {
                    setError('Failed to load snippet details.');
                    console.error('Error fetching snippet details:', err);
                    setLoading(false);
                }
            };
            fetchSnippetDetails();
        } else {
            // Reset when no snippet is selected
            previousSnippetId.current = null;
            setAnimationState('idle');
        }
    }, [selectedSnippetId]);

    // Highlight code when snippet changes
    useEffect(() => {
        if (prismLoaded && window.Prism && codeRef.current && snippet) {
            requestAnimationFrame(() => {
                window.Prism.highlightElement(codeRef.current);
            });
        }
    }, [snippet, prismLoaded]);

    const handleUpdate = useCallback(() => {
        onStartUpdate?.();
    }, [onStartUpdate]);

    const handleDelete = useCallback(async () => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            try {
                await snippetsAPI.deleteSnippet(selectedSnippetId);
                onStartDelete?.();
            } catch (err) {
                alert('Failed to delete snippet.');
                console.error('Error deleting snippet:', err);
            }
        }
    }, [selectedSnippetId, onStartDelete]);

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(snippet.code);
            console.log('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [snippet?.code]);

    if (loading) {
        // Insert text to display during loading
        return (
            <div className="loading" id="view-loading">
                <p></p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="exception" id="view-error">
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!selectedSnippetId) {
        return (
            <div className="no-selection" id="no-snippet-view">
                <p>No Snippet Selected</p>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="pending" id="view-pending">
                <p id="detail-loading">Loading Snippet Details...</p>
            </div>
        );
    }

    return (
        <div className="container" id="snippet-view-background">
            <div className={`body ${animationState}`} id="snippet-view">
                <div className="attributes" id="view-attributes">
                    <div className="title" id="title-language">
                        <p className="badge" id="view-language-badge">{snippet.language}</p>
                        <h2>{snippet.title}</h2>
                    </div>
                    <h4>{snippet.description}</h4>
                    <div className="tags" id="view-tags">
                        {snippet.tags.slice(0, snippet.tags.length).map((tag, idx) => (
                            <span key={idx} className="tag">
                                {typeof tag === 'string' ? tag : tag.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="code" id="view-code">
                    <pre>
                        <code ref={codeRef} className={`language-${snippet?.language.toLowerCase() || 'javascript'}`}>
                            {snippet.code}
                        </code>
                        <svg id="copy-button" fill="#000000" width="50px" height="50px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" onClick={copyToClipboard}>
                            <path fill="white" d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z" fill-rule="evenodd" />
                        </svg>
                    </pre>
                </div>

                <div className="button-group" id="view-buttons">
                    <button id="update-initiate-btn" onClick={handleUpdate}>
                        Update
                    </button>
                    <button id="delete-initiate-btn" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SnippetDetail;