import React, { useState, useRef, useEffect } from "react";
import { snippetsAPI } from '../api';
import TagInput from './TagInput';
import './SnippetCreate.css';

export default function SnippetCreate({ onCreate, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [code, setCode] = useState("");
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
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
            const newSnippet = await snippetsAPI.createSnippet(payload);
            onCreate && onCreate(newSnippet);
        }
        catch (err) {
            setError(err.message || "An error occurred while creating the snippet.");
            console.error("Error creating snippet:", err);
        }
        finally {
            setLoading(false);
        }
    }

    const handleTagsChange = (newTags) => {
        console.log('Parent handleTagsChange called with:', newTags);
        console.log('Current tags state:', tags);
        console.log('Stack trace:', new Error().stack);
        setTags(newTags);
    };

    console.log('SnippetCreate render - tags:', tags);

    return (
        <div className="body" id="snippet-create">
            <h2 id="create-title">Create New Snippet</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="attributes" id="create-attributes">
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
                    <div className="dropdown" id="dropdown-lan-create-container">
                        <label>Language:</label>
                        <button
                            ref={buttonRef}
                            type="button"
                            className={`dropdown-button ${isDropdownOpen ? 'dropdown-open' : ''}`}
                            id="dropdown-lan-create-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {language || "Select Language"}
                            <span className="dropdown-arrow" id="create-dropdown-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
                        </button>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu" id="create-dropdown-menu" ref={dropdownRef}>
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
                <div className="tags" id="create-tags">
                    <label>
                        Tags:
                    </label>
                    <TagInput
                        key="tag-input-create"
                        value={tags}
                        onChange={handleTagsChange}
                        placeholder="Type to add tags (press Space or Enter)"
                    />
                </div>
                <div className="code" id="create-code">
                    <label>
                        Code:
                        <div className="textarea-wrapper" id="textarea-wrapper-create">
                            <textarea
                                id="code-area-create"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                rows={10}
                            />
                        </div>
                    </label>
                </div>
                <div className="button-group" id="create-buttons">
                    <button id="create-submit-btn" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                    {onCancel && (
                        <button id="create-cancel-btn" type="button" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}