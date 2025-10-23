import React, { useState, useRef, useEffect } from "react";
import { snippetsAPI } from '../api';
import './SnippetUpdate.css';

export default function SnippetUpdate({ selectedSnippetId, onUpdate, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [code, setCode] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingSnippet, setFetchingSnippet] = useState(true);
    const [error, setError] = useState(null);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const languages = ["JavaScript", "Python", "Java", "CSharp", "CSS", "HTML", "XML", "SQL", "JSON", "JSX", "CSHTML"];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Close if clicking outside both the button and the dropdown menu
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSnippet = async () => {
            if (!selectedSnippetId) {
                setError("No snippet selected");
                setFetchingSnippet(false);
                return;
            }

            try {
                setFetchingSnippet(true);
                const snippet = await snippetsAPI.getSnippetById(selectedSnippetId);

                // Pre-fill the form with existing data
                setTitle(snippet.title || "");
                setDescription(snippet.description || "");
                setLanguage(snippet.language || "");
                setCode(snippet.code || "");

                // Convert tags array back to comma-separated string
                if (Array.isArray(snippet.tags)) {
                    setTags(snippet.tags.join(", "));
                } else {
                    setTags("");
                }
            } catch (err) {
                setError("Failed to load snippet data");
                console.error("Error fetching snippet:", err);
            } finally {
                setFetchingSnippet(false);
            }
        };

        fetchSnippet();
    }, [selectedSnippetId]);

    function validate() {
        if (!title.trim()) return "Title is required.";
        if (!code) return "Code is required.";
        if (!language.trim()) return "Language is required.";
        if (!tags.trim()) return "At least one tag is required.";
        else return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        const payload = {
            title: title.trim(),
            code: code,
            language: language.trim(),
            description: description.trim(),
            tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        }

        setLoading(true);
        try {
            const updatedSnippet = await snippetsAPI.updateSnippet(selectedSnippetId, payload);
            onUpdate && onUpdate(updatedSnippet);
        }
        catch (err) {
            setError(err.message || "An error occurred while updating the snippet.");
            console.error("Error updating snippet:", err);
        }
        finally {
            setLoading(false);
        }
    }

    if (fetchingSnippet) {
        return (
            <div className="snippet-update">
                <h2>Update Snippet</h2>
                <p>Loading snippet data...</p>
            </div>
        );
    }

    return (
        <div id="snippet-update">
            <h2>Update Snippet</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="attributes">
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </label>
                    <div id="dropdown-lan-update-container">
                        <label>Language:</label>
                        <button
                            ref={buttonRef}
                            type="button"
                            className={`dropdown-button ${isDropdownOpen ? 'dropdown-open' : ''}`}
                            id="dropdown-lan-update-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {language || "Select Language"}
                            <span className="dropdown-arrow" id="update-dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
                        </button>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu" id="update-dropdown-menu" ref={dropdownRef}>
                                {languages.map((lang) => (
                                    <li
                                        key={lang}
                                        className={lang === language ? "selected" : ""}
                                        onClick={() => {
                                            setLanguage(lang);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {lang}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="main-body">
                    <label>
                        Code:
                        <textarea
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            rows={10}
                        />
                    </label>
                </div>
                <div className="tags">
                    <label>
                        Tags:
                        <input
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="react, javascript, hooks"
                        />
                    </label>
                </div>
                <div id="button-update-group">
                    <button id="btn-update-update" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                    {onCancel && (
                        <button id="btn-cancel-update" type="button" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}