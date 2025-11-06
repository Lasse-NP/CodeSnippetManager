import React, { useState, useRef, useEffect } from "react";
import { snippetsAPI } from '../api';
import TagInput from './TagInput';
import './SnippetUpdate.css';

export default function SnippetUpdate({ selectedSnippetId, onUpdate, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [code, setCode] = useState("");
    const [tags, setTags] = useState([]);
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
        if (!Array.isArray(tags) || tags.length === 0) return "At least one tag is required.";
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
            tags: tags.map(t => t.name)
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
            <div className="loading" id="update-loading">
                <p>Loading snippet data...</p>
            </div>
        );
    }

    const handleTagsChange = (newTags) => {
        console.log('Parent received tags:', newTags);
        setTags(newTags);
    };

    return (
        <div className="body" id="snippet-update">
            <h2 id="update-title">Update Snippet</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="attributes" id="update-attributes">
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
                    <div className="dropdown" id="dropdown-lan-update-container">
                        <label>Language:</label>
                        <button
                            ref={buttonRef}
                            type="button"
                            className={`dropdown-button ${isDropdownOpen ? 'dropdown-open' : ''}`}
                            id="dropdown-lan-update-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {language || "Select Language"}
                            <span className="dropdown-arrow" id="update-dropdown-arrow">{isDropdownOpen ? "▼" : "▲"}</span>
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
                <div className="tags" id="update-tags">
                    <label>
                        Tags:
                    </label>
                    <TagInput
                        value={tags}
                        onChange={handleTagsChange}
                        placeholder="Type to add tags (press Space or Enter)"
                    />
                </div>
                <div className="code" id="update-code">
                    <label>
                        Code:
                        <div className="textarea-wrapper" id="textarea-wrapper-update">
                            <textarea
                                id="code-area-update"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                rows={10}
                            />
                        </div>
                    </label>
                </div>
                <div className="button-group" id="update-buttons">
                    <button id="update-submit-btn" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                    {onCancel && (
                        <button id="update-cancel-btn" type="button" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}